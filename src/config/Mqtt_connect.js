




var mqtt = require('mqtt')
exports.connectMqtt = () => {
var options = {
    host: '9b9ff99947084987a898c48451b4d8ac.s1.eu.hivemq.cloud',
    port: 8883,
    protocol: 'mqtts',
    username: 'SANJO00444',
    password: 'Sanjo@00444'
}

// initialize the MQTT client
var client = mqtt.connect(options);

// setup the callbacks
client.on('connect', function () {
    console.log('Connected');
});

client.on('error', function (error) {
    console.log(error);
});

client.on('message', function (topic, message) {
    // called each time a message is received
    console.log('Received message:', topic, message.toString());
});

// subscribe to topic 'my/test/topic'
client.subscribe('my/test/topic');

// publish message 'Hello' to topic 'my/test/topic'
client.publish('my/test/topic', 'Hello');
};