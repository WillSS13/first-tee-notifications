// import { getCoachId, sessionParticipants, coachSessions } from "./salesforce/salesforce.js";
// const coachId = '0033600001KJ05SAAT'

var salesforce = require('./salesforce/salesforce');
var twilio = require('./twilio/twilio');
var sendgrid = require('./sendgrid/sendgrid');

const express = require("express");
const path = require('path');

const { Knock } = require('@knocklabs/node');
const { testSMS, testEmail } = require('./knock/knock');
const { sendSMS, sendEmail } = require('./knock/knock');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

// take the email of the coach and check if it's in the system 
app.post("/checklogin",(req,res) => {
    res.json({ message: "Logged in!" });
});

// Get the coach id from the logged in email
app.post("/coachId", (req,res) => {
    // Retrieve coach's email from the request query parameters 
    let coachEmail = req.body.email;


    //! FOR DEV TESTING PURPOSES ONLY (REMOVE IN PRODUCTION)
    if (coachEmail == "bzchen@andrew.cmu.edu" 
     || coachEmail == "ypagarwa@andrew.cmu.edu" 
     || coachEmail == "wsquibb@andrew.cmu.edu"){
        coachEmail = 'pcoultas@thefirstteepittsburgh.org';
        // coachEmail = 'lrussell@firstteepittsburgh.org';
        // coachEmail = 'jroberts@thefirstteepittsburgh.org';
        // coachEmail = 'brettbossblackwood@gmail.com';
        // coachEmail = 'rhawkins@firstteepittsburgh.org';
        // coachEmail = 'alindauer@firstteepittsburgh.org';
        // 
    }
    console.log("Logged in as: ", coachEmail);

    // Get coach sessions from id 
    salesforce.getCoachId(coachEmail,res);
});

// Get all the sessions for a coach 
app.get("/sessions", (req,res) => {
    // Retrieve coach's email from the request query parameters 
    const coachEmail = req.query.session;
  
    // get coach sessions from id 
    console.log("\x1b[31m%s\x1b[0m", "receiving session");
    console.log(coachEmail);
    salesforce.coachSessions(coachEmail,res);
});

// Get all the participants for a session 
app.get("/participants",(req,res) => {
    const sessionId = req.query.participant;
    salesforce.sessionParticipants(sessionId,res);
});

// Get all the coaches for a session 
app.get("/coaches",(req,res) => {
    const sessionId = req.query.session;
    console.log("retrieving coaches");
    salesforce.sessionCoaches(sessionId,res);
});

// Send the message after receiving list of phone numbers and emails 
app.post("/sendmessage", (req,res) => {
    // Setting the body of post request 
    const body = req.body;
    const subject = body.subject;
    const msg = body.message;
    const coachId = body.coachId;

    // Send message to participants
    salesforce.sessionNumbers(coachId, sendSMS, msg);
    salesforce.sessionEmails(coachId, sendEmail, msg, subject)

    sendSMS("0033600001KJ05SAAT", "+14176316203", "/sendmessage RECEIVED"); 

    // Send message to coaches
    salesforce.coachNumbers(coachId, sendSMS, msg);
    salesforce.coachEmails(coachId, sendEmail, msg, subject)

    res.status(200).send('Status: OK')
})

app.use(express.static(path.resolve(__dirname, '../client/build')));

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// sendSMS("0033600001KJ05SAAT", "+14176316203", "DEPLOYED");
// sendSMS("1033600001KJ05SAAT", "+14699806998", "DEPLOYED");
// sendSMS("2033600001KJ05SAAT", "+18624859128", "DEPLOYED");

// var test = true;

// if (test) {
//   console.log("Testing");
//   // testSMS("23428347", "+14176316203", "TEST MESSAGE"); 
//   // testEmail("1", "notifications@thefirstteepittsburgh.org", "TEST MESSAGE");
//   test = false;
// }