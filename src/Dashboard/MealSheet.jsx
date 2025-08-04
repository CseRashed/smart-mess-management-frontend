import React, { useEffect } from 'react';
import useMembers from '../../Hooks/useMembers';
import useMeals from '../../Hooks/useMeals';
import { Helmet } from 'react-helmet-async';

export default function MealSheet() {
   useEffect(() => {
      document.title = 'Meal Sheet';
    }, []);
  const month = new Date().toISOString().slice(0, 7); // "2025-07" ফরম্যাট

  const { data: members = [], isLoading: memberLoading } = useMembers();
  const { data: meals = [], isLoading: mealLoading } = useMeals(month);

  if (memberLoading || mealLoading) return <p className="text-center mt-10">Loading...</p>;

  const memberMap = Object.fromEntries(members.map(m => [m._id, m.name]));

  const dates = [...new Set(meals.map(entry => entry.date))].sort();
  const memberIds = members.map(m => m._id);

  // দিনের ভিত্তিতে meal data group করা
  const groupedMeals = {};
  dates.forEach(date => {
    groupedMeals[date] = {};
    meals.forEach(entry => {
      if (entry.date === date) {
        groupedMeals[date][entry.memberId] = entry.meals;
      }
    });
  });

  // মোট মিল বের করা
  const totals = {};
  meals.forEach(entry => {
    if (!totals[entry.memberId]) totals[entry.memberId] = 0;
    totals[entry.memberId] += entry.meals;
  });

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl md:text-3xl font-bold text-center text-emerald-600 underline underline-offset-4 mb-6">
        🍽️ Meal Sheet
      </h1>

      <div className="border border-gray-300 rounded-lg shadow bg-white">
        {/* Overflow-x-auto wrapper for horizontal scroll on small devices */}
        <div className="overflow-x-auto max-h-[500px]">
          <table className="min-w-max table-auto w-full border-collapse text-sm">
            <thead className="bg-emerald-100 text-emerald-700">
              <tr>
                <th className="sticky text-center left-0 z-10 bg-emerald-100 py-2 min-w-[120px] border-r">
                  Date
                </th>
                {memberIds.map(id => (
                  <th key={id} className="px-4 py-2 text-center border-r whitespace-nowrap">
                    <div className="relative">
                      <span>{memberMap[id]}</span>
                      <span className="absolute -top-3 right-0 text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                        {totals[id] || 0}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {dates.map(date => (
                <tr key={date} className="hover:bg-emerald-50">
                  <td className="sticky left-0 bg-white text-center py-2 font-medium border-r min-w-[120px] z-10">
                    {date}
                  </td>
                  {memberIds.map(id => (
                    <td key={id} className="px-4 py-2 text-center border-r">
                      {groupedMeals[date][id] ?? '—'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-center text-xs text-gray-500 mt-2 italic">
        Scroll left-right to see all members ↔️
      </p>
    </div>
  );
}
