import cron from "node-cron";
import { Event } from "../models/Event";
import { EventInviteUser } from "../models/EventInviteUser";
import { User } from "../models/User";
import { sendKafkaMessage } from "../../kafka/producer";

export const startReminderScheduler = () => {
  cron.schedule("*/5 * * * *", async () => {
    console.log("⏰ Running reminder scheduler...");

    const now = new Date();
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

    const events = await Event.find({
      startTime: { $gte: now, $lte: oneHourFromNow },
    });

    for (const event of events) {
      const invites = await EventInviteUser.find({
        eventId: event._id,
        status: "pending",
        reminderSentAt: { $exists: false },
      });

      for (const invite of invites) {
        const user = await User.findById(invite.userId);

        if (user) {
          await sendKafkaMessage("email-topic", {
            to: user.email,
            subject: `Reminder: ${event.title} starts soon`,
            html: `<p>Hello ${user.firstName},<br/>Reminder: the event <b>${event.title}</b> starts within 1 hour!</p>`,
          });

          invite.reminderSentAt = new Date();
          await invite.save();
        }
      }
    }
  });
};
