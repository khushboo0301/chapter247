import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'event-app',
  brokers: [process.env.KAFKA_BROKER!],
});

export const producer = kafka.producer();

export const initProducer = async () => {
  await producer.connect();
  console.log('Kafka Producer connected');
};

export const sendKafkaMessage = async (topic: string, message: object) => {
  await producer.send({
    topic,
    messages: [{ value: JSON.stringify(message) }],
  });
};
