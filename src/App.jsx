import React, { useEffect, useState } from 'react';
import { getExpenses, addExpense, getTotalExpenses } from './db';

const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchExpenses = async () => {
      const expenses = await getExpenses();
      setExpenses(expenses);
      const total = await getTotalExpenses();
      setTotal(total);
    };
    fetchExpenses();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (description && amount) {
      await addExpense(description, parseFloat(amount));
      setDescription('');
      setAmount('');
      const expenses = await getExpenses();
      setExpenses(expenses);
      const total = await getTotalExpenses();
      setTotal(total);
    }
  };

  return (
    <div>
      <h1>Rastreador de Despesas Pessoais</h1>
      <form onSubmit={handleAddExpense}>
        <input
          type="text"
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="number"
          placeholder="Valor"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">💸</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>Descrição</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense[0]}>
              <td>{expense[1]}</td>
              <td>{expense[2]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Total de Despesas: R${total.toFixed(2)}</h2>
    </div>
  );
};

export default App;
