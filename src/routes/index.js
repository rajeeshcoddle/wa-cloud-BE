let express = require("express");
let router = express.Router();

/* Home page */
router.get("/", function (req, res, next) {
  return res.json({ title: "WA_CLOUD_BACKEND" });
});

module.exports = router;
