const sendEmail = (emails, message, subject, name) => {
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
    const sgMail = require('@sendgrid/mail')
    sgMail.setApiKey('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')
    const msg = {
      to: emails, // Change to your recipient
      from: 'notifications@thefirstteepittsburgh.org', // Change to your verified sender
      subject: subject,
      text: 'First Tee Pittsburgh Notifications',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      templateId: 'd-8ed996d8a4fa48bbaa58259052643102',
      dynamic_template_data: {
        mesg: message
        // name: coach_name,
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