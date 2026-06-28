import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function updatePlatformSetting(formData: FormData) {
  "use server";

  await requireRole(["ADMIN"]);

  const key = formData.get("key")?.toString();
  const value = formData.get("value")?.toString();

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
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <a
            href="/admin/dashboard"
            className="text-sm font-medium text-blue-600"
          >
            ← Admin Dashboard
          </a>

          <div className="flex flex-wrap gap-3">
            <a
              href="/admin/users"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Manage Users
            </a>

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
              href="/logout"
              className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
            >
              Logout
            </a>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-slate-950 p-8 text-white">
          <p className="text-sm text-blue-200">Admin Area</p>
          <h1 className="mt-2 text-3xl font-bold">Platform Settings</h1>
          <p className="mt-2 text-slate-300">
            Create and update simple settings for the platform.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Save Setting
            </h2>

            <form action={updatePlatformSetting} className="mt-4 grid gap-3">
              <input
                name="key"
                placeholder="Setting key, example: site_name"
                required
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
              />

              <input
                name="value"
                placeholder="Setting value"
                required
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
              />

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Save Setting
              </button>
            </form>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Current Settings
            </h2>

            {settings.length === 0 ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-medium text-slate-900">
                  No settings found
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {settings.map((setting) => (
                  <div
                    key={setting.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <p className="font-semibold text-slate-900">
                      {setting.key}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
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