import { useQuery } from '@tanstack/react-query';
import useAxios from './useAxios'; // ✅ custom axios hook
import { useEffect, useState } from 'react';

function useMess() {
  const axiosSecure = useAxios(); // ✅ Token attach করা axios instance
  const [uniqueId, setUniqueId] = useState(null);

  // Prevent SSR warning (React hydration mismatch issue) when using localStorage
  useEffect(() => {
    const id = localStorage.getItem('uniqueId');
    setUniqueId(id);
  }, []);

  const { data: mess, isLoading, error } = useQuery({
    queryKey: ['mess', uniqueId],
    enabled: !!uniqueId,
    queryFn: async () => {
      const res = await axiosSecure.get(`/api/mess?id=${uniqueId}`);
      return res.data;
    },
  });

  return { mess, isLoading, error };
}

export default useMess;
