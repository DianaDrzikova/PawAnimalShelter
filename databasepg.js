const {Client} = require('pg')

const client = new Client({
    host: "",
    user: "",
    port: ,
    password: "", //nastavovane pri pociatku
    database: ""
})

client.on("connect", () =>{
    console.log("Database connection");
})

client.on("end", () => {
    console.log("Connection end");
})


module.exports = client;
