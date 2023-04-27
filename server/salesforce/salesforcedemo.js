// need to get these to 
SALESFORCE_CLIENT_ID="3MVG9uudbyLbNPZN8s8tSkgg9Sq2J3CNElUcXXf3QNVUMDbcYPYC2jfIV5OFqY6G8X71m49vqrTK7erZFlFvN"
SALESFORCE_CLIENT_SECRET="9DE23A303F2FD5AC0BE3280701CD093809CC01E9B5B2DDB49B595271A00997FF"
SALESFORCE_USERNAME="integration@firstteepittsburgh.org"
SALESFORCE_PASSWORD="firstTeeP1ttsburgh!"
SALESFORCE_SECURITY_TOKEN="cb5BSAG0MM5yJoIJNFQUyxdWj"

SALESFORCE_INSTANCE_URL="https://firsttee.my.salesforce.com"
SALESFORCE_ACCESS_TOKEN="00D36000000uXgY!AQQAQGSXNeayatrKLRCHtclYTQuJ9At6PJx5VDcpYnag6zUQJcN7PN98eRdF7AmQIGbk2VfHRlgTDQgAgkE.693hlJibvDix"
SALESFORCE_REFRESH_TOKEN="5Aep861QbHyftz0nI9WixbcujBK.a4w09vFurPjPS97oi9Bp7z1a5tl8LoFnU7AQZfYfkJwBW5wpKIXBtdD5oo7"

var jsforce = require('jsforce');
console.log("hi");
var oauth2 = new jsforce.OAuth2({
    clientId:"3MVG9uudbyLbNPZN8s8tSkgg9Sq2J3CNElUcXXf3QNVUMDbcYPYC2jfIV5OFqY6G8X71m49vqrTK7erZFlFvN",
    clientSecret:"9DE23A303F2FD5AC0BE3280701CD093809CC01E9B5B2DDB49B595271A00997FF",
    redirectUri: "/oauth2/auth"
});
var conn = new jsforce.Connection({
    oauth2: oauth2,
    instanceUrl: "https://firsttee.my.salesforce.com",
    accessToken:"00D36000000uXgY!AQQAQGSXNeayatrKLRCHtclYTQuJ9At6PJx5VDcpYnag6zUQJcN7PN98eRdF7AmQIGbk2VfHRlgTDQgAgkE.693hlJibvDix",
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

/**
 * Retrieves all session id for a given coaches and calls the provided callback with them.
 * @param id Salesforce id of session listing to retrieve users
 * @param callback Callback function to execute once coaches have been retrieved
 */

// retrieving from listing session 
var records = [];
conn.query("SELECT Id, Listing_Session_Location__c, Listing_Session_Location_Address__c, Listing_Session_Location_Name__c, Name FROM Listing_Session__c", function(err, result) {
  if (err) { return console.error(err); }
  console.log("total : " + result.totalSize);
  console.log("fetched : " + result.records.length);
//   for (var record of result.records) {
//     console.log(record.Id);
//   }
});

// retrieving from session registration 
var records = [];
conn.query("SELECT Id, Name, Contact__c, Status__c, Listing_Session__c FROM Session_Registration__c WHERE Status__c = 'Registered'", function(err, result) {
  if (err) { return console.error(err); }
  console.log("total : " + result.totalSize);
  console.log("fetched : " + result.records.length);
//   for (var record of result.records) {
//     console.log(record.Listing_Session__c);
//     console.log(record.Contact__c);
//   }
});

// retrieving from participant contact
var records = [];
conn.query("SELECT Id, Name, Primary_Contact_s_Email__c, Primary_Contact_s_Mobile__c FROM Contact", function(err, result) {
  if (err) { return console.error(err); }
  console.log("total : " + result.totalSize);
  console.log("fetched : " + result.records.length);
//   for (var record of result.records) {
//     console.log(record.Id);
//   }
});

// given session id, get participant information 
// sample session id: a0H3600000UtSIBEA3, a0H3600000Cex7ZEAR, a0H1R00001F67OmUAJ, a0H1R000013eaoxUAA
var records = [];
conn.query("SELECT Id, Name, Contact__c, Contact__r.Name ,Contact__r.Primary_Contact_s_Email__c, Contact__r.Primary_Contact_s_Mobile__c FROM Session_Registration__c WHERE Listing_Session__c = 'a0H1R000013eaoxUAA' AND Status__c ='Registered'", function(err, result) {
  if (err) { return console.error(err); }
  console.log("total : " + result.totalSize);
  console.log("fetched : " + result.records.length);
//   for (var record of result.records) {
//     console.log(`Participant Name: ${record.Contact__r.Name}`);
//     console.log(`Participant Primary Contact Email: ${record.Contact__r.Primary_Contact_s_Email__c}`);
//     console.log(`Participant Primary Contact Phone: ${record.Contact__r.Primary_Contact_s_Mobile__c}`);
//   }
});

// function of getting session id with coach id:
conn.sobject("Session_Registration__c")
    .select(`Id, Name, Contact__c, Contact__r.Name, Contact__r.Primary_Contact_s_Email__c, Contact__r.Primary_Contact_s_Mobile__c, Contact__r.Contact_Type__c`)
    .where({
        Listing_Session__c: 'a0H1R000013eaoxUAA',
    })
    .execute(function(err,records){
        if (err) { return console.error(err); }
        var participants = [];
        for (var record of records) {
            // fill the json object and check if session current date is within the session start date and end date 
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
    });


var records = [];
conn.query("SELECT Id, Email, Name, Primary_Contact_s_Email__c, Primary_Contact_s_Mobile__c FROM Contact WHERE Contact_Type__c = 'Coach' AND Id = '0033600001Yibm7AAB'", function(err, result) {
    if (err) { return console.error(err); }
    console.log("total : " + result.totalSize);
    console.log("fetched : " + result.records.length);
      for (var record of result.records) {
        console.log(record.Id);
        console.log(record.Email);
      }
});
    
    /**
     * Retrieves all session id for a given coach id
     * @param id Salesforce id of session listing to retrieve users
     * @param callback Callback function to execute once users have been retrieved
     */
    // this gets the listing session id and coach id from coach assignment 
    // sample coach id: 0033600001Yibm7AAB, 0031R0000259rjpQAA, 0033600001KJ0oYAAT
    var records = [];
    conn.query("SELECT Id, Coach__c, Coach__r.Name, Name, Listing_Session__c FROM Coach_Assignment__c WHERE Coach__c = '0033600001Yibm7AAB'", function(err, result) {
      if (err) { return console.error(err); }
      console.log("total : " + result.totalSize);
      console.log("fetched : " + result.records.length);
    //   for (var record of result.records) {
    //     console.log(`Name: ${record.Name}`);
    //     console.log(`Coach: ${record.Coach__c}`);
    //     console.log(`Coach Name: ${record.Coach__r.Name}`);
    //     console.log(`Listing Session: ${record.Listing_Session__c}`);
    //   }
    });
    
    // function of getting session id with coach id:
    conn.sobject("Coach_Assignment__c")
        .select(`Id, Coach__c, Coach__r.Name, Name, Listing_Session__c,Session_End_Date__c, Session_Start_Date__c, Listing_Session__r.Name`)
        .where({
            Coach__c: '0033600001Yibm7AAB',
            // Session_Start_Date__c: {$gte: jsforce.Date.YESTERDAY},
            // Session_End_Date__c: {$lt: jsforce.Date.TOMORROW}
        })
        .execute(function(err,records){
            if (err) { return console.error(err); }
            var sessions = [];
            for (var record of records) {
                // fill the json object and check if session current date is within the session start date and end date 
                sessions.push({
                    id: record.Listing_Session__c,
                    name: record.Name,
                    start_date: record.Session_Start_Date__c,
                    end_date: record.Session_End_Date__c,
                    official_name: record.Listing_Session__r.Name
                });
            }
            console.log(sessions);
        });