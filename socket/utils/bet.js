const User = require("../../models/User");
const Bet = require("../../models/Bet");
const WinResult = require("../../models/WinResult");
const Winning = require("../../models/Winning");
async function placeBet(retailerId, position, betPoint, ticketId) {
  //Verify Token
  try {
    let user = await User.findById(retailerId);

    if (user.creditPoint >= betPoint) {
      bet = await Bet.create({
        retailerId,
        bet: betPoint,
        startPoint: user.creditPoint,
        userName: user.userName,
        position,
        name: user.name,
        ticketId,
        endPoint: user.creditPoint,
      });
      await User.findByIdAndUpdate(retailerId, {
        $inc: { creditPoint: -betPoint, playPoint: betPoint },
        lastBetAmount: betPoint,
        lastTicketId: ticketId,
      });

      return bet._id;
    }
    return 0;
  } catch (err) {
    console.log("Error on place bet", err.message);
    return;
  }
}


async function getAdminData() {
  let data = await Bet.aggregate([
    {
      $match: {
        DrDate: () =>
          new Date()
            .toLocaleString("en-US", {
              timeZone: "Asia/Calcutta",
            })
            .toString()
            .split(",")[0]
            .replace(/\//g, (x) => "-"),
      },
    },
    { $group: { _id: "$DrDate", totalCollection: { $sum: "$bet" }, totalPayment: { $sum: "$won" } } }

  ]);
  return data;
}

async function winGamePay(price, betId, winPosition) {
  try {
    console.log(
      "WInGame Pay: price : ",
      price,
      "  betId : ",
      betId,
      " winPosition : ",
      winPosition
    );

    const betData = await Bet.findByIdAndUpdate(betId, {
      $inc: { won: price, endPoint: price },
    });
    let user = "";
    user = await User.findByIdAndUpdate(betData.retailerId, {
      $inc: { creditPoint: price, wonPoint: price },
    });

    return betData.retailerId;
  } catch (err) {
    console.log("Error on winGamePay", err.message);
    return err.message;
  }
}

//Add result of the Game
async function addGameResult(result, x, isWinByAdmin) {
  try {
    await WinResult.create({ result, x, isWinByAdmin });
    await Bet.updateMany({ winPosition: "" }, { winPosition: result, x });
  } catch (err) {
    console.log("Error on addGameResult", err.message);
    return err.message;
  }
}

//Add result of the Game
async function getLastrecord(retailerId) {
  try {
    let result = await WinResult.find()
      .select({ result: 1, x: 1, DrTime: 1, _id: 0 })
      .sort("-createdAt")
      .limit(15);
    let data = [];
    let x = [];
    let times = [];

    for (res of result) {
      data.push(res.result);
      x.push(res.x);
      times.push(res.DrTime)
    }

    return { records: data, x, times };
  } catch (err) {
    console.log("Error on getLastrecord", err.message);
    return err.message;
  }
}

//Get Admin Percentage for winning Result
async function getAdminPer() {
  return await Winning.findById("602e55e9a494988def7acc25");
}
//Get current running Game Data{
async function getCurrentBetData(retailerId) {
  let data = await Bet.find({ winPosition: "", retailerId });
  return data;
}

module.exports = {
  placeBet,
  winGamePay,
  getAdminPer,
  addGameResult,
  getLastrecord,
  getCurrentBetData,
  getAdminData,
};
