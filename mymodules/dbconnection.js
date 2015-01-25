var mongoose = require('mongoose');

var loggedin = "";

//tietokannan nimi
var uri = "mongodb://localhost/database";

// uri = oman db:n nimi ja paikka

exports.initialiseDataBase = function(req,res){
 
// tarkista onko jo yhteystietokantaan, muutoin tarvii käynnistää 
  if(!mongoose.connection.readyState)
  {
    mongoose.connect(uri, function(err, succ){
    if(err){
        console.log("Error mongodb not opened-- :): " + err);
    }
    else{
        console.log("Nicely connected to " + uri);
    }                    
    });
  }
}
 
var Schema = mongoose.Schema;

var register = new Schema({    
    username: {type:String,index:{unique:true}},
    password: String,
    email: String
});

var addressbook = new Schema({
    owner: String,
    name: String,
    address: String,
    email: String,
    phonenumber: String,
    birthday: String,
    generalinfo: String
});

var Register = mongoose.model("Register", register);
var AddressBook =  mongoose.model("AddressBook", addressbook);

exports.Register = Register;
exports.AddressBook = AddressBook;