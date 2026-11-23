const express = require("express");

const app = express();
const mysql = require('mysql2/promise');
let connection = null;

import {sendTextMessage} from './twilio.js';

async function query(sql, params) {
    //Singleton DB connection
    if (null === connection) {
        connection = await mysql.createConnection({
            host: "student-databases.cvode4s4cwrc.us-west-2.rds.amazonaws.com",
            user: "ZOEHARMANING", //same as username for DB connection
            password: "1BoBpUpbcc8ow9oYDBAfmi7qRAplXLb1qZZ", //Same as password for logging in
            database: 'ZOEHARMANING' //same as database name for DB connection
        });
    }

    const [results,] = await connection.execute(sql, params);
    return results;
}

app.use(express.json());

app.post("/api/sensor", async (req, res) => {
    console.log("Received body:", req.body);

    if (!req.body || req.body.lightLevel === undefined) {
        return res.status(400).json({
            message: "Missing light data",
            received: req.body
        });
    }

    const light = Number(req.body.lightLevel);

    if (!Number.isFinite(light)) {
        return res.status(400).json({
            message: "Invalid light data"
        });
    }

    const sql = `
        INSERT INTO arduino_input
        (light)
        VALUES (?)
    `;

    // twilio bit
    if (
        light < DARKNESS_LIMIT &&
        !alertInProgress &&
        now - lastAlertTime >= ALERT_COOLDOWN
    ) {
        alertInProgress = true;

        try {
            await sendTextMessage();
            lastAlertTime = Date.now();
        } catch (error) {
            console.error("SMS error:", error.message);
        } finally {
            alertInProgress = false;
        }
    }

    // Back to reading sensor data
    try {
        await query(sql, [light]);

        res.json({
            message: "Sensor data received",
            light: light
        });

    } catch (error) {
        console.error("DATABASE ERROR:", error);

        res.status(500).json({
            message: "Database error"
        });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});