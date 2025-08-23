import mongoose from "mongoose";
const { Schema } = mongoose;

const teamSchema = new Schema(
  {
    name: { type: String, required: true, min: 3, max: 50 },
    city: { type: String, required: true, min: 2, max: 50 },
    stadium: { type: String, required: true, min: 3, max: 100 },
    foundedYear: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Team", teamSchema);
