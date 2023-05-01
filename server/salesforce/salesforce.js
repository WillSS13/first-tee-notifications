// need to get these to 
const client_id = process.env.SALESFORCE_CLIENT_ID;
const client_secret = process.env.SALESFORCE_CLIENT_SECRET;
const username = process.env.SALESFORCE_USERNAME;
const password = process.env.SALESFORCE_PASSWORD;
const security_token = process.env.SALESFORCE_SECURITY_TOKEN;

const instance_url = process.env.SALESFORCE_INSTANCE_URL;
const access_token = process.env.SALESFORCE_ACCESS_TOKEN;
const refresh_token = process.env.SALESFORCE_REFRESH_TOKEN;


var jsforce = require('jsforce');
console.log("hi");
var oauth2 = new jsforce.OAuth2({
    clientId: "3MVG9uudbyLbNPZN8s8tSkgg9Sq2J3CNElUcXXf3QNVUMDbcYPYC2jfIV5OFqY6G8X71m49vqrTK7erZFlFvN",
    clientSecret: "9DE23A303F2FD5AC0BE3280701CD093809CC01E9B5B2DDB49B595271A00997FF",
    redirectUri: "/oauth2/auth"
});
var conn = new jsforce.Connection({
    oauth2: oauth2,
    instanceUrl: "https://firsttee.my.salesforce.com",
    accessToken: "00D36000000uXgY!AQQAQGSXNeayatrKLRCHtclYTQuJ9At6PJx5VDcpYnag6zUQJcN7PN98eRdF7AmQIGbk2VfHRlgTDQgAgkE.693hlJibvDix",
    refreshToken: "5Aep861QbHyftz0nI9WixbcujBK.a4w09vFurPjPS97oi9Bp7z1a5tl8LoFnU7AQZfYfkJwBW5wpKIXBtdD5oo7"
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
            res.send(JSON.stringify(participants[0].id));
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
        .select(`Id, Name, Contact__c, Contact__r.Name, Contact__r.Primary_Contact_s_Email__c, Contact__r.Primary_Contact_s_Mobile__c, Contact__r.Contact_Type__c, Contact__r.Participation_Status__c`)
        .where({
            Listing_Session__c: id
        })
        .execute(function(err,records){
            if (err) { return console.error(err); }
            var participants = [];
            for (var record of records) {
                // fill the json object and check if session current date is within the session start date and end date 
                console.log(record.Contact__r.Name);
                console.log(record.Contact__r.Contact_Type__c);
                console.log(record.Contact__r.Participation_Status__c);
                
                if (record.Contact__r.Contact_Type__c == 'Participant'){
                    participants.push({
                        id: record.Id,
                        name: record.Name,
                        contact_name: record.Contact__r.Name,
                        primary_contact_phone: record.Contact__r.Primary_Contact_s_Mobile__c,
                        primary_contact_email: record.Contact__r.Primary_Contact_s_Email__c
                    });
                } 
            }
            // console.log(participants);
            res.send(participants);
        });
}

var records = [];
conn.query("SELECT Id, Name, Primary_Contact_s_Email__c, Primary_Contact_s_Mobile__c FROM Contact WHERE Id = '0033600001KJ05SAAT'", function(err, result) {
  if (err) { return console.error(err); }
  console.log("total : " + result.totalSize);
  console.log("fetched : " + result.records.length);
  for (var record of result.records) {
    console.log(record.Id);
    console.log(record.Name);
  }
});

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
            console.log(sessions);
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
            Listing_Session__c: id
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
            console.log(participants);
            // possible phone number format is (412) 334-6941, 412-606-2882, null 
            // remove duplicates
            let unique = [];
            participants.forEach(element => {
                if (!unique.includes(element)) {
                    unique.push(element);
                }
            });
            // remove null 
            unique.filter(e => (e !== null));
            res(unique,msg);
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
            Listing_Session__c: id
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
            console.log(participants);
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

module.exports = {getCoachId, sessionParticipants, coachSessions, sessionNumbers, sessionEmails};