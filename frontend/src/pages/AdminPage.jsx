import React, { useState, useEffect } from 'react';
import { getPets, deletePet, createPet, updatePet, getCategories } from '../services/catalogApi';
import { 
  Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Dialog, DialogActions, 
  DialogContent, DialogTitle, TextField, Select, MenuItem, 
  InputLabel, FormControl, IconButton, Chip 
} from '@mui/material';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PetsIcon from '@mui/icons-material/Pets';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PeopleIcon from '@mui/icons-material/People';
import ReceiptIcon from '@mui/icons-material/Receipt';
import StarIcon from '@mui/icons-material/Star';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import StoreIcon from '@mui/icons-material/Store';
import { Link, useNavigate } from 'react-router-dom';
import './AdminPage.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#a855f7',
    },
    background: {
      paper: 'rgba(30, 41, 59, 0.6)',
      default: 'transparent'
    }
  },
  typography: {
    fontFamily: '"Outfit", "Inter", sans-serif',
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(16px)',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        }
      }
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 600,
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        },
        body: {
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          backgroundImage: 'none',
        }
      }
    }
  }
});

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [pets, setPets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const navigate = useNavigate();
  
  const initialFormState = {
    name: '', breed: '', type: 'DOG', ageYears: 1, 
    priceCents: 1000, description: '', photoUrl: '', categoryId: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const cats = await getCategories();
      setCategories(cats);
      const p = await getPets({ limit: 100 });
      setPets(p.data || []);
    } catch (error) {
      console.error('Error loading data', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await deletePet(id);
        loadData();
      } catch (err) {
        alert('Failed to delete pet');
      }
    }
  };

  const handleOpenDialog = (pet = null) => {
    if (pet) {
      setEditingPet(pet);
      setFormData({
        name: pet.name,
        breed: pet.breed,
        type: pet.type ? pet.type.toUpperCase() : 'DOG',
        ageYears: pet.ageYears,
        priceCents: pet.priceCents || Math.round((pet.priceUsd || 0) * 100),
        description: pet.description || '',
        photoUrl: pet.photoUrl || '',
        categoryId: pet.categoryId || categories[0]?.id || ''
      });
    } else {
      setEditingPet(null);
      setFormData({ ...initialFormState, categoryId: categories[0]?.id || '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...formData,
        ageYears: formData.ageYears === '' ? null : Number(formData.ageYears),
        priceCents: formData.priceCents === '' ? null : Number(formData.priceCents)
      };

      if (!payload.name || !payload.breed || !payload.type || !payload.categoryId) {
        alert("Please fill in all required fields.");
        return;
      }

      if (editingPet) {
        await updatePet(editingPet.id, payload);
      } else {
        await createPet(payload);
      }
      handleCloseDialog();
      loadData();
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || error.response?.data?.error || error.message;
      alert('Failed to save pet: ' + msg);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon /> },
    { id: 'pets', label: 'Pet Management', icon: <PetsIcon /> },
    { id: 'adoptions', label: 'Adoption Requests', icon: <AssignmentIcon /> },
    { id: 'users', label: 'Users', icon: <PeopleIcon /> },
    { id: 'orders', label: 'Orders / Transactions', icon: <ReceiptIcon /> },
    { id: 'reviews', label: 'Reviews', icon: <StarIcon /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon /> },
  ];

  // Mock data for other tabs
  const mockAdoptions = [
    { id: 1, user: 'John Doe', email: 'john@example.com', pet: 'Buddy (Dog)', status: 'Pending', date: '2023-11-05' },
    { id: 2, user: 'Jane Smith', email: 'jane@example.com', pet: 'Luna (Cat)', status: 'Approved', date: '2023-11-02' },
  ];

  const renderDashboard = () => (
    <div className="admin-dashboard">
      <div className="stat-cards-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper blue"><PetsIcon /></div>
          <div className="stat-info">
            <h3>Total Pets</h3>
            <p className="stat-value">{pets.length || 24}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper green"><AssignmentIcon /></div>
          <div className="stat-info">
            <h3>Available / Adopted</h3>
            <p className="stat-value">{(pets.filter(p => p.availability === 'Available').length) || 18} / 6</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper purple"><PeopleIcon /></div>
          <div className="stat-info">
            <h3>Total Users</h3>
            <p className="stat-value">1,204</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon-wrapper orange"><ReceiptIcon /></div>
          <div className="stat-info">
            <h3>Pending Requests</h3>
            <p className="stat-value">8</p>
          </div>
        </div>
      </div>
      
      <div className="recent-activity-section">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-dot green"></span>
            <div className="activity-text">
              <p><strong>Jane Smith</strong> adopted <strong>Luna</strong></p>
              <span className="activity-time">2 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-dot blue"></span>
            <div className="activity-text">
              <p>New pet <strong>Max (Dog)</strong> added to catalog</p>
              <span className="activity-time">5 hours ago</span>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-dot orange"></span>
            <div className="activity-text">
              <p><strong>Mike Johnson</strong> submitted an adoption application</p>
              <span className="activity-time">1 day ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPetManagement = () => (
    <div className="admin-table-container">
      <div className="table-header-actions">
        <h3>Manage Pets</h3>
        <Button variant="contained" color="primary" onClick={() => handleOpenDialog()} sx={{ borderRadius: '8px', fontWeight: 600 }}>
          + Add New Pet
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Photo</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell><strong>Breed</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Price</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pets.map((pet) => (
              <TableRow key={pet.id} hover>
                <TableCell>
                  <img src={pet.photoUrl || 'https://via.placeholder.com/50'} alt={pet.name} className="admin-pet-thumb" />
                </TableCell>
                <TableCell>{pet.name}</TableCell>
                <TableCell>{pet.type}</TableCell>
                <TableCell>{pet.breed}</TableCell>
                <TableCell>
                  <Chip 
                    label={pet.availability || 'Available'} 
                    color={pet.availability === 'Adopted' ? 'default' : 'success'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>${((pet.priceUsd || pet.priceCents / 100) || 0).toFixed(2)}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleOpenDialog(pet)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(pet.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {pets.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center" style={{ padding: '40px' }}>No pets available.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  const renderAdoptions = () => (
    <div className="admin-table-container">
      <h3>Adoption Requests</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Applicant</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Pet Applied For</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell align="right"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {mockAdoptions.map((req) => (
              <TableRow key={req.id} hover>
                <TableCell>{req.user}</TableCell>
                <TableCell>{req.email}</TableCell>
                <TableCell>{req.pet}</TableCell>
                <TableCell>{req.date}</TableCell>
                <TableCell>
                  <Chip 
                    label={req.status} 
                    color={req.status === 'Approved' ? 'success' : req.status === 'Rejected' ? 'error' : 'warning'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell align="right">
                  <Button size="small" variant="outlined" color="primary" style={{ marginRight: 8 }}>View</Button>
                  {req.status === 'Pending' && (
                    <>
                      <Button size="small" variant="contained" color="success" style={{ marginRight: 8 }}>Approve</Button>
                      <Button size="small" variant="contained" color="error">Reject</Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

  const renderPlaceholder = (title) => (
    <div className="admin-placeholder">
      <div className="placeholder-content">
        <h2>{title}</h2>
        <p>This module is currently under development. Data will be integrated soon.</p>
      </div>
    </div>
  );

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="admin-layout">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <div className="admin-brand">
            <span className="brand-icon">🐾</span>
            <h2>PetStore Admin</h2>
          </div>
          <nav className="admin-nav">
            {menuItems.map(item => (
              <button 
                key={item.id} 
                className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="admin-main">
          {/* Topbar */}
          <header className="admin-topbar">
            <div className="topbar-title">
              <h1>{menuItems.find(i => i.id === activeTab)?.label}</h1>
            </div>
            <div className="topbar-actions">
              <Button 
                startIcon={<StoreIcon />} 
                onClick={() => navigate('/')}
                className="topbar-btn"
                sx={{ color: '#cbd5e1' }}
              >
                Storefront
              </Button>
              <div className="admin-profile">
                <img src="https://ui-avatars.com/api/?name=Admin+User&background=a855f7&color=fff" alt="Admin" className="admin-avatar" />
                <div className="admin-info">
                  <span className="admin-name">Admin User</span>
                  <span className="admin-role">Super Admin</span>
                </div>
              </div>
              <IconButton color="error" title="Logout" onClick={() => navigate('/')}>
                <LogoutIcon />
              </IconButton>
            </div>
          </header>

          {/* Content Wrapper */}
          <div className="admin-content">
            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'pets' && renderPetManagement()}
            {activeTab === 'adoptions' && renderAdoptions()}
            {activeTab === 'users' && renderPlaceholder('User Management')}
            {activeTab === 'orders' && renderPlaceholder('Orders & Transactions')}
            {activeTab === 'reviews' && renderPlaceholder('Customer Reviews')}
            {activeTab === 'settings' && renderPlaceholder('Store Settings')}
          </div>
        </main>

        {/* Pet Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle>{editingPet ? 'Edit Pet' : 'Add New Pet'}</DialogTitle>
          <DialogContent dividers>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', padding: '10px 0' }}>
              <TextField label="Name" name="name" value={formData.name} onChange={handleChange} fullWidth required />
              <TextField label="Breed" name="breed" value={formData.breed} onChange={handleChange} fullWidth required />
              
              <FormControl fullWidth required>
                <InputLabel>Type</InputLabel>
                <Select name="type" value={formData.type} onChange={handleChange} label="Type">
                  <MenuItem value="DOG">Dog</MenuItem>
                  <MenuItem value="CAT">Cat</MenuItem>
                  <MenuItem value="BIRD">Bird</MenuItem>
                  <MenuItem value="FISH">Fish</MenuItem>
                </Select>
              </FormControl>
              
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select name="categoryId" value={formData.categoryId} onChange={handleChange} label="Category">
                  {categories.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField label="Age (Years)" name="ageYears" type="number" value={formData.ageYears} onChange={handleChange} fullWidth required />
              <TextField label="Price (Cents)" name="priceCents" type="number" value={formData.priceCents} onChange={handleChange} fullWidth required helperText="e.g. 1500 for $15.00" />
              
              <TextField label="Photo URL (Leave empty for default)" name="photoUrl" value={formData.photoUrl} onChange={handleChange} fullWidth style={{ gridColumn: 'span 2' }} />
              <TextField label="Description" name="description" value={formData.description} onChange={handleChange} fullWidth multiline rows={3} style={{ gridColumn: 'span 2' }} />
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="inherit">Cancel</Button>
            <Button onClick={handleSubmit} variant="contained" color="primary">Save Pet</Button>
          </DialogActions>
        </Dialog>
      </div>
    </ThemeProvider>
  );
}
