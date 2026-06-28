import PublicFooter from "@/components/PublicFooter";
import PublicHeader from "@/components/PublicHeader";
import prisma from "@/lib/prisma";

type JobsPageProps = {
  searchParams: Promise<{
    q?: string;
    location?: string;
    type?: string;
  }>;
};

function formatJobType(type: string) {
  return type
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;

  const q = params.q?.trim() || "";
  const location = params.location?.trim() || "";
  const type = params.type?.trim() || "";

  const jobs = await prisma.job.findMany({
    where: {
      isActive: true,
      AND: [
        q
          ? {
              OR: [
                {
                  title: {
                    contains: q,
                    mode: "insensitive",
                  },
                },
                {
                  company: {
                    name: {
                      contains: q,
                      mode: "insensitive",
                    },
                  },
                },
              ],
            }
          : {},
        location
          ? {
              location: {
                contains: location,
                mode: "insensitive",
              },
            }
          : {},
        type
          ? {
              type: type as never,
            }
          : {},
      ],
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
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <PublicHeader />

      <section className="border-b border-purple-100 bg-white px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex rounded-full bg-purple-100 px-4 py-2 text-sm font-bold text-purple-700">
            Find your next opportunity
          </p>

          <div className="mt-6 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <h1 className="text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                Open Jobs
              </h1>

              <p className="mt-3 max-w-2xl text-slate-600">
                Browse real jobs, search by title or company, and filter by
                location and job type.
              </p>
            </div>

            <a
              href="/login"
              className="inline-flex rounded-xl bg-black px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/25 hover:bg-purple-700"
            >
              Login to Apply
            </a>
          </div>

          <form className="mt-8 grid gap-4 rounded-3xl border border-purple-100 bg-purple-50/70 p-4 shadow-sm md:grid-cols-[1fr_1fr_1fr_auto_auto]">
            <input
              name="q"
              placeholder="Search job title or company"
              defaultValue={q}
              className="rounded-2xl border border-purple-100 bg-white px-4 py-3 text-slate-950 outline-none placeholder:text-slate-400 focus:border-purple-400"
            />

            <input
              name="location"
              placeholder="Location"
              defaultValue={location}
              className="rounded-2xl border border-purple-100 bg-white px-4 py-3 text-slate-950 outline-none placeholder:text-slate-400 focus:border-purple-400"
            />

            <select
              name="type"
              defaultValue={type}
              className="rounded-2xl border border-purple-100 bg-white px-4 py-3 text-slate-950 outline-none focus:border-purple-400"
            >
              <option value="">All Job Types</option>
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
              <option value="REMOTE">Remote</option>
            </select>

            <button className="rounded-2xl bg-purple-800 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-purple-600/25 hover:bg-purple-700">
              Search
            </button>

            <a
              href="/jobs"
              className="rounded-2xl border border-purple-200 bg-white px-6 py-3 text-center text-sm font-bold text-purple-700 hover:bg-purple-50"
            >
              Clear
            </a>
          </form>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto max-w-7xl">
          {jobs.length === 0 ? (
            <div className="rounded-3xl border border-purple-100 bg-white p-10 text-center shadow-sm">
              <h2 className="text-xl font-bold">No jobs available</h2>
              <p className="mt-2 text-slate-600">
                Please check again later for new job opportunities.
              </p>
            </div>
          ) : (
            <div className="grid gap-5">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-purple-200 hover:shadow-xl"
                >
                  <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                    <div>
                      <p className="text-sm font-semibold text-purple-700">
                        {job.company.name}
                      </p>

                      <h2 className="mt-1 text-2xl font-black text-slate-950">
                        {job.title}
                      </h2>

                      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
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
                      className="rounded-2xl bg-purple-950 px-6 py-3 text-center text-sm font-bold text-white shadow-lg shadow-purple-600/25 hover:bg-purple-700"
                    >
                      View Details
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}