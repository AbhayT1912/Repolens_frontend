import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div style={{ margin: 0, padding: 0, width: '100vw', minHeight: '100vh', overflow: 'hidden' }}>
      <Outlet />
    </div>
  );
}