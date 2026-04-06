import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/dashboard';
import Tenants from './pages/tenants';
import Organizations from './pages/organizations';
import Users from './pages/users';
import Roles from './pages/roles';
import Permissions from './pages/permissions';
import Dicts from './pages/dicts';
import { AuthGuard, GuestGuard } from './router';

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestGuard>
            <Login />
          </GuestGuard>
        }
      />
      <Route
        element={
          <AuthGuard>
            <MainLayout />
          </AuthGuard>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="tenants" element={<Tenants />} />
        <Route path="organizations" element={<Organizations />} />
        <Route path="users" element={<Users />} />
        <Route path="roles" element={<Roles />} />
        <Route path="permissions" element={<Permissions />} />
        <Route path="dicts" element={<Dicts />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
