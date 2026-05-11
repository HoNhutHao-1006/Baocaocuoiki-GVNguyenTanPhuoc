const amqp = require('amqplib');

const startWorker = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        const channel = await connection.createChannel();
        await channel.assertQueue('ticket_events');
        console.log('👷 Worker is listening for ticket_events...');

        channel.consume('ticket_events', (msg) => {
            if (msg !== null) {
                const event = JSON.parse(msg.content.toString());
                console.log(`\n[Worker] 📥 Received Event: ${event.type}`);
                console.log(`[Worker] Processing ticket: ${event.data.ticketId} for user: ${event.data.userId}`);
                
                // Simulate an async operation like sending an email
                setTimeout(() => {
                    console.log(`[Worker] ✅ Successfully processed event for User: ${event.data.userId}.`);
                    channel.ack(msg);
                }, 2500);
            }
        });
    } catch (error) {
        console.error('⚠️ Worker RabbitMQ connection failed.', error.message);
    }
};

module.exports = startWorker;
