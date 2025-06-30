import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';
import 'bootstrap/dist/css/bootstrap.min.css';

const ITEMS_PER_PAGE = 10;

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'user',
    gender: '', date_of_birth: '',job:'',country:'',region:'',phone:'',is_verified:''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get('/users.php');
    setUsers(res.data);
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
    setSortConfig({ key, direction });
  };

  const sorted = [...users].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = (a[sortConfig.key] || '').toString().toLowerCase();
    const valB = (b[sortConfig.key] || '').toString().toLowerCase();
    return sortConfig.direction === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const filtered = sorted.filter((u) =>
    Object.values(u).some(val => String(val).toLowerCase().includes(search.toLowerCase()))
  );

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    await axios.post('/users_add.php', form);
    setForm({ name: '', email: '', password: '', role: 'user', gender: '', date_of_birth: '',job:'',country:'',phone:'',region:'',is_verified:'' });
    setShowModal(false);
    fetchUsers();
  };

  const handleUpdate = async (id, field, value) => {
    await axios.post('/users_update_inline.php', { id, field, value });
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this User ?')) {
      await axios.post('/users_delete.php', { id });
      fetchUsers();
    }
  };

  return (
    <div className="container mt-4">
      <h3>👥 Users Manager</h3>

      <div className="d-flex justify-content-between mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="🔍 Rechercher..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
        />
        <button className="btn btn-primary ms-2" onClick={() => setShowModal(true)}>
          ➕ Add a user
        </button>
      </div>
    <div className="table-responsive">
      <table className="table table-bordered">
        <thead className="table-secondary">
          <tr>
            {['name', 'email', 'role', 'gender', 'date_of_birth','job','country'].map((col) => (
              <th key={col} onClick={() => handleSort(col)} style={{ cursor: 'pointer' }}>
                {col} {sortConfig.key === col && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
              </th>
            ))}
            <th>🗑</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((u) => (
            <tr key={u.id}>
              {['name', 'email', 'role', 'gender', 'date_of_birth','job','country'].map((field) => (
                <td key={field}>
                  <EditableCell
                    initial={u[field] || ''}
                    onSave={(value) => handleUpdate(u.id, field, value)}
                  />
                </td>
              ))}
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(u.id)}>X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {/* Pagination */}
      <nav>
        <ul className="pagination justify-content-center">
          {[...Array(pageCount)].map((_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Modal Bootstrap */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <form className="modal-content" onSubmit={handleAdd}>
              <div className="modal-header">
                <h5 className="modal-title">➕ Mew User</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-2">
                  {[
                    { name: 'name', label: 'Nom',type:'text' },
                    { name: 'email', label: 'Email',type:'email' },
                    { name: 'password', label: 'Mot de passe',type:'password' },
                    { name: 'date_of_birth', label: 'Date of Birth', type: 'date' },
                    { name: 'job', label: 'Job',type:'text' },
                    { name: 'region', label: 'Region',type:'text' },
                    { name: 'phone', label: 'Phone (No country Code)',type:'number' },
                  ].map(({ name, label, type }) => (
                    <div className="col-md-6" key={name}>
                      <label className="form-label">{label}</label>
                      <input
                        className="form-control"
                        name={name}
                        value={form[name]}
                        onChange={handleChange}
                        type={type || 'text'}
                        required
                      />
                    </div>
                  ))}
                  <div className="col-md-6">
                    <label className="form-label">Genre</label>
                    <select className="form-select" name="gender" value={form.gender} onChange={handleChange} required>
                      <option value="">Choose</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Country</label>
                    <select className="form-select" name="country" value={form.country} onChange={handleChange} required>
                      
                      <option value="Burundi">Burundi</option>
                      <option value="DRC">DRC</option>
                      <option value="Rwanda">Rwanda</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Role</label>
                    <select className="form-select" name="role" value={form.role} onChange={handleChange} required>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Is Verified</label>
                    <select className="form-select" name="role" value={form.is_verified} onChange={handleChange} required>
                      <option value="1">Yes</option>
                      <option value="0">No</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-success">Add</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const EditableCell = ({ initial, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initial);

 return editing ? (
  <input
    className="form-control"
    value={value}
    autoFocus
    onChange={(e) => setValue(e.target.value)}
    onBlur={() => {
      setEditing(false);
      if (value !== initial) onSave(value);
    }}
  />
) : (
  <div
    onClick={() => setEditing(true)}
    style={{ cursor: 'pointer', minHeight: '24px', padding: '2px', backgroundColor: '#fdfdfd' }}
  >
    {value || <span style={{ color: '#ccc' }}>—</span>}
  </div>
);

};

export default UserAdmin;
