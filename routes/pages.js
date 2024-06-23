const express = require('express');
const orderController = require('../controllers/order')
const Reservation = require('../controllers/reservation') 

const router = express.Router();
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



router.get("/register", (req, res) => {
    if (res.locals.loggedIn) {
        res.redirect('/dashboard')
    }
    else {
        res.render('register');

    }
});

router.get("/", (req, res) => {
    if (res.locals.loggedIn) {
        res.redirect('/dashboard')
    }
    else {
        res.render('register');

    }
});



router.get("/login", (req, res) => {
    //res.render('login');
    if (res.locals.loggedIn) {
        res.redirect('/dashboard')
    }
    else {
        res.render('login');

    }
});

router.get("/dashboard", (req, res) => {
    if (res.locals.loggedIn) {
        // console.log(res.locals.role)
        const role = res.locals.role
        var admin = false
        var user = false
        if (role == 'admin') {
            admin = true
        }
        else if (role == 'user') {
            user = true
        }
        res.render('dashboard', { loggedIn: res.locals.loggedIn, admin: admin, user: user });
    }
    else {
        res.redirect('/login')
    }
});

router.get("/placedorder", (req, res) => {
    if (res.locals.loggedIn) {
        const role = res.locals.role
        var email = res.locals.email
        var admin = false
        var user = false
        var formattedOrders = null;
        var formattedPickedUpOrders = null
        if (role == 'admin') {
            admin = true
            db.query('SELECT * FROM orders WHERE status = "placed"', async (error, placedresults) => {
                if (error) {
                    console.log(error)
                }
                if (!placedresults) {
                    res.status(401).render('createorders', {
                        message: 'No orders placed'
                    })
                } else {
                    // console.log(results)
                    formattedOrders = placedresults.map(order => {
                        const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                        });

                        // Create a new object with the formatted created_at field
                        return { ...order, formattedCreatedAt };
                    });
                    db.query('SELECT * FROM orders WHERE status = "pickedup"', async (error, pickedupresults) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            formattedPickedUpOrders = pickedupresults.map(order => {
                                const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                                    dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                    timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                });

                                // Create a new object with the formatted created_at field
                                return { ...order, formattedCreatedAt };
                            });



                            //new code
                            db.query('SELECT * FROM orders WHERE status = "done"', async (error, admincompletedresults) => {
                                if (error) {
                                    console.log(error)
                                }
                                else {
                                    formattedCompletedOrders = admincompletedresults.map(order => {
                                        const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                        });
        
                                        // Create a new object with the formatted created_at field
                                        return { ...order, formattedCreatedAt };
                                    });
        




                        
                            res.render('placedorder', { loggedIn: res.locals.loggedIn, admin: admin, user: user, adminorderhistory: formattedOrders, adminpickeduphistory: formattedPickedUpOrders, admincompletedhistory:formattedCompletedOrders });
                        }})
                        
                        }

                    });


                }
            })
        }
        else if (role == 'user') {
            user = true
            db.query('SELECT * FROM orders WHERE email = ? and status = "placed"', [email], async (error, results) => {
                if (error) {
                    console.log(error)
                }
                if (!results) {
                    res.status(401).render('createorders', {
                        message: 'No orders placed'
                    })
                } else {
                    const userformattedOrders = results.map(order => {
                        const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                        });

                        // Create a new object with the formatted created_at field
                        return { ...order, formattedCreatedAt };
                    });
                    db.query('SELECT * FROM orders WHERE email = ? and status = "pickedup"', [email], async (error, userpickedupresults) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            formattedPickedUpOrders = userpickedupresults.map(order => {
                                const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                                    dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                    timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                });

                                // Create a new object with the formatted created_at field
                                return { ...order, formattedCreatedAt };
                            });

                             
                            

                            db.query('SELECT * FROM orders WHERE email = ? and status = "done"', [email], async (error, usercompletedresults) => {
                                if (error) {
                                    console.log(error)
                                }
                                else {
                                    formattedCompletedOrders = usercompletedresults.map(order => {
                                        const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                        });
        
                                        // Create a new object with the formatted created_at field
                                        return { ...order, formattedCreatedAt };
                                    });
                                   




                        
                            //res.render('orders', { loggedIn: res.locals.loggedIn, admin: admin, user: user, userorderhistory: userformattedOrders, userpickeduphistory: formattedPickedUpOrders });
                            res.render('placedorder', { loggedIn: res.locals.loggedIn, admin: admin, user: user, userorderhistory: userformattedOrders, userpickeduphistory: formattedPickedUpOrders, usercompletedhistory:formattedCompletedOrders  });
                            }})
                            
                        }    

                    });

                    // console.log(formattedOrders)
                    // res.render('orders', { loggedIn: res.locals.loggedIn, admin: admin, user: user, userorderhistory: formattedOrders });
                }
            })

            // res.render('orders', { loggedIn: res.locals.loggedIn, admin: admin, user: user });
        }
        else {
            res.redirect('/login')
        }

    }
    else {
        res.redirect('/login')
    }
})


router.get("/createorders", (req, res) => {
    if (res.locals.loggedIn) {
        const role = res.locals.role
        console.log(res.locals.email)
        var admin = false
        var user = false
        if (role == 'admin') {
            admin = true
        }
        else if (role == 'user') {
            user = true
        }
        res.render('createorder', { loggedIn: res.locals.loggedIn, admin: admin, user: user});
    }
    else {
        res.redirect('/login')
    }
});

router.post('/createorders', orderController.createorder);

router.get("/makereservation", (req, res) => {
    if (res.locals.loggedIn) {
        const role = res.locals.role
        console.log(res.locals.email)
        var admin = false
        var user = false
        if (role == 'admin') {
            admin = true
        }
        else if (role == 'user') {
            user = true
        }
        res.render('makereservation', { loggedIn: res.locals.loggedIn, admin: admin, user: user });
    }
    else {
        res.redirect('/login')
    }
});

router.post('/makereservation', Reservation.makereservation);

router.get("/logout", (req, res) => {
    if (res.locals.loggedIn) {
        res.clearCookie('jwt');
        res.redirect('/login')
    }
    else {
        res.redirect('/login')
    }
})

router.get("/menu", (req, res) => {
    if (res.locals.loggedIn) {
        // console.log(res.locals.role)
        const role = res.locals.role
        var admin = false
        var user = false
        if (role == 'admin') {
            admin = true
        }
        else if (role == 'user') {
            user = true
        }
        res.render('menu', { loggedIn: res.locals.loggedIn, admin: admin, user: user });
    }
    else {
        res.redirect('/login')
    }
});




router.get("/placedorder", (req, res) => {
    if (res.locals.loggedIn) {
        const role = res.locals.role
        var email = res.locals.email
        var admin = false
        var user = false
        var formattedOrders = null;
        var formattedPickedUpOrders = null
        if (role == 'admin') {
            admin = true
            db.query('SELECT * FROM orders WHERE status = "placed"', async (error, placedresults) => {
                if (error) {
                    console.log(error)
                }
                if (!placedresults) {
                    res.status(401).render('createorders', {
                        message: 'No orders placed'
                    })
                } else {
                    // console.log(results)
                    formattedOrders = placedresults.map(order => {
                        const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                        });

                        // Create a new object with the formatted created_at field
                        return { ...order, formattedCreatedAt };
                    });
                    db.query('SELECT * FROM orders WHERE status = "pickedup"', async (error, pickedupresults) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            formattedPickedUpOrders = pickedupresults.map(order => {
                                const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                                    dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                    timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                });

                                // Create a new object with the formatted created_at field
                                return { ...order, formattedCreatedAt };
                            });



                            //new code
                            db.query('SELECT * FROM orders WHERE status = "done"', async (error, admincompletedresults) => {
                                if (error) {
                                    console.log(error)
                                }
                                else {
                                    formattedCompletedOrders = admincompletedresults.map(order => {
                                        const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                        });
        
                                        // Create a new object with the formatted created_at field
                                        return { ...order, formattedCreatedAt };
                                    });
        




                        
                            res.render('placedorder', { loggedIn: res.locals.loggedIn, admin: admin, user: user, adminorderhistory: formattedOrders, adminpickeduphistory: formattedPickedUpOrders, admincompletedhistory:formattedCompletedOrders });
                        }})
                        
                        }

                    });


                }
            })
        }
        else if (role == 'user') {
            user = true
            db.query('SELECT * FROM orders WHERE email = ? and status = "placed"', [email], async (error, results) => {
                if (error) {
                    console.log(error)
                }
                if (!results) {
                    res.status(401).render('createorders', {
                        message: 'No orders placed'
                    })
                } else {
                    const userformattedOrders = results.map(order => {
                        const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                        });

                        // Create a new object with the formatted created_at field
                        return { ...order, formattedCreatedAt };
                    });
                    db.query('SELECT * FROM orders WHERE email = ? and status = "pickedup"', [email], async (error, userpickedupresults) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            formattedPickedUpOrders = userpickedupresults.map(order => {
                                const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                                    dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                    timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                });

                                // Create a new object with the formatted created_at field
                                return { ...order, formattedCreatedAt };
                            });

                             
                            

                            db.query('SELECT * FROM orders WHERE email = ? and status = "done"', [email], async (error, usercompletedresults) => {
                                if (error) {
                                    console.log(error)
                                }
                                else {
                                    formattedCompletedOrders = usercompletedresults.map(order => {
                                        const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                        });
        
                                        // Create a new object with the formatted created_at field
                                        return { ...order, formattedCreatedAt };
                                    });
                                   




                        
                            //res.render('orders', { loggedIn: res.locals.loggedIn, admin: admin, user: user, userorderhistory: userformattedOrders, userpickeduphistory: formattedPickedUpOrders });
                            res.render('placedorder', { loggedIn: res.locals.loggedIn, admin: admin, user: user, userorderhistory: userformattedOrders, userpickeduphistory: formattedPickedUpOrders, usercompletedhistory:formattedCompletedOrders  });
                            }})
                            
                        }    

                    });

                    // console.log(formattedOrders)
                    // res.render('orders', { loggedIn: res.locals.loggedIn, admin: admin, user: user, userorderhistory: formattedOrders });
                }
            })

            // res.render('orders', { loggedIn: res.locals.loggedIn, admin: admin, user: user });
        }
        else {
            res.redirect('/login')
        }

    }
    else {
        res.redirect('/login')
    }
})




router.get("/pickeduporders", (req, res) => {
    if (res.locals.loggedIn) {
        const role = res.locals.role
        var email = res.locals.email
        var admin = false
        var user = false
        var formattedOrders = null;
        var formattedPickedUpOrders = null
        if (role == 'admin') {
            admin = true
            db.query('SELECT * FROM orders WHERE status = "placed"', async (error, placedresults) => {
                if (error) {
                    console.log(error)
                }
                if (!placedresults) {
                    res.status(401).render('createorders', {
                        message: 'No orders placed'
                    })
                } else {
                    // console.log(results)
                    formattedOrders = placedresults.map(order => {
                        const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                        });

                        // Create a new object with the formatted created_at field
                        return { ...order, formattedCreatedAt };
                    });
                    db.query('SELECT * FROM orders WHERE status = "pickedup"', async (error, pickedupresults) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            formattedPickedUpOrders = pickedupresults.map(order => {
                                const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                                    dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                    timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                });

                                // Create a new object with the formatted created_at field
                                return { ...order, formattedCreatedAt };
                            });



                            //new code
                            db.query('SELECT * FROM orders WHERE status = "done"', async (error, admincompletedresults) => {
                                if (error) {
                                    console.log(error)
                                }
                                else {
                                    formattedCompletedOrders = admincompletedresults.map(order => {
                                        const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                        });
        
                                        // Create a new object with the formatted created_at field
                                        return { ...order, formattedCreatedAt };
                                    });
        




                        
                            res.render('pickeduporders', { loggedIn: res.locals.loggedIn, admin: admin, user: user, adminorderhistory: formattedOrders, adminpickeduphistory: formattedPickedUpOrders, admincompletedhistory:formattedCompletedOrders });
                        }})
                        
                        }

                    });


                }
            })
        }
        else if (role == 'user') {
            user = true
            db.query('SELECT * FROM orders WHERE email = ? and status = "placed"', [email], async (error, results) => {
                if (error) {
                    console.log(error)
                }
                if (!results) {
                    res.status(401).render('createorders', {
                        message: 'No orders placed'
                    })
                } else {
                    const userformattedOrders = results.map(order => {
                        const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                        });

                        // Create a new object with the formatted created_at field
                        return { ...order, formattedCreatedAt };
                    });
                    db.query('SELECT * FROM orders WHERE email = ? and status = "pickedup"', [email], async (error, userpickedupresults) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            formattedPickedUpOrders = userpickedupresults.map(order => {
                                const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                                    dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                    timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                });

                                // Create a new object with the formatted created_at field
                                return { ...order, formattedCreatedAt };
                            });

                             
                            

                            db.query('SELECT * FROM orders WHERE email = ? and status = "done"', [email], async (error, usercompletedresults) => {
                                if (error) {
                                    console.log(error)
                                }
                                else {
                                    formattedCompletedOrders = usercompletedresults.map(order => {
                                        const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                        });
        
                                        // Create a new object with the formatted created_at field
                                        return { ...order, formattedCreatedAt };
                                    });
                                   




                        
                            //res.render('orders', { loggedIn: res.locals.loggedIn, admin: admin, user: user, userorderhistory: userformattedOrders, userpickeduphistory: formattedPickedUpOrders });
                            res.render('pickeduporders', { loggedIn: res.locals.loggedIn, admin: admin, user: user, userorderhistory: userformattedOrders, userpickeduphistory: formattedPickedUpOrders, usercompletedhistory:formattedCompletedOrders  });
                            }})
                            
                        }    

                    });

                    // console.log(formattedOrders)
                    // res.render('orders', { loggedIn: res.locals.loggedIn, admin: admin, user: user, userorderhistory: formattedOrders });
                }
            })

            // res.render('orders', { loggedIn: res.locals.loggedIn, admin: admin, user: user });
        }
        else {
            res.redirect('/login')
        }

    }
    else {
        res.redirect('/login')
    }
})




router.get("/completedorders", (req, res) => {
    if (res.locals.loggedIn) {
        const role = res.locals.role
        var email = res.locals.email
        var admin = false
        var user = false
        var formattedOrders = null;
        var formattedPickedUpOrders = null
        if (role == 'admin') {
            admin = true
            db.query('SELECT * FROM orders WHERE status = "placed"', async (error, placedresults) => {
                if (error) {
                    console.log(error)
                }
                if (!placedresults) {
                    res.status(401).render('createorders', {
                        message: 'No orders placed'
                    })
                } else {
                    // console.log(results)
                    formattedOrders = placedresults.map(order => {
                        const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                        });

                        // Create a new object with the formatted created_at field
                        return { ...order, formattedCreatedAt };
                    });
                    db.query('SELECT * FROM orders WHERE status = "pickedup"', async (error, pickedupresults) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            formattedPickedUpOrders = pickedupresults.map(order => {
                                const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                                    dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                    timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                });

                                // Create a new object with the formatted created_at field
                                return { ...order, formattedCreatedAt };
                            });



                            //new code
                            db.query('SELECT * FROM orders WHERE status = "done"', async (error, admincompletedresults) => {
                                if (error) {
                                    console.log(error)
                                }
                                else {
                                    formattedCompletedOrders = admincompletedresults.map(order => {
                                        const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                        });
        
                                        // Create a new object with the formatted created_at field
                                        return { ...order, formattedCreatedAt };
                                    });
        




                        
                            res.render('completedorders', { loggedIn: res.locals.loggedIn, admin: admin, user: user, adminorderhistory: formattedOrders, adminpickeduphistory: formattedPickedUpOrders, admincompletedhistory:formattedCompletedOrders });
                        }})
                        
                        }

                    });


                }
            })
        }
        else if (role == 'user') {
            user = true
            db.query('SELECT * FROM orders WHERE email = ? and status = "placed"', [email], async (error, results) => {
                if (error) {
                    console.log(error)
                }
                if (!results) {
                    res.status(401).render('createorders', {
                        message: 'No orders placed'
                    })
                } else {
                    const userformattedOrders = results.map(order => {
                        const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                        });

                        // Create a new object with the formatted created_at field
                        return { ...order, formattedCreatedAt };
                    });
                    db.query('SELECT * FROM orders WHERE email = ? and status = "pickedup"', [email], async (error, userpickedupresults) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            formattedPickedUpOrders = userpickedupresults.map(order => {
                                const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                                    dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                    timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                });

                                // Create a new object with the formatted created_at field
                                return { ...order, formattedCreatedAt };
                            });

                             
                            

                            db.query('SELECT * FROM orders WHERE email = ? and status = "done"', [email], async (error, usercompletedresults) => {
                                if (error) {
                                    console.log(error)
                                }
                                else {
                                    formattedCompletedOrders = usercompletedresults.map(order => {
                                        const formattedCreatedAt = new Date(order.created_at).toLocaleString('en-US', {
                                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                        });
        
                                        // Create a new object with the formatted created_at field
                                        return { ...order, formattedCreatedAt };
                                    });
                                 
                            //res.render('orders', { loggedIn: res.locals.loggedIn, admin: admin, user: user, userorderhistory: userformattedOrders, userpickeduphistory: formattedPickedUpOrders });
                            res.render('completedorders', { loggedIn: res.locals.loggedIn, admin: admin, user: user, userorderhistory: userformattedOrders, userpickeduphistory: formattedPickedUpOrders, usercompletedhistory:formattedCompletedOrders  });
                            }})
                            
                        }    

                    });

                    // console.log(formattedOrders)
                    // res.render('orders', { loggedIn: res.locals.loggedIn, admin: admin, user: user, userorderhistory: formattedOrders });
                }
            })

            // res.render('orders', { loggedIn: res.locals.loggedIn, admin: admin, user: user });
        }
        else {
            res.redirect('/login')
        }

    }
    else {
        res.redirect('/login')
    }
})

router.get("/myreservation", (req, res) => {
    if (res.locals.loggedIn) {
        const role = res.locals.role
        var email = res.locals.email
        var admin = false
        var user = false
        var formattedPendingReservation = null;
        var formattedConfirmedReservation = null
        if (role == 'admin') {
            admin = true
            db.query('SELECT * FROM reservation WHERE reservationstatus = "Pending"', async (error, pendingresults) => {
                if (error) {
                    console.log(error)
                }
                if (!pendingresults) {
                    res.status(401).render('makereservation', {
                        message: 'No reservation made.'
                    })
                } else {
                    // console.log(results)
                    formattedPendingReservation = pendingresults.map(reservation => {
                        const formattedCreatedAt = new Date(reservation.created_at).toLocaleString('en-US', {
                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                        });

                        // Create a new object with the formatted created_at field
                        return { ...reservation, formattedCreatedAt };
                    });
                    db.query('SELECT * FROM reservation WHERE reservationstatus = "confirmed"', async (error, confirmedresults) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            formattedConfirmedReservation = confirmedresults.map(reservation => {
                                const formattedCreatedAt = new Date(reservation.created_at).toLocaleString('en-US', {
                                    dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                    timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                });

                                // Create a new object with the formatted created_at field
                                return { ...reservation, formattedCreatedAt };
                            });
                            res.render('myreservation', { loggedIn: res.locals.loggedIn, admin: admin, user: user, adminpendinghistory: formattedPendingReservation, adminconfirmedhistory: formattedConfirmedReservation });



                            //new code
                          
                        
                        }

                    });


                }
            })
        }
        else if (role == 'user') {
            user = true
            db.query('SELECT * FROM reservation WHERE email = ? and reservationstatus = "Pending" OR reservationstatus="Declined"', [email], async (error, results) => {
                if (error) {
                    console.log(error)
                }
                if (!results) {
                    res.status(401).render('makereservation', {
                        message: 'No reservations made.'
                    })
                } else {
                    userPendingReservation = results.map(reservation => {
                        const formattedCreatedAt = new Date(reservation.created_at).toLocaleString('en-US', {
                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                        });

                        // Create a new object with the formatted created_at field
                        return { ...reservation, formattedCreatedAt };
                    });
                   
                    res.render('myreservation', { loggedIn: res.locals.loggedIn, admin: admin, user: user, userpendinghistory: userPendingReservation});
                    
                }
            })

        }
        else {
            res.redirect('/login')
        }

    }
    else {
        res.redirect('/login')
    }
})








router.get("/confirmedreservation", (req, res) => {
    if (res.locals.loggedIn) {
        const role = res.locals.role
        var email = res.locals.email
        var admin = false
        var user = false
        var formattedPendingReservation = null;
        var formattedConfirmedReservation = null;
        var userTables = null;
        if (role == 'admin') {
            admin = true
            db.query('SELECT * FROM reservation WHERE reservationstatus = "confirmed"', async (error, confirmedresults) => {
                if (error) {
                    console.log(error)
                }
                if (!confirmedresults) {
                    res.status(401).render('makereservation', {
                        message: 'No confirmed reservation made.'
                    })
                } else {
                    // console.log(results)
                    formattedConfirmedReservation = confirmedresults.map(reservation => {
                        const formattedCreatedAt = new Date(reservation.created_at).toLocaleString('en-US', {
                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                        });

                        // Create a new object with the formatted created_at field
                        return { ...reservation, formattedCreatedAt };
                    });
                    res.render('confirmedreservation', { loggedIn: res.locals.loggedIn, admin: admin, user: user, adminconfirmedhistory: formattedConfirmedReservation });


                }
            })
        }
        else if (role == 'user') {
            user = true
            db.query('SELECT * FROM reservation WHERE email = ? and reservationstatus = "confirmed"', [email], async (error, userconfirmedresults) => {
                if (error) {
                    console.log(error)
                }
                if (!userconfirmedresults) {
                    res.status(401).render('makereservation', {
                        message: 'No confirmed reservations made.'
                    })
                } else {
                    userConfirmedReservation = userconfirmedresults.map(reservation => {
                        const formattedCreatedAt = new Date(reservation.created_at).toLocaleString('en-US', {
                            dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                            timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                        });

                        // Create a new object with the formatted created_at field
                        return { ...reservation, formattedCreatedAt };
                    });

                   
                    db.query('SELECT tableID FROM tables WHERE status = "Vacant"', async (error, usertableID) => {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            userTables = usertableID.map(table => {
                                const formattedCreatedAt = new Date(table.created_at).toLocaleString('en-US', {
                                    dateStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                    timeStyle: 'medium', // 'short', 'medium', 'long', 'full'
                                });

                                // Create a new object with the formatted created_at field
                                return { ...table, formattedCreatedAt };
                            });
                   
                    res.render('confirmedreservation', { loggedIn: res.locals.loggedIn, admin: admin, user: user, userconfirmedhistory: userConfirmedReservation, usertableID: userTables});
                        }});
                }
            })

        }
        else {
            res.redirect('/login')
        }

    }
    else {
        res.redirect('/login')
    }
})
module.exports = router; //for export these router that we created and that we are giving in here for ourpages
