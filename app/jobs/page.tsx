import prisma from "@/lib/prisma";

function formatJobType(type: string) {
  return type
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function JobsPage() {
  const jobs = await prisma.job.findMany({
    where: {
      isActive: true,
    },
    include: {
      company: true,
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

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
              Browse real jobs loaded from the Supabase PostgreSQL database.
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
            <option>Internship</option>
            <option>Remote</option>
          </select>
        </div>

        {jobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              No jobs available
            </h2>
            <p className="mt-2 text-slate-600">
              Please check again later for new job opportunities.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {job.title}
                    </h2>
                    <p className="mt-1 text-slate-600">{job.company.name}</p>

                    <p className="mt-3 max-w-3xl text-sm text-slate-600">
                      {job.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2 text-sm">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-blue-700">
                        {job.location}
                      </span>

                      <span className="rounded-full bg-green-100 px-3 py-1 text-green-700">
                        {formatJobType(job.type)}
                      </span>

                      {job.salary && (
                        <span className="rounded-full bg-purple-100 px-3 py-1 text-purple-700">
                          {job.salary}
                        </span>
                      )}

                      {job.category && (
                        <span className="rounded-full bg-orange-100 px-3 py-1 text-orange-700">
                          {job.category.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <a
                        href={`/jobs/${job.id}`}
                        className="rounded-xl bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
                        >
                        View Details
                 </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}