let express = require("express");
let router = express.Router();
let verificationController = require("../controllers/otpVerification.controller");

router.get("/generate", verificationController.generateOtp);
router.post("/verify", verificationController.verifyOtp);

module.exports = router;
