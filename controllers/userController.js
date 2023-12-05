const User = require("../models/userModel.js");
const app = require("../server.js");
const bcrypt = require('bcrypt');
const e = require("express");
const saltRounds = 10;

//.................................UNREGISTRED..................................//

//UNREGISTRED, welcome page
const welcome = (req, res) => {
    res.status(200).render("welcome", {
        style:"./unregistered/welcome.css", 
        role:"unregistered", 
        footer:true, 
        not_partial:true
    })
}

//UNREGISTERED, sign up
const signUp = (req, res) =>{
    console.log("Signing up..")


    res.render("signUp", {
        style:"./unregistered/signup.css",
        role : "unregistered",
        not_partial : true,
        footer : false
    });
};

const signUpConfirm = (req, res) =>{
    console.log("Registering..")

    var {first_name, last_name, email, password} = req.body

    User.findRegistered(email)
        .then(data1 => {
            if (data1.rows.length == 0){
                User.newVolunteer(first_name, last_name, email, password)
                    .then(data1 => {
                        User.getByEmail(email)
                            .then(data => {
                                req.session.regenerate(function (err) {
                                    if (err) next(err)
        
                                    req.session.user = data.rows[0].id
                                    req.session.role = data.rows[0].role
                                    req.session.name = first_name
        
                                    req.session.save(function (err) {
                                        if (err) return next(err) 
                                    
                                        res.render("volunteerHomepage", {
                                            data : data.rows,
                                            style:"./volunteer/user/homepage.css",
                                            user_id: req.session.user,
                                            user_name:  req.session.name,
                                            data_to_print:  [],
                                            role : "volunteer",
                                            not_partial : true,
                                            footer : false
                                        });
                                    })
                            })
                            
                        })


                    })
            }else{
                res.status(400).json('This email is already registered!');
            }
        })
};


//UNREGISTRED, login in
const logIn = (req, res) =>{
    console.log("Log in..")

    res.render("logIn", {
        style:          "./unregistered/login.css",
        role :          "unregistred",
        not_partial :   true,
        footer :        false
        
    });
};





//UNREGISTRED, loggin in
const logInConfirm = (req, res) =>{
    console.log("Loggin in..")

    const {email , password} = req.body

    User.verification(email)
        .then(data =>{
                bcrypt.compare(password, data.rows[0].password, function(err, result) {
                    console.log(result)
                    if(result){
                        req.session.regenerate(function (err) {
                            if (err) next(err)
                        
                            // store user information in session, typically a user id
                            req.session.user = data.rows[0].id
                            req.session.role = data.rows[0].role
                            req.session.name = data.rows[0].first_name

                            var style =  './volunteer/user/homepage.css'

                            if(req.session.role != "volunteer"){
                                style =  './caregiver/user/homepage.css'
                            }

                        
                            // save the session before redirection to ensure page
                            // load does not happen before session is saved
                            req.session.save(function (err) {
                              if (err) return next(err)

                              User.get(data.rows[0].id)
                                .then(data1 => {
                                    User.getAllData(data.rows[0].id)
                                        .then(data2 => {
                                            var data_to_print = date_parsing(data2.rows)
                                            console.log("rendering homepage", data1.rows[0].role)
                                            res.render(data1.rows[0].role+"Homepage", { 
                                            data:           data1.rows, 
                                            user_name:      req.session.name,
                                            data_to_print:  data_to_print,
                                            user_id:        data.rows[0].id,
                                            style:          style, 
                                            role:           data1.rows[0].role, 
                                            not_partial:    true,
                                            footer:         false  
    
                                            })
                                        })

                                       
                                })
                                .catch(err => res.status(400).json({ err }));
                            })
                        })
                    
                    }else{
                        if(email == "AdmiN" && password == "AdminIIS2022"){

                            req.session.user = data.rows[0].id
                            req.session.name = data.rows[0].e_mail
                            req.session.role = "admin"

                            req.session.save(function (err) {
                                if (err) return next(err)
  
                                User.SearchAdmin()
                                .then(data => {
                                    res.render("adminHomepage",{
                                        data: data.rows,
                                        user_id : req.session.user,
                                        user_name : req.session.name,
                                        style :  './admin.css',
                                        role: "admin",
                                        not_partial:true,
                                        footer:false,
                                    })
                        
                                })
                              })

                        }
                    }

                });
        })

};


//.................................CAREGIVER..................................//

//CAREGIVER, homepage
const homepageCar = (req, res) =>{
    console.log("Caregiver homepage...")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const data = [] //SKONTROLOVAT DATA!!!
    res.render("caregiverHomepage", {
        data:           data, 
        style:          './caregiver/user/homepage.css', 
        role:           "caregiver", 
        user_id:        req.session.user, 
        user_name:  req.session.name,
        not_partial:    true, 
        footer:         true
    })
}


//CAREGIVER, get pending volunteers
const Pending = (req, res) => {
    console.log("Caregiver get pending volunteers..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    User.pending()
        .then(data => res.render("caregiverPendingVolunteers", { 
            data:       data.rows, 
            style:      './caregiver/user/homepage.css', 
            role:       "caregiver", 
            user_id:    req.session.user,
            user_name:  req.session.name,
            not_partial:false, 
            footer:     true 
        }))
        .catch(err => res.status(400).json({ err }));

}

//CAREGIVER, get user profile
const get = (req, res) => {
    console.log("Caregiver get user profile...")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id, r_id} = req.query

    User.get(id)
        .then(data => res.render("caregiverUserProfile", { 
            data:           data.rows, 
            style:          './caregiver/user/userProfile.css', 
            role:           "caregiver", 
            reservation_id: r_id, 
            user_id:        req.session.user,
            user_name:  req.session.name,
            not_partial:    true,
            footer:         false  
        }))
        .catch(err => res.status(400).json({ err }));
}


//CAREGIVER, pending volunteer profile
const getPending = (req, res) => {
    console.log("Caregiver pending volunteer profile")
    
    const {id} = req.params
    
    User.get(id)
    .then(data => res.render("caregiverPendingUserProfile", { 
        data:           data.rows, 
        style:          './caregiver/user/pendingUserProfile.css',
        role:           "caregiver", 
        user_id:        req.session.user,
        user_name:  req.session.name,
        not_partial:    true, 
        footer:         false 
    }))
    .catch(err => res.status(400).json({ err }));
    
}

//CAREGIVER, changing auth of volunteers
const PendingChange = (req, res) =>{
    console.log("Caregiver, changing state of volunteers..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {confirm} = req.body
    const {id} = req.params

    if(confirm){
        User.changeAuth(id, confirm)
            .then(result => {res.json( {redirect : "/caregiverHomepage" })} )            
            .catch(err => res.status(400).json({ err }));
    }
}


//.................................VOLUNTEER..................................//


//VOLUNTEER, homepage
const homepageVol = (req, res) =>{
    console.log("Volunteer homepage...")

    if(req.session.role != "volunteer"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    User.get(req.session.user)
        .then(data => {
            User.getAllData(req.session.user)
                .then(data1 =>{
                    var data_to_print = date_parsing(data1.rows)
                    res.render("volunteerHomepage", {
                        data:       data.rows, 
                        data_to_print : data_to_print,
                        user_id:    req.session.user,
                        user_name:  req.session.name,
                        style:      './volunteer/user/homepage.css',
                        role:       "volunteer", 
                        not_partial: true, 
                        footer:     true

                })
            })
        })
}

//VOLUNTEER, get my profile
const getmyprofile = (req, res) => {
    console.log("Volunteer get my profile...")

    if(req.session.role != "volunteer"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }


    const {id} = req.params

    User.get(id)
        .then(data => res.render("volunteerMyProfile", { 
            data:           data.rows, 
            user_id:        req.session.user, 
            user_name:  req.session.name,
            role:           "volunteer", 
            style:          './caregiver/user/userProfile.css', 
            not_partial:    true,
            footer:         false  
        }))
        .catch(err => res.status(400).json({ err }));
}

//VOLUNTEER, edit my profile
const editmyprofile = (req, res) =>{
    console.log("Volunteer edit my profile")

    if(req.session.role != "volunteer"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params

    User.get(id)
        .then(data => res.render("volunteerEditMyProfile", { 
            data:           data.rows, 
            user_id:        req.session.user, 
            user_name:  req.session.name,
            role:           "volunteer", 
            style:          './caregiver/user/userProfile.css', 
            not_partial:    true,
            footer:         true
        }))
        .catch(err => res.status(400).json({ err }));    
}

//VOLUNTEER, edit my profile submit
const editmyprofileSubmit = (req, res) => {
    console.log("Volunteer editing my profile...")

    if(req.session.role != "volunteer"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params

    const {first_name, last_name, date_of_brith, phone_number, e_mail, adress, _default_img} = req.body

    var relative_path = ""

    if(!req.files || Object.keys(req.files).length === 0){
        relative_path = _default_img
    }else{
        let to_save = req.files.img
        console.log(req.files)
        console.log("nieco")
    
        const filename = to_save.name;
    
    
        relative_path = "/img/"+filename;
    
        const img = __dirname + "/../files/"+filename;
    
        to_save.mv(img, function(err){
            if(err){
                return res.status(400).send(err);
            }
    
        });
    }


    User.edit(id, first_name,last_name,date_of_brith,phone_number,e_mail,adress, relative_path)
        .then(data => res.render("volunteerMyProfile", {
            data:        data.rows, 
            style:      './caregiver/user/userProfile.css', 
            role:       "volunteer", 
            user_id:    req.session.user, 
            user_name:  req.session.name,
            not_partial:true, 
            footer:     true
        }))
        .catch(err => res.status(400).json({ err }));  
}

//.................................VETERINARIAN..................................//

//VETERINARIAN, homepage
const homepageVet = (req, res) =>{
    console.log("Veterinarian homepage...")

    if(req.session.role != "veterinarian"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const data = [] //SKONTROLOVAT DATA!!
    res.render("veterinarianHomepage", {
        data:       data, 
        style:      './caregiver/user/homepage.css', 
        role:       "veterinarian", 
        user_id:    req.session.user,
        user_name:  req.session.name,
        not_partial:true, 
        footer:     true
    })
}


//.................................ADMIN..................................//


//ADMIN, homepage
const adminHomepage = (req, res) =>{
    console.log("Admin homepage...")
    
    if(req.session.role != "admin"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    User.SearchAdmin()
        .then(data => {
            res.render("adminHomepage",{
                data: data.rows,
                user_id : req.session.user,
                user_name : req.session.name,
                style :  './admin.css',
                role: "admin",
                not_partial:true,
                footer:false,
            })

        })
    
}


//ADMIN, add user
const addUser = (req, res) =>{
    console.log("Admin add user..")

    if(req.session.role != "admin"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    res.render("adminAddUser", {
        style:          './caregiver/user/userProfile.css', 
        user_id:        req.session.user, 
        user_name:      req.session.name,
        role:           "admin", 
        not_partial:    true, 
        footer:         false
    })
    
};

//CAREGIVER, add animal submit
const addUserSubmit = (req, res) =>{
    console.log("Admin add animal submit..")

    if(req.session.role != "admin"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }
    
    const {first_name, last_name, e_mail, password, role} = req.body
    
    User.addAdmin(first_name, last_name, e_mail, password, role)
        .then(data1 => {
            User.SearchAdmin()
                .then(data =>{
                    res.render("adminHomepage", {
                        data: data.rows,
                        user_id : req.session.user,
                        user_name : req.session.name,
                        style :  './admin.css',
                        role: "admin",
                        not_partial:true,
                        footer:false,
                    })
                })


        })
        .catch(err => res.status(400).json({ err }));
};  



const getAdminProfile = (req, res) => {

    if(req.session.role != "admin"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params

    User.get(id)
        .then(data => {
            res.render("adminProfileUser", { 
            data:           data.rows, 
            user_id:        req.session.user, 
            user_name:      req.session.name,
            role:           "admin", 
            style:          './caregiver/user/userProfile.css', 
            not_partial:    true,
            footer:         false  
            })

        })
        .catch(err => res.status(400).json({ err }));
} 



const deleteUser = (req, res) => {

    if(req.session.role != "admin"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params

    User.deleteUser(id)
        .then(result => {res.json( {redirect : "/adminHomepage" })} )
        .catch(err => res.status(400).json({ err }));
} 



//.................................ERROR VIEW..................................//


const error = (req, res) =>{
    res.render("error", {})
}

//FUNCTION FOR DATE PARSING
function date_parsing(data) {
    var myArray = []
    var newst_rows = []
    var myArray2;
    console.log("data", data)
    for (var i = 0; i < data.length;  i++){
        myArray2 = String(data[i].date)

        myArray = myArray2.split(" ")

        weekday = myArray[0]
        day = myArray[2]
        month = myArray[1]
        year = myArray[3]
        new_data = weekday + " " + day + "." + month + "." + year
        newst_rows.push(new_data)
    }
    console.log("data", newst_rows)
    return newst_rows
}


module.exports = {
    signUp, 
    Pending,
    get,
    homepageCar,
    homepageVol,
    getPending,
    PendingChange,
    welcome,
    getmyprofile,
    editmyprofile,
    editmyprofileSubmit,
    logIn,
    error,
    signUpConfirm,
    logInConfirm,
    adminHomepage,
    addUser,
    addUserSubmit,
    getAdminProfile,
    deleteUser,
    homepageVet,

}