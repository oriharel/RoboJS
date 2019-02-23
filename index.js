const express = require('express');
const gpio = require('onoff').Gpio;
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  console.log("Got a request on /");
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Robot is listening on port ${port}!`)
});


const blue = new gpio(10, "out");
const red = new gpio(9, "out");
const green = new gpio(11, "out");

const sound = new gpio(17, "in", "both", {debounceTimeout: 300});

sound.watch((err, value)=>{

  if (err) {
    console.error(`Error reading sound ${err}`);
  }
  else {
    console.log(`received sound value ${value}`);
    if (value === 1) {
      allLightsOn();
      setTimeout(allLightsOff, 5000);
    }
    else {
      allLightsOff();
    }
  }
});

console.log("sound is configured on pin 17");
const edge = sound.edge();
console.log("sound edge is "+edge);
const accessible = gpio.accessible;
console.log("gpio is accessible "+accessible);

const allLightsOff = () => {
  // console.log("turning the lights off");
  blue.writeSync(0);
  red.writeSync(0);
  green.writeSync(0);
};

const allLightsOn = () => {
  // console.log("turning the lights on");
  blue.writeSync(1);
  red.writeSync(1);
  green.writeSync(1);
};

// setTimeout(allLightsOn, 1000);

// Handle Ctrl+C exit cleanly
process.on('SIGINT', () => {
  allLightsOff();
  process.exit();
});

// allLightsOff();
