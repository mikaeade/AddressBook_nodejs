var express = require('express');
var router = express.Router();
// incluudaa function
var db = require('../mymodules/dbconnection');
var loggedin = false;
var userName = "";
// AddressBook ja Register tietokanta

router.get('/', function(req, res) {
    console.log("index")
    // alusta tietokanta
    db.initialiseDataBase(req, res);
    //pääsivu
    res.render('index', {});
});

router.register = function(req, res){
    // rekisteröinti sivu
    console.log("register")
    res.render('register', {});
}

router.register_user = function(req, res){
    // rekisteröinti sivu
    console.log("register_user")
    var registerDb = new db.Register({
        username:req.body.username,
        password:req.body.password,
        email:req.body.email
     });
    //tallenna objekti
    registerDb.save(function(err){
        if(err){
            console.log("error during registering -> db error");
            res.render('register',{error: "Username reserved already !"});
        }
        else{
            console.log("registering was successful");
            res.status(301);
            res.setHeader('location','http://localhost:3000');
            res.render('index',{});
        }
    });
}

router.login = function(req, res){
    console.log("login")
    db.Register.find({username:req.body.username, password:req.body.password}, function(err, foundRegisterData){
    if(err){
        console.log("error when trying to find data from db");
        res.render('generalerror');
     } 
     else if(foundRegisterData.length === 0)
     {
            console.log("could not find data with given data");
            res.render('notidentified');
     }
     else{         
        console.log("find from db oK");
        // temp solution to check if logged, change to use Session 
        loggedin = true;
        userName = foundRegisterData[0].username;
        res.redirect('/getaddressbook');
     }
    });   
}

router.getaddressbook = function(req, res){  
    // hae tiedot tietokannasta
    db.AddressBook.find({owner: userName}, function(err, addressbookData){
    if(err)
    {
        console.log("error fetching addressBook data");
    }
    else{         
        console.log("getaddressbook find from db oK");
        res.render('names', {addressbookData: addressbookData, userName:userName});
    }
    });
}

router.new_contact = function(req, res){
    console.log("new_contact");
    res.render('addtoaddressbook');
}

router.update_address_book = function(req, res){
    
   // päivitä AddressBook database
   console.log("update_address_book");
   var AddressbookFormat = new db.AddressBook({
        owner: userName,
        name: req.body.username,
        address: req.body.address,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        birthday: req.body.birthday,
        generalinfo: req.body.generalinfo 
    });    

    AddressbookFormat.save(function(err){
        if(err)
        {
            res.render('generalerror');
        }
        else{
            console.log("Addressbook save successfully");
            res.redirect('/getaddressbook');
        }  
   }); 
}

router.get_contacts = function(req, res){

    console.log("get_contacts");
    db.AddressBook.findById(req.query.id,function(err,data){
    if(err){
        res.render('generalerror');
    }
    else{
        res.render('contactsData',data);
    }
});

}

module.exports = router;
