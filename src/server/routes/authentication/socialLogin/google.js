module.exports = function(app, request, User, createJWT, secret, googlesecret) {

    app.route('/auth/google').post( function(req, res){
        //console.log(req.body.code);
        var url = 'https://accounts.google.com/o/oauth2/token';
        var apiUrl = 'https://www.googleapis.com/plus/v1/people/me/openIdConnect';
        var params = {
            client_id: req.body.clientId,
            redirect_uri: req.body.redirectUri,
            code: req.body.code,
            grant_type: 'authorization_code',
            client_secret: googlesecret
        };

        // Step 1. Exchange authorization code for access token.
        request.post(url, {
            json:true,
            form: params
        }, function(err,response,token){
            var accessToken = token.access_token;
            var headers = {
                Authorization: 'Bearer ' + accessToken
            }

        // Step 2. Retrieve profile information about the current user.
            request.get({url:apiUrl, headers: headers, json:true}, function(err, response, profile){
                console.log(profile);
                User.findOne({googleId: profile.sub}, function(err, foundUser){
                    if(err) throw err;
                    if(foundUser){
                       console.log('found user googleId');
                       console.log(JSON.stringify(foundUser));
                       var token = createJWT(foundUser, secret);

                       return  res.status(200).send({
                            name: foundUser.name,
                            picture: foundUser.picture,
                            token: token
                        });
                    }
                    else {
                        if(profile.email != null){
                            var query = {email: profile.email};
                            User.findOne(query, function(err, user){
                                if(err) throw err;

                                if(user) {
                                    user.googleId = profile.sub;
                                    user.picture = user.picture || profile.picture;
                                    user.save(function(err,updated){
                                        if(err) throw err;
                                        console.log('added googleId to existing user profile' + JSON.stringify(updated));
                                    });
                                    User.findOne({googleId: profile.sub}, function(err, found) {
                                        if(err) throw err;
                                        if(found) {
                                            console.log(JSON.stringify(found));
                                            var token = createJWT(found, secret);
                                            return res.send({token: token, name: found.name, picture: found.picture});
                                        }
                                    });
                                }
                                else {
                                    var newUser = new User();
                                    newUser.googleId = profile.sub;
                                    newUser.name = profile.name;
                                    newUser.email = profile.email;
                                    newUser.picture = profile.picture;
                                    newUser.save(function(err, saved){
                                        if(err) throw err;
                                        console.log('Successfully saved new google user ' + JSON.stringify(saved));
                                        res.send({token: createJWT(saved, secret), name: saved.name, picture: saved.picture, userId: saved._id});
                                    });
                                }
                            });
                        }
                    }
                });
            });
        });
    });
};