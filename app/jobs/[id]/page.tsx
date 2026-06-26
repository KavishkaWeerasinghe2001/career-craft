import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";

type JobDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatJobType(type: string) {
  return type
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;

  const job = await prisma.job.findUnique({
    where: {
      id,
    },
    include: {
      company: true,
      category: true,
      recruiter: true,
    },
  });

  if (!job) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-8">
      <div className="mx-auto max-w-5xl">
        <a href="/jobs" className="text-sm font-medium text-blue-600">
          ← Back to Jobs
        </a>

        <section className="mt-6 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-medium text-blue-600">
                {job.company.name}
              </p>

              <h1 className="mt-2 text-4xl font-bold text-slate-900">
                {job.title}
              </h1>

              <div className="mt-5 flex flex-wrap gap-2 text-sm">
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
              href="/login"
              className="rounded-xl bg-blue-600 px-6 py-3 text-center font-semibold text-white hover:bg-blue-700"
            >
              Login to Apply
            </a>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="rounded-3xl bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-slate-900">
                Job Description
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                {job.description}
              </p>

              <h2 className="mt-8 text-2xl font-bold text-slate-900">
                Requirements
              </h2>
              <p className="mt-4 leading-7 text-slate-600">
                {job.requirements}
              </p>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Company Details
              </h2>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <p>
                  <span className="font-semibold text-slate-900">Company:</span>{" "}
                  {job.company.name}
                </p>

                {job.company.location && (
                  <p>
                    <span className="font-semibold text-slate-900">
                      Location:
                    </span>{" "}
                    {job.company.location}
                  </p>
                )}

                {job.company.website && (
                  <p>
                    <span className="font-semibold text-slate-900">
                      Website:
                    </span>{" "}
                    {job.company.website}
                  </p>
                )}

                {job.company.description && (
                  <p className="leading-6">{job.company.description}</p>
                )}
              </div>
            </div>

            <div className="rounded-3xl bg-slate-950 p-6 text-white shadow-sm">
              <h2 className="text-xl font-bold">Ready to apply?</h2>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                Login as a candidate to submit your application and track your
                application status.
              </p>

              <a
                href="/login"
                className="mt-5 block rounded-xl bg-white px-5 py-3 text-center font-semibold text-slate-950 hover:bg-slate-200"
              >
                Login to Apply
              </a>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}