const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const myOAuth2Client = new OAuth2(
  process.env.MAIL_CLIENT_ID,
  process.env.MAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
  )
  
  myOAuth2Client.setCredentials({
    refresh_token:process.env.MAIL_REFRESH_TOKEN
    });

  const myAccessToken = myOAuth2Client.getAccessToken()

const mail = (to,mailMessage,mainSubject) =>{
      myAccessToken.then(res=> {
        // send email
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
                type: "OAuth2",
                user: process.env.EMAIL_SERVICE,
                clientId: process.env.MAIL_CLIENT_ID,
                clientSecret: process.env.MAIL_CLIENT_SECRET,
                refreshToken: res.token,
                accessToken: myAccessToken
          }
        });
  
        var mailOptions = {
          from: process.env.EMAIL_SERVICE,
          to: to,
          subject: mainSubject,
          html: mailMessage
        };
  
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            // Error handler
            return;
          } else {
            // Email sent successfuly handler
            return;
          }
        });
      })
  }

module.exports = mail;