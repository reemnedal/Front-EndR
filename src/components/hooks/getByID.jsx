import { useState, useEffect } from "react";
import axios from "axios";

const useFetchDataById = (type, path, id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/${type}/${path}/${id}`,
          { withCredentials: true }
        );
        setData(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, path, id]);

  return { data, loading, error };
};

export default useFetchDataById;
