const db = require("../databasepg")
const uuid = require('uuid');

const Appointment = {}

Appointment.view = (id) => {
    return db.query("SELECT * FROM appointments WHERE animal_id = $1", [id]);
};

Appointment.viewAnimal = (id) => {
    return db.query("SELECT * FROM animal WHERE animal_id = $1", [id]);
};

Appointment.create = (animal_id, date, type, description) => {
    const primary_key = uuid.v1();

    return db.query("INSERT into appointments(appointment_id, date, animal_id, type, ca_comment)" + "VALUES($1, $2, $3, $4, $5)", 
    [primary_key, date, animal_id, type, description]);
    
};

Appointment.getall = () => {
    return db.query("select * from appointments natural join animal WHERE date is null");
};


Appointment.getAppointmentCard = (id) => {
    return db.query("select * from appointments natural join animal where appointment_id = $1 ", [id])
}


Appointment.getByHistory = (id) => {
    const today = new Date()
    return db.query("select * from appointments natural join animal where animal_id = $1 and confirmed = $2 and date < $3", [id, true, today])
}

Appointment.getByUpcoming = (id) => {
    const today = new Date()
    return db.query("select * from appointments natural join animal where animal_id = $1 and confirmed = $2 and date >= $3", [id, true, today])
}

Appointment.getByUpcomingUn = (id) => {
    const today = new Date()
    return db.query("select * from appointments natural join animal where animal_id = $1 and confirmed = $2", [id, false])
}
//
Appointment.setDate = (id, date, time, animal_id, vet_comment) => {

    db.query("DELETE from reservations WHERE date = $1 and animal_id = $2", [date, animal_id]);

    return db.query("UPDATE appointments SET date = $1, time = $2, confirmed = $3, vet_comment = $4 WHERE appointment_id = $5", [date,time,true,vet_comment,id]);
};

Appointment.deleteAppointments = (id) => {
    db.query("DELETE from appointments WHERE appointment_id = $1", [id]);
};


Appointment.viewUpcomingCon = (id) => {
    var today = new Date()
    return db.query("SELECT * FROM appointments NATURAL JOIN animal WHERE confirmed = $1 and date >= $2", [true, today]);
};

Appointment.viewUpcomingUn = (id) => {
    var today = new Date()
    return db.query("SELECT * FROM appointments NATURAL JOIN animal WHERE confirmed = $1", [false]);
};

Appointment.getAppointmentCard = (id) =>{
    return db.query("SELECT * FROM appointments NATURAL JOIN animal WHERE appointment_id = $1", [id]);
}

module.exports = Appointment;