const mongoose = require("mongoose");


//Set you offset here like +5.5 for IST
var offsetIST = 19800000;

//Create a new date from the Given string
var d = new Date();

//To convert to UTC datetime by subtracting the current Timezone offset
var utcdate = new Date(d.getTime());

//Then cinver the UTS date to the required time zone offset like back to 5.5 for IST
var istdate = new Date(utcdate.getTime() + offsetIST)

const BetSchema = new mongoose.Schema({
    retailerId: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    
    bet: Number,
    winPosition: {
        type: String,
        default: ""
    },
    startPoint: Number,
    userName: String,
    name: String,
    position: {
        type: Object,
        required: true
    },
    won: {
        type: Number,
        default: 0
    },
  

    DrTime: {
        type: String,
        default: istdate.getHours().toString() + " : " + istdate.getMinutes().toString() + " : " + istdate.getSeconds().toString(),
    },
    DrDate: {
        type: String,
        default: istdate.getFullYear().toString() + "-" + (istdate.getMonth() + 1).toString() + "-" + istdate.getDate().toString(),
    },
    createDate: {
        type: Date,
        default: istdate,
    },
    andarBaharResult: String

}, { timestamps: true })

module.exports = mongoose.model("Bet", BetSchema);

