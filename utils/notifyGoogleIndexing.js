// E:\nauman\NowSpike\frontend\utils\notifyGoogleIndexing.js
const { google } = require("googleapis");

async function notifyGoogleIndexing(url, type = "URL_UPDATED") {
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: "credentials/fit-boulevard-454715-q4-90675e04a4f2.json",
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