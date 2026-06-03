import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const Navigation = () => {
  const { state, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!state.token) {
    return null;
  }

  return (
    <nav data-testid="navigation" style={{ backgroundColor: '#f0f0f0', padding: '10px', marginBottom: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link to="/dashboard" style={{ marginRight: '15px' }} data-testid="nav-dashboard">Dashboard</Link>
          {(state.authUser?.role === 'admin' || state.authUser?.role === 'manager') && (
            <>
              <Link to="/users" style={{ marginRight: '15px' }} data-testid="nav-users">Users</Link>
              <Link to="/projects" style={{ marginRight: '15px' }} data-testid="nav-projects">Projects</Link>
            </>
          )}
          <Link to="/issues" style={{ marginRight: '15px' }} data-testid="nav-issues">Issues</Link>
          <Link to="/profile" style={{ marginRight: '15px' }} data-testid="nav-profile">Profile</Link>
        </div>
        <div>
          <span style={{ marginRight: '15px' }}>{state.authUser?.name} ({state.authUser?.role})</span>
          <button onClick={handleLogout} data-testid="nav-logout">Logout</button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
