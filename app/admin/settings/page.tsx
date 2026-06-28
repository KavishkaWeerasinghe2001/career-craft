import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function saveSetting(formData: FormData) {
  "use server";

  await requireRole(["ADMIN"]);

  const key = formData.get("key")?.toString().trim();
  const value = formData.get("value")?.toString().trim();

  if (!key || !value) {
    return;
  }

  await prisma.platformSetting.upsert({
    where: {
      key,
    },
    update: {
      value,
    },
    create: {
      key,
      value,
    },
  });

  revalidatePath("/admin/settings");
  revalidatePath("/admin/dashboard");
}

export default async function AdminSettingsPage() {
  await requireRole(["ADMIN"]);

  const settings = await prisma.platformSetting.findMany({
    orderBy: {
      key: "asc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 text-lg font-black text-white shadow-lg shadow-purple-600/30">
              CC
            </div>

            <div>
              <p className="text-xl font-bold leading-none text-slate-950">
                Career Craft
              </p>
              <p className="mt-1 text-xs font-medium text-purple-700">
                Job Board
              </p>
            </div>
          </a>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <a
              href="/admin/dashboard"
              className="rounded-xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-700/20 hover:bg-purple-800"
            >
              Admin Dashboard
            </a>

            <a
              href="/admin/users"
              className="rounded-xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-700/20 hover:bg-purple-800"
            >
              Manage Users
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
              href="/logout"
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Logout
            </a>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-purple-950 p-8 text-white shadow-xl shadow-purple-950/20">
          <p className="text-sm text-purple-100">Admin Area</p>
          <h1 className="mt-2 text-3xl font-bold">Platform Settings</h1>
          <p className="mt-2 max-w-2xl text-purple-50">
            Create and update platform settings used across the system.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Save Setting</h2>

            <form action={saveSetting} className="mt-5 space-y-4">
              <input
                name="key"
                required
                placeholder="Setting key, example: site_name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

              <input
                name="value"
                required
                placeholder="Setting value"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-purple-700/20 hover:bg-purple-800"
              >
                Save Setting
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-slate-950">
                Current Settings
              </h2>

              <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
                {settings.length} settings
              </span>
            </div>

            {settings.length === 0 ? (
              <div className="mt-5 rounded-xl border border-purple-100 bg-purple-50 p-5">
                <p className="font-semibold text-slate-950">
                  No settings saved yet
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Add your first platform setting using the form.
                </p>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                {settings.map((setting) => (
                  <div
                    key={setting.id}
                    className="rounded-xl border border-purple-100 p-5 shadow-sm"
                  >
                    <p className="font-bold text-slate-950">{setting.key}</p>
                    <p className="mt-2 text-sm text-slate-700">
                      {setting.value}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}