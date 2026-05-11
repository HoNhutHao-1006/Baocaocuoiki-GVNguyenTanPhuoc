const http = require('http');
const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb://127.0.0.1:27017/eventbooking');
  const User = require('./src/models/User');
  
  // Find member user
  const member = await User.findOne({ role: 'MEMBER' });
  if (!member) { console.log('No MEMBER found'); process.exit(1); }
  console.log('Member:', member._id.toString(), member.fullname, member.bankName, member.bankAccount);
  
  // Test updateProfile mutation
  const query = `mutation { updateProfile(userId: "${member._id}", fullname: "${member.fullname}", bankName: "MB Bank", bankAccount: "123456789") { id fullname bankName bankAccount } }`;
  const data = JSON.stringify({ query });
  
  const req = http.request('http://localhost:4000/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
  }, (res) => {
    let body = '';
    res.on('data', chunk => body += chunk);
    res.on('end', () => {
      console.log('Response:', body);
      
      // Test cancelOrder
      const mongoose2 = require('mongoose');
      const Order = require('./src/models/Order');
      Order.findOne({ memberId: member._id, status: 'Paid' }).then(order => {
        if (!order) { console.log('No Paid order found'); process.exit(0); }
        console.log('Order to cancel:', order._id.toString(), order.status, order.totalAmount);
        
        const q2 = `mutation { cancelOrder(orderId: "${order._id}") }`;
        const d2 = JSON.stringify({ query: q2 });
        const req2 = http.request('http://localhost:4000/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(d2) }
        }, (res2) => {
          let b2 = '';
          res2.on('data', c => b2 += c);
          res2.on('end', () => { console.log('Cancel response:', b2); process.exit(0); });
        });
        req2.write(d2);
        req2.end();
      });
    });
  });
  req.write(data);
  req.end();
}
test();
