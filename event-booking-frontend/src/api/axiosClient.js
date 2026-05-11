/**
 * Custom fetch wrapper to replace fetchGraphQL
 */
export const fetchGraphQL = async (query, variables = {}) => {
  const currentUser = localStorage.getItem('currentUser');
  let token = '';
  
  if (currentUser) {
    try {
      const u = JSON.parse(currentUser);
      if (u.token) token = u.token;
    } catch (e) {
      console.error('Error parsing current user from localStorage', e);
    }
  }

  const response = await fetch(import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();
  
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }
  
  return result.data;
};
