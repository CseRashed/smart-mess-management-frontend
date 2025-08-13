import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useMess from '../../Hooks/useMess';
import useExpenses from '../../Hooks/useExpenses';
import Loader from '../compontens/Loader';

export default function Expenses() {
  useEffect(() => {
    document.title = 'Expense';
  }, []);

  const month = new Date().toISOString().slice(0, 7); // "2025-07" format
  const { mess } = useMess();
  const { data: expenses = [], isLoading, isError, refetch, error } = useExpenses(month);

  const [expenseData, setExpenseData] = useState({
    title: '',
    amount: '',
    date: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, amount, date } = expenseData;

    if (!title || !amount || !date) {
      Swal.fire('Error', 'Please fill in all fields', 'error');
      return;
    }

    const duplicate = expenses.find(exp => exp.date === date);
    if (duplicate) {
      Swal.fire('Error', `Expense for date ${date} already exists!`, 'error');
      return;
    }

    const expense = {
      title,
      amount: parseFloat(amount),
      date,
      uniqueId: mess?.uniqueId
    };

    try {
      const token = localStorage.getItem('token');

      const res = await fetch(`${import.meta.env.VITE_API}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(expense)
      });

      const data = await res.json();

      if (data.insertedId) {
        Swal.fire('Success', 'Expense added successfully!', 'success');
        setExpenseData({ title: '', amount: '', date: '' });
        refetch();
      } else {
        Swal.fire('Error', 'Failed to add expense', 'error');
      }
    } catch {
      Swal.fire('Error', 'Failed to add expense', 'error');
    }
  };

  // Fullscreen loader for page load
  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <p className="text-red-500 text-lg text-center">Failed to load expenses{error ? `: ${error.message}` : ''}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Add Expense</h2>

      {/* Expense Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <input
          type="text"
          name="title"
          placeholder="Expense Name"
          className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
          value={expenseData.title}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount (৳)"
          className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
          value={expenseData.amount}
          onChange={handleChange}
          required
        />
        <input
          type="date"
          name="date"
          className="border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-300"
          value={expenseData.date}
          onChange={handleChange}
          min={new Date().toISOString().slice(0, 8) + '01'}
          max={new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
            .toISOString()
            .slice(0, 10)}
          required
        />

        <button
          type="submit"
          className="col-span-1 sm:col-span-3 bg-emerald-500 text-white font-semibold py-2 rounded-md hover:bg-emerald-600 transition"
        >
          Add Expense
        </button>
      </form>

      {/* Expense Table */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Expenses</h3>
        {expenses.length === 0 ? (
          <p className="text-gray-500">No expenses added yet.</p>
        ) : (
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-emerald-100">
                <th className="border border-gray-300 px-4 py-2 text-left">Title</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Amount (৳)</th>
                <th className="border border-gray-300 px-4 py-2 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {expenses
                .slice()
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((exp) => (
                  <tr key={exp._id} className="hover:bg-emerald-50">
                    <td className="border border-gray-300 px-4 py-2">{exp.title}</td>
                    <td className="border border-gray-300 px-4 py-2">৳ {exp.amount}</td>
                    <td className="border border-gray-300 px-4 py-2">{exp.date}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
