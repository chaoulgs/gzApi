
//Dependencies
var restful = require('node-restful');
var mongoose = restful.mongoose;

//Schema
var userSchema = new mongoose.Schema({
  id: Number,
  discordId: String,
  username: String,
  tokens: 0
});

//Return model
module.exports = restful.model('Users', userSchema);