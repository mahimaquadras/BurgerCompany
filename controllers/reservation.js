//You can use this or you can create file and contain this
const mysql = require('mysql'); //for import express
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const db = mysql.createConnection({
    host: process.env.db_host, //Protect db
    user: process.env.db_user,
    password: process.env.db_password,
    port: '3306',
    database: process.env.db
})
//

//login
exports.makereservation = async (req,res)=>{
    const name = req.body.name
    // console.log(chickenQuantity)
    
    const email = req.body.email
    // console.log(muttonQuantity)

    const totalno = req.body.totalno
    // console.log(lambQuantity)

    const date = req.body.date
    // console.log(vegQuantity)

    const time = req.body.time
    // console.log(vegQuantity)


    const message = res.locals.message
    // console.log(email)


    console.log(req.body)

    var reservationstatus = 'Pending';
    db.query('INSERT INTO reservation SET ?', {email: email, name: name, totalno:totalno, message:message, dt:date, time: time, reservationstatus: reservationstatus}, (error, results) => {
        if(error){
            console.log(error);
            res.status(500).render('makereservation', {
                message : "Reservation failed. Please try again later"
            })
        }
        else{
        //    console.log(results)
            return res.status(200).redirect('/dashboard'),{
                message : "Reservation request sent. Please check back in a few minutes"
            }
        }
    });

    //res.redirect("/orders")
}