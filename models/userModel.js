const db = require("../databasepg")
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const e = require("express");
const saltRounds = 10;

const User = {};


// MAIN FUNCTION TO GET USER DATA
User.get = (id) =>{
    console.log("volunteer:", id)
    return db.query("SELECT * FROM participants WHERE id = $1", [id]); 
}

User.getByEmail = (e_mail) =>{
    console.log("volunteer:", e_mail)
    return db.query("SELECT * FROM participants WHERE e_mail = $1", [e_mail]); 
}

//USER DATA WITH WALKIES
User.getAllData = (id) =>{
    console.log("volunteer:", id)
    return db.query("SELECT * FROM participants NATURAL JOIN reservations WHERE id = $1", [id]); 
}


//VALIDATING IF USER IS NOT ALREADY REGISTERED
User.findRegistered = (email) => {
   return db.query("SELECT * FROM participants WHERE e_mail = $1", [email])
}


//LOGIN DATA
User.verification = (email) => {
    return db.query("SELECT e_mail, password, role, id, first_name FROM participants WHERE e_mail = $1", [email])
}

//ADDING NEW VOLUNTEER
User.newVolunteer = (first_name, last_name, e_mail, password) =>{
    const primary_key = uuid.v1();

    bcrypt.hash(password, saltRounds, function(err, hash) {
        return db.query(`INSERT into participants(id, volunteer_id, first_name, last_name, e_mail, password, role, authentification)` + `VALUES($1, $2, $3, $4, $5, $6, $7, $8)`, 
        [primary_key, primary_key, first_name, last_name, e_mail, hash, "volunteer", false]);
    });


    return db.query("SELECT * FROM participants WHERE id = $1", [primary_key]); 
}

//PENDING NEW VOLUNTEERS
User.pending = () =>{
    return db.query("SELECT * FROM participants WHERE authentification = $1", [false]); 
}

//CHANGING AUTHENTIFICATION
User.changeAuth = (id, confirm) => {
    console.log("changing :", id, "to", confirm)
    db.query("UPDATE participants SET authentification = $1 WHERE id = $2", 
    [confirm, id]);

    return db.query("SELECT * FROM participants WHERE id = $1", [id]);    
}

//EDITING USER DATA
User.edit = (id, fn, ln, date_of_birth, phone, email, address, img) =>{
    db.query("UPDATE participants SET first_name = $1, last_name = $2, birthday = $3, phone_number = $4, address = $5, e_mail = $6, img_par = $7 WHERE id = $8", 
    [ fn, ln, date_of_birth, phone, address, email, img ,id]);

    return db.query("SELECT * FROM participants WHERE id = $1", [id]); 
}


// add ARTICLE
User.addAdmin = (first_name, last_name, email, password, role) => {
    const primary_key = uuid.v1();


    console.log(role)

    if(role == "caregiver"){
        bcrypt.hash(password, saltRounds, function(err, hash) {
            db.query(`INSERT into participants(id, caregiver_id, first_name, last_name, e_mail, password, role, authentification)` + `VALUES($1, $2, $3, $4, $5, $6, $7, $8)`, 
            [primary_key, primary_key, first_name, last_name, email, hash, "caregiver", true]);
        });
        console.log("caregiver added")
    }else if(role == "veterinarian"){
        bcrypt.hash(password, saltRounds, function(err, hash) {
            db.query(`INSERT into participants(id, veterinarian_id, first_name, last_name, e_mail, password, role, authentification)` + `VALUES($1, $2, $3, $4, $5, $6, $7, $8)`, 
            [primary_key, primary_key, first_name, last_name, email, hash, "veterinarian", true]);
        });
    }

    return db.query("SELECT * FROM participants WHERE id = $1", [primary_key]); 
};



User.SearchAdmin = () =>{
    return db.query("SELECT * FROM participants WHERE e_mail != $1", ["AdmiN"])
}

User.deleteUser = (id) => {
    return db.query("DELETE from participants WHERE id = $1", [id]);

}

module.exports = User;