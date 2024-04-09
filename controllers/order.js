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
exports.createorder = async (req,res)=>{
    const chickenQuantity = req.body.chicken
    // console.log(chickenQuantity)
    
    const muttonQuantity = req.body.mutton
    // console.log(muttonQuantity)

    const lambQuantity = req.body.lamb
    // console.log(lambQuantity)

    const vegQuantity = req.body.veg
    // console.log(vegQuantity)

    const email = res.locals.email
    // console.log(email)

    console.log(req.body)

    var status = 'placed';
    db.query('INSERT INTO orders SET ?', {email: email, chickenqnty:chickenQuantity, muttonqnty:muttonQuantity, lambqnty:lambQuantity, vegqnty:vegQuantity, status:status}, (error, results) => {
        if(error){
            console.log(error);
            res.status(500).render('createorder', {
                message : "Order placement failed. Please try again later"
            })
        }
        else{
           // console.log(results)
            return res.status(200).redirect('/placedorder');
        }
    });

    //res.redirect("/orders")
}
