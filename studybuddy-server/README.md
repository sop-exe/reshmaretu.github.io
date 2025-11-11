# StudyBuddy Push Server

Minimal Node.js server to deliver Web Push notifications for StudyBuddy. Deployable on Render.

## Endpoints

- `POST /subscribe` — Body: PushSubscription JSON. Stores the subscription in memory.
- `POST /notify` — Body: `{ "message": "text" }`. Sends the payload to all stored subscriptions.

Note: This server uses in-memory storage. Redeploys or restarts will clear subscriptions. For production, persist subscriptions to a database.

## Environment Variables

- `PUBLIC_VAPID_KEY` — Your VAPID public key
- `PRIVATE_VAPID_KEY` — Your VAPID private key

## Local Run

```bash
npm install
export PUBLIC_VAPID_KEY=your_public_key
export PRIVATE_VAPID_KEY=your_private_key
npm start
```

## Deploy on Render

1. Push this folder as a GitHub repo.
2. Render → New → Web Service → Connect repo.
3. Start command: `node server.js` (build command not required).
4. Add Environment Variables:
   - `PUBLIC_VAPID_KEY`
   - `PRIVATE_VAPID_KEY`
5. Deploy. Use the generated HTTPS URL in your front-end:
   - `https://<your-service>.onrender.com/subscribe`
   - `https://<your-service>.onrender.com/notify`


