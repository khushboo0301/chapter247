import { Request, Response } from "express";
import { Event } from "../models/Event";
import { EventInviteUser } from "../models/EventInviteUser";
import { User } from "../models/User";
import { sendKafkaMessage } from "../../kafka/producer";

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, description, startTime, createdBy } = req.body;

    const event = await Event.create({
      title,
      description,
      startTime,
      createdBy,
    });

    const users = await User.find({});
    const inviteDocs = users.map((user) => ({
      userId: user._id,
      eventId: event._id,
      status: "pending",
    }));

    await EventInviteUser.insertMany(inviteDocs);

    // Schedule invites after 1 hour using Kafka
    users.forEach((user) => {
      sendKafkaMessage("email-topic", {
        to: user.email,
        subject: `You're invited to ${event.title}`,
        html: `<p>Hello ${user.firstName},</p><p>You are invited to: ${event.title}</p>`,
      });
    });

    res
      .status(201)
      .json({ message: "Event created and invites scheduled", event });
  } catch (error) {
    console.error("Create Event Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
