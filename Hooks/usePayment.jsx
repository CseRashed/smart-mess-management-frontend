import { useQuery } from '@tanstack/react-query';
import useAxios from './useAxios';

export default function usePayments(month) {
  const axiosSecure = useAxios(); // 🔐 Token automatically attach হবে
  const uniqueId = localStorage.getItem('uniqueId');

  const fetchPayments = async () => {
    const res = await axiosSecure.get(`/payments?uniqueId=${uniqueId}&month=${month}`);
    return res.data;
  };

  return useQuery({
    queryKey: ['payments', uniqueId, month],
    queryFn: fetchPayments,
    enabled: !!uniqueId && !!month, // ✅ token interceptor এর ভেতর handled
  });
}
