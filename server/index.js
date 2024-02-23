// server/index.js
// import { getCoachId, sessionParticipants, coachSessions } from "./salesforce/salesforce.js";
var salesforce = require('./salesforce/salesforce');
var twilio = require('./twilio/twilio');
var sendgrid = require('./sendgrid/sendgrid');

const express = require("express");
const path = require('path');
const { Knock } = require('@knocklabs/node');
const { testKnock } = require('./knock/knock');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());

app.get("/api", (req, res) => {
    res.json({ message: "Hello from server!" });
});

// take the email of the coach and check if it's in the system 
app.post("/checklogin",(req,res) => {
    res.json({ message: "Hello from server!" });
});

// get all the sessions for a coach 
app.post("/coachId",(req,res) => {
    // retrieve coach's email from the request query parameters 
    let coachEmail = req.body.email;
    // get coach id from email 

    // add your email to the if statement below and alter your log in email to another coach's email
    if (coachEmail == "edithtan777@gmail.com" || coachEmail == "nmaher@andrew.cmu.edu" || coachEmail == "alexanderma00@gmail.com"){
        coachEmail = 'pcoultas@thefirstteepittsburgh.org';
        // coachEmail = 'lrussell@firstteepittsburgh.org';
        // coachEmail = 'jroberts@thefirstteepittsburgh.org';
        // coachEmail = 'brettbossblackwood@gmail.com';
        // coachEmail = 'rhawkins@firstteepittsburgh.org';
        // coachEmail = 'alindauer@firstteepittsburgh.org';
        // 
    }
    tempEmail = 'pcoultas@firstteepittsburgh.org';
    // const coachId = '0033600001KJ05SAAT'
    // get coach sessions from id 
    console.log("second time through");
    // console.log(coachEmail);
    salesforce.getCoachId(coachEmail,res);
    // res.json(sessions);
});

// get all the sessions for a coach 
app.get("/sessions",(req,res) => {
    // retrieve coach's email from the request query parameters 
    const coachEmail = req.query.session;
    // console.log(coachEmail);
    console.log("this should be the coach id");
    // get coach id from email 
    // const coachId = '0033600001KJ05SAAT'
    // get coach sessions from id 
    salesforce.coachSessions(coachEmail,res);
    // res.json(sessions);
});

// get all the participants for a session 
app.get("/participants",(req,res) => {
    const sessionId = req.query.participant;
    // const sessionId = 'a0H1R000013eaoxUAA';
    salesforce.sessionParticipants(sessionId,res);
    // res.json({ message: "Hello from server!" });
});

app.get("/coaches",(req,res) => {
    const sessionId = req.query.session;
    // const sessionId = 'a0H1R000013eaoxUAA';
    console.log("retrieving coaches");
    salesforce.sessionCoaches(sessionId,res);
    // res.json({ message: "Hello from server!" });
});

// send the message after receiving list of phone numbers and emails 
app.post("/sendmessage", (req,res) => {
    // getting the body of post request 
    const body = req.body;
    const subject = body.subject;
    const msg = body.message;
    const coachId = body.coachId;

    // const coachId = '0033600001KJ05SAAT'

    // send message to participants
    salesforce.sessionNumbers(coachId, twilio.sendMessage, msg);
    salesforce.sessionEmails(coachId, sendgrid.sendEmail, msg, subject)

    // send message to coaches
    salesforce.coachNumbers(coachId, twilio.sendMessage, msg);
    salesforce.coachEmails(coachId, sendgrid.sendEmail, msg, subject)

    // res.json({ message: "Message Successfully Sent" });
    res.status(200).send('Status: OK')
})

app.use(express.static(path.resolve(__dirname, '../client/build')));

// Twilio verification for clickable links in text messages
app.get('/b38a6c86e62761d3561f58c0be47e378.html', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public', 'b38a6c86e62761d3561f58c0be47e378.html'));
});

// TLS certificate verification for Let's Encrypt (1)
app.get('/.well-known/acme-challenge/0urWIe3t1qXli7jmEpAEWd1dcUHFKI51i32L5BNK4dI', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/.well-known/acme-challenge/0urWIe3t1qXli7jmEpAEWd1dcUHFKI51i32L5BNK4dI'));
});

// TLS certificate verification for Let's Encrypt (2)
app.get('/.well-known/acme-challenge/BLghGRk4WelBdAbLQdFuh80jpm2xhk6ShnqKHWBP9Mo', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'public/.well-known/acme-challenge/BLghGRk4WelBdAbLQdFuh80jpm2xhk6ShnqKHWBP9Mo'));
});


// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

// var test = true;

// if (test) {
//   console.log("Testing");
//   // testKnock();
//   // testEmail
//   test = false;
// }