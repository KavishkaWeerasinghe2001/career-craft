import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function createCategory(formData: FormData) {
  "use server";

  await requireRole(["ADMIN"]);

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();

  if (!name) {
    return;
  }

  await prisma.category.upsert({
    where: {
      name,
    },
    update: {
      description: description || null,
    },
    create: {
      name,
      description: description || null,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/dashboard");
  revalidatePath("/jobs");
}

export default async function AdminCategoriesPage() {
  await requireRole(["ADMIN"]);

  const categories = await prisma.category.findMany({
    include: {
      jobs: true,
    },
    orderBy: {
      name: "asc",
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
          <h1 className="mt-2 text-3xl font-bold">Manage Categories</h1>
          <p className="mt-2 text-slate-300">
            Create and review job categories used across the platform.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Add Category</h2>

            <form action={createCategory} className="mt-4 grid gap-3">
              <input
                name="name"
                placeholder="Category name"
                required
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
              />

              <textarea
                name="description"
                placeholder="Category description"
                className="min-h-24 rounded-xl border border-slate-300 px-4 py-3 text-sm"
              />

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Add Category
              </button>
            </form>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">All Categories</h2>

            {categories.length === 0 ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-medium text-slate-900">No categories found</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {category.name}
                        </p>

                        {category.description && (
                          <p className="mt-1 text-sm text-slate-600">
                            {category.description}
                          </p>
                        )}
                      </div>

                      <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-700">
                        {category.jobs.length} jobs
                      </span>
                    </div>
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