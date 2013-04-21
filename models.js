var mongoose = require('mongoose');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var showSchema = new Schema({
    title    : String
  , place    : String
  , when	 : String
  , date     : String
  , time	 : String
  , body     : String
});

var emailSchema = new Schema({
	email 	: String
});

exports.Email = mongoose.model('Email', emailSchema);
exports.Show = mongoose.model('Show', showSchema);