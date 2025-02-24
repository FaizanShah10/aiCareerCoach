import { useState } from "react";
import { toast } from "sonner";


//cb => callback function --> used for fetching the data
const useFetch = (cb: any) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<any>(null);
  const [error, setError] = useState(null);


  //function to trigger the Api call
  const fn = async (...args: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (error: any) {
      setError(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;