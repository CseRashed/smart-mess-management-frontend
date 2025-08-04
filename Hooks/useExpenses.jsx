import { useQuery } from '@tanstack/react-query';
import useAxios from './useAxios'; // 🔁 Custom axios instance with token
import useMess from './useMess'; // যদি uniqueId এখান থেকে নিতে চাও

export default function useExpenses(month) {
  const axiosSecure = useAxios(); // 🔐 Axios with Authorization header
  const uniqueId = localStorage.getItem('uniqueId'); // অথবা useMess থেকে নিতে পারো

  return useQuery({
    queryKey: ['expenses', uniqueId, month],
    enabled: !!uniqueId && !!month, // ✅ শর্ত ঠিক আছে
    queryFn: async () => {
      const res = await axiosSecure.get(`/expenses?uniqueId=${uniqueId}&month=${month}`);
      return res.data;
    },
  });
}
