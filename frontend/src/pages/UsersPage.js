import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../utils/api';

const UsersPage = () => {
  const { state, setUsers } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.getUsers(state.token);
        if (response.success) {
          setUsers(response.data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    if (state.token) {
      fetchUsers();
    }
  }, [state.token, setUsers]);

  if (loading) {
    return <div data-testid="users-loading">Loading users...</div>;
  }

  return (
    <div data-testid="users-page" style={{ padding: '20px' }}>
      <h2>Users</h2>
      <table data-testid="users-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Role</th>
            <th style={{ border: '1px solid #ddd', padding: '10px', textAlign: 'left' }}>Department</th>
          </tr>
        </thead>
        <tbody>
          {state.users.map(user => (
            <tr key={user._id} data-testid={`user-row-${user._id}`}>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{user.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{user.email}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{user.role}</td>
              <td style={{ border: '1px solid #ddd', padding: '10px' }}>{user.department || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersPage;
