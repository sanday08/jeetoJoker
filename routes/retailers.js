const express = require('express');
const { getWinnerResultsByDate, claimeTicket, getBetHistroy, getOnlineRetailers, getAllBetHistroy, addComplaint, get7Days ,getReprintData,getDayTickets,getBetHistroyDayWise} = require("../controllers/retailers")
const { protect, authorize } = require("../middleware/auth");
const Bet = require("../models/Bet")
const advancedResults = require("../middleware/advancedResults");

const router = express.Router();

//use middleware to protect, authorize
router.use(protect);
router.route("/betHistroy/").get(advancedResults(Bet), getAllBetHistroy)
router.get("/betHistroy/:retailerId", getBetHistroy)
router.get("/betDayHistroy", getBetHistroyDayWise)
router.get("/online", getOnlineRetailers);

router.use(authorize("retailer"));
// router.route("/addCreditPoint").post(addDistributerCreditPoint);
// router.route("/reduceCreditPoint").post(reduceDistributerCreditPoint);
// router.route("/distributers").get(getDistributers);
// router.route("/retailers").get(getRetailers);
router.route("/reprint/:ticketId").get(getReprintData);
router.route("/tickets").get(getDayTickets);
router.route("/winResultByDate/:date").get(getWinnerResultsByDate);

router.route("/claim").put(claimeTicket);
router.route("/complaint").post(addComplaint);
module.exports = router;