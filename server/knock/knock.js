const { Knock } = require("@knocklabs/node");
const knock = new Knock(process.env.KNOCK_API_KEY);

const testKnock = () => {
  knock.workflows.trigger("notification", {
    data: { message: "THIS IS A TEST MESSAGE" },
    recipients: [
      {
        id: "1",
        name: "Will Squibb",
        phone_number: "+14176316203",
      },
    ],
  })
  .then((response) => console.log(response))
  .catch((error) => console.error(error));
}

module.exports = { testKnock };