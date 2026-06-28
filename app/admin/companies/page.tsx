import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

async function createCompany(formData: FormData) {
  "use server";

  await requireRole(["ADMIN"]);

  const name = formData.get("name")?.toString();
  const description = formData.get("description")?.toString();
  const website = formData.get("website")?.toString();
  const location = formData.get("location")?.toString();

  if (!name) {
    return;
  }

  await prisma.company.create({
    data: {
      name,
      description: description || null,
      website: website || null,
      location: location || null,
    },
  });

  revalidatePath("/admin/companies");
  revalidatePath("/admin/dashboard");
}

export default async function AdminCompaniesPage() {
  await requireRole(["ADMIN"]);

  const companies = await prisma.company.findMany({
    include: {
      recruiter: true,
      jobs: true,
    },
    orderBy: {
      createdAt: "desc",
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
          <h1 className="mt-2 text-3xl font-bold">Manage Companies</h1>
          <p className="mt-2 text-slate-300">
            Create companies and review the companies connected to job posts.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Add Company
            </h2>

            <form action={createCompany} className="mt-4 grid gap-3">
              <input
                name="name"
                placeholder="Company name"
                required
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
              />

              <input
                name="website"
                placeholder="Website"
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
              />

              <input
                name="location"
                placeholder="Location"
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
              />

              <textarea
                name="description"
                placeholder="Company description"
                className="min-h-24 rounded-xl border border-slate-300 px-4 py-3 text-sm"
              />

              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Add Company
              </button>
            </form>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              All Companies
            </h2>

            {companies.length === 0 ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-medium text-slate-900">
                  No companies found
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {companies.map((company) => (
                  <div key={company.id} className="rounded-xl border border-slate-200 p-4">
                    <p className="font-semibold text-slate-900">
                      {company.name}
                    </p>

                    {company.location && (
                      <p className="text-sm text-slate-600">
                        {company.location}
                      </p>
                    )}

                    {company.website && (
                      <p className="text-sm text-blue-600">
                        {company.website}
                      </p>
                    )}

                    <p className="mt-2 text-sm text-slate-500">
                      {company.jobs.length} jobs
                    </p>

                    {company.description && (
                      <p className="mt-2 text-sm text-slate-600">
                        {company.description}
                      </p>
                    )}
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