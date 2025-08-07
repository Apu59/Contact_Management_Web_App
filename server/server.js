//import installed packages

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const port = 5000;

const app = express();


//middlewares

app.use(cors());
app.use(express.json());


//Making connection with MySQL server

let db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'contactmanager'
});

db.connect((err) => {
    if (err) {
        console.log("Connection is unstable, something went wrong while connecting to the database : ", err);
        throw err;
    }
    else {
        console.log("Connection is stable, MySQL server is connected...");
    }
});



//API getway for fetch id and pass from frontend 
app.post('/getUserInfo', (req, res) => {
    const { userID, password } = req.body;

    const getUserInfoSQL = `SELECT userID, userName, userEmail FROM users WHERE users.userID = ? AND users.userPassword = ?`

    let query = db.query(getUserInfoSQL, [userID, password], (err, result) => {
        if (err) {
            console.log("Error getting user info from server : ", err);
            throw err;
        } else {
            res.send(result);
        }
    });
});



//API getway for show all contact 
app.get("/getAllContacts", (req, res) => {

    const userID = req.query.userID;

    const sqlForAllContacts = `SELECT * FROM contacts WHERE userID = ? ORDER BY contactName ASC`;

    let query = db.query(sqlForAllContacts, [userID], (err, result) => {
        if (err) {
            console.log("Error loading all contacts from database : ", err);
            throw err;
        }
        else {
            // console.log(result);
            res.send(result);
        }
    });
});



//API getway for add new contact
app.post("/saveContact", (req, res) => {
    const { userID, contactName, phoneNumber, emailAddress, address } = req.body;

    const sqlForAddNewContct = `
        INSERT INTO contacts (contactID, userID, contactName, phoneNumber, emailAddress, address) VALUES (NULL, ?, ?, ?, ?, ?);
    `
    let query = db.query(sqlForAddNewContct, [userID, contactName, phoneNumber, emailAddress, address], (err, result) => {
        if (err) {
            console.log("Error while adding a new contact in the database...");
            throw err;
        } else {
            res.send(result);
        }
    });

});


//API getway for registration
app.post("/register", (req, res) => {
    const { userName, userEmail, userPassword } = req.body;

    const checkEmail = `SELECT userID FROM users WHERE userEmail = ?`;

    db.query(checkEmail, [userEmail], (err, result) => {
        
        if (err) {
            console.log("Error checking email in database...");
            return res.json({
                message : "Error",
            });
        }

        if (result.length > 0) {
            return res.json({
                message : "Email already exist.",
            });
        }

        const addNewUser = `INSERT INTO users (userName, userEmail, userPassword) VALUES (?, ?, ?)`;

        db.query(addNewUser, [userName, userEmail, userPassword], (err, result) => {
            if (err) {
                console.log("Failed to save user info in database.");
                return res.json({
                    message : "Error",
                });
            }
            return res.json({
                message : "Success",
                userID : result.insertId,
            });
        });
    });
});


//API getway for delete contact
app.delete("/deleteContact/:id" , (req, res) =>{
    const contactId = req.params.id;

    const dalateContactSQL = "DELETE FROM contacts WHERE contactID = ?";
    db.query(dalateContactSQL,[contactId], (err, result) =>{
        if(err){
            console.log("Error deleting contact.");
            return res.json({
                success : false,
            });
        }
        return res.json({
            success : true,
        });
    });
});


//API getway for search contact
app.get("/searchContact", (req, res) =>{

    const searchTerm = req.query.search;
    
    const userID = req.query.userID;
    
    const searchContactSQL = `SELECT * FROM contacts WHERE (contactName LIKE ? OR phoneNumber LIKE ? OR emailAddress LIKE ?) AND userID = ?`;
    
    const searchValue = `%${searchTerm}%`;

    db.query(searchContactSQL, [searchValue , searchValue , searchValue , userID], (err, result) =>{
        if(err){
            console.log("Error while searching.");
            throw err;
        }
        res.json(result);
    });
});




//API getway for update contact
app.post("/updateContact", (req , res) =>{
    const {contactID , contactName , phoneNumber , emailAddress , address} = req.body;

    const updateContactSQL = `UPDATE contacts SET contactName=?,phoneNumber=?,emailAddress=?,address=? WHERE contactID=?`;

    db.query(updateContactSQL, [contactName , phoneNumber , emailAddress , address , contactID], (err , result) =>{
        if(err){
            console.log("Error updating contact.");
            res.json({
                success : false,
            });
        }
        res.json({
            success : true,
        });
    });

});


//Checking server running or not 
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
