import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

function formatRole(role: string) {
  return role
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function AdminUsersPage() {
  await requireRole(["ADMIN"]);

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <a href="/admin/dashboard" className="text-sm font-medium text-blue-600">
            ← Admin Dashboard
          </a>

          <div className="flex flex-wrap gap-3">
            <a
              href="/admin/companies"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Manage Companies
            </a>
            <a
              href="/admin/categories"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Manage Categories
            </a>
            <a
              href="/admin/settings"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
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

        <div className="mt-6 rounded-3xl bg-slate-950 p-8 text-white">
          <p className="text-sm text-blue-200">Admin Area</p>
          <h1 className="mt-2 text-3xl font-bold">Manage Users</h1>
          <p className="mt-2 text-slate-300">
            View all admins, recruiters, and candidates registered in the system.
          </p>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">All Users</h2>

          {users.length === 0 ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-medium text-slate-900">No users found</p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center"
                >
                  <div>
                    <p className="font-semibold text-slate-900">{user.name}</p>
                    <p className="text-sm text-slate-600">{user.email}</p>
                  </div>

                  <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                    {formatRole(user.role)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}