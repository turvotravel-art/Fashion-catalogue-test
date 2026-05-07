import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { Storefront } from './pages/Storefront';
import { AdminAuth } from './pages/AdminAuth';
import { AdminDashboard } from './pages/AdminDashboard';

export default function App() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Storefront */}
        <Route path="/" element={<Storefront />} />
        
        {/* Admin Routes */}
        <Route 
          path="/admin/login" 
          element={<AdminAuth onLogin={() => setIsAdminAuthenticated(true)} />} 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            isAdminAuthenticated ? <AdminDashboard /> : <Navigate to="/admin/login" replace />
          } 
        />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
