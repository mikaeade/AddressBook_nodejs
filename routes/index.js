var express = require('express');
var router = express.Router();
// incluudaa function
var db = require('../mymodules/dbconnection');
// AddressBook ja Register tietokanta
var userName="";

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
        // loggedin = true;
        userName = foundRegisterData[0].username;
        
        //use session
        console.log("LOGGED IN");
        req.session.loggedin = true;
        req.session.username = foundRegisterData[0].username;
        res.redirect('/getaddressbook');
     }
    });   
}

router.getaddressbook = function(req, res){  
    // hae tiedot tietokannasta
    console.log("getaddressbook");
    if(req.session.loggedin){
        console.log("logged in");
        db.AddressBook.find({owner: userName}, function(err, addressbookData){
        if(err)
        {
            console.log("error fetching addressBook data");
        }   
        else{         
            console.log("getaddressbook find from db oK");
            res.render('names', {addressbookData: addressbookData, owner: userName});
        }
        });
    }
    else{
        console.log("not logged in");
        res.render('/index');
    }
}

router.new_contact = function(req, res){
    console.log("new_contact");
    res.render('addtoaddressbook');
}

router.update_address_book = function(req, res){
    
   // päivitä AddressBook database
   if(req.session.loggedin){    
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
   else{
      res.redirect('/'); 
   }
}

router.get_contacts = function(req, res){
    if(req.session.loggedin){     
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
    else{
        res.redirect('/'); 
    }
}

router.modify = function(req, res){
    console.log("server modify");
        if(req.session.loggedin){  
            console.log(req.query.id);
            db.AddressBook.findById(req.query.id,function(err,data){
            if(err){
                console.log(err);
                res.render('generalerror');
            }
            else{
                console.log("render modify data");
                res.render('contactsDataModify',data);
            }
        });
    }
    else{
        res.redirect('/'); 
    }
}

router.delete = function(req, res){
    console.log("server delete");
        if(req.session.loggedin){  
            console.log(req.query.id);
            db.AddressBook.findOne(req.query.id,function(err,data){
            if(err){
                console.log(err);
                res.render('generalerror');
            }
            else{
                console.log("delete data");
                console.log(data);
                // deletoi tietokannasta
                if(data.length === 0)
                {
                    res.redirect('/getaddressbook');
                }
                else{
                data.remove();
                //res.send('ok');
                res.redirect('/getaddressbook');
                }
            }
        });
    }
    else{
        res.redirect('/'); 
    }
}


router.modifyaddressbookData = function(req, res){
    console.log("server modify");
    if(req.session.loggedin){  
        console.log(req.query.id);
        db.AddressBook.findById(req.query.id,function(err,data){
        if(err){
            console.log(err);
            res.render('generalerror');
        }
        else{
            console.log("Save modified contact");
            data.name= req.query.username;
            data.address= req.query.address;
            data.email= req.query.email;
            data.phonenumber= req.query.phonenumber;
            data.birthday= req.query.birthday;
            data.generalinfo= req.query.generalinfo;
            console.log("here 1");
            data.save(function(err){
                if(err){
                    console.log(err);
                    res.render('error');
                }
                else{ 
                    console.log("yritä getaddressbookiin");
                    res.redirect('/getaddressbook');
                    }
                });
            }
        });
    }
    else{
        res.redirect('/'); 
    }
}

// JATKA TÄSTÄ
router.modifyaddressbookData = function(req, res){
    console.log("server modify");
    if(req.session.loggedin){  
        console.log(req.query.id);
        db.AddressBook.findById(req.query.id,function(err,data){
        if(err){
            console.log(err);
            res.render('generalerror');
        }
        else{
            console.log("Save modified contact");
            data.name= req.query.username;
            data.address= req.query.address;
            data.email= req.query.email;
            data.phonenumber= req.query.phonenumber;
            data.birthday= req.query.birthday;
            data.generalinfo= req.query.generalinfo;
            console.log("here 1");
            data.save(function(err){
                if(err){
                    console.log(err);
                    res.render('error');
                }
                else{ 
                    console.log("yritä getaddressbookiin");
                    res.redirect('/getaddressbook');
                    }
                });
            }
        });
    }
    else{
        res.redirect('/'); 
    }
}
module.exports = router;
