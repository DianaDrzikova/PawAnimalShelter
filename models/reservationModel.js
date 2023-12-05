const db = require("../databasepg")
const uuid = require('uuid');

const Reservation = {};

Reservation.getByHistory = (id) => {
    const today = new Date()
    console.log(today)
    return db.query("SELECT * FROM reservations WHERE animal_id = $1 and confirmed = $2 and date < $3 ORDER by date", [id, "true", today]); 
};

Reservation.getByUpcoming = (id) => {
    const today = new Date()
    console.log(today)
    return db.query("SELECT * FROM reservations WHERE animal_id = $1 and confirmed = $2 and date >= $3 ORDER by date", [id, "true", today]); 
};

Reservation.view = (id) => {
    return db.query("SELECT * FROM reservations WHERE animal_id = $1 ORDER by date", [id]);
};

Reservation.getAnimalData = (id) => {
    console.log("animal data ok")
    return db.query("SELECT * FROM animal WHERE animal_id = $1", [id]);
};


Reservation.create = (animal_id, caregiver_id, date) => {
    const primary_key = uuid.v1();

    return db.query("INSERT into reservations(reservation_id, date, animal_id, confirmed)" + "VALUES($1, $2, $3, $4)", 
    [primary_key, date, animal_id, false]);

};

Reservation.getByDate = (id, date) => {
 
    return db.query("SELECT * FROM reservations WHERE animal_id = $1 and date = $2", [id, date])
     
};

Reservation.getByDateApp = (id, date) => {
 
    return db.query("SELECT * FROM appointments WHERE animal_id = $1 and date = $2", [id, date])
     
};


Reservation.getSpecified = (id) => {
    const today = new Date()
    return db.query("SELECT * FROM reservations WHERE animal_id = $1 and confirmed = $2 and date >= $3 and volunteer_id IS NULL ORDER by date", [id, "false", today]); 
};

Reservation.foundReservationsV = (id) => {
    const today = new Date()
    console.log(today)
    return db.query("SELECT * FROM reservations WHERE volunteer_id = $1 and confirmed = $2 and date >= $3 ORDER by date", [id, true, today]); 
};


Reservation.delete = (id) => {
    return db.query("DELETE from reservations WHERE reservation_id = $1", [id]);
};

Reservation.deleteV = (id) => {
    console.log("stornoo:", id)
    return db.query("UPDATE reservations SET volunteer_id = $1, confirmed = $2 WHERE reservation_id = $3", [null,false,id]);
};


Reservation.getVolunteerData = (id) =>{
    console.log("volunteer:", id)
    return db.query("SELECT * FROM participants WHERE id = $1", [id]); 
}

Reservation.getResCard = (id) => {
    console.log("reservation1:", id)
    return db.query("SELECT * FROM reservations NATURAL JOIN animal WHERE reservation_id = $1", [id]); 
}


Reservation.Pending = () =>{
    return db.query("SELECT * FROM reservations NATURAL JOIN animal WHERE confirmed = $1 and volunteer_id IS NOT NULL", [false]); 
}


Reservation.pendingProfile = (id) =>{
    console.log("reservation3:", id)
    return db.query("SELECT * FROM reservations NATURAL JOIN animal NATURAL JOIN participants WHERE reservation_id = $1", [id]); 
}


Reservation.changeAuth = (id, confirm) => {
    console.log("changing :", id, "to", confirm)
    if(confirm){
        db.query("UPDATE reservations SET confirmed = $1 WHERE reservation_id = $2", 
        [confirm, id]);
    }else{
        db.query("UPDATE reservations SET volunteer_id = $1 WHERE reservation_id = $2", 
        [null, id]);
    }

    return db.query("SELECT * FROM reservations NATURAL JOIN animal WHERE confirmed = $1 and volunteer_id IS NOT NULL", [false]); 

}

Reservation.myreservationsUpcoming = (id) => {
    const today = new Date()
    return db.query("SELECT * FROM reservations NATURAL JOIN animal WHERE volunteer_id = $1 and date >= $2 and confirmed = $3", [id, today, true])
}


Reservation.myreservationsUpcomingUnconfirm = (id) => {
    const today = new Date()
    return db.query("SELECT * FROM reservations NATURAL JOIN animal WHERE volunteer_id = $1 and date >= $2 and confirmed = $3", [id, today, false])
}

Reservation.myreservationsHistory = (id) => {
    const today = new Date()
    return db.query("SELECT * FROM reservations NATURAL JOIN animal WHERE volunteer_id = $1 and date < $2 and confirmed = $3", [id, today, true])
}


Reservation.checkResVolunteer = (id, date) => {
    return db.query("SELECT * FROM reservations NATURAL JOIN participants WHERE volunteer_id = $1 and date = $2", [id, date])
}


Reservation.singInToRes = (id, res_id) => {
    return db.query("UPDATE reservations SET volunteer_id = $1 WHERE reservation_id = $2", [id, res_id])
}

Reservation.checkVolAuth = (id) =>{
    return db.query("SELECT * FROM participants WHERE authentification = $1 and id = $2", [true, id])
}

Reservation.viewUpcomingCon = (id) => {
    var today = new Date()
    return db.query("SELECT * FROM reservations NATURAL JOIN animal WHERE confirmed = $1 and date >= $2", [true, today]);
};

Reservation.viewUpcomingUn = (id) => {
    var today = new Date()
    return db.query("SELECT * FROM reservations NATURAL JOIN animal WHERE confirmed = $1", [false]);
};


module.exports = Reservation;