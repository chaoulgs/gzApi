//Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;
var bcrypt = require('bcryptjs');

//Schema
var userSchema = new mongoose.Schema({
	id: {
		type: Number
	},
	discordId: {
		type:String
	},
	tokens: {
		type: Number
	},
	toxicTokens: {
		type: Number
	},
	username: {
		type: String,
		index: true
	},
	password: {
		type: String
	},
	email: {
		type: String
	},
	name: {
		type: String
	}
});

//Return model
module.exports = restful.model('Users', userSchema);

var User = mongoose.model('User', userSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password, salt, function(err, hash) {
	        newUser.password = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err){
    		console.log(err);
    	}
    	callback(null, isMatch);
	});
}