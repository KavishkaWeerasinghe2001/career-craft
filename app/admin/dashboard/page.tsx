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
    prisma.user.count({
      where: {
        role: "RECRUITER",
      },
    }),
    prisma.user.count({
      where: {
        role: "CANDIDATE",
      },
    }),
    prisma.job.count(),
    prisma.application.count(),
    prisma.company.count(),
    prisma.category.count(),
    prisma.application.findMany({
      take: 5,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        candidate: true,
        job: {
          include: {
            company: true,
          },
        },
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

  const managementLinks = [
    {
      title: "Manage Users",
      description: "View all admins, recruiters, and candidates.",
      href: "/admin/users",
    },
    {
      title: "Manage Companies",
      description: "View and create companies used by job posts.",
      href: "/admin/companies",
    },
    {
      title: "Manage Categories",
      description: "View and create job categories.",
      href: "/admin/categories",
    },
    {
      title: "Platform Settings",
      description: "View and update platform settings.",
      href: "/admin/settings",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <a href="/" className="text-sm font-medium text-blue-600">
            ← Career Craft
          </a>

          <div className="flex flex-wrap gap-3">
            {managementLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
              >
                {link.title}
              </a>
            ))}

            <a
              href="/jobs"
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Jobs
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
          <h1 className="mt-2 text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-slate-300">
            Welcome, {session.name}. Manage users, recruiters, companies, job
            categories, and platform analytics.
          </p>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">{stat.label}</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {stat.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>

          {recentApplications.length === 0 ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-medium text-slate-900">No recent activity</p>
              <p className="mt-1 text-sm text-slate-600">
                Applications will appear here after candidates apply for jobs.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {recentApplications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {application.candidate.name} applied for{" "}
                        {application.job.title}
                      </p>
                      <p className="mt-1 text-sm text-slate-600">
                        {application.job.company.name}
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
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
