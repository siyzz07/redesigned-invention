const { name } = require("ejs");
const mongoose = require("mongoose");

const partiesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  parties: [
    {
      name: {
        type: String,
      },
      description: {
        type: String,
      },
      phone: {
        type: Number,
      },
      transactions: [
        {
          toGet: {
            type: Number,
            default: 0,
          },
          toGave: {
            type: Number,
            default: 0,
          },
          reason:{
            type:String
          },
          date: {
            type: Date,
          },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Parties", partiesSchema);
