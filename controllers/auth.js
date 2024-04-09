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
exports.login = async (req,res)=>{
    try {
        const {email,password} = req.body;

        if(!email || !password ){
            return res.status(400).render('login', {
                message: 'Please Provide an email and password'
            })
        }
    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results)=>{
        console.log(results);
        if( !results || !(await bcrypt.compare(password, results[0].password ))){
            res.status(401).render('login', {
                message: 'Email or Password is incorrect'
            })
        }else{
            const role= results[0].role;

            const token = jwt.sign({ role: role, email: email }, process.env.JWT_SECRET, {
                expiresIn: process.env.JWT_EXPIRES_IN
            });
            console.log(" The token is "+token);

            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000
                ),
                httpOnly: true
            }
            res.cookie('jwt', token, cookieOptions);
            res.status(200).redirect("/dashboard")

        }
    })
    } catch (error) {
        console.log(error)
    }
}


exports.register = (req, res)=>{
    console.log(req.body); 
    const { name, email, password, passwordConfirm, role} = req.body;
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result)=>{
        console.log(result);
        if(error){
            console.log(error);
        }
        if(result.length > 0) {
            return res.render('register', {
                message: 'That email is already used'
            })
        }else if(password !== passwordConfirm){
            return res.render('register', {
                message: 'That Password is not match'
            });
        }
        
        let hashedPassword = await bcrypt.hash(password, 8);
        console.log(hashedPassword);

        db.query('INSERT INTO users SET ?', {name: name, email: email, password: hashedPassword , role:role}, (error, results) => {
            if(error){
                console.log(error);
            }
            else{
                console.log(results)
                return res.render('login', {
                    message: 'Success'
                });
            }
        });

    });

}




//MAKERESERVATION
exports.makereservation = (req, res)=>{
    console.log(req.body);
//for manual
   // const name = req.body.name;
   // const email = req.body.email;
   // const password = req.body.password;
   // const passwordConfirm = req.body.passwordConfirm;
//for best 
    const { name, email, totalno, message, dt, status, tableID} = req.body;
    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, result)=>{
        console.log(result);
        if(error){
            console.log(error);
        }
        else{
            console.log(results)
            return res.render('dashboard', {
                message: 'Success'
            });
        }

        db.query('SELECT tableID FROM tables WHERE status = "Vacant"'), [status], async (error, result)=>
        console.log(result);
        if(error){
            console.log(error);
        }
        else{
            console.log(results)
            return res.render('dashboard',{
                message: 'Success'
        });
        }
        
       

        db.query('INSERT INTO reservation SET ?', {name: name, email: email, totalno: totalno, message: message , dt:date, time: time, tableID: tableID}, (error, results) => {
            if(error){
                console.log(error);
            }
            else{
                console.log(results)
                return res.render('dashboard', {
                    message: 'Success'
                });
            }
        });

    });

}