import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    dueDate: '',
  });

  const [editingTaskId, setEditingTaskId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const token = localStorage.getItem('token');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/tasks?status=${statusFilter}&page=${page}`,
        { headers: { Authorization: token } }
      );
      setTasks(res.data.tasks);
    } catch (err) {
      console.error('Error fetching tasks:', err.message);
      toast.error('Failed to load tasks');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, page]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTaskId) {
        await axios.put(`http://localhost:5000/api/tasks/${editingTaskId}`, formData, {
          headers: { Authorization: token },
        });
        toast.success('Task updated!');
      } else {
        await axios.post(`http://localhost:5000/api/tasks`, formData, {
          headers: { Authorization: token },
        });
        toast.success('Task added!');
      }

      setFormData({ title: '', description: '', status: 'pending', dueDate: '' });
      setEditingTaskId(null);
      fetchTasks();
    } catch (err) {
      console.error('Error submitting task:', err.message);
      toast.error('Failed to submit task');
    }
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description,
      status: task.status,
      dueDate: task.dueDate?.split('T')[0],
    });
    setEditingTaskId(task.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: { Authorization: token },
      });
      toast.success('Task deleted');
      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err.message);
      toast.error('Failed to delete task');
    }
  };

  return (
    <div className="container mt-4">
      <button
        className="btn btn-danger float-end"
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/';
        }}
      >
        Logout
      </button>

      <h2>Task Manager</h2>

      <form onSubmit={handleSubmit} className="mb-4">
        <div className="row">
          <div className="col">
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Title"
              className="form-control"
              required
            />
          </div>
          <div className="col">
            <input
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Description"
              className="form-control"
            />
          </div>
          <div className="col">
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-control"
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="col">
            <input
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
              className="form-control"
            />
          </div>
          <div className="col">
            <button type="submit" className="btn btn-primary w-100">
              {editingTaskId ? 'Update' : 'Add'} Task
            </button>
          </div>
        </div>
      </form>

      <div className="d-flex justify-content-between mb-3">
        <select
          onChange={(e) => setStatusFilter(e.target.value)}
          className="form-select w-25"
        >
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <div>
          <button
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            className="btn btn-outline-secondary me-2"
          >
            Prev
          </button>
          <button
            onClick={() => setPage(page + 1)}
            className="btn btn-outline-secondary"
          >
            Next
          </button>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Due</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks?.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center">
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.status}</td>
                <td>{task.dueDate ? task.dueDate.split('T')[0] : ''}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(task.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
