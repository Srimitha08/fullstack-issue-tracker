import React, { useEffect, useState } from 'react';
import { useAppContext } from '../context/AppContext';
import api from '../utils/api';

const ProjectsPage = () => {
  const { state, setProjects, addProject } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.getProjects(state.token);
        if (response.success) {
          setProjects(response.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    if (state.token) {
      fetchProjects();
    }
  }, [state.token, setProjects]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const response = await api.createProject(formData, state.token);
      if (response.success) {
        addProject(response.data);
        setFormData({ title: '', description: '' });
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  if (loading) {
    return <div data-testid="projects-loading">Loading projects...</div>;
  }

  return (
    <div data-testid="projects-page" style={{ padding: '20px' }}>
      <h2>Projects</h2>
      
      {(state.authUser?.role === 'admin' || state.authUser?.role === 'manager') && (
        <>
          <button
            onClick={() => setShowForm(!showForm)}
            data-testid="projects-create-btn"
            style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
          >
            {showForm ? 'Cancel' : 'Create Project'}
          </button>

          {showForm && (
            <form onSubmit={handleCreateProject} data-testid="projects-create-form" style={{ marginBottom: '20px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
              <div style={{ marginBottom: '10px' }}>
                <label>Title:</label>
                <input
                  type="text"
                  data-testid="projects-form-title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label>Description:</label>
                <textarea
                  data-testid="projects-form-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                />
              </div>
              <button
                type="submit"
                data-testid="projects-form-submit"
                style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
              >
                Create
              </button>
            </form>
          )}
        </>
      )}

      <div data-testid="projects-list">
        {state.projects.map(project => (
          <div
            key={project._id}
            data-testid={`project-card-${project._id}`}
            style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '5px', marginBottom: '15px', border: '1px solid #ddd' }}
          >
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <p><strong>Status:</strong> {project.status}</p>
            <p><strong>Owner:</strong> {project.owner?.name}</p>
            <p><strong>Members:</strong> {project.members?.length || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
