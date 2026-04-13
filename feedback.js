exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: "Invalid JSON" };
  }

  // Option A: Log to console (visible in Netlify function logs)
  console.log("=== NEW FEEDBACK ===", JSON.stringify(body, null, 2));

  // Option B: Forward to a Google Sheets webhook via Apps Script
  // Replace WEBHOOK_URL with your Google Apps Script Web App URL
  const WEBHOOK_URL = process.env.FEEDBACK_WEBHOOK_URL;
  if (WEBHOOK_URL) {
    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (e) {
      console.error("Webhook failed:", e.message);
    }
  }

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ ok: true }),
  };
};
