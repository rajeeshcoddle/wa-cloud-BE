const moment = require("moment");
const config = require("config");
const { sendResponse } = require("../utilities/handleResponse");
const otpGenerator = require("otp-generator");
const sendgrid = require("@sendgrid/mail");
const verificationModel = require("../models/otpVerification.model");

const createOtp = () => {
  const OTP = otpGenerator.generate(6, {
    digits: true,
    specialChars: false,
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
  });

  return OTP;
};

const generateOtp = async (req, res) => {
  try {
    if (!req.headers.useremail) {
      let errorMsg = "Email Id is missing";
      return sendResponse(res, errorMsg, 500);
    }
    let email = req.headers.useremail;
    const user = await verificationModel.checkUserExist(email);
    if (!user) {
      let errorMsg = "User doesn't exist";
      return sendResponse(res, errorMsg, 500);
    }
    const { id, name } = user;
    const userName = name.toString().trim() || "";
    const welcomeText = userName ? `Ciao ${userName},` : `Ciao,`;
    const otp = createOtp();
    const savedOtp = await verificationModel.saveOtp(id, otp);
    if (!savedOtp) {
      let errorMsg = "Error while saving Otp";
      return sendResponse(res, errorMsg, 500);
    }
    sendgrid.setApiKey(config.sendgrid_key);
    const sendMail = await sendgrid.send({
      to: email,
      from: config.from_mail,
      subject: "Codice di accesso temporaneo",
      html: `<html>
      <body>
        <div>
          <p>${welcomeText}</p>
          <p>Per completare l'accesso al tuo account di Green Plus inserisci il seguente codice temporaneo: <strong id="otp">${otp}</strong></p><br>
          <p><strong>Non sei stato tu ad effettuare il tentativo di accesso?</strong><br>
          Contatta il team IT di Green Plus e segnala questo evento. Per sicurezza ti suggeriamo in questo caso anche di cambiare la password di accesso all'account.</p>
        </div>
      </body>
    </html>`,
    });
    if (!sendMail) {
      let errorMsg = "Error while sending Otp";
      return sendResponse(res, errorMsg, 500);
    }
    let message = `Otp is send to ${email}`;
    return sendResponse(res, message, 200);
  } catch (error) {
    console.log(error);
    return sendResponse(res, "Error while creating OTP", 500);
  }
};

function parseRole(value) {
  if (!value) {
    return [];
  } else {
    return value.split(",").map((role) => role.trim());
  }
}

const verifyOtp = async (req, res) => {
  try {
    if (!req.headers.useremail) {
      let errorMsg = "Email Id is missing";
      return sendResponse(res, errorMsg, 400);
    }
    if (!req.body.otp) {
      let errorMsg = "OTP is missing";
      return sendResponse(res, errorMsg, 400);
    }
    const { otp } = req.body;
    let email = req.headers.useremail;
    const otpVerified = await verificationModel.verifyOtp(email, otp);
    if (!otpVerified) {
      let errorMsg = "Incorrect OTP";
      return sendResponse(res, errorMsg, 500);
    }
    const { name, otp_created_time, currentTime } = otpVerified;
    console.log(otp_created_time);
    const otpCreatedTime = moment(
      otp_created_time,
      "YYYY-MM-DD HH:mm:ss"
    ).unix();
    const currentDateTime = moment(currentTime, "YYYY-MM-DD HH:mm:ss").unix();
    console.log(currentDateTime);
    const differenceInSeconds = currentDateTime - otpCreatedTime;
    console.log(otpCreatedTime, currentDateTime, differenceInSeconds);
    if (differenceInSeconds > 900) {
      let errorMsg = "OTP scaduto";
      return sendResponse(res, errorMsg, 401);
    }
    let getUserRole = await verificationModel.getUserRole(email);
    if (!Array.isArray(getUserRole) || getUserRole.length === 0) {
      return sendResponse(res, "Error while getting user role", 500);
    }
    let roleArray = [];
    for (let value of getUserRole) {
      let user_role = value.user_role;
      if (user_role) {
        user_role = user_role.trim();
        roleArray.push(user_role);
      }
    }
    let isAdmin = getUserRole[0]?.isadmin;
    if (isAdmin === 1) {
      roleArray.push("ADMIN");
    }
    console.log("roleArray", roleArray);
    let result = { roleArray: roleArray };
    let message = `Verifica OTP completata. Benvenuto/a ${name}`;
    return sendResponse(res, message, 200, result);
  } catch (error) {
    console.log(error);
    return sendResponse(res, "Errore durante la verifica OTP", 500);
  }
};

module.exports = {
  generateOtp,
  verifyOtp,
};
