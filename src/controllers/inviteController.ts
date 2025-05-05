import { Request, Response } from "express";
import { EventInviteUser } from "../models/EventInviteUser";

interface InviteParams {
  eventId: string;
  userId: string;
}

interface InviteBody {
  status: "accepted" | "rejected";
}

export const respondToInvite = async (
  req: Request<InviteParams, {}, InviteBody>,
  res: Response
): Promise<Response> => {
  try {
    const { eventId, userId } = req.params;
    const { status } = req.body;

    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const invite = await EventInviteUser.findOneAndUpdate(
      { eventId, userId },
      { status },
      { new: true }
    );

    if (!invite) {
      return res.status(404).json({ error: "Invite not found" });
    }

    return res.status(200).json({ message: `Invite ${status}`, invite });

  } catch (error) {
    console.error("Respond Error:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
