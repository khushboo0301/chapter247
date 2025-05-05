import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import { initProducer } from "../kafka/producer";
import { initConsumer } from "../kafka/consumer";
import eventRoutes from "./routes/eventRoutes";
import inviteRoutes from "./routes/inviteRoutes";
import { startReminderScheduler } from "./schedulers/reminderScheduler";

dotenv.config();

const app = express();
app.use(express.json());

connectDB();
initProducer();
initConsumer();

startReminderScheduler();

app.use("/api/events", eventRoutes);

app.use("/api/invite", inviteRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
