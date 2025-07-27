const express = require('express');
const app = express();
const axios = require('axios');
const mqtt = require('mqtt');

const PORT = process.env.PORT || 3000;

// MQTT Configuration
const brokerURL = 'mqtt://mqtt.koinsightug.com';
const username = 'gkfiqxkh';
const password = 'wtc48z8dSovj';
const port = 1883;

// MQTT options
const options = {
    port: port,
    username: username,
    password: password
};

const mqttClient = mqtt.connect(brokerURL, options);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe('woodCount/+/state');
});

mqttClient.on('message', (topic, message) => {
    // console.log(`Received on ${topic}: ${message.toString()}`);
    const data = JSON.parse(message.toString());    
    // console.log(data);
    

    const payload = {
      device_id: data.device_id,
      status: data.status,
    };

    axios.post('https://coffee.rndnakawa.com/api/get_status.php', payload, {
      headers: {
        'Content-Type': 'application/json'
      },
    //   timeout: 5000
    })
    .then(response => {
      console.log('Server response:', response.data);
    })
    .catch(error => {
      if (error.response) {
        console.error('Server responded with error:', error.response.status, error.response.data);
      } else if (error.request) {
        console.error('No response received:', error.message);
      } else {
        console.error('Error setting up request:', error.message);
      }
    });


});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
