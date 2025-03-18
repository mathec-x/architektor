import { Kafka } from 'kafkajs';

export class KafkaGateway {
  private kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092'],
  });

  private producer = this.kafka.producer();
  private consumer = this.kafka.consumer({ groupId: 'my-group' });

  async sendMessage(topic: string, message: object) {
    await this.producer.connect();
    await this.producer.send({
      topic,
      messages: [{ value: JSON.stringify(message) }],
    });
    await this.producer.disconnect();
  }

  async consumeMessages(topic: string, callback: (message: string) => void) {
    await this.consumer.connect();
    await this.consumer.subscribe({ topic, fromBeginning: true });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (message.value) callback(message.value.toString());
      },
    });
  }
}
