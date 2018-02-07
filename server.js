const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.locals.title = 'Companies-Backend'

app.set('port', process.env.PORT || 3000);

app.get('/', (request, response) => {
  response.send("Hello!")
});

app.get('/api/v1/companies', (request, response) => {
  database("companies").select()
    .then((companies) => {
      response.status(200).json(companies);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get("port")}.`)
});
