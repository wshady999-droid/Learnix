import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, type Role } from '@/context/AuthContext';

const homeFor = (role: Role) => `/${role}`;

export default function ProtectedRoute({ allow }: { allow: Role }) {
  const { session, profile, loading, signOut } = useAuth();
  const inactive = !!profile && profile.status !== 'active';

  useEffect(() => {
    if (inactive) signOut();
  }, [inactive]);

  if (loading || (session && !profile)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </div>
    );
  }
  if (!session) return <Navigate to="/login" replace />;
  if (inactive) return <Navigate to="/login" replace />;
  if (profile && profile.role !== allow) return <Navigate to={homeFor(profile.role)} replace />;
  return <Outlet />;
}
