import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function createCategory(formData: FormData) {
  "use server";

  await requireRole(["ADMIN"]);

  const name = formData.get("name")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!name) {
    return;
  }

  await prisma.category.create({
    data: {
      name,
      description: description || null,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/dashboard");
}

export default async function AdminCategoriesPage() {
  await requireRole(["ADMIN"]);

  const categories = await prisma.category.findMany({
    include: {
      jobs: true,
    },
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
          <h1 className="mt-2 text-3xl font-bold">Manage Categories</h1>
          <p className="mt-2 max-w-2xl text-purple-100">
            Create and review job categories used across the platform.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Add Category</h2>

            <form action={createCategory} className="mt-5 space-y-4">
              <input
                name="name"
                required
                placeholder="Category name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-purple-500"
              />

              <textarea
                name="description"
                placeholder="Category description"
                className="min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-purple-500"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-purple-700/20 hover:bg-purple-800"
              >
                Add Category
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-950">
                All Categories
              </h2>

              <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
                {categories.length} categories
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-lg font-bold text-slate-950">
                        {category.name}
                      </p>

                      {category.description && (
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {category.description}
                        </p>
                      )}
                    </div>

                    <span className="w-fit rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
                      {category.jobs.length} jobs
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}