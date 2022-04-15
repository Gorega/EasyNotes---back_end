const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const myOAuth2Client = new OAuth2(
  "96709645210-7ro39dhrk1mcafc60b85mpkk0om5m1u0.apps.googleusercontent.com",
  "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",
  "https://developers.google.com/oauthplayground"
  )

myOAuth2Client.setCredentials({
  refresh_token:"1//04phiGLL2sXYNCgYIARAAGAQSNwF-L9Ir4WWlXfftxdaDcJC1jzDIzhNLBMkuq95nF_3h2eMSCua_uVfTrUbLEHQZvxxfVdXLwSM"
  });

const myAccessToken = myOAuth2Client.getAccessToken()

const mail = (to,mailMessage) =>{
        if(!to){
          throw new Error('BROKEN')
        }

      // send email
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
              type: "OAuth2",
              user: "waelabuawwad18@gmail.com", //your gmail account you used to set the project up in google cloud console"
              clientId: "96709645210-7ro39dhrk1mcafc60b85mpkk0om5m1u0.apps.googleusercontent.com",
              clientSecret: "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",
              refreshToken: "1//04phiGLL2sXYNCgYIARAAGAQSNwF-L9Ir4WWlXfftxdaDcJC1jzDIzhNLBMkuq95nF_3h2eMSCua_uVfTrUbLEHQZvxxfVdXLwSM",
              accessToken: myAccessToken //access token variable we defined earlier
        }
      });

      var mailOptions = {
        from: "waelabuawwad18@gmail.com",
        to: to,
        subject: 'EasyNotes - Verify your email address',
        html: mailMessage
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error)
          return;
        } else {
          console.log("success")
          return;
        }
      });
  }

module.exports = mail;