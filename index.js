const gpio = require('onoff').Gpio;


const blue = new gpio(10, "out");
const red = new gpio(9, "out");
const green = new gpio(11, "out");

const sound = new gpio(26, "in", "both");

sound.watch((err, value)=>{

  if (err) {
    console.error(`Error reading sound ${err}`);
  }
  else {
    console.log(`received sound value ${value}`);
    if (value === 1) {
      allLightsOn();
    }
    else {
      allLightsOff();
    }
  }

})

// const sleep = (howLong) => {
//   return new Promise((resolve) => {
//     setTimeout(resolve, howLong)
//   })
// };


// const runLights = async () => {
//   while (true) {
//     // Red
//     red.writeSync(1)
//     await sleep(3000)
//
//     // Red and Blue
//     blue.writeSync(1)
//     await sleep(1000)
//     //
//     // Green
//     red.writeSync(0)
//     blue.writeSync(0)
//     green.writeSync(1)
//     await sleep(5000)
//     //
//     // Blue
//     green.writeSync(0)
//     blue.writeSync(1)
//     await sleep(2000)
//     //
//     // Blue off
//     blue.writeSync(0)
//   }
// };

const allLightsOff = () => {
  blue.writeSync(0)
  red.writeSync(0)
  green.writeSync(0)
};

const allLightsOn = () => {
  blue.writeSync(1)
  red.writeSync(1)
  green.writeSync(1)
};

// Handle Ctrl+C exit cleanly
process.on('SIGINT', () => {
  allLightsOff();
  process.exit();
});

allLightsOff();
// runLights();
