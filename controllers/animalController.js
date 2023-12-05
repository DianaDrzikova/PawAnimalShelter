
const { file } = require("file-reader");
const Animal = require("../models/animalModel.js");
const app = require("../server.js");



//.................................CAREGIVER..................................//

//CAREGIVER, get all animals
const getAnimalsCaregiver = (req, res) => {
    console.log("Caregiver get all animals..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {name, spieces} = req.query
    const Spieces = spieces.charAt(0).toUpperCase() + spieces.slice(1);

    Animal.getSpecified1(name, spieces)
        .then(data => res.render("caregiverAnimals", { 
            data:           data.rows, 
            style:          './caregiver/animal/animals.css', 
            role:           "caregiver", 
            user_id:        req.session.user, 
            user_name:      req.session.name,
            spieces:        Spieces, 
            name:           "Name",  
            not_partial:    true,
            footer:         true 
        }))
        .catch(err => res.status(400).json({ err }));
};

//CAREGIVER, get animal 
const getAnimal = (req, res) =>{
    console.log("Caregiver get animal..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }    

    const {id} = req.params

    Animal.view(id)
        .then(data => res.render("caregiverProfileAnimal", {
            data:           data.rows, 
            style:          './caregiver/animal/profileAnimal.css', 
            role:           "caregiver", 
            user_name:      req.session.name,
            user_id:        req.session.user, 
            not_partial:    true, 
            footer:         false
        }))
        .catch(err => res.status(400).json({ err }));
};


//CAREGIVER, add animal
const addAnimal = (req, res) =>{
    console.log("Caregiver add animal..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    res.render("caregiverAddAnimal", {
        style:          './caregiver/animal/addAnimal.css', 
        user_id:        req.session.user, 
        user_name:      req.session.name,
        role:           "caregiver", 
        not_partial:    true, 
        footer:         false
    })
    
};

//CAREGIVER, add animal submit
const addAnimalSubmit = (req, res) =>{
    console.log("Caregiver add animal submit..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }
    
    const {name_animal, spieces, age, gender, description} = req.body
    console.log(req.files)

    if(!req.files || Object.keys(req.files).length === 0){
        return res.status(400).send("No image uploaded!");
    }

    let to_save = req.files.img

    const filename = to_save.name;
    const relative_path = "/img/"+filename;

    const img = __dirname + "/../files/"+filename;

    to_save.mv(img, function(err){
        if(err){
            return res.status(400).send(err);
        }

    });

    
    Animal.add(name_animal, spieces, age, gender, description, relative_path)
        .then(data => res.render("caregiverProfileAnimal", {
            data:           data.rows, 
            style:          './caregiver/animal/profileAnimal.css', 
            role:           "caregiver", 
            user_name:      req.session.name,
            user_id:        req.session.user,
            not_partial:    true, 
            footer:         false
        }))
        .catch(err => res.status(400).json({ err }));
};  

//CAREGIVER, delete animal
const deleteAnimal = (req, res) =>{
    console.log("Caregiver delete animal..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params

    Animal.delete(id)
        .then(result => {res.json( {redirect : "/caregiverAnimals/?name=all&spieces=all" })} )
        .catch(err => res.status(400).json({ err }));
};

//CAREGIVER, edit animal
const editAnimal = (req, res) => {
    console.log("Caregiver edit animal...")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }    

    const {id} = req.params

    Animal.view(id)
        .then(data => res.render("caregiverEditAnimal", {
            data:       data.rows, 
            style:      './caregiver/animal/editAnimal.css', 
            role:       "caregiver", 
            user_name:      req.session.name,
            user_id:    req.session.user, 
            not_partial:true, 
            footer:     false
        }))
        .catch(err => res.status(400).json({ err }));  
};


//CAREGIVER, edit animal submit
const editAnimalSubmit = (req, res) => {
    console.log("Caregiver edit animal submit..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params
    const {name_animal, spieces, age, gender, description, _default_img} = req.body


    var relative_path = ""

    if(!req.files || Object.keys(req.files).length === 0){
        relative_path = _default_img
    }else{
        let to_save = req.files.img
        const filename = to_save.name;    
        relative_path = "/img/"+filename;
        const img = __dirname + "/../files/"+filename;
    
        to_save.mv(img, function(err){
            if(err){
                return res.status(400).send(err);
            }
    
        });
    }

    Animal.edit(id, name_animal, spieces, age, gender, description, relative_path)
        .then(data => res.render("caregiverProfileAnimal", {
            data:           data.rows, 
            style:          './caregiver/animal/profileAnimal.css', 
            role:           "caregiver", 
            user_id:        req.session.user, 
            user_name:      req.session.name,
            not_partial:    true, 
            footer:         false
        }))
        .catch(err => res.status(400).json({ err }));  
};   

//CAREGIVER, search with filter
const searchWithFilter = (req, res) => {
    console.log("Caregiver search with filter..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {name, spieces} = req.query

    var Spieces = "Spieces"

    if(spieces != "all"){
        Spieces = spieces.charAt(0).toUpperCase() + spieces.slice(1);
    }

    Animal.getSpecified1(name, spieces)
        .then(data => res.render("caregiverFoundAnimals", { 
            data:           data.rows, 
            style:          './caregiver/animal/animals.css', 
            role:           "caregiver", 
            spieces:        Spieces, 
            name:           name, 
            user_id:        req.session.user,
            user_name:      req.session.name,
            not_partial:    false,
            footer:         true 
        }))        
        .catch(err => res.status(400).json({ err }));
};

//.................................VOLUNTEER + SOME OF UNREGISTERED..................................//

//VOLUNTEER/UNREGISTERED, get all animals..
const getAnimalsVolunteer = (req, res) => {
    console.log("Volunteer get all animals..")

    var role = ""
    var endpoint = ""
    var user_id = ""

    if(req.path == "/unregistredAnimals/"){
        endpoint = "unregistredAnimals"
        role = "unregistred"
    }else{
        endpoint = "volunteerAnimals"
        role = "volunteer"
    }

    if(role == "volunteer"){
        if(req.session.role != "volunteer"){
            res.status(400).render("error", {not_partial:true, footer:false})
        }
        user_id = req.session.user
    }

    var {date, spieces} = req.query

    var today = new Date()
    var todayNulled = new Date()
    todayNulled.setHours(0,0,0,0);

    var hour = "" 
    var minutes = "" 
    var show = true

    if(date == "today"){ //MEANING TODAY
        date = new Date();

        hour = date.getHours()
        minutes = date.getMinutes()
        
        if(hour > 13){
            show = false;
        }

    }else{
        date = new Date(date);
        date.setHours(0,0,0,0);

        if(todayNulled.getTime() == date.getTime()){
            hour = today.getHours()
            if(hour > 14){
                show = false;
            }
        }
    }
    
    date.setHours(0,0,0,0);

    const Spieces = spieces.charAt(0).toUpperCase() + spieces.slice(1);
    
    Animal.getSpecifiedHomepage(date, spieces, show)
    .then(data => {
        res.render(endpoint, { 
            data:       data.rows, 
            style:      './volunteer/animal/animals.css', 
            role:       role, 
            user_id:    user_id, 
            user_name:      req.session.name,
            spieces:    Spieces, 
            name:       "Name", 
            not_partial:true,
            footer:     true 
        })

    })
        .catch(err => res.status(400).json({ err }));
};



//VOLUNTEER/UNREGISTERED, get animal
const getAnimalV = (req, res) => {
    console.log("Volunteer and unregistered get animal...")

    const {id} = req.params

    var user_id = ""
    var role = ""
    var path = String(req.path)

    var endpoint = ""
    if(path.includes("volunteer")){
        endpoint = "volunteerProfileAnimal"
        role = "volunteer"
    }else{
        endpoint = "unregistredProfileAnimal"
        role = "unregistred"
    }

    if(role == "volunteer"){
        if(req.session.role != "volunteer"){
            res.status(400).render("error", {not_partial:true, footer:false})
        }
        user_id = req.session.user
    }
    
    Animal.getAnimalReservations(id)
        .then(data => {
            if(data.rowCount != 0){
                res.render(endpoint, {
                data:       data.rows, 
                style:      './volunteer/animal/profileAnimal.css', 
                role:       role, 
                user_id:    user_id, 
                user_name:      req.session.name,
                not_partial:true, 
                footer:     true
                })
            }else{
                Animal.view(id)
                .then(data => {
                    res.render(endpoint, {
                        data:       data.rows, 
                        style:      './volunteer/animal/profileAnimal.css', 
                        role:       role, 
                        user_id:    user_id, 
                        user_name:      req.session.name,
                        not_partial:true, 
                        footer:     true
                    })
                })
            }
            
        })
        .catch(err => res.status(400).json({ err }));
}


//VOLUNTEER/UNREGISTRED, search animals
const searchWithFilterV = (req, res) => {
    console.log("getAnimals from animals volunteer..")

    var {date, spieces} = req.query

    var role = ""
    var user_id = ""
    var endpoint = ""

    if(req.path == "/unregistredAnimals/unregistredFoundAnimals/"){
        endpoint = "unregistredFoundAnimals"
        role = "unregistred"

    }else{
        endpoint = "volunteerFoundAnimals"
        role = "volunteer"
    }

    if(role == "volunteer"){
        if(req.session.role != "volunteer"){
            res.status(400).render("error", {not_partial:true, footer:false})
        }
        user_id = req.session.user
    }

    var today = new Date()
    var todayNulled = new Date()
    todayNulled.setHours(0,0,0,0);

    var hour = "" 
    var minutes = "" 
    var show = true

    if(date == "today"){ //MEANING TODAY
        date = new Date();

        hour = date.getHours()
        minutes = date.getMinutes()
        console.log(hour, minutes)
        
        if(hour > 13){
            show = false;
        }

    }else{
        date = new Date(date);
        date.setHours(0,0,0,0);
        console.log(date, today)

        if(todayNulled.getTime() == date.getTime()){
            hour = today.getHours()
            if(hour > 14){
                show = false;
            }
        }
    }
    
    date.setHours(0,0,0,0);

    const Spieces = spieces.charAt(0).toUpperCase() + spieces.slice(1);


    Animal.getSpecifiedHomepage(date, spieces, show)
    .then(data => res.render(endpoint, { 
        data:       data.rows, 
        style:      './volunteer/animal/animals.css', 
        role:       role, 
        user_id:    user_id, 
        spieces:    Spieces,  
        not_partial:false,
        footer:     true
    }))
    .catch(err => res.status(400).json({ err }));
};


//.................................VETERINARIAN..................................//


//VETERINARIAN, get all animals
const getAnimalsVet = (req, res) => {
    console.log("Veterinarian get all animals..")

    if(req.session.role != "veterinarian"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }


    const {name, spieces} = req.query
    const Spieces = spieces.charAt(0).toUpperCase() + spieces.slice(1);

    Animal.getSpecified1(name, spieces)
        .then(data => res.render("veterinarianAnimals", { 
            data:       data.rows, 
            style:      './caregiver/animal/animals.css', 
            role:       "veterinarian", 
            user_id:    req.session.user, 
            user_name:  req.session.name,
            spieces:    Spieces, 
            name:       "Name",  
            not_partial:true,
            footer:     true 
        }))
        .catch(err => res.status(400).json({ err }));

};


//VETERINARIAN, search with filter
const searchWithFilterVet = (req, res) => {
    console.log("Veterinarian search with filter..")

    if(req.session.role != "veterinarian"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {name, spieces} = req.query

    var Spieces = "Spieces"

    if(spieces != "all"){
        Spieces = spieces.charAt(0).toUpperCase() + spieces.slice(1);
    }

    Animal.getSpecified1(name, spieces)
        .then(data => res.render("veterinarianFoundAnimals", { 
            data:       data.rows, 
            style:      './caregiver/animal/animals.css', 
            role:       "caregiver", 
            spieces:    Spieces, 
            user_id:    req.session.user,
            user_name:  req.session.name,
            name:       name, 
            not_partial:false,
            footer:     true 
        }))        
        .catch(err => res.status(400).json({ err }));
};




module.exports = {
    //CAREGIVER
    getAnimalsCaregiver, 
    addAnimal,
    addAnimalSubmit,
    getAnimal,
    deleteAnimal,
    editAnimal,
    editAnimalSubmit,
    searchWithFilter,

    //VOLUNTEER
    getAnimalsVolunteer,
    getAnimalV,
    searchWithFilterV,

    //VETERINARIAN
    getAnimalsVet,
    searchWithFilterVet,

}
