// need to get these to 
// const client_id = process.env.SALESFORCE_CLIENT_ID;
// const client_secret = process.env.SALESFORCE_CLIENT_SECRET;
// const username = process.env.SALESFORCE_USERNAME;
// const password = process.env.SALESFORCE_PASSWORD;
// const security_token = process.env.SALESFORCE_SECURITY_TOKEN;

// const instance_url = process.env.SALESFORCE_INSTANCE_URL;
// const access_token = process.env.SALESFORCE_ACCESS_TOKEN;
// const refresh_token = process.env.SALESFORCE_REFRESH_TOKEN;

const client_id = "3MVG9uudbyLbNPZN8s8tSkgg9Sq2J3CNElUcXXf3QNVUMDbcYPYC2jfIV5OFqY6G8X71m49vqrTK7erZFlFvN";
const client_secret = "9DE23A303F2FD5AC0BE3280701CD093809CC01E9B5B2DDB49B595271A00997FF";
const username = "integration@firstteepittsburgh.org";
const password = "firstTeeP1ttsburgh!";
const security_token = "cb5BSAG0MM5yJoIJNFQUyxdWj";

const instance_url = "https://firsttee.my.salesforce.com";
const access_token = "00D36000000uXgY!AQQAQGSXNeayatrKLRCHtclYTQuJ9At6PJx5VDcpYnag6zUQJcN7PN98eRdF7AmQIGbk2VfHRlgTDQgAgkE.693hlJibvDix";
const refresh_token = "5Aep861QbHyftz0nI9WixbcujBK.a4w09vFurPjPS97oi9Bp7z1a5tl8LoFnU7AQZfYfkJwBW5wpKIXBtdD5oo7";

var jsforce = require('jsforce');
console.log("hi");
var oauth2 = new jsforce.OAuth2({
    clientId: client_id,
    clientSecret: client_secret,
    redirectUri: "/oauth2/auth"
});
var conn = new jsforce.Connection({
    oauth2: oauth2,
    instanceUrl: instance_url,
    accessToken: access_token,
    refreshToken: refresh_token
});

conn.on('refresh', function (accessToken, res) {
    // Refresh event will be fired when renewed access token
    // to store it in your storage for next request
    console.log('Access Token Refreshed');
});

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getCoachId(email, res){
    conn.sobject("Contact")
        .select(`Id, Name, Email`)
        .where({
            Email: email,
            Contact_Type__c: 'Coach'
        })
        .execute(function(err,records){
            if (err) { return console.error(err); }
            var participants = [];
            for (var record of records) {
                // fill the json object and check if session current date is within the session start date and end date 
                participants.push({
                    id: record.Id,
                });  
            }
            if (participants.length !== 0){
                res.send(JSON.stringify(participants[0].id));
            } else {
                res.send(JSON.stringify("None"));
            }
            
        });
}

/**
 * Retrieves all participant information given a session id 
 * @param id Salesforce id of session listing to retrieve users
 * @param callback Callback function to execute once users have been retrieved
 */
// given session id, get participant information 
// sample session id: a0H3600000UtSIBEA3, a0H3600000Cex7ZEAR, a0H1R00001F67OmUAJ, a0H1R000013eaoxUAA

function sessionParticipants(id,res){
    conn.sobject("Session_Registration__c")
        .select(`Id, Name, Status__c, Contact__c, Contact__r.Name, Contact__r.Primary_Contact_s_Email__c, Contact__r.Primary_Contact_s_Mobile__c, Contact__r.Contact_Type__c, Contact__r.Participation_Status__c`)
        .where({
            Listing_Session__c: id,
            Status__c: 'Registered'
        })
        .execute(function(err,records){
            if (err) { return console.error(err); }
            var participants = [];
            for (var record of records) {
                // fill the json object and check if session current date is within the session start date and end date 
                
                // if (record.Contact__r.Contact_Type__c == 'Participant'){
                    participants.push({
                        id: record.Id,
                        name: record.Name,
                        contact_name: record.Contact__r.Name,
                        type: record.Contact__r.Contact_Type__c,
                        primary_contact_phone: record.Contact__r.Primary_Contact_s_Mobile__c,
                        primary_contact_email: record.Contact__r.Primary_Contact_s_Email__c,
                        status: record.Status__c
                    });
                // } 
            }
            // console.log(participants);
            res.send(participants);
        });
}

/**
 * Retrieves all participant information given a session id 
 * @param id Salesforce id of session listing to retrieve users
 * @param callback Callback function to execute once users have been retrieved
 */
// given session id, get participant information 
// sample session id: a0H3600000UtSIBEA3, a0H3600000Cex7ZEAR, a0H1R00001F67OmUAJ, a0H1R000013eaoxUAA

function sessionCoaches(id,res){
    conn.sobject("Coach_Assignment__c")
        .select(`Id, Coach__c, Coach__r.Name, Name, Listing_Session__c,Session_End_Date__c, Session_Start_Date__c, Listing_Session__r.Id, Listing_Session__r.Name, Coach__r.Email, Coach__r.MobilePhone, Coach__r.Contact_Type__c`)
        .execute(function(err,records){
            if (err) { return console.error(err); }
            var coaches = [];
            for (var record of records) {
                // fill the json object and check if session current date is within the session start date and end date 
                if (record.Listing_Session__r.Id === id) {
                    coaches.push({
                        id: record.Id,
                        name: record.Coach__r.Name,
                        email: record.Coach__r.Name,
                        phone: record.Coach__r.MobilePhone
                    });
                    
                } 
            }
            res.send(coaches);
        });
}

var records = [];
conn.query("SELECT Id, Name, Email, Contact_Type__c FROM Contact WHERE Contact_Type__c = 'Coach'", function(err, result) {
  if (err) { return console.error(err); }
  console.log("total : " + result.totalSize);
  console.log("fetched : " + result.records.length);
  for (var record of result.records) {
    console.log(record.Id);
    console.log(record.Name);
    console.log(record.Email);
    console.log(record.Contact_Type__c);
  }
});

// const temp = "a0H1R00001F6809UAB";
// conn.sobject("Coach_Assignment__c")
//         .select(`Id, Coach__c, Coach__r.Name, Name, Listing_Session__c,Session_End_Date__c, Session_Start_Date__c, Listing_Session__r.Id, Listing_Session__r.Name, Coach__r.Email, Coach__r.MobilePhone, Coach__r.Contact_Type__c`)
//         // .where({
//         // Coach__c: 'a0H1R000013eaoxUAA',
//         // })
//         .execute(function(err,records){
//             if (err) { return console.error(err); }
//             for (var record of records) {
//                 // fill the json object and check if session current date is within the session start date and end date 
//                 if (record.Listing_Session__r.Id === temp) {
//                     console.log(record.Coach__r.Name);
//                     console.log(record.Coach__r.Email);
//                     console.log(record.Coach__r.MobilePhone);
//                     console.log(record.Coach__r.Contact_Type__c);
//                     console.log(record.Listing_Session__r.Id);
//                 }
                
//             }

//         });

// fetching all fields from contact

// conn.sobject("Contact")
//   .select('*') // asterisk means all fields in specified level are targeted. // conditions in raw SOQL where clause.
// //   .limit(10)
//   .execute(function(err, records) {
//     for (var i=0; i<records.length; i++) {
//       var record = records[i];
//     //   console.log("Name: " + record.Name);
//     //   console.log("Participation Status: " + record.Participation_Status__c);
//       console.log("Contact Type: " + record.Contact_Type__c);
//       // fields in Account relationship are fetched
//     }
//   });

/**
 * Retrieves all session id for a given coach id
 * @param id Salesforce id of session listing to retrieve users
 * @param callback Callback function to execute once users have been retrieved
 */
// this gets the listing session id and coach id from coach assignment 
// sample coach id: 0033600001Yibm7AAB, 0031R0000259rjpQAA, 0033600001KJ0oYAAT
function coachSessions(id,res) {
    conn.sobject("Coach_Assignment__c")
        .select(`Id, Coach__c, Coach__r.Name, Name, Listing_Session__c,Session_End_Date__c, Session_Start_Date__c,Listing_Session__r.Name`)
        .where({
        Coach__c: id,
        Session_Start_Date__c: {$lt: jsforce.Date.TODAY},
        Session_End_Date__c: {$gte: jsforce.Date.TODAY}
        })
        .execute(function(err,records){
            if (err) { return console.error(err); }
            var sessions = [];
            for (var record of records) {
                // fill the json object and check if session current date is within the session start date and end date 
                sessions.push({
                    id: record.Listing_Session__c,
                    coach_assignment_name: record.Name,
                    start_date: record.Session_Start_Date__c,
                    end_date: record.Session_End_Date__c,
                    session_name: record.Listing_Session__r.Name
                });
            }
            // return sessions;
            res.send(sessions);
        });
}

/**
 * Retrieves all participant phone number given a session id 
 * @param id Salesforce id of session listing to retrieve users
 * @param callback Callback function to execute once users have been retrieved
 */
// given session id, get participant information 
// sample session id: a0H3600000UtSIBEA3, a0H3600000Cex7ZEAR, a0H1R00001F67OmUAJ, a0H1R000013eaoxUAA
function sessionNumbers(id,res, msg){
    conn.sobject("Session_Registration__c")
        .select(`Id, Contact__r.Primary_Contact_s_Mobile__c, Contact__r.Contact_Type__c`)
        .where({
            Listing_Session__c: id,
            Status__c: 'Registered'
        })
        .execute(function(err,records){
            if (err) { return console.error(err); }
            var participants = [];
            for (var record of records) {
                // fill the json object and check if session current date is within the session start date and end date 
                if (record.Contact__r.Contact_Type__c == 'Participant'){
                    participants.push(
                        record.Contact__r.Primary_Contact_s_Mobile__c
                    );
                } 
            }
            // possible phone number format is (412) 334-6941, 412-606-2882, null 
            // remove duplicates
            let unique = [];
            // let unique = ['(724) 759-0648', '412-551-5356'];
            participants.forEach(element => {
                if (!unique.includes(element)) {
                    unique.push(element);
                }
            });
            // remove null 
            unique = unique.filter(e => (e !== null));
            // removing format xxx-xxx-xxxx
            let final = [];
            unique.forEach(element => {
                console.log("inside");
                if (element[3] === '-' && element[7] === '-'){
                    let tempNum = element.substring(0,3) + element.substring(4,7) + element.substring(8);
                    final.push(tempNum);
                } else {
                    final.push(element);
                }
            });
            if (final.length !== 0) {
                console.log("can't be null here");
                res(final,msg);
            }
        });
}

/**
 * Retrieves all coaches' phone number given a session id 
 * @param id Salesforce id of session listing to retrieve users
 * @param callback Callback function to execute once users have been retrieved
 */
// given session id, get participant information 
// sample session id: a0H3600000UtSIBEA3, a0H3600000Cex7ZEAR, a0H1R00001F67OmUAJ, a0H1R000013eaoxUAA
function coachNumbers(id,res, msg){
    conn.sobject("Coach_Assignment__c")
        .select(`Id, Coach__r.MobilePhone, Listing_Session__r.Id`)
        .execute(function(err,records){
            if (err) { return console.error(err); }
            var numbers = [];
            for (var record of records) {
                // fill the json object and check if session current date is within the session start date and end date 
                if (record.Listing_Session__r.Id === id){
                    numbers.push(
                        record.Coach__r.MobilePhone
                    );
                } 
            }
            // possible phone number format is (412) 334-6941, 412-606-2882, null 
            // remove duplicates
            let unique = [];
            // let unique = ['(724) 759-0648', '412-551-5356'];
            numbers.forEach(element => {
                if (!unique.includes(element)) {
                    unique.push(element);
                }
            });
            // remove null 
            unique = unique.filter(e => (e !== null));
            // removing format xxx-xxx-xxxx
            let final = [];
            unique.forEach(element => {
                console.log("inside");
                if (element[3] === '-' && element[7] === '-'){
                    let tempNum = element.substring(0,3) + element.substring(4,7) + element.substring(8);
                    final.push(tempNum);
                } else {
                    final.push(element);
                }
            });
            if (final.length !== 0) {
                console.log("can't be null here");
                res(final,msg);
            }
        });
}

/**
 * Retrieves all participant emails given a session id 
 * @param id Salesforce id of session listing to retrieve users
 * @param callback Callback function to execute once users have been retrieved
 */
// given session id, get participant information 
// sample session id: a0H3600000UtSIBEA3, a0H3600000Cex7ZEAR, a0H1R00001F67OmUAJ, a0H1R000013eaoxUAA
function sessionEmails(id,res, msg, subject){
    conn.sobject("Session_Registration__c")
        .select(`Id, Contact__r.Primary_Contact_s_Email__c, Contact__r.Contact_Type__c`)
        .where({
            Listing_Session__c: id,
            Status__c: 'Registered'
        })
        .execute(function(err,records){
            if (err) { return console.error(err); }
            var participants = [];
            for (var record of records) {
                // fill the json object and check if session current date is within the session start date and end date 
                if (record.Contact__r.Contact_Type__c == 'Participant'){
                    participants.push(
                        record.Contact__r.Primary_Contact_s_Email__c
                    );
                } 
            }
            // remove duplicates
            let unique = [];
            participants.forEach(element => {
                if (!unique.includes(element)) {
                    unique.push(element);
                }
            });
            res(unique, msg, subject);
        });
}

/**
 * Retrieves all participant emails given a session id 
 * @param id Salesforce id of session listing to retrieve users
 * @param callback Callback function to execute once users have been retrieved
 */
// given session id, get participant information 
// sample session id: a0H3600000UtSIBEA3, a0H3600000Cex7ZEAR, a0H1R00001F67OmUAJ, a0H1R000013eaoxUAA
function coachEmails(id,res, msg, subject){
    conn.sobject("Coach_Assignment__c")
        .select(`Id, Coach__r.Email, Listing_Session__r.Id`)
        .execute(function(err,records){
            if (err) { return console.error(err); }
            var emails = [];
            for (var record of records) {
                // fill the json object and check if session current date is within the session start date and end date 
                if (record.Listing_Session__r.Id == id){
                    emails.push(
                        record.Coach__r.Email
                    );
                } 
            }
            // remove duplicates
            let unique = [];
            emails.forEach(element => {
                if (!unique.includes(element)) {
                    unique.push(element);
                }
            });
            res(unique, msg, subject);
        });
}

module.exports = {getCoachId, sessionParticipants, sessionCoaches, coachSessions, sessionNumbers, sessionEmails, coachNumbers, coachEmails};