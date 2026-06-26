import { requireRole } from "@/lib/auth";

const pipeline = [
  { label: "Applied", value: "18" },
  { label: "Shortlisted", value: "9" },
  { label: "Interview", value: "5" },
  { label: "Offered", value: "2" },
  { label: "Rejected", value: "4" },
];

export default async function RecruiterDashboardPage() {
  const session = await requireRole(["RECRUITER"]);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
            <a href="/" className="text-sm font-medium text-blue-600">
            ← Career Craft
            </a>

            <div className="flex gap-3">
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
          <p className="text-sm text-green-200">Recruiter Area</p>
          <h1 className="mt-2 text-3xl font-bold">Recruiter Dashboard</h1>
          <p className="mt-2 text-slate-300">
            Welcome, {session.name}. Create job posts, review candidates,
            update application status, and manage interviews.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-5">
          {pipeline.map((item) => (
            <div key={item.label} className="rounded-2xl bg-white p-6 shadow-sm">
              <p className="text-sm text-slate-500">{item.label}</p>
              <h2 className="mt-2 text-3xl font-bold text-slate-900">
                {item.value}
              </h2>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Recent Applicants
          </h2>

          <div className="mt-4 space-y-4">
            <div className="rounded-xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">Nimal Perera</p>
              <p className="text-sm text-slate-600">
                Applied for Frontend Developer
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="font-semibold text-slate-900">Kavindi Silva</p>
              <p className="text-sm text-slate-600">
                Applied for UI/UX Designer
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}