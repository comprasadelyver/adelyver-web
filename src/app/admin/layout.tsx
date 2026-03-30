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
    <main className="md:max-w-xl md:mx-auto w-full grid grow">
      <AuthGuard>
        <AdminGuard>
          <div className="min-h-dvh flex flex-col">
            <Navbar>
              <AdminNavbarLinks />
            </Navbar>
            {children}
          </div>
        </AdminGuard>
      </AuthGuard>
    </main>
  );
}
