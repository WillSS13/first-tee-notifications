var clc = require("cli-color");

var green = clc.green.bold;

var salesforceColor = clc.xterm(75).bgXterm(236);
var knockColor = clc.xterm(202).bgXterm(236);
var twilioColor = clc.xterm(196).bgXterm(236);
var mailersendColor = clc.xterm(93).bgXterm(236);

console.log(green("Executing API Tests"));

async function runTests() {
  console.log(salesforceColor("\n================== SALESFORCE ==================\n"));
  const { testSalesforce } = require('./testSalesforce.js');
  await testSalesforce();

  console.log(knockColor("\n================== KNOCK ==================\n"));
  const { testKnock } = require('./testKnock.js');
  await testKnock();

  console.log(twilioColor("\n================== TWILIO ==================\n"));
  const { testTwilio } = require('./testTwilio.js');
  await testTwilio();

  console.log(mailersendColor("\n================== MAILERSEND ==================\n"));
  const { testMailersend } = require('./testMailersend.js');
  await testMailersend();
}


runTests();
