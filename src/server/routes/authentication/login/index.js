module.exports = function(app, User, createJWT, secret, bcrypt, crypto, mailer, smtp, ownerService, ownerEmail, ownerPassword) {
    app.route('/login').post(function(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var searchUser = {
            email: email
        };

        // User.findById({_id: "57fbd6db6c18528304fb737f"}, function(err, hhh){
        //     if(err) throw err;
        //     if(hhh){
        //         console.log("alert");
        //     }
        // });

        User.findOne(searchUser, function(err, userFound) {
            if(err) throw err;

            if(userFound) {
                //var userFound = userFound[0];
                bcrypt.compare(password, userFound.password, function(err, result) {
                    if(result) {
                        console.log(JSON.stringify(userFound));
                        var token = createJWT(userFound, secret);
                        res.send({token: token, name: userFound.name, picture: userFound.picture, userId: userFound._id});
                    }
                    else {
                        if (!userFound.password) {
                            res.send({error: 'You have Signed up using a provider. Please use a Provider login or Create a password using Forgot my Password Link below', errorCode: 401});
                        }
                        else res.send({error: 'You have entered a wrong password. Please check', errorCode: 401});
                    }
                });
            }
            else {
                res.send({error: 'Invalid Email', errorCode: 401});
            }
        });
    });

    app.route('/register').post(function(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var name = req.body.name;
        console.log(name);
        var searchUser = {
            email: email
        };
        User.findOne(searchUser, function(err,userFound) {
            if(err) throw err;

            if(userFound){
                res.send({error: 'User already exists. Try login', errorCode: 401});
            }
            else {
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(password, salt, function(err, hash) {
                        var newUser = new User({
                            name: name,
                            email: email,
                            password: hash
                        });
                        newUser.save(function(err, result) {
                            if(err) throw err;
                            console.log(JSON.stringify(result._id));
                            res.send({token: createJWT(result, secret), name: result.name, userId: result._id});
                        });
                    });
                });
            }
        });
    });

    app.route('/forgot').post(function(req, res) {
        var resetEmail = req.body.email;
        //console.log(req.headers.host);
        var host = req.headers.host;
        var query = {
            email: resetEmail
        };
        crypto.randomBytes(20, function(err, buf) {
            var token = buf.toString('hex');
            User.findOne(query, function(err, user){
                if(err) throw err;
                
                if(user){
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 3600000; 

                    user.save(function(err, updated) {
                      console.log('user saved', JSON.stringify(updated));
                      var smtpTransport = mailer.createTransport(smtp({
                            service: ownerService,
                            auth: {
                                user: ownerEmail,
                                pass: ownerPassword
                            }
                        }));
                      var mailOptions = {
                            to: resetEmail,
                            from: 'passwordreset@kushalraghav.com',
                            subject: 'Password Reset Link',
                            text: 'You are receiving this because you have requested the reset of the password for your account.\n\n' +
                            'Please click on the following link, or paste this into your browser to reset the password:\n\n' +
                            'http://' + host + '/#/reset/' + token + '\n\n' +
                            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
                        };
                        smtpTransport.sendMail(mailOptions, function (err, response) {
                            if (err) {
                                throw err;
                            }
                            else {
                                res.send({result: "E-Mail Sent with instructions! Please check your email"});
                            }
                        });
                    });
                }
                else {
                    res.send({error:'Email does not exists'});
                }
            });
        });    
    });

    app.route('/reset/:token').post(function(req, res){
        console.log(req.body.token);
        console.log(req.body);
        console.log(req.body.newPassword);
        User.findOne({resetPasswordToken: req.body.token, resetPasswordExpires: { $gt: Date.now()}}, function(err, user) {
            if(err) throw err;

            if(user) {
                var email = user.email;
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(req.body.newPassword, salt, function(err, hash){
                        user.password = hash;
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
                        user.save(function(err, result) {
                            if(err) throw err;
                            console.log('password updated! ' + JSON.stringify(result));
                            var smtpTransport = mailer.createTransport(smtp({
                                service: ownerService,
                                auth: {
                                    user: ownerEmail,
                                    pass: ownerPassword
                                }
                            }));
                           var mailOptions = {
                                to: email,
                                from: 'passwordreset@kushalraghav.com',
                                subject: 'Your Password has been changed',
                                text: 'Hello,\n\n' +
                                        'This is a confirmation that the password for your account ' + email + ' has just been changed.\n'
                            };
                            smtpTransport.sendMail(mailOptions, function (err, response) {
                                if (err) {
                                    throw err;
                                }
                                else {
                                    res.send({result: "Your password has been updated! E-Mail Sent!"});
                                }
                            });
                        });
                    });
                });
            }
            else
            {
                res.send({error: 'Token Expired! Please go back and reset your password again!'});
            }
        });
    });

    app.route('/contact').post(function(req, res) {
        var email = req.body.email;
        var name = req.body.name;
        var message = req.body.message;

        var smtpTransport = mailer.createTransport(smtp({
            service: oservice,
            auth: {
                user: ownerEmail,
                pass: ownerPassword
            }
        }));

        var receiveMailOptions = {
            to: email,
            from: 'passwordreset@kushalraghav.com',
            subject: 'E-Mail from a user!',
            text: message + '\n\n' + 'User E-Mail : ' + email
        };

        var sendMailOptions = {
            to: email,
            from: 'admin@kushalraghav.com',
            subject: 'We will get back to you soon!',
            text: 'Hi ' + name + ', we have received your mail and is currently being reviewed.\n\n' +
            'We will get back to you as soon as possible with the information you need. \n\n' +
            'Thank you for using Angular \n\n' +
            'Regards, \n' +
            'Kushal Raghav \n\n' +
            'DO NOT REPLY TO THIS EMAIL! THIS IS AN UNATTENDED MAILBOX!'
        };

        smtpTransport.sendMail(receiveMailOptions, function (err, response) {
            if (err) {
                throw err;
            }
            else {
                console.log("New E-Mail Recieved!"); //check in heroku logs
                smtpTransport.sendMail(sendMailOptions, function (err, response) {
                    if (err) {
                        throw err;
                    }
                    res.send({result: "done"});
                });
            }
        });

    });
};