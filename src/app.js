let express = require("express");
const config = require("config");
const { auth } = require("express-oauth2-jwt-bearer");

let app = express();
let bodyParser = require("body-parser");
let indexRouter = require("./routes/index");
let outActionsRoute = require("./routes/outActions");
let userRoute = require("./routes/user");
let verificationRoutes = require("./routes/otpVerification");
const cors = require("cors");

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(cors());

const jwtCheck = auth({
  audience: config.audience,
  issuerBaseURL: config.issuerBaseURL,
  tokenSigningAlg: config.tokenSigningAlg,
});
// enforce on all endpoints
app.use(jwtCheck);

app.use("/", indexRouter);
app.use("/out-actions", outActionsRoute);
app.use("/user", userRoute);
app.use("/otp", verificationRoutes);

//Error handling for 403 errors
app.get("*", function (req, res) {
  res.json({ success: false, message: "Invalid Request" }).status(403);
});

//Error handling for 404 errors
app.post("*", function (req, res) {
  res.json({ success: false, message: "Invalid Request" }).status(404);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ success: false, message: "Invalid Request" });
});

module.exports = app;
