const express = require("express");

const app = express();

async function query(sql, params) {
    //Singleton DB connection
    if (null === connection) {
        console.log('Here');
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

app.post("/api/sensor", (req, res) => {
    console.log(req.body);
    res.json({
        message: "Sensor data received"
    });
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});