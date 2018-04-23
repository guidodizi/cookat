const express = require("express");
const dish_controller = require("../controllers/dishController");
const { isLoggedIn } = require('./utils')


var router = express.Router();

/* view all dishes. */
router.get("/", isLoggedIn, dish_controller.list_get);

/* GET create new dishes. */
router.get("/create", isLoggedIn, dish_controller.create_get);
/* POST create new dish*/
router.post("/create", isLoggedIn, dish_controller.create_post);

module.exports = router;