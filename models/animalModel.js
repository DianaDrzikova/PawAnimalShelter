const db = require("../databasepg")
const uuid = require('uuid');


const Animal = {};

// add ARTICLE
Animal.add = (name, spieces, age, gender, description, img) => {
    const primary_key = uuid.v1();

    db.query(`INSERT into animal(animal_id, name, spieces, age, gender, description, img)` + `VALUES($1, $2, $3, $4, $5, $6, $7)`, 
    [primary_key, name, spieces, age, gender, description, img]);

    return db.query("SELECT * FROM animal WHERE animal_id = $1", [primary_key]);

};
  
  // GET ALL ARTICLES
Animal.get = () => {
    return db.query('SELECT * FROM animal ORDER by name ASC');
};


Animal.view = (id) => {
  return db.query("SELECT * FROM animal WHERE animal_id = $1", [id]);
};

// DELETE AN ARTICLE
Animal.delete = (id) => {
    return db.query("DELETE from animal WHERE animal_id = $1", [id]);
};

Animal.getAnimalReservations = (id) => {
  return db.query("SELECT * FROM animal NATURAL JOIN reservations WHERE animal_id = $1 and volunteer_id IS NULL", [id]);
}


Animal.getAnimalAppointments = (id) => {
  return db.query("SELECT * FROM animal NATURAL JOIN appointments WHERE animal_id = $1 and confirmed = $2", [id, false]);
}

// edit AN ARTICLE 
Animal.edit = (id, name, spieces, age, gender, description, img) => {
    db.query("UPDATE animal SET name = $1, age = $2, spieces = $3, gender = $4, description = $5, img = $6 WHERE animal_id = $7", 
    [ name, age, spieces, gender, description, img ,id]);

    return db.query("SELECT * FROM animal WHERE animal_id = $1 ORDER by name ASC", [id]);    
};

Animal.getSpecified = (name, spieces) => {
  console.log(name, spieces)
  return db.query("SELECT * FROM animal WHERE name = $1 and spieces = $2 ORDER by name ASC", [name, spieces]); 
}

Animal.getUser = (id) =>{
    return db.query("SELECT * FROM participants WHERE id = $1", [id]); 
}

Animal.getSpecified1 = (name, spieces) => {
  console.log(name, spieces)
  if(name == "all" && spieces == "all"){
    return db.query('SELECT * FROM animal ORDER by name ASC');
  }else if(name != "all" && spieces != "all"){
    return db.query("SELECT * FROM animal WHERE name = $1 and spieces = $2 ORDER by name ASC", [name, spieces]); 
  }else if(name != "all"){
    return db.query("SELECT * FROM animal WHERE name = $1 ORDER by name ASC", [name]); 
  }else{
    console.log(spieces)
    return db.query("SELECT * FROM animal WHERE spieces = $1 ORDER by name ASC", [spieces]); 
  }
}

Animal.getSpecifiedHomepage = (date, spieces, show) => {

  if(show){
    if(spieces == "all"){
      console.log("today before 14 hour or another day")
      return db.query('SELECT DISTINCT * FROM animal NATURAL JOIN reservations WHERE volunteer_id IS NULL and date = $1 ORDER by name ASC',[date]);
    }else{
      return db.query('SELECT DISTINCT * FROM animal NATURAL JOIN reservations WHERE volunteer_id IS NULL and date = $1 and spieces = $2 ORDER by name ASC',[date, spieces]);
    }
  }else{
    console.log("today after 14 hour")
    date.setHours(0,30,0,0);
    return db.query('SELECT DISTINCT * FROM animal NATURAL JOIN reservations WHERE volunteer_id IS NULL and date = $1 and spieces = $2 ORDER by name ASC',[date, spieces]);
  }

}

//export database model(user)
module.exports = Animal;

