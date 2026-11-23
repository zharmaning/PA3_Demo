import "dotenv/config"
import twilio from "twilio"

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