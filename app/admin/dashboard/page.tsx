import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

function formatStatus(status: string) {
  return status
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function AdminDashboardPage() {
  const session = await requireRole(["ADMIN"]);

  const [
    totalUsers,
    totalRecruiters,
    totalCandidates,
    totalJobs,
    totalApplications,
    totalCompanies,
    totalCategories,
    recentApplications,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { role: "RECRUITER" } }),
    prisma.user.count({ where: { role: "CANDIDATE" } }),
    prisma.job.count(),
    prisma.application.count(),
    prisma.company.count(),
    prisma.category.count(),
    prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        candidate: true,
        job: { include: { company: true } },
      },
    }),
  ]);

  const stats = [
    { label: "Total Users", value: totalUsers },
    { label: "Recruiters", value: totalRecruiters },
    { label: "Candidates", value: totalCandidates },
    { label: "Open Jobs", value: totalJobs },
    { label: "Applications", value: totalApplications },
    { label: "Companies", value: totalCompanies },
    { label: "Categories", value: totalCategories },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
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
            <a href="/admin/users" className="rounded-xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-700/20 hover:bg-purple-800">
              Manage Users
            </a>
            <a href="/admin/companies" className="rounded-xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-700/20 hover:bg-purple-800">
              Manage Companies
            </a>
            <a href="/admin/categories" className="rounded-xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-700/20 hover:bg-purple-800">
              Manage Categories
            </a>
            <a href="/admin/settings" className="rounded-xl bg-purple-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-purple-700/20 hover:bg-purple-800">
              Platform Settings
            </a>
            <a href="/jobs" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-100">
              Jobs
            </a>
            <a href="/logout" className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
              Logout
            </a>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-purple-950 p-8 text-white shadow-xl shadow-purple-950/20">
          <p className="text-sm text-purple-200">Admin Area</p>
          <h1 className="mt-2 text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 max-w-3xl text-purple-100">
            Welcome, {session.name}. Manage users, recruiters, companies, job
            categories, platform settings, and application activity.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-950">
                {stat.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-950">Recent Activity</h2>

          {recentApplications.length === 0 ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-medium text-slate-950">No recent activity</p>
              <p className="mt-1 text-sm text-slate-600">
                Applications will appear here after candidates apply for jobs.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {recentApplications.map((application) => (
                <div key={application.id} className="rounded-xl border border-purple-100 p-4">
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div>
                      <p className="font-semibold text-slate-950">
                        {application.candidate.name} applied for{" "}
                        {application.job.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {application.job.company.name}
                      </p>
                    </div>

                    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                      {formatStatus(application.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}