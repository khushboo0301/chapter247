import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  inviteSentAt: Date,
  reminderSentAt: Date,
});

export const EventInviteUser = mongoose.model("EventInviteUser", inviteSchema);
