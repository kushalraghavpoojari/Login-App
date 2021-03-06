var mongoose = require('mongoose');
var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    googleId: String,
    facebookId: String,
    picture: String,
    resetPasswordToken: String,
    resetPasswordExpires: Date
})

// UserSchema.pre('save', function(next) {
//   var user = this;
//   if (!user.isModified('password')) {
//     return next();
//   }
//   bcrypt.genSalt(10, function(err, salt) {
//     bcrypt.hash(user.password, salt, function(err, hash) {
//       user.password = hash;
//       next();
//     });
//   });
// });

// UserSchema.methods.comparePassword = function(password, done) {
//   bcrypt.compare(password, this.password, function(err, isMatch) {
//     done(err, isMatch);
//   });
// };


var User = mongoose.model('User', UserSchema);

module.exports = User;

