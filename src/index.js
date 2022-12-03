const express = require('express');
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());

const customers = [];

// middlewares
function verifyIfExistsAccount(req, res, next) {
  const { cpf } = req.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return res.status(400).json({ error: 'There is no account registered with this CPF :(' });
  }

  // forward the data to the routes
  req.customer = customer;

  return next();
}

// functions
function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === 'credit') {
      return acc + operation.amount;
    } else {
      return acc - operation.amount;
    }
  }, 0);

  return balance;
}

// routes
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

app.put('/account', verifyIfExistsAccount, (req, res) => {
  const { customer } = req;
  const { name } = req.body;

  customer.name = name;

  return res.status(201).json({ message: 'Updated account successfully :)' });
});

app.get('/account', verifyIfExistsAccount, (req, res) => {
  const { customer } = req;

  return res.json(customer);
});

app.delete('/account', verifyIfExistsAccount, (req, res) => {
  const { customer } = req;

  customers.splice(customer, 1);

  return res.status(200).json({ message: 'Account deleted successfully :(' });
});

app.get('/statement', verifyIfExistsAccount, (req, res) => {
  const { customer } = req;

  return res.json({ statement: customer.statement });
});

app.get('/statement/date', verifyIfExistsAccount, (req, res) => {
  const { customer } = req;
  const { date } = req.query;

  // hack to get any time from a date
  const dateFormated = new Date(date + ' 00:00');

  const statement = customer.statement.filter(
    (operation) => operation.created_at.toDateString() === dateFormated.toDateString()
  );

  return res.json(statement);
});

app.post('/deposit', verifyIfExistsAccount, (req, res) => {
  const { customer } = req;
  const { amount, description } = req.body;

  const statementOperation = {
    amount,
    description,
    created_at: new Date(),
    type: 'credit',
  };

  customer.statement.push(statementOperation);

  return res.status(201).json({ message: 'Amount deposited successfully :)' });
});

app.post('/withdraw', verifyIfExistsAccount, (req, res) => {
  const { customer } = req;
  const { amount } = req.body;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance :(' });
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: 'debit',
  };

  customer.statement.push(statementOperation);

  return res.status(201).json({ message: 'Amount withdrawed successfully :)' });
});

app.get('/balance', verifyIfExistsAccount, (req, res) => {
  const { customer } = req;

  const balance = getBalance(customer.statement);

  return res.json({ balance });
});

app.listen(3333, () => {
  console.log('Server started successfully on http://localhost:3333');
});
