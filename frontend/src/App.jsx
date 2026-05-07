import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import CatalogPage from './pages/CatalogPage'
import PetDetailPage from './pages/PetDetailPage'
import AdminPage from './pages/AdminPage'
import ProfilePage from './pages/ProfilePage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'

import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/pet/:id" element={<PetDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </Router>
  )
}

export default App
