const stats = [
  { label: "Total Users", value: "128" },
  { label: "Recruiters", value: "24" },
  { label: "Candidates", value: "96" },
  { label: "Open Jobs", value: "32" },
];

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="text-sm font-medium text-blue-600">
          ← Back to Home
        </a>

        <div className="mt-6 rounded-3xl bg-slate-950 p-8 text-white">
          <p className="text-sm text-blue-200">Admin Area</p>
          <h1 className="mt-2 text-3xl font-bold">Admin Dashboard</h1>
          <p className="mt-2 text-slate-300">
            Manage users, recruiters, companies, job categories, and platform
            analytics.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">
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
          <ul className="mt-4 space-y-3 text-slate-600">
            <li>New recruiter account created.</li>
            <li>Candidate applied for Frontend Developer.</li>
            <li>Admin added a new job category.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}