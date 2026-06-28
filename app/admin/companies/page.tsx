import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function createCompany(formData: FormData) {
  "use server";

  await requireRole(["ADMIN"]);

  const name = formData.get("name")?.toString().trim();
  const website = formData.get("website")?.toString().trim();
  const location = formData.get("location")?.toString().trim();
  const description = formData.get("description")?.toString().trim();

  if (!name) {
    return;
  }

  await prisma.company.create({
    data: {
      name,
      website: website || null,
      location: location || null,
      description: description || null,
    },
  });

  revalidatePath("/admin/companies");
  revalidatePath("/admin/dashboard");
}

export default async function AdminCompaniesPage() {
  await requireRole(["ADMIN"]);

  const companies = await prisma.company.findMany({
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
          <h1 className="mt-2 text-3xl font-bold">Manage Companies</h1>
          <p className="mt-2 max-w-2xl text-purple-100">
            Create companies and review the companies connected to job posts.
          </p>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950">Add Company</h2>

            <form action={createCompany} className="mt-5 space-y-4">
              <input
                name="name"
                required
                placeholder="Company name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-purple-500"
              />

              <input
                name="website"
                placeholder="Website"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-purple-500"
              />

              <input
                name="location"
                placeholder="Location"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-purple-500"
              />

              <textarea
                name="description"
                placeholder="Company description"
                className="min-h-28 w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-purple-500"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-purple-700 px-5 py-3 text-sm font-semibold text-white shadow-md shadow-purple-700/20 hover:bg-purple-800"
              >
                Add Company
              </button>
            </form>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-950">
                All Companies
              </h2>

              <span className="rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
                {companies.length} companies
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {companies.map((company) => (
                <div
                  key={company.id}
                  className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-lg font-bold text-slate-950">
                        {company.name}
                      </p>

                      {company.location && (
                        <p className="mt-1 text-sm text-slate-600">
                          {company.location}
                        </p>
                      )}

                      {company.website && (
                        <p className="mt-1 text-sm text-purple-700">
                          {company.website}
                        </p>
                      )}

                      {company.description && (
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                          {company.description}
                        </p>
                      )}
                    </div>

                    <span className="w-fit rounded-full bg-purple-100 px-4 py-2 text-sm font-semibold text-purple-700">
                      {company.jobs.length} jobs
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