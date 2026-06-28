import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

function formatRole(role: string) {
  return role.toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function AdminUsersPage() {
  await requireRole(["ADMIN"]);

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-lg font-black text-white shadow-lg shadow-purple-600/30">
              CC
            </div>

            <div>
              <p className="text-xl font-bold leading-none text-slate-950">
                Career Craft
              </p>
              <p className="mt-1 text-xs font-semibold text-purple-700">
                Job Board
              </p>
            </div>
          </a>

          <div className="flex flex-wrap gap-3">
            <a
              href="/admin/dashboard"
              className="rounded-xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-700/20 hover:bg-purple-800"
            >
              Admin Dashboard
            </a>

            <a
              href="/admin/companies"
              className="rounded-xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-700/20 hover:bg-purple-800"
            >
              Manage Companies
            </a>

            <a
              href="/admin/categories"
              className="rounded-xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-700/20 hover:bg-purple-800"
            >
              Manage Categories
            </a>

            <a
              href="/admin/settings"
              className="rounded-xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-700/20 hover:bg-purple-800"
            >
              Platform Settings
            </a>

            <a
              href="/logout"
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Logout
            </a>
          </div>
        </div>

        <section className="mt-6 rounded-3xl bg-purple-950 p-8 text-white shadow-xl shadow-purple-950/20">
          <p className="text-sm text-purple-200">Admin Area</p>
          <h1 className="mt-2 text-3xl font-bold">Manage Users</h1>
          <p className="mt-2 max-w-2xl text-purple-100">
            View all admins, recruiters, and candidates registered in the
            platform.
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-950">All Users</h2>

            <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
              {users.length} users
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-bold text-slate-950">
                      {user.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">{user.email}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      Joined{" "}
                      {user.createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  <span className="w-fit rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
                    {formatRole(user.role)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}