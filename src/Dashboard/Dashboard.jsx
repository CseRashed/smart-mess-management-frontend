import React, { useEffect } from 'react';
import { FaUserFriends, FaUtensils, FaMoneyCheckAlt, FaChartPie } from 'react-icons/fa';
import useMembers from '../../Hooks/useMembers';
import useMeals from '../../Hooks/useMeals';
import useExpenses from '../../Hooks/useExpenses';
import usePayments from '../../Hooks/usePayment';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Helmet } from 'react-helmet-async';

const DashboardCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-lg p-5 shadow hover:shadow-lg transition">
    <div className="flex items-center space-x-4">
      {icon}
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <h3 className="text-xl font-bold text-gray-800">{value}</h3>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
   useEffect(() => {
      document.title = 'Dashboard';
    }, []);
    const month = new Date().toISOString().slice(0, 7); // "2025-07" ফরম্যাট

  const { data: members = [], isLoading: membersLoading, isError: membersError, error: membersErrorMsg } = useMembers();
  const { data: meals = [], isLoading: loadingMeals, isError: errorMeals, error: errorMealsMsg } = useMeals(month);
  const { data: expenses = [], isLoading: loadingExpenses, isError: errorExpenses, error: errorExpensesMsg } = useExpenses(month);
  const { data: payments = [], isLoading: loadingPayments, isError: errorPayments, error: errorPaymentsMsg } = usePayments(month);

  if (membersLoading || loadingMeals || loadingExpenses || loadingPayments) return <p className="text-center mt-10">Loading...</p>;
  if (membersError) return <p className="text-red-600 text-center mt-10">Error loading members: {membersErrorMsg.message}</p>;
  if (errorMeals) return <p className="text-red-600 text-center mt-10">Error loading meals: {errorMealsMsg.message}</p>;
  if (errorExpenses) return <p className="text-red-600 text-center mt-10">Error loading expenses: {errorExpensesMsg.message}</p>;
  if (errorPayments) return <p className="text-red-600 text-center mt-10">Error loading payments: {errorPaymentsMsg.message}</p>;

  const memberCount = members.length;
  const totalMeals = meals.reduce((sum, meal) => sum + Number(meal.meals || 0), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + Number(exp.amount || 0), 0);
  const totalPayments = payments.reduce((sum, pay) => sum + Number(pay.amount || 0), 0);
  const mealRate = totalMeals > 0 ? (totalExpenses / totalMeals).toFixed(2) : 0;

  const expenseByDate = {};
  expenses.forEach(exp => {
    const date = exp.date;
    expenseByDate[date] = (expenseByDate[date] || 0) + Number(exp.amount || 0);
  });

  const mealByDate = {};
  meals.forEach(meal => {
    const date = meal.date;
    mealByDate[date] = (mealByDate[date] || 0) + Number(meal.meals || 0);
  });

  const sortedDates = Array.from(new Set([...Object.keys(expenseByDate), ...Object.keys(mealByDate)])).sort();

  const mealChartData = sortedDates.map(date => ({
    date,
    Meals: mealByDate[date] || 0,
  }));

  const expenseChartData = sortedDates.map(date => ({
    date,
    Expenses: expenseByDate[date] || 0,
  }));

  return (
    <div className="flex-1 flex flex-col">
      <div className="md:hidden flex items-center justify-between bg-white p-4 shadow z-10">
        <h2 className="text-xl font-bold text-emerald-600">Dashboard</h2>
      </div>

      <main className="p-6 mt-4 md:mt-0">
        <div className="hidden md:flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <p className="text-sm text-gray-600">Welcome, <span className="font-semibold">Manager</span></p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
  <div className="col-span-1">
    <DashboardCard icon={<FaUserFriends className="text-3xl text-blue-500" />} label="Members" value={memberCount} />
  </div>
  <div className="col-span-1">
    <DashboardCard icon={<FaUtensils className="text-3xl text-orange-400" />} label="Total Meals" value={totalMeals} />
  </div>
  <div className="col-span-1">
    <DashboardCard icon={<FaMoneyCheckAlt className="text-3xl text-green-500" />} label="Payment" value={`৳ ${totalPayments}`} />
  </div>
  <div className="col-span-1">
    <DashboardCard icon={<FaMoneyCheckAlt className="text-3xl text-green-500" />} label="Expenses" value={`৳ ${totalExpenses}`} />
  </div>
  <div className="col-span-1">
    <DashboardCard icon={<FaChartPie className="text-3xl text-purple-500" />} label="Meal Rate" value={mealRate === 0 ? mealRate : `৳ ${mealRate}`} />
  </div>
</div>


        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-orange-100 hover:shadow-orange-200 transition">
            <h2 className="text-lg font-semibold text-orange-600 mb-4 text-center">🍽️ Meals Over Time</h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={mealChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="Meals" stroke="#F97316" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-sky-100 hover:shadow-sky-200 transition">
            <h2 className="text-lg font-semibold text-sky-600 mb-4 text-center">💸 Expenses Over Time</h2>
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={expenseChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `৳ ${value}`} />
                <Legend />
                <Line type="monotone" dataKey="Expenses" stroke="#0EA5E9" strokeWidth={3} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
}
