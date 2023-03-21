const nodemailer = require("nodemailer");
const { OAuth2Client } = require("google-auth-library");

const OAUTH_PLAYGROUND = "https://developers.google.com/oauthplayground";

const CLIENT_ID = `${process.env.OAUTH_CLIENT_ID}`;
const CLIENT_SECRET = `${process.env.OAUTH_CLIENT_SECRET}`;
const REFRESH_TOKEN = `${process.env.OAUTH_REFRESH_TOKEN}`;
const SENDER_MAIL = `${process.env.SENDER_EMAIL_ADDRESS}`;

const sendEmail = async (options) => {
  const oAuth2Client = new OAuth2Client(
    CLIENT_ID,
    CLIENT_SECRET,
    OAUTH_PLAYGROUND
  );

  oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

  try {
    const accessToken = await oAuth2Client.getAccessToken();

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: SENDER_MAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });

    const message = {
      from: `${process.env.SENDER_EMAIL_ADDRESS}`,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };

    return transport.sendMail(message);
  } catch (error) {
    console.log(error);
  }
};

module.exports = sendEmail;
