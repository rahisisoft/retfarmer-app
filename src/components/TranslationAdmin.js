import React, { useEffect, useState } from 'react';
import axios from '../utils/axiosInstance';

const ITEMS_PER_PAGE = 10;

const TranslationAdmin = () => {
  const [translations, setTranslations] = useState([]);
  const [form, setForm] = useState({ key_name: '', language_code: '', value: '', context: '' });
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [langFilter, setLangFilter] = useState('');
  const [contextFilter, setContextFilter] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    const res = await axios.get('fetch_trans.php');
    setTranslations(res.data);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    await axios.post('add_trans.php', form,{
  headers: { 'Content-Type': 'multipart/form-data' }, // ou même ne pas mettre du tout
});
    setForm({ key_name: '', language_code: '', value: '', context: '' });
    fetchTranslations();
  };

  const handleUpdate = async (id, value) => {
    await axios.post('edit_trans.php', { id, value },{
  headers: { 'Content-Type': 'multipart/form-data' }, // ou même ne pas mettre du tout
});
    fetchTranslations();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Confirmer la suppression ?')) {
      await axios.post('del_trans.php', { id },{
  headers: { 'Content-Type': 'multipart/form-data' }, // ou même ne pas mettre du tout
});
      fetchTranslations();
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sorted = [...translations].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const valA = a[sortConfig.key]?.toString().toLowerCase() || '';
    const valB = b[sortConfig.key]?.toString().toLowerCase() || '';
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
    return 0;
  });

  const filtered = sorted.filter((tr) => {
    const matchSearch = Object.values(tr).some((val) =>
      String(val).toLowerCase().includes(search.toLowerCase())
    );
    const matchLang = langFilter ? tr.lang_code === langFilter : true;
    const matchContext = contextFilter
      ? (tr.context || '').toLowerCase() === contextFilter.toLowerCase()
      : true;

    return matchSearch && matchLang && matchContext;
  });

  const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const uniqueLanguages = [...new Set(translations.map((tr) => tr.lang_code))];
  const uniqueContexts = [...new Set(translations.map((tr) => tr.context || '—'))];

  return (
    <div className="container mt-4">
      <h3>🌐 Admin des traductions</h3>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleAdd} className="row g-2 mb-4">
        {['key_name', 'language_code', 'value', 'context'].map((field) => (
          <div className="col-md-3" key={field}>
            <input
              className="form-control"
              placeholder={field}
              name={field}
              value={form[field]}
              onChange={handleChange}
              required={field !== 'context'}
            />
          </div>
        ))}
        <div className="col-md-12">
          <button type="submit" className="btn btn-primary">➕ Ajouter</button>
        </div>
      </form>

      {/* Filtres */}
      <div className="row mb-3">
        <div className="col-md-4 mb-2">
          <input
            type="text"
            placeholder="🔍 Rechercher..."
            className="form-control"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={langFilter}
            onChange={(e) => {
              setLangFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">🌍 Toutes les langues</option>
            {uniqueLanguages.map((lang) => (
              <option key={lang} value={lang}>{lang.toUpperCase()}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4 mb-2">
          <select
            className="form-select"
            value={contextFilter}
            onChange={(e) => {
              setContextFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">📚 Tous les contextes</option>
            {uniqueContexts.map((ctx, idx) => (
              <option key={idx} value={ctx}>
                {ctx}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tableau */}
      <div className="table-responsive">
      <table className="table table-bordered">
        <thead className="table-secondary">
          <tr>
            {['key_name', 'lang_code', 'value', 'context'].map((col) => (
              <th key={col} onClick={() => handleSort(col)} style={{ cursor: 'pointer' }}>
                {col} {sortConfig.key === col && (sortConfig.direction === 'asc' ? '🔼' : '🔽')}
              </th>
            ))}
            <th>🗑</th>
          </tr>
        </thead>
        <tbody>
          {paginated.map((tr) => (
            <tr key={tr.id}>
              <td>{tr.key_name}</td>
              <td>{tr.lang_code}</td>
              <td>
                <EditableCell
                  initial={tr.value}
                  onSave={(newValue) => handleUpdate(tr.id, newValue)}
                />
              </td>
              <td>{tr.context || '—'}</td>
              <td>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(tr.id)}>X</button>
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
              <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

const EditableCell = ({ initial, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(initial);

  return editing ? (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onBlur={() => {
        setEditing(false);
        if (value !== initial) onSave(value);
      }}
      autoFocus
      className="form-control"
    />
  ) : (
    <div onClick={() => setEditing(true)} style={{ cursor: 'pointer' }}>{value}</div>
  );
};

export default TranslationAdmin;
