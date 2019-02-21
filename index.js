const gpio = require('onoff').Gpio;


const blue = new gpio(10, "out");
const red = new gpio(9, "out");
const green = new gpio(11, "out");

const sleep = (howLong) => {
  return new Promise((resolve) => {
    setTimeout(resolve, howLong)
  })
};


const runLights = async () => {
  while (true) {
    // Red
    red.writeSync(1)
    await sleep(3000)

    // Red and Blue
    blue.writeSync(1)
    await sleep(1000)
    //
    // Green
    red.writeSync(0)
    blue.writeSync(0)
    green.writeSync(1)
    await sleep(5000)
    //
    // Blue
    green.writeSync(0)
    blue.writeSync(1)
    await sleep(2000)
    //
    // Blue off
    blue.writeSync(0)
  }
};

const allLightsOff = () => {
  blue.writeSync(0)
  red.writeSync(0)
  green.writeSync(0)
};

// Handle Ctrl+C exit cleanly
process.on('SIGINT', () => {
  allLightsOff();
  process.exit();
});

allLightsOff();
runLights();
