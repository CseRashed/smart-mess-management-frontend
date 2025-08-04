import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";
import useMess from "./useMess";

const useMembers = () => {
  const axiosPublic = useAxios(); // 🔐 এখন এই axios এ token থাকবে
  const { mess, isLoading: messLoading } = useMess();
  const uniqueId = mess?.uniqueId;

  const {
    data = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['members', uniqueId],
    enabled: !!uniqueId && !messLoading,
    queryFn: async () => {
      const res = await axiosPublic.get(`/members?uniqueId=${uniqueId}`);
      return res.data;
    },
  });

  return { data, isLoading, isError, error, refetch };
};

export default useMembers;
