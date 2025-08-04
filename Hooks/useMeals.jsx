import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

const useMeals = (month) => {
  const axiosSecure = useAxios();
  const uniqueId = localStorage.getItem('uniqueId');

  return useQuery({
    queryKey: ['meals', uniqueId, month],
    enabled: !!uniqueId && !!month, // ✅ নিশ্চিত করছি দুইটা থাকলেই কেবল API call হবে
    queryFn: async () => {
      const res = await axiosSecure.get(`/meals?uniqueId=${uniqueId}&month=${month}`);
      return res.data;
    },
  });
};

export default useMeals;
