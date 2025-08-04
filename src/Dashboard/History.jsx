import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import useMembers from '../../Hooks/useMembers';
import useMeals from '../../Hooks/useMeals';
import usePayments from '../../Hooks/usePayment';
import useExpenses from '../../Hooks/useExpenses';
import { Helmet } from 'react-helmet-async';

export default function History() {
   useEffect(() => {
      document.title = 'History';
    }, []);
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [settlements, setSettlements] = useState([]);

  const { data: members = [] } = useMembers();
  const { data: meals = [] } = useMeals(selectedMonth);
  const { data: payments = [] } = usePayments(selectedMonth);
  const { data: expenses = [] } = useExpenses(selectedMonth);

  useEffect(() => {
    const token = localStorage.getItem('token');
fetch(`${import.meta.env.VITE_API}/settlement`, {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(data => setSettlements(data))
  .catch(err => console.error('❌ Failed to fetch settlements:', err));

  }, []);

  const getMealCount = (memberId) =>
    meals
      .filter(meal => meal.memberId === memberId && meal.date?.startsWith(selectedMonth))
      .reduce((total, meal) => total + Number(meal.meals || meal.meal || meal.mealCount || 0), 0);

  const getPaidAmount = (memberId) =>
    payments
      .filter(p => p.memberId === memberId && p.month === selectedMonth)
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

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
      .filter(e => e.date?.startsWith(selectedMonth))
      .reduce((sum, e) => sum + Number(e.amount || 0), 0);

    const mealRate = totalMeals > 0 ? totalExpenses / totalMeals : 0;

    return summaryArray
      .map(member => {
        const cost = member.meals * mealRate;
        const balance = member.paid - cost;

        return {
          ...member,
          cost: cost.toFixed(2),
          balance: balance.toFixed(2),
          mealRate: mealRate.toFixed(2),
        };
      })
      .filter(m => m.meals > 0 || m.paid > 0 || Number(m.cost) > 0); // Filter only those who have data
  };

  const summary = getSummary();
  const mealRate = summary[0]?.mealRate || 0;

  const handleSettle = async (memberId, uniqueId, email, name) => {
    const payload = {
      memberId,
      uniqueId,
      email,
      month: selectedMonth,
      settle: true,
    };

    try {
      const token = localStorage.getItem('token');

const res = await fetch(`${import.meta.env.VITE_API}/settlement`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`  // ✅ attach the token
  },
  body: JSON.stringify(payload),
});


      const data = await res.json();
      if (data.insertedId) {
        Swal.fire('Settled', `${name} marked as paid for ${selectedMonth}`, 'success');
        setSettlements(prev => [...prev, payload]);
      }
    } catch (error) {
      Swal.fire('Error', 'Settlement failed.', 'error');
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-teal-600 underline underline-offset-4 mb-4">
        📅 History Summary
      </h1>

      <div className="max-w-xs mx-auto mb-6">
        <input
          type="month"
          className="w-full px-4 py-2 border border-gray-300 rounded-md"
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
        />
      </div>

      {summary.length > 0 ? (
        <>
          <div className="max-w-xs mx-auto bg-emerald-100 border border-emerald-300 rounded-md p-4 mb-8 shadow-sm text-center text-emerald-700 font-semibold text-lg">
            Meal Rate: <span className="text-emerald-900">৳{mealRate}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg shadow-md overflow-hidden text-sm">
              <thead className="bg-teal-50 text-teal-700">
                <tr>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Meals</th>
                  <th className="py-2 px-4">Paid</th>
                  <th className="py-2 px-4">Cost</th>
                  <th className="py-2 px-4">Balance</th>
                  <th className="py-2 px-4">Action</th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {summary.map((member, idx) => {
                  const isSettled = settlements.some(
                    s => s.memberId === member.memberId && s.month === selectedMonth && s.settle === true
                  );

                  return (
                    <tr key={idx} className="hover:bg-teal-50 transition-all">
                      <td className="py-2 px-4">{member.name}</td>
                      <td className="py-2 px-4 text-center">{member.meals}</td>
                      <td className="py-2 px-4 text-center">৳{member.paid}</td>
                      <td className="py-2 px-4 text-center">৳{member.cost}</td>
                      <td
                        className={`py-2 px-4 text-center font-medium ${
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
                          ? `Get ৳${member.balance}`
                          : member.balance < 0
                          ? `Pay ৳${Math.abs(member.balance)}`
                          : 'Balanced'}
                      </td>
                      <td className="py-2 px-4 text-center">
                        {isSettled || member.meals === 0 ? (
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
        </>
      ) : (
        <p className="text-center text-gray-500 mt-8">No data found for {selectedMonth}</p>
      )}
    </div>
  );
}
