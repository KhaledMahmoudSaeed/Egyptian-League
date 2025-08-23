import mongoose from "mongoose";
const { Schema } = mongoose;

const matchSchema = new Schema(
  {
    homeTeam: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    awayTeam: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    matchDate: { type: Date, required: true },
    score: { type: String, required: true },
  },
  { timestamps: true }
);
export default mongoose.model("Match", matchSchema);
