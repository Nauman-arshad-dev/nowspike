// E:\nauman\NowSpike\frontend\utils\notifyGoogleIndexing.js
const { google } = require("googleapis");

// Parse the credentials from the environment variable
const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS || "{}");

async function notifyGoogleIndexing(url, type = "URL_UPDATED") {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: credentials, // Use the parsed JSON object from the environment variable
      scopes: ["https://www.googleapis.com/auth/indexing"],
    });

    const client = await auth.getClient();
    const indexing = google.indexing({ version: "v3", auth: client });

    const response = await indexing.urlNotifications.publish({
      requestBody: {
        url: url,
        type: type,
      },
    });

    console.log(`Successfully notified Google for ${url}:`, response.data);
    return response.data;
  } catch (error) {
    console.error(`Error notifying Google for ${url}:`, error.message);
    throw error;
  }
}

module.exports = { notifyGoogleIndexing };