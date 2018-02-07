const express = require("express");
const app = express();
const bodyParser = require('body-parser');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.locals.title = 'Companies-Backend';

app.set('port', process.env.PORT || 3000);

app.get('/', (request, response) => {
  response.send("Hello!");
});

app.get('/api/v1/companies', (request, response) => {
  database("topcompanies").select()
    .then((companies) => {
      response.status(200).json(companies);
    })
    .catch((error) => {
      response.status(500).json({ error });
    });
});

app.get('/api/v1/branches', (request, response) => {
  database('branches').select()
    .then(branches => {
      response.status(200).json(branches);
    })
    .catch(error => {
      response.status(500).json(error);
    });
});

app.post('/api/v1/companies', (request, response) => {
  const company = request.body;
  for (let requiredParameters of ["companyName", "industry", "location", "revenueGrowth"]) {
    if (!company[requiredParameters]) {
      return response.status(422).json({
        error: `You are missing a required field ${requiredParameters}`
      });
    }
  }
  database('topcompanies').insert(company, 'id')
    .then(company => {
      return response.status(201).json({ id: company[0] });
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

app.post('/api/v1/branches', (request, response) => {//need to post to specific id
  const branch = request.body;
  for (let requiredParameters of ["companyName", "employees", "location", "grossRevenue"]) {
    if (!branch[requiredParameters]) {
      return response.status(422).json({
        error: `You are missing a required field ${requiredParameters}`
      });
    }
  }
  database('branches').insert(branch, 'id')
    .then(branch => {
      return response.status(201).json({ id: branch[0] });
    })
    .catch(error => {
      return response.status(500).json({ error });
    });
});

// app.get(`/api/v1/companies?revenueGrowth=`, (request, response) => { //query parameters

// })

app.patch('/api/v1/branches/:id', (request, response) => {
  database('branches')
    .where({company_id: request.params.id})
    .update(request.body, '')
    .then(update => {
      if(!update) {
        return response.sendStatus(404).json({error: 'Could not update branch'})
      } else {
        response.sendStatus(204)
      }
    })
      .catch(error => {
        response.status(500).json({ error })
      })
})

app.get('/api/v1/branches/:id', (request, response) => {
  database('branches')
    .where({ company_id: request.params.id}).select()
    .then(branch => {
      response.status(200).json(branch);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/branches/:id', (request, response) => {
  const {id} = request.params;
  database('branches').where({id}).del()
    .then(branch => {
      if(!branch) {
        response.status(422).json({error: 'This Branch does not exist'})
      } else {
        response.sendStatus(204)
      }
    })
    .catch(error => response.status(500).json({ error }))
})

app.get('/api/v1/companies/:id', (request, response) => {
  database('topcompanies')
    .where({ id: request.params.id}).select()
    .then(branch => {
      response.status(200).json(branch);
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.delete('/api/v1/companies/:id', (request, response) => {
  const {id} = request.params;
  console.log(request)
  database('topcompanies').where({id}).del()
    .then(companies => {
      if(!companies) {
        response.status(422).json({error: 'This Branch does not exist'})
      } else {
        response.sendStatus(204)
      }
    })
    .catch(error => response.status(500).json({ error }))
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get("port")}.`)
});

module.exports = app;
