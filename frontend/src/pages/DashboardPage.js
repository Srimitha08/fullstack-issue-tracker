import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../utils/api';

const DashboardPage = () => {
  const { state, setAnalytics } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const issuesRes = await api.getIssueAnalytics(state.token);
        const projectsRes = await api.getProjectAnalytics(state.token);
        
        setAnalytics({
          issues: issuesRes.data,
          projects: projectsRes.data,
          developers: null
        });
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    if (state.token) {
      fetchAnalytics();
    }
  }, [state.token, setAnalytics]);

  if (loading) {
    return <div data-testid="dashboard-loading">Loading dashboard...</div>;
  }

  return (
    <div data-testid="dashboard-page" style={{ padding: '20px' }}>
      <h2>Dashboard</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '30px' }}>
        <div data-testid="dashboard-total-issues" style={{ padding: '20px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <h3>Total Issues</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{state.analytics.issues?.totalIssues || 0}</p>
        </div>
        <div data-testid="dashboard-open-issues" style={{ padding: '20px', backgroundColor: '#fff3cd', borderRadius: '5px' }}>
          <h3>Open Issues</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{state.analytics.issues?.openIssues || 0}</p>
        </div>
        <div data-testid="dashboard-resolved-issues" style={{ padding: '20px', backgroundColor: '#d4edda', borderRadius: '5px' }}>
          <h3>Resolved Issues</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{state.analytics.issues?.resolvedIssues || 0}</p>
        </div>
        <div data-testid="dashboard-active-projects" style={{ padding: '20px', backgroundColor: '#cfe2ff', borderRadius: '5px' }}>
          <h3>Active Projects</h3>
          <p style={{ fontSize: '24px', fontWeight: 'bold' }}>{state.analytics.projects?.activeProjects || 0}</p>
        </div>
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h3>Issue Status Breakdown</h3>
        <ul data-testid="dashboard-issue-stats">
          <li>Open: {state.analytics.issues?.openIssues || 0}</li>
          <li>In Progress: {state.analytics.issues?.inProgressIssues || 0}</li>
          <li>Testing: {state.analytics.issues?.testingIssues || 0}</li>
          <li>Resolved: {state.analytics.issues?.resolvedIssues || 0}</li>
          <li>Closed: {state.analytics.issues?.closedIssues || 0}</li>
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
