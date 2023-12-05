const Reservation = require("../models/reservationModel.js");
const app = require("../server.js");



//.................................CAREGIVER..................................//

//CAREGIVER, all walkies
const getReservations = (req, res) =>{
    console.log("Caregiver all walkies..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }
    const {id} = req.params


    Reservation.getAnimalData(id) //get animal data
    .then(data1 => {
        var animal_data = data1.rows
        Reservation.getByHistory(id) //get history of animal
            .then(data2 => {
                var history_data = data2.rows
                Reservation.getByUpcoming(id) //get confirmed of animal
                    .then(  data3 => {

                            var history_rows = date_parsing(history_data);
                            var upcoming_rows = date_parsing(data3.rows);
                        
                            res.render("caregiverAllWalkies", {
                                style:          "./caregiver/reservation/allWalkies.css", 
                                upcoming_data:  data3.rows, p_upcoming_data: upcoming_rows,
                                history_data :  history_data, p_history_data: history_rows,
                                animal_data:    animal_data, 
                                user_id:        req.session.user, 
                                user_name:  req.session.name,
                                role:           "caregiver",
                                animal_id:      id, 
                                not_partial:    true, 
                                footer:         false
                            })})

                    .catch(err => res.status(400).json({ err }));
            })
            .catch(err => res.status(400).json({ err }));
    })
    .catch(err => res.status(400).json({ err }))

};

//CAREGIVER, add reservations
const addReservation = (req, res) => {
    console.log("Caregiver add reservation..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params


    Reservation.getSpecified(id)
        .then(data => {
                var newst_rows = date_parsing(data.rows);
                res.render("caregiverSetWalkies", {
                    style:          "./caregiver/reservation/setWalkies.css",
                    user_id:        req.session.user,
                    role:           "caregiver", 
                    data:           data.rows, 
                    data_for_print: newst_rows ,
                    user_name:  req.session.name,
                    animal_id:      id, 
                    not_partial:    true, 
                    footer:         false
                })
        })
        .catch(err => res.status(400).json({ err }));
};

//CAREGIVER, add reservation submit
const addReservationSubmit = (req, res) => {
    console.log("Caregiver add reservation submit..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params
    var {date} = req.body;

    if(date == "today"){ //MEANING TODAY
        date = new Date();
    }else{
        date = new Date(date);
    }

    date.setTime( date.getTime() + date.getTimezoneOffset()*60*1000 );
    

    Reservation.getByDate(id, date)
        .then(data => {
            if((data.rows.length) < 1){

                Reservation.getByDateApp(id, date)
                    .then(data1 => {
                        if((data1.rows.length) < 1){
                            Reservation.create(id, req.session.user ,date)
                            .then (console.log("all good"))
                            .catch(err => res.status(400).json({ err }));
                            return;
                        }else{
                            res.status(400).render("caregiverReservationError", {
                                style:          "./caregiver/reservation/setWalkies.css", 
                                role:           "caregiver", 
                                animal_id:      id,
                                user_id:        req.session.user,
                                user_name:  req.session.name,
                                not_partial:    true,
                                footer:         false
                            })  
                        }
                    })
                    
            }else{
                res.status(400).render("caregiverReservationError", {
                    style:          "./caregiver/reservation/setWalkies.css",
                    not_partial:    true, 
                    role:           "caregiver", 
                    user_id:        req.session.user,
                    user_name:  req.session.name,
                    animal_id:      id, 
                    footer:         false
                })  
            }
        })

};


//CAREGIVER, found reservations
const foundReservations = (req, res) => {
    console.log("Caregiver found reservations..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params

    Reservation.getSpecified(id)
        .then(data => {
            var newst_rows = date_parsing(data.rows);
            res.render("caregiverFoundReservations", { 
                data:           data.rows, 
                data_for_print: newst_rows,
                style:          '"./caregiver/reservation/setWalkies.css"', 
                role:           "caregiver", 
                user_id:        req.session.user,
                user_name:  req.session.name,
                not_partial:    false,
                footer:         true 
            })

        })
        .catch(err => res.status(400).json({ err }));
};

//CAREGIVER, delete reservation
const deleteReservation = (req, res) =>{
    console.log("Caregiver delete reservation..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params

    Reservation.delete(id)
        .then(console.log("ok"))
        .catch(err => res.status(400).json({ err }))
}

//CAREGIVER, get reservation card
const getReservationCard = (req, res) =>{
    console.log("Caregiver get reservation card..")
    const {id} = req.params

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    Reservation.getResCard(id)
        .then(data =>{
            const animal_id = data.rows[0].animal_id
            const volunteer_id = data.rows[0].volunteer_id
            var date_row = date_parsing(data.rows);
        
            Reservation.getVolunteerData(volunteer_id)
                .then(data1=>{
                    const volunteer = data1.rows
                    res.render("caregiverReservationCard", {
                        data:           data.rows, 
                        date:           date_row, 
                        style:          "./caregiver/reservation/reservationCard.css", 
                        role :          "caregiver", 
                        volunteer:      volunteer, 
                        animal_id:      animal_id, 
                        reservation_id: id, 
                        user_id:        req.session.user, 
                        user_name:  req.session.name,
                        not_partial:    true,
                        footer:         false
                    })
                })
                .catch(err => res.status(400).json({ err })) 
                
        })
        .catch(err => res.status(400).json({ err }))
}


//CAREGIVER, get pending reservations
const Pending = (req, res) => {
    console.log("Caregiver get pending reservations..")


    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }
    

    Reservation.Pending()
        .then(data => {
                var newst_rows = date_parsing(data.rows);
                res.render("caregiverPendingReservations", { 
                    data:           data.rows, 
                    role:           "caregiver", 
                    data_to_print:  newst_rows, 
                    style:          './caregiver/user/homepage.css', 
                    user_id:        req.session.user,
                    user_name:  req.session.name,
                    not_partial:    false, 
                    footer:         true 
                })

        })
        .catch(err => res.status(400).json({ err }));
}

//CAREGIVER, put pending reservations
const PendingRChange = (req, res) =>{
    console.log("Caregiver changing pending reservation state..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {confirm} = req.body
    const {id} = req.params
    
    console.log(confirm, id)
    Reservation.changeAuth(id, confirm)
        .then(result => {res.json( {redirect : "/caregiverHomepage" })} )            
        .catch(err => res.status(400).json({ err }));
    
}


//CAREGIVER, get pending reservation profile
const getRPending = (req, res) => {
    console.log("Caregiver pending reservation profile")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }    
    
    const {id} = req.params

    Reservation.pendingProfile(id)
        .then(data => {
            var data_to_print = date_parsing(data.rows)
            res.render("caregiverPendingReservationProfile", { 
                data:       data.rows, 
                data_to_print :data_to_print,
                style:      './caregiver/reservation/reservationCard.css', 
                user_id:    req.session.user,
                user_name:  req.session.name,
                role:       "caregiver", 
                not_partial:true, 
                footer:     false 
            })}
       )
        .catch(err => res.status(400).json({ err }));
}


//CAREGIVER, get all upcoming appointments
const getReservationsAll = (req, res) => {
    console.log("Caregiver get all reservations..")

    if(req.session.role != "caregiver"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }
    
    Reservation.viewUpcomingCon()
    .then(data => {
            var app_data_c_print = date_parsing(data.rows)
            Reservation.viewUpcomingUn()
            .then(data1 => {
                var app_data_u_print = date_parsing(data1.rows)
                res.render("caregiverReservations", {
                        app_data_c :    data.rows,  app_data_c_print : app_data_c_print,
                        app_data_u :    data1.rows, app_data_u_print : app_data_u_print,
                        style:          './volunteer/reservation/myReservations.css',
                        role :          "caregiver",
                        user_name:      req.session.name,
                        user_id:        req.session.user,
                        not_partial:    true,
                        footer:         false,
                        
                    })
                })
                
            })
}

//.................................VOLUNTEER..................................//

//VOLUNTEER, get reservvation by animal
const foundReservationsV = (req, res) => {
    console.log("Volunteer get reservation by animal..")

    if(req.session.role != "volunteer"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params

    Reservation.foundReservationsV(id)
        .then(data => {

            var newst_rows = date_parsing(data.rows);
            res.render("volunteerFoundReservations", { 
                data:           data.rows, 
                data_to_print:  newst_rows,
                style:          '"./volunteer/reservation/myReservations.css"', 
                role:           "volunteer",
                user_id:        req.session.user,
                user_name:  req.session.name,
                not_partial:    false,
                footer:         true 
            })

        })
        .catch(err => res.status(400).json({ err }));
};


//VOLUNTEER, delete reservation 
const deleteReservationV = (req, res) =>{
    console.log("Volunteer delete reservation..")

    if(req.session.role != "volunteer"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params


    Reservation.deleteV(id)
        .then(result => {res.json( {redirect : '/volunteerHomepage' })} )
        .catch(err => res.status(400).json({ err }));
}



//VOLUNTEER, get reservation card
const getReservationCardV = (req, res) => {
    console.log("Volunteer get reservation card")

    if(req.session.role != "volunteer"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }


    const {id} = req.params

    Reservation.getResCard(id)
        .then(data =>{
            console.log(id)
            const volunteer_id = data.rows[0].volunteer_id
            const date = date_parsing(data.rows)

            Reservation.getVolunteerData(volunteer_id)
                .then(data1=>{
                    res.render("volunteerReservationCard", {
                        data:       data.rows, 
                        volunteer:  data1.rows, 
                        style:      "./volunteer/reservation/reservationCard.css",
                        role:       "volunteer", 
                        user_id:    req.session.user, 
                        user_name:  req.session.name,
                        date:       date,
                        footer:     true, 
                        not_partial:true, 
                    })
                })
                .catch(err => res.status(400).json({ err }))

        })
        .catch(err => res.status(400).json({ err }))

}



//VOLUNTEER, get my reservations
const getmyreservations = (req, res) => {
    console.log("Volunteer get my reservations")

    if(req.session.role != "volunteer"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    const {id} = req.params


    Reservation.myreservationsUpcoming(id)
    .then(upcoming_data => {
        const p_upcoming_data = date_parsing(upcoming_data.rows)
        
        Reservation.myreservationsHistory(id)
        .then(history_data => {
            const p_history_data = date_parsing(history_data.rows)
            
            Reservation.myreservationsUpcomingUnconfirm(id)
            .then(un_upcoming_data => {
                
                const p_un_upcoming_data = date_parsing(un_upcoming_data.rows)

                res.render("volunteerMyReservations", { 
                    history_data:       history_data.rows, 
                    upcoming_data:      upcoming_data.rows,
                    un_upcoming_data:   un_upcoming_data.rows,
                    p_upcoming_data:    p_upcoming_data, 
                    p_history_data:     p_history_data,
                    p_un_upcoming_data: p_un_upcoming_data, 
                    style:              './volunteer/reservation/myReservations.css',
                    role:               "volunteer", 
                    user_id:            req.session.user, 
                    user_name:  req.session.name,
                    not_partial:        true, 
                    footer:             true 
                })
            })

        })
        .catch(err => res.status(400).json({ err }));
    })
    .catch(err => res.status(400).json({ err }));
}

//VOLUNTEER, sign in for reservation
const signInForRes = (req, res) => {
    console.log("Volunteer signing in..")

    if(req.session.role != "volunteer"){
        res.status(400).render("error", {not_partial:true, footer:false})
    }

    var {volunteer_id, date, reservation_id} = req.body

    date = new Date(date)

    Reservation.checkResVolunteer(volunteer_id, date)
        .then(data => {
            console.log(data.rows.length)
            if(data.rows.length == 0){
                console.log("moze sa prihlasit")
                Reservation.checkVolAuth(volunteer_id)
                    .then(data=>{
                        if(data.rows.length != 0){
                            Reservation.singInToRes(volunteer_id, reservation_id)
                                .then(result => {res.json( {redirect : "/volunteerHomepage" })} )            
                                .catch(err => res.status(400).json({ err }));
                        }else{
                            console.log("found");
                            res.status(400).render("error", {
                                style:      "./caregiver/reservation/setWalkies.css",
                                role:       "volunteer", 
                                not_partial:true, 
                                user_id:req.session.user,
                                user_name:req.session.name,
                                footer:     false
                            })  
                        }
                    })
                    .catch(err => res.status(400).json({ err }));
                    return

            }else{
                console.log("found");
                res.status(400).render("error", {
                    style:      "./caregiver/reservation/setWalkies.css",
                    role:       "volunteer", 
                    not_partial:true, 
                    user_id:req.session.user,
                    user_name:req.session.name,
                    footer:     false
                })  
        }
        })


}


// PARSING DATE TO PRINTABLE STATE
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
    //CAREGIVER
    getReservations,
    addReservation,
    addReservationSubmit,
    foundReservations,
    deleteReservation,
    getReservationCard,
    deleteReservation,
    Pending,
    PendingRChange,
    getRPending,
    getReservationsAll,

    //VOLUNTEER
    getReservationCardV,
    getmyreservations,
    foundReservationsV,
    deleteReservationV,
    signInForRes,

}
