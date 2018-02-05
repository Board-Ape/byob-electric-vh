const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });
const fs = require('fs');

nightmare
  .goto('https://developer.nrel.gov/api/alt-fuel-stations/v1.json?api_key=DEMO_KEY&fuel_type=ELEC&state=CO')
  .wait(3000)
  .evaluate(() => {
    const electric = document.querySelectorAll('#kvov1')
    const fuelStations = [];

    for(let i = 0; i < electric.length; i++) {
      let stations = electric[i].innerHTML
      fuelStations.push({stations})
    }
    return fuelStations
  })
  .end()
  .then(function (result) {
    const output = JSON.stringify(result, null, 2)

    fs.writeFile('./fuel-stations.json', output, 'utf8', (error) => {
      if (error) {
        return console.log(error);
      }
    })
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });
