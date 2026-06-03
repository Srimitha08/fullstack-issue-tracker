import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const ProfilePage = () => {
  const { state } = useAppContext();

  return (
    <div data-testid="profile-page" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>User Profile</h2>
      
      {state.authUser ? (
        <div data-testid="profile-info" style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px', border: '1px solid #ddd' }}>
          <p><strong>Name:</strong> {state.authUser.name}</p>
          <p><strong>Email:</strong> {state.authUser.email}</p>
          <p><strong>Role:</strong> {state.authUser.role}</p>
          <p><strong>Department:</strong> {state.authUser.department || 'Not specified'}</p>
          <p><strong>Status:</strong> {state.authUser.status}</p>
        </div>
      ) : (
        <div data-testid="profile-loading">Loading profile...</div>
      )}
    </div>
  );
};

export default ProfilePage;
