
import { useState, useEffect } from 'react';
import { fetchAPI } from '../lib/api';

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAPI('/list-courses')
      .then(data => setCourses(data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading, error };
}
