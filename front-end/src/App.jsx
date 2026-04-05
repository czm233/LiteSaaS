import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import { AuthGuard, GuestGuard } from './router';

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  return (
    <div>
      <h1>首页</h1>
      <p>欢迎, {user.name || user.username}</p>
    </div>
  );
}

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
        path="/"
        element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
