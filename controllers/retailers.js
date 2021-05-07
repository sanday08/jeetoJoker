const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");
const WinResult = require("../models/WinResult");
const Bet = require("../models/Bet");
const Complaint = require("../models/Complaint");





//@desc      Get 7Days Bet History
//@routes    GET /api/retailers/betHistroy
//Access     Private/Admin
exports.get7Days = asyncHandler(async (req, res, next) => {
    console.log("date by Piyush", req.params.date)
    let result = await WinResult.find({
        createDate: {
            $gte: new Date(new Date(req.params.date) - 7 * 24 * 60 * 60 * 1000),
            $lt: new Date(req.params.date),
        }
    })
    console.log("Result is", result);
    return res.status(200).json({ success: true, data: result })
});






//@desc      Get all Bet History
//@routes    GET /api/retailers/betHistroy
//Access     Private/Admin
exports.getAllBetHistroy = asyncHandler(async (req, res, next) => {
    res.status(200).json(res.advancedResults);
});

//@desc      Get  Bet History via user
//@routes    GET /api/retailers/betHistroy/:retailerId
//Access     Private/Admin
exports.getBetHistroy = asyncHandler(async (req, res, next) => {

    console.log(req.query.retailerId, req.body.retailerId, req.params.retailerId)

    const bets = await Bet.find({ retailerId: req.params.retailerId });

    res.status(200).json({ success: true, count: bets.length, data: bets });
});



//@desc      Get all Online Retailer
//@routes    GET /api/retailers/online
//Access     Private/Admin
exports.getOnlineRetailers = asyncHandler(async (req, res, next) => {
    const users = await User.find({ isLogin: true });
    res.status(200).json({ success: true, count: users.length, data: users });
});





//@desc      Get all Win Result History
//@routes    GET /api/retailers/winResultByDate
//Access     Private/Admin
exports.getWinnerResultsByDate = asyncHandler(async (req, res, next) => {

    console.log(req.query.date, req.body.date, req.params.date)
    const winnerHistory = await WinResult.find({ DrDate: req.params.date });
    res.status(200).json({ success: true, count: winnerHistory.length, data: winnerHistory });
});

//@desc      Claime Ticket
//@routes    Put /api/retailers/claim
//Access     Private/Admin
exports.claimeTicket = asyncHandler(async (req, res, next) => {

    console.log("req.body.ticketId", req.body.ticketId, req.query.ticketId, req.params.ticketId);
    bets = await Bet.find({ ticketId: req.body.ticketId.toString().toUpperCase() });
    console.log("This is bets", bets)
    let result = "Ticket Id Not Found";
    if (bets.length != 0) {
        console.log(bets[0].retailerId, "& this is the system Owner Id", req.user.id)
        if (bets[0].retailerId == req.user.id) {
            if (bets[0].winPositions.length == 0)
                result = "Result Not yet Declared";
            else if (bets[0].claim) {
                result = "Ticket Already Claimed."
            }
            else {
                await Bet.findOneAndUpdate({ ticketId: req.body.ticketId }, { claim: true });
                if (bets[0].won != 0)
                    result = "You won the Ticket of " + bets[0].won
                else
                    result = "You loss The Ticket"
            }
        }
        else
            result = "You purchased your ticket from other retailer.."

    }

    res.status(200).json({ success: true, data: result });
});



//@desc      Post all Bet History
//@routes    Post /api/retailers/complaint
//Access     Private/Admin
exports.addComplaint = asyncHandler(async (req, res, next) => {
    const bets = await Complaint.create({ title: req.body.title, content: req.body.content });
    res.status(200).json({ success: true, count: bets.length, data: bets });
});




//@desc      Get 7days Win Result History
//@routes    GET /api/retailers/winResultByDate
//Access     Private/Admin
exports.getWinnerResultsByDate = asyncHandler(async (req, res, next) => {

    console.log(req.query.date, req.body.date, req.params.date)
    const winnerHistory = await WinResult.find({ DrDate: req.params.date });
    res.status(200).json({ success: true, count: winnerHistory.length, data: winnerHistory });
});
