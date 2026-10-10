const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory transactions array
let transactions = [
  { id: '1', title: 'Salary', amount: 1200, type: 'income', category: 'Salary', date: '2026-10-01' },
  { id: '2', title: 'Groceries', amount: 150, type: 'expense', category: 'Food', date: '2026-10-03' }
];

// 1. Get all transactions
app.get('/api/transactions', (req, res) => {
  res.json(transactions);
});

// 2. Get financial summary
app.get('/api/summary', (req, res) => {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((t) => {
    if (t.type === 'income') {
      totalIncome += Number(t.amount);
    } else {
      totalExpense += Number(t.amount);
    }
  });

  const balance = totalIncome - totalExpense;
  res.json({ totalIncome, totalExpense, balance });
});

// 3. Add a new transaction
app.post('/api/transactions', (req, res) => {
  const { title, amount, type, category } = req.body;

  if (!title || !amount || !type || !category) {
    return res.status(400).json({ error: 'Please provide all fields' });
  }

  const newTransaction = {
    id: Date.now().toString(),
    title,
    amount: Number(amount),
    type,
    category,
    date: new Date().toISOString().split('T')[0]
  };

  transactions.push(newTransaction);
  res.status(201).json(newTransaction);
});

// 4. Delete a transaction
app.delete('/api/transactions/:id', (req, res) => {
  transactions = transactions.filter((t) => t.id !== req.params.id);
  res.json({ message: 'Deleted successfully' });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});

