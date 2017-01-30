module.exports = function(app, request, User, createJWT, secret, fbsecret) {
    //console.log(User);
    app.route('/auth/facebook').post(function(req, res) {
        console.log(req.body.userId);
        var fields = ['email', 'id', 'first_name', 'last_name', 'link', 'name', 'picture.type(large)'];
        var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
        var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
        var params = {
            code: req.body.code,
            client_id: req.body.clientId,
            client_secret: fbsecret,
            redirect_uri: req.body.redirectUri
        }
        request.get({url: accessTokenUrl, qs: params, json: true}, function(err, response, accessToken) {
            if (response.statusCode !== 200) {
              return res.status(500).send({ message: accessToken.error.message });
            }
            //console.log(accessToken);
            request.get({url: graphApiUrl, qs:accessToken, json: true}, function(err,response, profile) {
                if (response.statusCode !== 200) {
                    return res.status(500).send({ message: profile.error.message });
                }
                //console.log(profile);
                User.findOne({facebookId: profile.id}, function(err, fbuser) {
                    if(err) throw err;

                    if(fbuser) {
                        console.log('user found using facebookId');
                        return res.send({token: createJWT(fbuser,secret), name: profile.name, picture: fbuser.picture});
                    }
                    else {
                        if(profile.email != null) {
                            var query = { email: profile.email};
                            User.findOne(query, function(err, user) {
                                if(err) throw err;

                                if(user) {
                                    user.facebookId = profile.id;
                                    user.picture = user.picture || profile.picture;
                                    user.save(function(err,updated){
                                        if(err) throw err;
                                        console.log('added facebookId to existing user profile' + JSON.stringify(updated));
                                    });
                                    User.findOne({facebookId: profile.id}, function(err, found) {
                                        if(err) throw err;
                                        if(found) {
                                            var token = createJWT(found, secret);
                                            return res.send({token: token, name: found.name, picture: found.picture});
                                        }
                                    });
                                }
                                else {
                                    var newUser = new User();
                                    newUser.facebookId = profile.id;
                                    newUser.name = profile.name;
                                    newUser.email = profile.email;
                                    newUser.picture = profile.picture.data.url;
                                    newUser.save(function(err, saved){
                                        if(err) throw err;
                                        console.log('Successfully saved new facebook user ' + JSON.stringify(saved));
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