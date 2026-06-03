import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../utils/api';

const IssuesPage = () => {
  const { state, setIssues, addIssue } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    projectId: '',
    priority: 'medium',
    severity: 'medium',
    dueDate: ''
  });

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await api.getIssues(state.token);
        if (response.success) {
          setIssues(response.data);
        }
      } catch (error) {
        console.error('Error fetching issues:', error);
      } finally {
        setLoading(false);
      }
    };

    if (state.token) {
      fetchIssues();
    }
  }, [state.token, setIssues]);

  const handleCreateIssue = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createIssue(formData, state.token);
      if (response.success) {
        addIssue(response.data);
        setFormData({
          title: '',
          description: '',
          projectId: '',
          priority: 'medium',
          severity: 'medium',
          dueDate: ''
        });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating issue:', error);
    }
  };

  if (loading) {
    return <div data-testid="issues-loading">Loading issues...</div>;
  }

  return (
    <div data-testid="issues-page" style={{ padding: '20px' }}>
      <h2>Issues</h2>

      <button
        onClick={() => setShowForm(!showForm)}
        data-testid="issues-create-btn"
        style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
      >
        {showForm ? 'Cancel' : 'Create Issue'}
      </button>

      {showForm && (
        <form onSubmit={handleCreateIssue} data-testid="issues-create-form" style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
          <div style={{ marginBottom: '10px' }}>
            <label>Title:</label>
            <input
              type="text"
              data-testid="issues-form-title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Description:</label>
            <textarea
              data-testid="issues-form-description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Project:</label>
            <select
              data-testid="issues-form-project"
              value={formData.projectId}
              onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="">Select Project</option>
              {state.projects.map(project => (
                <option key={project._id} value={project._id}>
                  {project.title}
                </option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '10px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label>Priority:</label>
              <select
                data-testid="issues-form-priority"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
            <div>
              <label>Severity:</label>
              <select
                data-testid="issues-form-severity"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            data-testid="issues-form-submit"
            style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            Create
          </button>
        </form>
      )}

      <div data-testid="issues-list">
        {state.issues.map(issue => (
          <div
            key={issue._id}
            data-testid={`issue-card-${issue._id}`}
            style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px', marginBottom: '15px', border: '1px solid #ddd' }}
          >
            <h3>{issue.title}</h3>
            <p>{issue.description}</p>
            <p><strong>Status:</strong> {issue.status}</p>
            <p><strong>Priority:</strong> {issue.priority}</p>
            <p><strong>Severity:</strong> {issue.severity}</p>
            <p><strong>Assigned To:</strong> {issue.assignedTo?.name || 'Unassigned'}</p>
            <p><strong>Reported By:</strong> {issue.reportedBy?.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IssuesPage;
