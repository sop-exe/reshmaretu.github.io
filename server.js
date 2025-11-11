const express = require('express');
const cors = require('cors');
const webpush = require('web-push');

const app = express();
app.use(cors());
app.use(express.json());

const publicVapidKey = process.env.PUBLIC_VAPID_KEY;   
const privateVapidKey = process.env.PRIVATE_VAPID_KEY; 

webpush.setVapidDetails(
  'mailto:your-email@gmail.com',
  publicVapidKey,
  privateVapidKey
);

let subscriptions = [];

app.post('/subscribe', (req, res) => {
  const sub = req.body;
  if (sub && sub.endpoint && !subscriptions.find(s => s.endpoint === sub.endpoint)) {
    subscriptions.push(sub);
  }
  res.status(201).json({ ok: true });
});

app.post('/notify', async (req, res) => {
  const payload = req.body && req.body.message ? req.body.message : 'Timer finished!';
  const results = [];
  for (const sub of subscriptions) {
    try {
      await webpush.sendNotification(sub, payload);
      results.push({ endpoint: sub.endpoint, ok: true });
    } catch (err) {
      results.push({ endpoint: sub.endpoint, ok: false });
    }
  }
  res.json({ success: true, delivered: results.filter(r => r.ok).length });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on ${port}`));