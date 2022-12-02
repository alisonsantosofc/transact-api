const express = require('express');
const { v4: uuid } = require('uuid');

const app = express();

const customers = [];

app.use(express.json());

app.post('/account', (req, res) => {
  const { name, cpf } = req.body;

  const customerAlreadyExists = customers.some((customer) => customer.cpf === cpf);

  if (!customerAlreadyExists) {
    const account = {
      id: uuid(),
      name,
      cpf,
      statement: [],
    };

    customers.push(account);

    return res.status(201).json({ message: 'Created account successfully :)' });
  } else {
    return res
      .status(400)
      .json({ error: 'There is already an account registered with this CPF :(' });
  }
});

app.listen(3333, () => {
  console.log('Server started successfully on http://localhost:3333');
});
