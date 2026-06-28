import { getSession } from "@/lib/auth";

export default async function PublicHeader() {
  const session = await getSession();

  let dashboardHref = "/login";
  let dashboardLabel = "Login";

  if (session?.role === "ADMIN") {
    dashboardHref = "/admin/dashboard";
    dashboardLabel = "Admin Dashboard";
  }

  if (session?.role === "RECRUITER") {
    dashboardHref = "/recruiter/dashboard";
    dashboardLabel = "Recruiter Dashboard";
  }

  if (session?.role === "CANDIDATE") {
    dashboardHref = "/candidate/dashboard";
    dashboardLabel = "My Dashboard";
  }

  return (
    <header className="border-b border-purple-500/20 bg-slate-950 px-6 py-5 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-lg font-black shadow-lg shadow-purple-600/30">
            CC
          </div>

          <div>
            <p className="text-xl font-bold leading-none">Career Craft</p>
            <p className="mt-1 text-xs text-purple-200">Job Board</p>
          </div>
        </a>

        <nav className="flex items-center gap-4 text-sm font-semibold">
          <a href="/jobs" className="text-slate-200 hover:text-purple-300">
            Find Jobs
          </a>

          {session ? (
            <>
              <span className="hidden text-purple-300 md:inline">
                Welcome, {session.name}
              </span>

              <a
                href={dashboardHref}
                className="rounded-xl bg-purple-600 px-5 py-3 text-white shadow-lg shadow-purple-600/30 hover:bg-purple-700"
              >
                {dashboardLabel}
              </a>

              <a href="/logout" className="text-slate-200 hover:text-red-300">
                Logout
              </a>
            </>
          ) : (
            <>
              <a href="/login" className="text-slate-200 hover:text-purple-300">
                Login
              </a>

              <a
                href="/register"
                className="rounded-xl bg-purple-600 px-5 py-3 text-white shadow-lg shadow-purple-600/30 hover:bg-purple-700"
              >
                Get Started
              </a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}