let express = require("express");
let router = express.Router();
const userController = require("../controllers/user.controller");

router.get("/role", userController.fetchUserRole);

module.exports = router;
