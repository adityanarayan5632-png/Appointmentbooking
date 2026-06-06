require("dotenv").config();

const express = require("express");
const cors = require("cors");
const twilio = require("twilio");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// GET ALL APPOINTMENTS
app.get("/appointments", (req, res) => {
  try {
    const data = fs.readFileSync("appointments.json", "utf8");
    const appointments = JSON.parse(data);

    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// CREATE APPOINTMENT
app.post("/appointments", async (req, res) => {
  try {
    const { name, phone, date, time } = req.body;

    // Read existing appointments
    const data = fs.readFileSync("appointments.json", "utf8");
    const appointments = JSON.parse(data);

    // New appointment
    const newAppointment = {
      id: Date.now(),
      name,
      phone,
      date,
      time,
    };

    appointments.push(newAppointment);

    // Save appointment
    fs.writeFileSync(
      "appointments.json",
      JSON.stringify(appointments, null, 2)
    );

    // Send SMS
    const message = await client.messages.create({
      body: `Hello ${name}, your appointment has been scheduled for ${date} at ${time}.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    res.status(200).json({
      success: true,
      appointment: newAppointment,
      messageSid: message.sid,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});