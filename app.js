const express = require('express'); // For import express 
const mysql = require('mysql'); //for import express
const path = require('path');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { log } = require('console');
const expressEjsLayouts = require('express-ejs-layouts');

dotenv.config({path: './.env'});

const app = express(); //start the server

const db = mysql.createConnection({
    host: process.env.db_host, //Protect db
    user: process.env.db_user,
    password: process.env.db_password,
    port: '3306',
    database: process.env.db
})

const publicDirectory = path.join(__dirname, './public') //for file like css or js
app.use(express.static(publicDirectory));

// Parse url-encode bodies (as Sent by html forms)
app.use(express.urlencoded({ extended: false}))
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cookieParser())
console.log(__dirname); //for checking
app.set('view engine', 'hbs'); //For template we use

//Checking db
db.connect((error)=>{
    if(error){
        console.log(error)
    }else{
        console.log("Mysql Is Connected :D ")
    }
})
//MIDDLEWARE TO HANDLE LOGIN
app.use((req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        // Verify the token (you should use your own secret key and logic here)
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            log
            if (err) {
                // Token is invalid
                res.locals.loggedIn = false;
            } else {
                // Token is valid, user is logged in
                res.locals.loggedIn = true;
                // console.log(decoded);
                res.locals.role = decoded.role; // Adjust based on your token content
                res.locals.email = decoded.email;
            }
            next();
        });
    } else {
        // Token is not present
        res.locals.loggedIn = false;
        next();
    }
});

//Define Routes
app.use('/', require('./routes/pages'));    //Every pages in / will except the routes
app.use('/auth', require('./routes/auth'));
app.use('/api', require('./routes/api'));



app.listen(8080, () =>{
    console.log('Start on port 8080');
})











