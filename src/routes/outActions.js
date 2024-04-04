let express = require("express");
let router = express.Router();
let outActionController = require("../controllers/outActions.controller");

router.get("/get-out-actions", outActionController.getOutActions);
router.get("/get-image-valid-url", outActionController.getImage);
router.get("/export-excel", outActionController.exportExcel);

module.exports = router;
