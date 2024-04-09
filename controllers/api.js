//You can use this or you can create file and contain this
const mysql = require('mysql'); //for import express
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const app = express();
const port = 8080;


const db = mysql.createConnection({
    host: process.env.db_host, //Protect db
    user: process.env.db_user,
    password: process.env.db_password,
    port: '3306',
    database: process.env.db
})
//

//login
exports.updateOrdertoPickup = async (req, res) => {
    if (res.locals.loggedIn) {
        // console.log(res.locals.role)
        const role = res.locals.role
        var admin = false
        var user = false
        if (role == 'admin') {
            var orderid = req.body.orderID
            console.log(req.body.orderID)
            console.log(res.locals)
            db.query('UPDATE orders SET status = "pickedup" WHERE orderid = ?', [orderid], async (error, results) => {
                if (error) {
                    console.log(error)
                } else {

                    console.log(results)
                    res.status(200).send("OK");
                }
            })
            //res.send("OK");
        }
        else {
            res.status(403).send('Not Authorized')
        }
    }
    else {
        res.status(403).send('Not Authorized')
    }
}
//email sending
exports.updateOrdertoDone = async (req, res) => {
    if (res.locals.loggedIn) {
        // console.log(res.locals.role)
        const role = res.locals.role
        const email = res.locals.email
        var admin = false
        var user = false
        if (role == 'admin') {
            var orderid = req.body.orderID
            console.log(req.body.orderID)
            console.log(res.locals)
           
            db.query('UPDATE orders SET status = "done" WHERE orderid = ?', [orderid], async (error, results) => {
                if (error) {
                    console.log(error)
                } else {

                    const port = 3000;

                    app.use(bodyParser.json());

                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'mahima.quadras.t22045@sophiacollege.edu.in',
                            pass: 'momdadkumar'
                        }
                    });

                    app.post('/orders', (req, res) => {

                        // Process the order completion logic here
                        // Assume req.body contains information about the completed order
                        const { orderId, email } = req.body; // Send completion email
                        const mailOptions = {
                            from: 'mahima.quadras.t22045@sophiacollege.edu.in',
                           // to: customerEmail,
                            to: email,
                            subject: 'Order Completed',
                            text: `Your order with ID ${orderId} has been completed. Thank you for your purchase!`
                        };

                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                console.error('Error sending email:', error);
                                res.status(500).send('Internal Server Error');
                            } else {
                                console.log('Email sent:', info.response);
                                res.status(200).send('Order Completed. Email Sent');
                            }
                        });
                    });
                   



                    console.log(results)
                                        res.status(200).send("OK");
                                    }
                                })
                                //res.send("OK");
                            }
                            else {
                                res.status(403).send('Not Authorized')
                            }
                        }
                        else {
                            res.status(403).send('Not Authorized')
                        }
                    }
                  
                    

                   

                    


                    // app.listen(port, () => {
                    //     console.log(`Server is running on http://localhost:${port}`);
                    // });

                    exports.updateReservationtoConfirmed = async (req, res) => {
                        if (res.locals.loggedIn) {
                            // console.log(res.locals.role)
                            const role = res.locals.role
                            var admin = false
                            var user = false
                            if (role == 'admin') {
                                var reservationID = req.body.reservationID
                                console.log(req.body.reservationID)
                                console.log(res.locals)
                                db.query('UPDATE reservation SET reservationstatus = "confirmed" WHERE reservationID = ?', [reservationID], async (error, results) => {
                                    if (error) {
                                        console.log(error)
                                    } else {
                    
                                        console.log(results)
                                        res.status(200).send("OK");
                                    }
                                })
                                //res.send("OK");
                            }
                            else {
                                res.status(403).send('Not Authorized')
                            }
                        }
                        else {
                            res.status(403).send('Not Authorized')
                        }
                    }


                    exports.declineReservation = async (req, res) => {
                        if (res.locals.loggedIn) {
                            // console.log(res.locals.role)
                            const role = res.locals.role
                            var admin = false
                            var user = false
                            if (role == 'admin') {
                                var reservationID = req.body.reservationID
                                console.log(req.body.reservationID)
                                console.log(res.locals)
                                db.query('UPDATE reservation SET reservationstatus = "Declined" WHERE reservationID = ?', [reservationID], async (error, results) => {
                                    if (error) {
                                        console.log(error)
                                    } else {
                    
                                        console.log(results)
                                        res.status(200).send("OK");
                                    }
                                })
                                //res.send("OK");
                            }
                            else {
                                res.status(403).send('Not Authorized')
                            }
                        }
                        else {
                            res.status(403).send('Not Authorized')
                        }
                    }




                   





