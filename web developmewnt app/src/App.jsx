import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ balance: 0, totalIncome: 0, totalExpense: 0 });

  // Form states
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState('Food');

  // Filter state
  const [filter, setFilter] = useState('all');

  // Load data on start
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const transRes = await fetch('http://localhost:5000/api/transactions');
      const transData = await transRes.json();
      setTransactions(transData);

      const summaryRes = await fetch('http://localhost:5000/api/summary');
      const summaryData = await summaryRes.json();
      setSummary(summaryData);
    } catch (error) {
      console.log('Error loading data:', error);
    }
  };

  // Add transaction
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    try {
      await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          amount: Number(amount),
          type,
          category
        })
      });

      // Reset inputs & reload data
      setTitle('');
      setAmount('');
      loadData();
    } catch (error) {
      console.log('Error adding transaction:', error);
      alert('Network error: Unable to connect to backend server at http://localhost:5000');
    }
  };

  // Delete transaction
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/transactions/${id}`, {
        method: 'DELETE'
      });
      loadData();
    } catch (error) {
      console.log('Error deleting transaction:', error);
      alert('Network error: Unable to connect to backend server at http://localhost:5000');
    }
  };

  // Filter transactions
  const visibleTransactions = transactions.filter((t) => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  return (
    <div className="container">
      <h1>Personal Expense Tracker</h1>

      {/* Summary Cards */}
      <div className="summary-row">
        <div className="card">
          <p>Balance</p>
          <h2>${summary.balance}</h2>
        </div>
        <div className="card income">
          <p>Total Income</p>
          <h2>${summary.totalIncome}</h2>
        </div>
        <div className="card expense">
          <p>Total Expenses</p>
          <h2>${summary.totalExpense}</h2>
        </div>
      </div>

      {/* 2-Column Dashboard */}
      <div className="dashboard">
        {/* Form */}
        <div className="box">
          <h3>Add Transaction</h3>
          <form onSubmit={handleSubmit}>
            <label>Title</label>
            <input
              type="text"
              placeholder="e.g. Salary, Rent"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <label>Amount ($)</label>
            <input
              type="number"
              placeholder="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <label>Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>

            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Food">Food</option>
              <option value="Salary">Salary</option>
              <option value="Bills">Bills</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Other">Other</option>
            </select>

            <button type="submit">Submit</button>
          </form>
        </div>

        {/* Transaction List */}
        <div className="box">
          <h3>Transactions</h3>

          {/* Filter Buttons */}
          <div className="filter-row">
            <button
              className={filter === 'all' ? 'active-filter' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button
              className={filter === 'income' ? 'active-filter' : ''}
              onClick={() => setFilter('income')}
            >
              Income
            </button>
            <button
              className={filter === 'expense' ? 'active-filter' : ''}
              onClick={() => setFilter('expense')}
            >
              Expenses
            </button>
          </div>

          {/* Items */}
          <ul className="list">
            {visibleTransactions.map((item) => (
              <li key={item.id} className={`list-item ${item.type}`}>
                <div>
                  <strong>{item.title}</strong>
                  <p className="subtext">{item.category} • {item.date}</p>
                </div>
                <div className="item-right">
                  <span className={`amount ${item.type}`}>
                    {item.type === 'income' ? '+' : '-'}${item.amount}
                  </span>
                  <button className="del-btn" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
