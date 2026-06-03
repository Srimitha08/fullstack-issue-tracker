import React, { createContext, useReducer, useCallback } from 'react';

export const AppContext = createContext();

const initialState = {
  authUser: null,
  token: localStorage.getItem('token') || null,
  users: [],
  projects: [],
  issues: [],
  comments: [],
  filters: {
    status: '',
    priority: '',
    severity: '',
    search: '',
    page: 1,
    limit: 10
  },
  analytics: {
    issues: null,
    projects: null,
    developers: null
  }
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_AUTH_USER':
      return { ...state, authUser: action.payload };
    
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    
    case 'SET_USERS':
      return { ...state, users: action.payload };
    
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    
    case 'ADD_PROJECT':
      return { ...state, projects: [action.payload, ...state.projects] };
    
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => p._id === action.payload._id ? action.payload : p)
      };
    
    case 'DELETE_PROJECT':
      return { ...state, projects: state.projects.filter(p => p._id !== action.payload) };
    
    case 'SET_ISSUES':
      return { ...state, issues: action.payload };
    
    case 'ADD_ISSUE':
      return { ...state, issues: [action.payload, ...state.issues] };
    
    case 'UPDATE_ISSUE':
      return {
        ...state,
        issues: state.issues.map(i => i._id === action.payload._id ? action.payload : i)
      };
    
    case 'DELETE_ISSUE':
      return { ...state, issues: state.issues.filter(i => i._id !== action.payload) };
    
    case 'SET_COMMENTS':
      return { ...state, comments: action.payload };
    
    case 'ADD_COMMENT':
      return { ...state, comments: [action.payload, ...state.comments] };
    
    case 'DELETE_COMMENT':
      return { ...state, comments: state.comments.filter(c => c._id !== action.payload) };
    
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    
    case 'SET_ANALYTICS':
      return { ...state, analytics: action.payload };
    
    case 'LOGOUT':
      localStorage.removeItem('token');
      return {
        ...initialState,
        token: null
      };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const setAuthUser = useCallback((user) => {
    dispatch({ type: 'SET_AUTH_USER', payload: user });
  }, []);

  const setToken = useCallback((token) => {
    localStorage.setItem('token', token);
    dispatch({ type: 'SET_TOKEN', payload: token });
  }, []);

  const setUsers = useCallback((users) => {
    dispatch({ type: 'SET_USERS', payload: users });
  }, []);

  const setProjects = useCallback((projects) => {
    dispatch({ type: 'SET_PROJECTS', payload: projects });
  }, []);

  const addProject = useCallback((project) => {
    dispatch({ type: 'ADD_PROJECT', payload: project });
  }, []);

  const updateProject = useCallback((project) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: project });
  }, []);

  const deleteProject = useCallback((id) => {
    dispatch({ type: 'DELETE_PROJECT', payload: id });
  }, []);

  const setIssues = useCallback((issues) => {
    dispatch({ type: 'SET_ISSUES', payload: issues });
  }, []);

  const addIssue = useCallback((issue) => {
    dispatch({ type: 'ADD_ISSUE', payload: issue });
  }, []);

  const updateIssue = useCallback((issue) => {
    dispatch({ type: 'UPDATE_ISSUE', payload: issue });
  }, []);

  const deleteIssue = useCallback((id) => {
    dispatch({ type: 'DELETE_ISSUE', payload: id });
  }, []);

  const setComments = useCallback((comments) => {
    dispatch({ type: 'SET_COMMENTS', payload: comments });
  }, []);

  const addComment = useCallback((comment) => {
    dispatch({ type: 'ADD_COMMENT', payload: comment });
  }, []);

  const deleteComment = useCallback((id) => {
    dispatch({ type: 'DELETE_COMMENT', payload: id });
  }, []);

  const setFilters = useCallback((filters) => {
    dispatch({ type: 'SET_FILTERS', payload: filters });
  }, []);

  const setAnalytics = useCallback((analytics) => {
    dispatch({ type: 'SET_ANALYTICS', payload: analytics });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' });
  }, []);

  const value = {
    state,
    setAuthUser,
    setToken,
    setUsers,
    setProjects,
    addProject,
    updateProject,
    deleteProject,
    setIssues,
    addIssue,
    updateIssue,
    deleteIssue,
    setComments,
    addComment,
    deleteComment,
    setFilters,
    setAnalytics,
    logout
  };

  // Expose app state for automated testing
  window.appState = {
    authUser: state.authUser,
    token: state.token,
    users: state.users,
    projects: state.projects,
    issues: state.issues,
    comments: state.comments,
    filters: state.filters,
    analytics: state.analytics
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = React.useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
