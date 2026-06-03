const API_BASE_URL = 'http://localhost:5000/api';

const api = {
  // Auth APIs
  register: (data) => fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  login: (data) => fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  getCurrentUser: (token) => fetch(`${API_BASE_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  // User APIs
  getUsers: (token) => fetch(`${API_BASE_URL}/users`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  // Project APIs
  getProjects: (token, query = '') => fetch(`${API_BASE_URL}/projects${query}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  getProjectById: (id, token) => fetch(`${API_BASE_URL}/projects/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  createProject: (data, token) => fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  updateProject: (id, data, token) => fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  deleteProject: (id, token) => fetch(`${API_BASE_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  // Issue APIs
  getIssues: (token, query = '') => fetch(`${API_BASE_URL}/issues${query}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  getIssueById: (id, token) => fetch(`${API_BASE_URL}/issues/${id}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  createIssue: (data, token) => fetch(`${API_BASE_URL}/issues`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  updateIssue: (id, data, token) => fetch(`${API_BASE_URL}/issues/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  deleteIssue: (id, token) => fetch(`${API_BASE_URL}/issues/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  assignIssue: (id, data, token) => fetch(`${API_BASE_URL}/issues/${id}/assign`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  updateIssueStatus: (id, data, token) => fetch(`${API_BASE_URL}/issues/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  // Comment APIs
  getCommentsByIssue: (issueId, token) => fetch(`${API_BASE_URL}/comments/${issueId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  createComment: (data, token) => fetch(`${API_BASE_URL}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data)
  }).then(res => res.json()),

  deleteComment: (id, token) => fetch(`${API_BASE_URL}/comments/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  // Analytics APIs
  getIssueAnalytics: (token) => fetch(`${API_BASE_URL}/analytics/issues`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  getProjectAnalytics: (token) => fetch(`${API_BASE_URL}/analytics/projects`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json()),

  getDeveloperAnalytics: (token) => fetch(`${API_BASE_URL}/analytics/developers`, {
    headers: { 'Authorization': `Bearer ${token}` }
  }).then(res => res.json())
};

export default api;
