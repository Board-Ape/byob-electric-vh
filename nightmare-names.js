const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });

const fs = require('fs');

nightmare
  .goto('https://www.deloitteprivate.co.nz/fast50/2017-fast-50/2017-fast-50/')
  .wait(3000)
  .evaluate(() => {
    const techCompanies = document.querySelectorAll('tr')

    const companyInfo = [];

    for (let i = 1; i < 31; i++) {
      let companyName = techCompanies[i].querySelectorAll('td')[1].innerText;
      let revenueGrowth = techCompanies[i].querySelectorAll('td')[2].innerText;
      let location = techCompanies[i].querySelectorAll('td')[3].innerText;
      let industry = techCompanies[i].querySelectorAll('td')[4].innerText;
      
      companyInfo.push({ companyName, revenueGrowth, location, industry });
    }

    return companyInfo;
  })
  // after duration period
  .end()
  .then(function (result) {
    const output = JSON.stringify(result, null, 2)

    fs.writeFile('./company-names.json', output, 'utf8', (err) => {
      if (err) {
        return console.log(err);
      }
    })
    console.log('File saved.');
  })
  .catch(function (error) {
    console.error('Search failed:', error);
  });
