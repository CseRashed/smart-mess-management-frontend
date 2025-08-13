import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import useMembers from '../../Hooks/useMembers';
import usePayments from '../../Hooks/usePayment';
import Loader from '../compontens/Loader';

export default function IndividualAmount() {
useEffect(()=>{
  document.title='Payments'
},[])

  const month = new Date().toISOString().slice(0, 7);
  const uniqueId = localStorage.getItem('uniqueId');

  const { data: members = [], isLoading: loadingMembers, isError, error } = useMembers();
  const { data: payments = [], isLoading: loadingPayments, refetch } = usePayments(month);

  const [amounts, setAmounts] = useState({});
  const [tempAmounts, setTempAmounts] = useState({});
  const [manager, setManager] = useState({});

  const loading = loadingMembers || loadingPayments; // ✅ members বা payments load না হলে loader

  // Manager Info Load
  useEffect(() => {
    if (!members.length) return;
    const managerData = members.find(m => m.role === 'Manager');
    if (managerData) setManager(managerData);
  }, [members]);

  // Payment Data Load
  useEffect(() => {
    if (payments.length > 0) {
      const initial = {};
      payments.forEach(payment => {
        initial[payment.memberId] = payment.amount;
      });
      setAmounts(initial);
      setTempAmounts(initial);
    }
  }, [payments]);

  const handleChange = (id, value) => {
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setTempAmounts(prev => ({ ...prev, [id]: value }));
    }
  };

  const handleBlur = async (memberId, memberName, memberEmail) => {
    const previous = amounts[memberId] || '';
    const current = tempAmounts[memberId] || '';

    if (previous !== current) {
      if (!manager?.name || !manager?.email) {
        Swal.fire('Error', 'Manager information not loaded yet.', 'error');
        return;
      }

      const result = await Swal.fire({
        title: 'Confirm Update',
        text: `Change amount from ৳${previous || 0} to ৳${current || 0}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#10B981',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, update it',
        cancelButtonText: 'No, keep old'
      });

      if (result.isConfirmed) {
        setAmounts(prev => ({ ...prev, [memberId]: current }));
        await saveSinglePayment(memberId, current, memberName, memberEmail);
        Swal.fire('Updated!', 'Amount has been updated.', 'success');
      } else {
        setTempAmounts(prev => ({ ...prev, [memberId]: previous }));
      }
    }
  };

  const saveSinglePayment = async (memberId, amount, memberName, memberEmail) => {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum < 0) {
      Swal.fire('Invalid Input', 'Amount must be a positive number.', 'error');
      setTempAmounts(prev => ({ ...prev, [memberId]: amounts[memberId] || '' }));
      return;
    }

    const payload = {
      memberId,
      amount: amountNum,
      month,
      uniqueId,
      memberName,
      memberEmail,
      managerName: manager?.name,
      managerEmail: manager?.email,
    };

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify([payload]),
      });
      const data = await res.json();
      if (data.result?.modifiedCount > 0 || data.result?.upsertedCount > 0 || data.success) {
        refetch();
      } else {
        throw new Error('No document updated or inserted');
      }
    } catch (err) {
      console.error('Error saving payment:', err);
      Swal.fire('Error', 'Failed to save payment.', 'error');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <Loader />
    </div>
  );

  if (isError) return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-red-500 text-lg">Error: {error.message}</p>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
        Individual Member Amount Entry
      </h2>

      <div className="space-y-4">
        {members.map(member => (
          <div
            key={member._id}
            className="flex items-center justify-between bg-emerald-50 p-3 rounded-md shadow-sm group"
          >
            <div>
              <span className="text-gray-800 font-medium">{member.name}</span>
            </div>
            <div className="relative">
              <input
                type="number"
                placeholder="Enter amount (৳)"
                value={tempAmounts[member._id] ?? ''}
                onChange={e => handleChange(member._id, e.target.value)}
                onBlur={() => handleBlur(member._id, member.name, member.email)}
                className="border border-gray-300 rounded-md px-3 py-2 w-40 focus:outline-none focus:ring-2 focus:ring-emerald-300"
              />
              <span className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Edit
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
