const http = require('http');
const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');
const { connectMqtt } = require('./config/Mqtt_connect');
const userRoutes = require('./routes/user.Routes');
const { startOcppServer } = require('./ocpp/ocppconfig');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/v1/users', userRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to Express + OCPP Server');
});

const httpServer = http.createServer(app);

connectDB();
connectMqtt();
//startOcppServer(httpServer);

httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
