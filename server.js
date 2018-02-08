const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];

const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.locals.title = 'Companies-Backend';

const requireHTTPS = (request, response, next) => {
  if (request.headers['x-forwarded-proto'] !== 'https') {
    return response.redirect('https://' + request.get('host') + request.url);
  }
  next();
};

app.set('secretKey', 'lysergic');

const checkAuthorization = (request, response, next) => {
  let token = request.headers.authorization ||
              request.body.token ||
              request.query.token;

  if (!token) {
    return response.status(403).json(
      { error: `You must be authorized to hit this endpoint`}
    );
  }
  jwt.verify(token, app.get('secretKey'), (error, decoded) => {
    if (error) {
      return response.status(403).json({ error: `Token is invalid ${error}` });
    }
    return decoded.admin === true
      ? next()
      : response.status(403).json({ error: `Need authorization ${error}` });
  });
};

app.post('/api/v1/authenticate', (request, response) => {
  let user;
  let token;
  let verify;
  const { email, appName } = request.body;

  if (!email || !appName) {
    return response.status(422).json(
      { error: `You are missing email, application name, or both.` }
    );
  }

  verify = email.endsWith('@turing.io');
  token = jwt.sign(request.body, app.get('secretKey'));

  if (verify) {
    user = Object.assign({}, request.body, { admin: true, token });
  } else {
    user = Object.assign({}, request.body, { admin: false, token });
  }
  return response.status(201).json({ user });
});

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

// company_id in Postman does not populate, does the frontend user side create that?
app.post('/api/v1/branches', (request, response) => {
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

app.get('/api/v1/companies/', (request, response) => {
  const { industry } = request.query;

  if (!industry) {
    return response.status(422).json({error: 'Please input an industry query parameter that exists'});
  }

  database('topcompanies').where('industry', industry).select()
    .then(companyName => {
      if (companyName[0]) {
        return response.status(200).json({ companyName: companyName[0] });;
      } else {
        return response.status(404).json({ error: `No companyName with industry of ${industry} was found.`})
      }
    })
    .catch(error => {
      return response.status(500).json({ error });
    })
});

app.patch('/api/v1/companies/:id', (request, response) => {
  database('topcompanies')
    .where({id: request.params.id})
    .update(request.body, '')
    .then(update => {
      if (!update) {
        return response.sendStatus(404).json({error: 'Could not update company'});
      } else {
        response.sendStatus(204);
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

app.patch('/api/v1/branches/:id', (request, response) => {
  database('branches')
    .where({company_id: request.params.id})
    .update(request.body, '')
    .then(update => {
      if (!update) {
        return response.sendStatus(404).json({error: 'Could not update branch'});
      } else {
        response.sendStatus(204);
      }
    })
    .catch(error => {
      response.status(500).json({ error });
    });
});

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

app.delete('/api/v1/branches/:id', (request, response) => {
  const {id} = request.params;
  database('branches').where({id}).del()
    .then(branch => {
      if (!branch) {
        response.status(422).json({error: 'This Branch does not exist'});
      } else {
        response.sendStatus(204);
      }
    })
    .catch(error => response.status(500).json({ error }));
});


app.delete('/api/v1/companies/:id', (request, response) => {
  const {id} = request.params;
  database('topcompanies').where({id}).del()
    .then(companies => {
      if (!companies) {
        response.status(422).json({error: 'This Branch does not exist'});
      } else {
        response.sendStatus(204);
      }
    })
    .catch(error => response.status(500).json({ error }));
});

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get("port")}.`)
});

module.exports = app;
