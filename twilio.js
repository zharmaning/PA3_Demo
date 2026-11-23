require("dotenv").config();
const twilio = require("twilio");
const DARKNESS_LIMIT = 300;

const now = Date.now();
const ALERT_COOLDOWN = 5 * 60 * 1000;

let lastAlertTime = 0;
let alertInProgress = false;

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

async function sendTextMessage() {
    const message = await client.messages.create({
        body: "sms_internal_alerts",
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.MY_PHONE_NUMBER
    });

    console.log("SMS submitted:", message.sid);
}

export {sendTextMessage};

// Twilio piece
// async function checkMessage() {
//     if (
//         light < DARKNESS_LIMIT &&
//         !alertInProgress &&
//         now - lastAlertTime >= ALERT_COOLDOWN
//     ) {
//         alertInProgress = true;

//         try {
//             await sendTextMessage();
//             lastAlertTime = Date.now();
//         } catch (error) {
//             console.error("SMS error:", error.message);
//         } finally {
//             alertInProgress = false;
//         }
//     }
// }