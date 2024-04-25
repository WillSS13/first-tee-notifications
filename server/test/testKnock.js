require('dotenv').config();

var clc = require("cli-color");
var knockColor = clc.xterm(202).bgXterm(236);
const arrow = knockColor(">") + "   ";

const { Knock } = require("@knocklabs/node");

// TODO: CREATE DOCUMENTATION FOR EACH ENV VAR & WHAT HAPPENS IF THEY ARE NOT SET
const knock = new Knock(process.env.KNOCK_API_KEY);

async function testConnection() {
  console.log(knockColor(">> Testing Connection\n"));

  try {
    const response = await knock.messages.list();
    console.log(arrow + "Successfully connected to Knock.");
    console.log(arrow + "Retrieved latest message ID: " + clc.bold(response.items[0].id));
  } catch (err) {
    console.error("Failed to connect to Knock:", err);
  }
  
}

async function testKnock() {
  await testConnection();
}

module.exports = { testKnock };