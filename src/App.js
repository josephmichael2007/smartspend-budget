import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem('budget_data');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Sample Salary', amount: 5000, type: 'income', date: '2 Jul' },
      { id: 2, title: 'Sample Groceries', amount: 450, type: 'expense', date: '2 Jul' }
    ];
  });

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');

  useEffect(() => {
    localStorage.setItem('budget_data', JSON.stringify(transactions));
  }, [transactions]);

  const income = transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
  const expenses = transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expenses;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !amount) return;

    const newTransaction = {
      id: Date.now(),
      title: title.trim(),
      amount: parseFloat(amount),
      type,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    };

    setTransactions([newTransaction, ...transactions]);
    setTitle('');
    setAmount('');
  };

  const handleDelete = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
  };

  return (
    <div className="App">
      <nav className="navbar">
        <h1>SmartSpend</h1>
        <span className="tagline">React.js Budget Tracker</span>
      </nav>
      <main className="container">
        <section className="metrics-grid">
          <div className="card balance-card"><h3>Net Balance</h3><p>₹{balance.toFixed(2)}</p></div>
          <div className="card income-card"><h3>Total Income</h3><p>+ ₹{income.toFixed(2)}</p></div>
          <div className="card expense-card"><h3>Expenditures</h3><p>- ₹{expenses.toFixed(2)}</p></div>
        </section>
        <div className="workspace-grid">
          <section className="panel">
            <h2>Add New Transaction</h2>
            <form onSubmit={handleSubmit} className="transaction-form">
              <div className="input-group"><label>Description</label><input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Internet bill" /></div>
              <div className="input-group"><label>Amount (₹)</label><input type="number" required min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" /></div>
              <div className="input-group"><label>Type</label><select value={type} onChange={(e) => setType(e.target.value)}><option value="expense">Expense (-)</option><option value="income">Income (+)</option></select></div>
              <button type="submit" className="submit-btn">Save Transaction</button>
            </form>
          </section>
          <section className="panel">
            <h2>Transaction History</h2>
            <div className="history-list">
              {transactions.map(t => (
                <div key={t.id} className={`history-item ${t.type}`}>
                  <div><span className="item-title">{t.title}</span><span className="item-date">{t.date}</span></div>
                  <div className="item-right">
                    <span className="item-amount">{t.type === 'income' ? '+' : '-'} ₹{t.amount.toFixed(2)}</span>
                    <button type="button" onClick={() => handleDelete(t.id)} className="delete-btn">&times;</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default App;