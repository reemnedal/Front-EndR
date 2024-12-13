import { useEffect, useState } from "react";
import axios from "axios";

const useFetchData = (type, crud) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/${type}/${crud}`,
          { withCredentials: true }
        );
        setData(response.data.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, crud]);

  return { data, loading, error };
};

export default useFetchData;
