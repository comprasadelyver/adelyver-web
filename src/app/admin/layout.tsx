import AdminGuard from "../__components/AdminGuard";
import AuthGuard from "../__components/AuthGuard";
import Navbar from "../__components/Navbar";
import AdminNavbarLinks from "./AdminNavbarLinks";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <AdminGuard>
        <Navbar>
          <AdminNavbarLinks />
        </Navbar>
        {children}
      </AdminGuard>
    </AuthGuard>
  );
}
