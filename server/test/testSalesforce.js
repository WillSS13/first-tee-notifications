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

// TODO: TEST THAT WE CAN RETRIEVE EACH TABLE & FIELDS FOR EACH FUNCTION
// E.G. Coach_Assignments__c, Listing_Session__c, etc.

// async function testCoachAssignmentsTable() {

async function testSalesforce() {
  await testConnection();
}

module.exports = { testSalesforce };