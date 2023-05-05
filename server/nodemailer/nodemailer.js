var nodemailer = require('nodemailer');

const sendEmail = (emails, message, subject) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        // auth:{
        //     user: 'notifications@thefirstteepittsburgh.org',
        //     pass: '5370Schenley'
        // }
        auth: {
            type: 'OAuth2',
            user: 'notifications@thefirstteepittsburgh.org',
            pass: '5370Schenley',
            clientId: "997854445828-5arllojtpa91frhmo220l3rs12ta07iq.apps.googleusercontent.com",
            clientSecret: "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",
            refreshToken: "1//04LPy7taQrziFCgYIARAAGAQSNwF-L9IrNBTKhsY-wVOlHbYviY0et5RiKRL3ItgvDN_wspjUsoH0bvj1zMmn1Kk9EueyximIe54"
        }
    });

    var mailOptions = {
        from: 'notifications@thefirstteepittsburgh.org',
        to: emails,
        subject: subject,
        text: message
    }

    transporter.sendMail(mailOptions, function(error,info){
        if(error) {
            console.log(error);
        } else {
            console.log('Email Sent');
        }
    })

}

module.exports = {sendEmail};