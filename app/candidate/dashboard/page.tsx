import { requireRole } from "@/lib/auth";

const applications = [
  { job: "Frontend Developer", company: "TechNova Solutions", status: "Applied" },
  { job: "UI/UX Designer", company: "Creative Labs", status: "Interview" },
];

export default async function CandidateDashboardPage() {
  const session = await requireRole(["CANDIDATE"]);

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="text-sm font-medium text-blue-600">
          ← Back to Home
        </a>

        <div className="mt-6 rounded-3xl bg-slate-950 p-8 text-white">
          <p className="text-sm text-purple-200">Candidate Area</p>
          <h1 className="mt-2 text-3xl font-bold">Candidate Dashboard</h1>
          <p className="mt-2 text-slate-300">
            Welcome, {session.name}. Build your profile, upload CV, browse jobs,
            apply, and track your application progress.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Applications</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">2</h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Profile Completion</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">70%</h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Interviews</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">1</h2>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">My Applications</h2>

          <div className="mt-4 space-y-4">
            {applications.map((application) => (
              <div
                key={application.job}
                className="flex flex-col justify-between gap-3 rounded-xl border border-slate-200 p-4 md:flex-row md:items-center"
              >
                <div>
                  <p className="font-semibold text-slate-900">
                    {application.job}
                  </p>
                  <p className="text-sm text-slate-600">
                    {application.company}
                  </p>
                </div>

                <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                  {application.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}