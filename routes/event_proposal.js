const express = require("express");
const event_proposals_controller = require("../controllers/eventProposalController");
const dish_controller = require("../controllers/dishController");
const { isLoggedIn } = require('./utils')

var router = express.Router();

router.get("/", isLoggedIn, event_proposals_controller.list_get);
router.get("/:id", isLoggedIn, event_proposals_controller.detail_get);

/* GET create new dishes. */
router.get("/create", isLoggedIn, dish_controller.create_get);
/* POST create new dish*/
router.post("/create", isLoggedIn, dish_controller.create_post);

module.exports = router;
