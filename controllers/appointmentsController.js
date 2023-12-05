const Appointment = require("../models/appointmentModel.js");
const app = require("../server.js");


//.................................CAREGIVER..................................//

//CAREGIVER, get appointments
const getAppointments = (req, res) => {
    console.log("Caregiver get appointments..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params
    Appointment.viewAnimal(id)
        .then(data => {
            Appointment.getByUpcoming(id)
                .then(data1 => {
                    var app_data_c_print = date_parsing(data1.rows)
                    Appointment.getByUpcomingUn(id)
                        .then(data2 => {
                            var app_data_u_print = date_parsing(data2.rows)
                            res.render("caregiverVetAppointments", {
                                data:           data.rows, 
                                app_data_c:     data1.rows, app_data_c_print:   app_data_c_print,
                                app_data_u:     data2.rows, app_data_u_print:   app_data_u_print,
                                style:          "./caregiver/appointment/vetAppointments.css",
                                role:           "caregiver",
                                animal_id:      id, 
                                user_id :       req.session.user,
                                user_name:  req.session.name,
                                not_partial:    true, 
                                footer:         false
                            })
                        })
                })

        })
        .catch(err => res.status(400).json({ err }));
}

//CAREGIVER, add appointment
const addAppointments = (req, res) => {
    console.log("Caregiver add appointment")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params

    const {date, type, description} = req.body;
    console.log(date, type, description)
    
    Appointment.create(id, date, type, description)
        .then (console.log('all good'))
        .catch(err => res.status(400).json({ err })); 
};

//CAREGIVER, found appointment
const getAnimalAppointments = (req, res) =>{
    console.log("Caregiver found appointment")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params
    Appointment.viewAnimal(id)
        .then(data => {
            Appointment.getByUpcoming(id)
                .then(data1 => {
                    var app_data_c_print = date_parsing(data1.rows)
                    Appointment.getByUpcomingUn(id)
                        .then(data2 => {
                            var app_data_u_print = date_parsing(data2.rows)
                            res.render("caregiverFoundAppointments", {
                                data:           data.rows, 
                                app_data_c:     data1.rows, app_data_c_print:   app_data_c_print,
                                app_data_u:     data2.rows, app_data_u_print:   app_data_u_print,
                                style:          "./caregiver/appointment/vetAppointments.css",
                                role:           "caregiver",
                                animal_id:      id, 
                                user_id:        req.session.user,
                                user_name:  req.session.name,
                                not_partial:    false, 
                                footer:         false
                            })
                        })
                })

        })
        .catch(err => res.status(400).json({ err }));
}

//CAREGIVER, delete appointment
const deleteAnimalAppointments = (req, res) => {
    console.log("Caregiver delete appointment")
    
    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }
    
    const {id} = req.params
    Appointment.deleteAppointments(id)
 
    return     
}

//CAREGIVER, get all upcoming appointments
const getAppointmentsAll = (req, res) => {
    console.log("Caregiver get all appointments..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }
    
    Appointment.viewUpcomingCon()
    .then(data => {
            var app_data_c_print = date_parsing(data.rows)
            Appointment.viewUpcomingUn()
            .then(data1 => {
                var app_data_u_print = date_parsing(data1.rows)
                res.render("caregiverUpcomingAppointments", {
                        app_data_c :    data.rows,  app_data_c_print : app_data_c_print,
                        app_data_u :    data1.rows, app_data_u_print : app_data_u_print,
                        style:          './volunteer/reservation/myReservations.css',
                        role :          "caregiver",
                        user_name:  req.session.name,
                        user_id:        req.session.user,
                        not_partial:    true,
                        footer:         false,
                        
                    })
                })
                
            })
}


const getAppointmentsCard = (req, res) => {
    console.log("Caregiver get appointment card..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params

    Appointment.getAppointmentCard(id)
        .then(data => {
            var data_to_print = date_parsing(data.rows)
            res.render("caregiverAppointmentCard", {
                data:       data.rows, 
                style:      "./volunteer/reservation/reservationCard.css",
                role:       "caregiver", 
                user_id:    req.session.user, 
                user_name:  req.session.name,
                date:       data_to_print,
                footer:     true, 
                not_partial:true,
            })
        })
}

//.................................VETERINARIAN..................................//

//VETERINARIAN, found appointments
const getAppointmentsPending = (req, res) => {
    console.log("Veterinarian found appointments..")

    if(req.session.role != "veterinarian"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    Appointment.getall()
        .then(data => {
            var data_to_print = date_parsing(data.rows)
            res.render("veterinarianFoundAppointments", {
                data:           data.rows, 
                style:          '"./volunteer/reservation/myReservations.css"',
                role:           "veterinarian",
                data_to_print:  data_to_print,
                user_name:  req.session.name,
                user_id:        req.session.user,
                not_partial:    false, 
                footer:         false
            })
        })
        .catch(err => res.status(400).json({ err }));

}

//VETERINARIAN, appointment card
const getAppointmentCard = (req,res) => {
    console.log("Veterinarian appointment card..")

    if(req.session.role != "veterinarian"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params

    Appointment.getAppointmentCard(id)
        .then(data => {
            res.render("veterinarianAppointmentCard", {
                data :          data.rows,
                style :         "./caregiver/reservation/reservationCard.css",
                role:           "veterinarian",
                user_id:        req.session.user,
                user_name:  req.session.name,
                not_partial:    true, 
                footer:         false
            })
        })
}


//VETERINARIAN, get animal
const getAnimalVet = (req, res) =>{
    console.log("Veterinarian get animal..")
    const {id} = req.params

    if(req.session.role != "veterinarian"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    Appointment.viewAnimal(id)
        .then(data => {
            Appointment.getByHistory(id)
                .then(data1 => {
                    console.log("all good history")
                    Appointment.getByUpcoming(id)
                    .then(data2 => {
                            var upcoming_data_p = date_parsing(data2.rows)
                            var history_data_p = date_parsing(data1.rows)

                            console.log("all good upcoming")
                            //HISTORY+UPCOMING
                            res.render("veterinarianProfileAnimal", {
                            history_data:       data1.rows, 
                            upcoming_data_p :   upcoming_data_p,
                            history_data_p :    history_data_p,
                            upcoming_data :     data2.rows,
                            data :              data.rows,
                            style:              './caregiver/animal/profileAnimal.css', 
                            role:               "veterinarian", 
                            user_id:            req.session.user, 
                            user_name:  req.session.name,
                            not_partial:        true, 
                            footer:             false
                            })
                        })
                        .catch(err => res.status(400).json({ err }));
        
                })
                .catch(err => res.status(400).json({ err }));
        })
};

//VETERINARIAN, set appointment
const setAppointment = (req, res) =>{
    console.log("Veterinarian set appointment..")

    if(req.session.role != "veterinarian"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }
    
    const {id} = req.params
    var {date, time, descrip, animal_id} = req.body

    var checkdate = new Date(date)
    var today = new Date()
    
    if(date == null || time == "" || checkdate < today){
        res.status(400).json( {redirect : '' })
    }else{
        date = new Date(date)
        Appointment.setDate(id, date, time, animal_id, descrip)
            .then(res.status(200).json( {redirect : '/veterinarianHomepage' }))
    }
}







//PARSING FUNC TO PRINT
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
    getAppointments,
    getAnimalAppointments,
    addAppointments,
    getAppointmentsPending,
    getAppointmentCard,
    getAnimalVet,
    setAppointment,
    deleteAnimalAppointments,
    getAppointmentsAll,
    getAppointmentsCard
}
