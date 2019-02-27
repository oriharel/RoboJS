const express = require('express');
const gpio = require('onoff').Gpio;
const PiGpio = require('pigpio').Gpio;
const app = express();
const port = 3000;
const MICROSECDONDS_PER_CM = 1e6/34321;


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


const leftLine = new gpio(27, "in", "both");
const rightLine = new gpio(17, "in", "both");


const motion = new gpio(22, "in", "both");

const trigger = new PiGpio(18, {mode: PiGpio.OUTPUT});
const echo = new PiGpio(24, {mode: PiGpio.INPUT, alert: true});

trigger.digitalWrite(0); // Make sure trigger is low

const watchHCSR04 = () => {
  let startTick;

  echo.on('alert', (level, tick) => {
    if (level == 1) {
      startTick = tick;
    } else {
      const endTick = tick;
      const diff = (endTick >> 0) - (startTick >> 0); // Unsigned 32 bit arithmetic
      console.log(diff / 2 / MICROSECDONDS_PER_CM);
    }
  });
};

watchHCSR04();

// Trigger a distance measurement once per second
setInterval(() => {
  trigger.trigger(10, 1); // Set trigger high for 10 microseconds
}, 1000);

const respondWithLight = (err, value, callbackOn, callbackOff)=>{
  if (err) {
    console.error(`Error reading ${err}`);
  }
  else {
    console.log(`received value ${value}`);
    if (value === 1) {
      callbackOn();
      setTimeout(callbackOff, 5000);
    }
    else {
      callbackOff();
    }
  }
};

leftLine.watch((err, value)=>{
  respondWithLight(err, value, ()=>red.writeSync(1), allLightsOff);
});

rightLine.watch((err, value)=>{
  respondWithLight(err, value, ()=>blue.writeSync(1), allLightsOff);
});


motion.watch((err, value)=>{
  respondWithLight(err, value, ()=>green.writeSync(1), allLightsOff);
});

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
