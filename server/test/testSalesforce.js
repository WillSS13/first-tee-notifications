require('dotenv').config();

// TODO: CREATE DOCUMENTATION FOR EACH ENV VAR & WHAT HAPPENS IF THEY ARE NOT SET
const client_id = process.env.SALESFORCE_CLIENT_ID;
const client_secret = process.env.SALESFORCE_CLIENT_SECRET;
const instance_url = process.env.SALESFORCE_INSTANCE_URL;
const access_token = process.env.SALESFORCE_ACCESS_TOKEN;
const refresh_token = process.env.SALESFORCE_REFRESH_TOKEN;

var clc = require("cli-color");
var salesforceColor = clc.xterm(75).bgXterm(236);
var arrow = salesforceColor(">") + "   ";

var jsforce = require('jsforce');

var oauth2 = new jsforce.OAuth2({
  clientId: client_id,
  clientSecret: client_secret,
  redirectUri: "/oauth2/auth"
});

var conn = new jsforce.Connection({
  oauth2: oauth2,
  instanceUrl: instance_url,
  accessToken: access_token,
  refreshToken: refresh_token,
  version: '52.0'
});

conn.on('refresh', function (accessToken, res) {
  console.log(salesforceColor(">> Refreshed Access Token\n"));
});

async function testConnection() {
  console.log(salesforceColor(">> Testing Connection\n"));
  try {
    const result = await conn.query("SELECT Id, Name FROM Account LIMIT 1");
    console.log(arrow + "Successfully connected to Salesforce.");
    console.log(arrow + "Sample Account Name: ", clc.bold(result.records[0].Name));
  } catch (err) {
    console.error(arrow + "Failed to connect to Salesforce:", err);
  }
}

async function testContactTable() {
  console.log(salesforceColor("\n>> Testing Access to Contact Table\n"));
  try {
    const result = await conn.sobject("Contact")
      .select(`Id, Name, Email, Secondary_Email__c`)
      .limit(1)
      .execute();

    console.log(arrow + "Sample Contact Name: ", clc.bold(result[0].Name));
    console.log(arrow + "Sample Contact Email: ", clc.bold(result[0].Email));
  } catch (err) {
    console.error(arrow + "Failed to query Contact Table:", err);
  }
}

async function testSessionRegistrationTable() {
  console.log(salesforceColor("\n>> Testing Access to Session Registration Table\n"));
  try {
    const result = await conn.sobject("Session_Registration__c")
      .select(`Id, Name, Status__c, Contact__c, Contact__r.Name, Contact__r.Primary_Contact_s_Email__c, Contact__r.Emergency_Contact_Number__c, Contact__r.Contact_Type__c, Contact__r.Participation_Status__c`)
      .limit(1)
      .execute();

    console.log(arrow + "Sample Session Registration Name: ", clc.bold(result[0].Name));
    console.log(arrow + "Sample Session Registration Contact: ", clc.bold(result[0].Contact__c));
  } catch (err) {
    console.error(arrow + "Failed to query Session Registration Table:", err);
  }
}

async function testCoachAssignmentTable() {
  console.log(salesforceColor("\n>> Testing Access to Coach Assignment Table\n"));
  try {
    const result = await conn.sobject("Coach_Assignment__c")
      .select(`Id, Coach__c, Coach__r.Name, Name, Listing_Session__c,Session_End_Date__c, Session_Start_Date__c, Listing_Session__r.Id, Listing_Session__r.Name, Coach__r.Email, Coach__r.MobilePhone, Coach__r.Contact_Type__c`)
      .limit(1)
      .execute();

    console.log(arrow + "Sample Coach Assignment Name: ", clc.bold(result[0].Name));
    console.log(arrow + "Sample Coach Assignment Coach: ", clc.bold(result[0].Coach__c));
  } catch (err) {
    console.error(arrow + "Failed to query Coach Assignment Table:", err);
  }
}

async function testListingSessionTable() {
  console.log(salesforceColor("\n>> Testing Access to Listing Session Table\n"));
  try {
    const result = await conn.sobject("Listing_Session__c")
      .select("Id, Total_Registrations__c")
      .limit(1)
      .execute();

    console.log(arrow + "Sample Listing Session ID: ", clc.bold(result[0].Id));
  } catch (err) {
    console.error(arrow + "Failed to query Listing Session Table:", err);
  }
}

// TODO: TEST THAT WE CAN RETRIEVE EACH TABLE & FIELDS FOR EACH FUNCTION
// E.G. Coach_Assignments__c, Listing_Session__c, etc.

// async function testCoachAssignmentsTable() {

async function testSalesforce() {
  await testConnection();
  await testContactTable();
  await testSessionRegistrationTable();
  await testCoachAssignmentTable();
  await testListingSessionTable();
}

module.exports = { testSalesforce };