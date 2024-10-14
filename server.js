const express = require('express');
const app= express();
const mysql= require('mysql2');
const dotenv= require('dotenv');
// configure environment variables
dotenv.config();
// create a connection object
const db= mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_NAME,
    port:"3306"
});
// check for connection errors
db.connect((err) => {
    // if not connected
    if (err) return console.log("Error connecting to mysql", err);
    // if connected
    console.log("connected to mysql as id: ", db.threadId);
});

// question 1- retrieve all patients
   app.get('/patients', (req,res)=>{
    const query = 'SELECT patient_id,first_name,last_name,date_of_birth FROM patients';
    db.execute(query,(err,data) =>{
        if (err){
            return res.status(400).send ('Error retrieving data', err);
        }else {
            res.status(200).send(data)
        }
    });
   });
// question 2- retrieve all providers
app.get('/providers',(req,res)=>{
    const query = 'SELECT first_name,last_name,provider_specialty FROM providers';
    db.execute(query,(err,data)=>{
        if (err) {
            console.error(err);
            res.status(400).send({message: 'Error retrieving providers'});
        } else{
            res.send(data);
        }
    });
});
// question 3- filter patients by first name
app.get('/patients/by-first-name',(req,res)=>{
    const firstName = req.query.firstName;
    const query = 'SELECT patient_id,first_name,last_name,date_of_birth FROM patients WHERE first_name=?';
    db.execute(query, [firstName], (err,data)=>{
        if (err) {
            console.error(err);
            res.status(400).send({message: 'Error retrieving patients'});
        } else{
            res.send(data);
        }
    });
});
//question 4- retrieve all providers by their specialty
app.get('/providers/by-specialty',(req,res)=>{
    const specialty = req.query.specialty;
    const query = 'SELECT first_name,last_name,provider_specialty FROM providers WHERE provider_specialty=?';
    db.execute(query, [specialty],(err,data)=>{
        if (err) {
            console.error(err);
            res.status(400).send({message: 'Error retrieving providers'});
        } else{
            res.send(data);
        }
    });
});

// listen to the server
const PORT=3001
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});

