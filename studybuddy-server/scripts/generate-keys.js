// Run: node scripts/generate-keys.js

const webpush = require('web-push');

const keys = webpush.generateVAPIDKeys();

console.log('PUBLIC_VAPID_KEY=' + keys.publicKey);
console.log('PRIVATE_VAPID_KEY=' + keys.privateKey);

console.log('\nNext steps:');
console.log('1) In Render env vars, set PUBLIC_VAPID_KEY and PRIVATE_VAPID_KEY to these values.');
console.log('2) In your GitHub Pages site index.html, set window.STUDYBUDDY_PUBLIC_VAPID to the PUBLIC key.');

