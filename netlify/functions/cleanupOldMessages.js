const admin = require('firebase-admin');
const functions = require('@netlify/functions');

// Initialize Firebase Admin
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (error) {
  console.error('Error parsing Firebase service account:', error);
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.handler = async (event, context) => {
  try {
    // Calculate timestamp for 5 days ago
    const fiveDaysAgo = new Date();
    fiveDaysAgo.setDate(fiveDaysAgo.getDate() - 5);

    // Query for old messages
    const snapshot = await db.collection('messages')
      .where('timestamp', '<', fiveDaysAgo)
      .get();

    // Delete old messages in batches
    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: `Successfully cleaned up ${snapshot.size} old messages`,
        deletedCount: snapshot.size
      })
    };
  } catch (error) {
    console.error('Error cleaning up old messages:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to clean up old messages' })
    };
  }
};
