import { useState } from "react";

const useFetch = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const triggerFetch = async (url: string, requestOptions?: RequestInit) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, requestOptions);
      // if (!response.ok) {
      //   throw new Error(`Error: ${response.status} - ${response.statusText}`);
      // }
      const result = await response.json();
      if(!result.success){
        setError(result.message)
        return null;
      }
      return result.data;
  } catch (err) {
      setError((err as Error).message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, triggerFetch };
};

export default useFetch;
