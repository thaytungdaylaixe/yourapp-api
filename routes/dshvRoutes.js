const express = require("express");
const router = express.Router();
const dshvsController = require("../controllers/dshvsController");

router
  .route("/")
  .get(dshvsController.getAllDshvs)
  .post(dshvsController.createNewDshv)
  .patch(dshvsController.updateDshv)
  .delete(dshvsController.deleteDshv);

module.exports = router;
