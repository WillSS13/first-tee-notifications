// Connection to Twilio SendGrid Email API

const sendEmail = (emails, message, subject) => {
    // const sgMail = require('@sendgrid/mail')
    // sgMail.setApiKey('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')
    // const msg = {
    //   to: 'edwardch@andrew.cmu.edu', // Change to your recipient
    //   from: 'edithtan777@gmail.com', // Change to your verified sender
    //   subject: subject,
    //   text: message,
    //   html: message,
    //   }
    // sgMail
    //   .send(msg)
    //   .then(() => {
    //     console.log('Email sent')
    //   })
    //   .catch((error) => {
    //     console.error(error)
    //   }) 
    const key = process.env.SENDGRID_API_KEY;
    // const key = "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";
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey(key)
    const msg = {
      // to: emails, // Change to your recipient
      to: "notifications@thefirstteepittsburgh.org",
      bcc: emails,
      from: 'notifications@thefirstteepittsburgh.org', // Change to your verified sender
      templateId: 'd-8ed996d8a4fa48bbaa58259052643102',
      dynamic_template_data: {
        mesg: message,
        // name: coach_name,
        subject: subject
      },
    }
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent')
      })
      .catch((error) => {
        console.error(error)
      })
  }

module.exports = {sendEmail};