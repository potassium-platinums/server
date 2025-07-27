const axios = require('axios');
const mqtt = require('mqtt');

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
    mqttClient.subscribe('woodCount/+/content');
    // mqttClient.subscribe('woodCount/+/state');
});

mqttClient.on('message', (topic, message) => {
    // console.log(`Received on ${topic}: ${message.toString()}`);
    const data = JSON.parse(message.toString());    
    // console.log(data);
    

    const payload = {
      device_id: data.device_id,
      count: data.count,
      date: data.date,
      time: data.time,
      location: data.location,
    };

    axios.post('https://coffee.rndnakawa.com/api/get_content.php', payload, {
      headers: {
        'Content-Type': 'application/json'
      },
      // timeout: 5000
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


  function updateDateDisplay() {
      const date = new Date();
      const longDayName = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date);
    const graph = {
      // device_id: data.device_id,
      count: data.count,
      date: data.date,
    };
      // get data from db
    axios.post('https://coffee.rndnakawa.com/api/barGraph.php', graph, {
      headers: {
        'Content-Type': 'application/json'
      },
      // timeout: 5000
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
  }

  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0); // Next midnight
  const timeUntilMidnight = midnight.getTime() - now.getTime();

  setTimeout(() => {
    updateDateDisplay();
    setInterval(updateDateDisplay, 24*60*60*1000); //for a day
  }, timeUntilMidnight); // midnight update


});

