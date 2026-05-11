const amqp = require('amqplib');

let channel = null;

const connectRabbitMQ = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        channel = await connection.createChannel();
        await channel.assertQueue('ticket_events');
        console.log('📦 Connected to RabbitMQ');
        return channel;
    } catch (error) {
        console.warn('⚠️ RabbitMQ connection failed. Ensure RabbitMQ is running.', error.message);
    }
};

const getChannel = () => channel;

module.exports = { connectRabbitMQ, getChannel };
