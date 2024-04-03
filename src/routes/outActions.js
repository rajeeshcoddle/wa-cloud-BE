let express = require("express");
let router = express.Router();
let outActionController = require("../controllers/outActions.controller");

router.get("/get-out-actions", outActionController.getOutActions);
router.get("/get-image-valid-url", outActionController.getImage);

module.exports = router;
