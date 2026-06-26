const jobs = [
  {
    title: "Frontend Developer",
    company: "TechNova Solutions",
    location: "Colombo",
    type: "Full Time",
    salary: "LKR 120,000 - 180,000",
  },
  {
    title: "UI/UX Designer",
    company: "Creative Labs",
    location: "Remote",
    type: "Contract",
    salary: "LKR 90,000 - 140,000",
  },
  {
    title: "Junior Full Stack Developer",
    company: "CareerHub",
    location: "Kandy",
    type: "Full Time",
    salary: "LKR 100,000 - 160,000",
  },
];

export default function JobsPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <a href="/" className="text-sm font-medium text-blue-600">
              ← Back to Home
            </a>
            <h1 className="mt-4 text-3xl font-bold text-slate-900">
              Open Jobs
            </h1>
            <p className="mt-2 text-slate-600">
              Browse available jobs and apply for the best opportunity.
            </p>
          </div>

          <a
            href="/login"
            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Login to Apply
          </a>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <input
            placeholder="Search job title"
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
          <input
            placeholder="Location"
            className="rounded-xl border border-slate-300 px-4 py-3"
          />
          <select className="rounded-xl border border-slate-300 px-4 py-3">
            <option>All Job Types</option>
            <option>Full Time</option>
            <option>Part Time</option>
            <option>Contract</option>
            <option>Remote</option>
          </select>
        </div>

        <div className="grid gap-5">
          {jobs.map((job) => (
            <div
              key={job.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {job.title}
                  </h2>
                  <p className="mt-1 text-slate-600">{job.company}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                      {job.location}
                    </span>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                      {job.type}
                    </span>
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-purple-700">
                      {job.salary}
                    </span>
                  </div>
                </div>

                <a
                  href="/login"
                  className="rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Apply Now
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}