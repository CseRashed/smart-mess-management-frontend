import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useMembers from '../../Hooks/useMembers';
import useMeals from '../../Hooks/useMeals';
import usePayments from '../../Hooks/usePayment';
import useExpenses from '../../Hooks/useExpenses';
import useAxios from '../../Hooks/useAxios';
import Loader from '../compontens/Loader'; // ✅ Loader import
import { Helmet } from 'react-helmet-async';

export default function Summary() {
  useEffect(() => {
    document.title = 'Summary';
  }, []);

  const month = new Date().toISOString().slice(0, 7); // "YYYY-MM"

  const { data: members = [], isLoading: loadingMembers } = useMembers();
  const { data: meals = [], isLoading: loadingMeals } = useMeals(month);
  const { data: payments = [], isLoading: loadingPayments } = usePayments(month);
  const { data: expenses = [], isLoading: loadingExpenses } = useExpenses(month);

  const loading = loadingMembers || loadingMeals || loadingPayments || loadingExpenses; // ✅ Loading check

  const [settlements, setSettlements] = useState([]);
  const [messClosedShown, setMessClosedShown] = useState(false);
  const axiosSecure = useAxios();
  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const fetchSettlements = async () => {
      try {
        const res = await axiosSecure.get('/settlement');
        const data = res.data;
        if (Array.isArray(data)) setSettlements(data);
        else if (Array.isArray(data.settlements)) setSettlements(data.settlements);
        else setSettlements([]);
      } catch (error) {
        console.error('❌ Settlement fetch failed:', error);
        setSettlements([]);
      }
    };
    fetchSettlements();
  }, [axiosSecure]);

  const getMealCount = (memberId) =>
    meals
      .filter(meal => meal.memberId === memberId && meal.date.startsWith(currentMonth))
      .reduce((total, meal) => total + Number(meal.meals || 0), 0);

  const getPaidAmount = (memberId) =>
    payments.find(payment => payment.memberId === memberId)?.amount || 0;

  const getSummary = () => {
    const summaryArray = members.map(member => {
      const mealsCount = getMealCount(member._id);
      const paidAmount = getPaidAmount(member._id);
      return {
        name: member.name,
        memberId: member._id,
        uniqueId: member.uniqueId,
        email: member.email,
        meals: mealsCount,
        paid: paidAmount,
      };
    });

    const totalMeals = summaryArray.reduce((sum, m) => sum + m.meals, 0);
    const totalExpenses = expenses
      .filter(e => e.date.startsWith(currentMonth))
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const mealRate = totalMeals > 0 ? totalExpenses / totalMeals : 0;

    return summaryArray.map(member => {
      const cost = member.meals * mealRate;
      const balance = member.paid - cost;
      return {
        ...member,
        cost: cost.toFixed(2),
        balance: balance.toFixed(2),
        mealRate: mealRate.toFixed(2),
      };
    });
  };

  const summary = getSummary();
  const mealRate = summary[0]?.mealRate || 0;

  useEffect(() => {
    if (!members.length || !summary.length || !settlements.length) return;

    const allSettled = summary.every(member => {
      const isSettled = settlements.some(
        s => s.memberId === member.memberId && s.month === currentMonth && s.settle === true
      );
      return Number(member.balance) === 0 && isSettled;
    });

    if (allSettled && !messClosedShown) {
      Swal.fire({
        icon: 'success',
        title: '🎉 Hurray!',
        text: 'Manager, your mill is permanently closed!',
      });
      setMessClosedShown(true);
    }
  }, [summary, settlements, members, currentMonth, messClosedShown]);

  const handleSettle = async (memberId, uniqueId, email, name) => {
    const payload = { memberId, uniqueId, email, month: currentMonth, settle: true };
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API}/settlement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.insertedId) {
        Swal.fire('Settled', `${name} marked as paid for ${currentMonth}`, 'success');
        setSettlements(prev => [...prev, payload]);
      }
    } catch (error) {
      Swal.fire('Error', 'Settlement failed.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader /> {/* ✅ Fullscreen loader */}
      </div>
    );
  }

  return (
    <>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-emerald-600 underline underline-offset-4 mb-4">
          💰 Payment Summary
        </h1>

        <div className="max-w-xs mx-auto bg-emerald-100 border border-emerald-300 rounded-md p-4 mb-8 shadow-sm text-center text-emerald-700 font-semibold text-lg">
          Current Meal Rate: <span className="text-emerald-900">৳{mealRate}</span> per meal
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden text-sm">
            <thead className="bg-emerald-100 text-emerald-700">
              <tr>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Meals</th>
                <th className="py-3 px-4">Paid (৳)</th>
                <th className="py-3 px-4">Cost (৳)</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {summary.map((member, idx) => {
                const isSettled = settlements.some(
                  s => s.memberId === member.memberId && s.month === currentMonth && s.settle === true
                );

                return (
                  <tr key={idx} className="hover:bg-emerald-50 transition-all">
                    <td className="py-3 px-4 font-semibold">{member.name}</td>
                    <td className="py-3 px-4 text-center">{member.meals}</td>
                    <td className="py-3 px-4 text-center">৳{member.paid}</td>
                    <td className="py-3 px-4 text-center">৳{member.cost}</td>
                    <td
                      className={`py-3 px-4 text-center font-medium ${
                        isSettled
                          ? 'text-blue-600'
                          : member.balance > 0
                          ? 'text-green-600'
                          : member.balance < 0
                          ? 'text-red-500'
                          : ''
                      }`}
                    >
                      {isSettled
                        ? 'Paid'
                        : member.balance > 0
                        ? `৳${member.balance} (Get)`
                        : member.balance < 0
                        ? `৳${Math.abs(member.balance)} (Pay)`
                        : 'Balanced'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isSettled ? (
                        <button
                          className="text-sm bg-gray-300 text-gray-600 px-3 py-1 rounded cursor-not-allowed"
                          disabled
                        >
                          Settled
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleSettle(member.memberId, member.uniqueId, member.email, member.name)
                          }
                          className="text-sm bg-emerald-500 text-white px-3 py-1 rounded hover:bg-emerald-600 transition"
                        >
                          Settle
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
