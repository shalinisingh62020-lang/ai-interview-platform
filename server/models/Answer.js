import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  answers: {
    type: Array,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;