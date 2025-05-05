import { Kafka } from "kafkajs";
import { sendEmail } from "../src/services/emailService";

const kafka = new Kafka({
  clientId: "event-app",
  brokers: [process.env.KAFKA_BROKER!],
});

const consumer = kafka.consumer({ groupId: "email-group" });

export const initConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: "email-topic", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const parsed = JSON.parse(message.value!.toString());
      console.log("Received message:", parsed);
      await sendEmail(parsed);
    },
  });
};
