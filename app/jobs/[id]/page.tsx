import PublicFooter from "@/components/PublicFooter";
import PublicHeader from "@/components/PublicHeader";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
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

async function applyForJob(formData: FormData) {
  "use server";

  const session = await getSession();

  if (!session || session.role !== "CANDIDATE") {
    return;
  }

  const jobId = formData.get("jobId")?.toString();
  const coverLetter = formData.get("coverLetter")?.toString();

  if (!jobId) {
    return;
  }

  await prisma.application.upsert({
    where: {
      candidateId_jobId: {
        candidateId: session.userId,
        jobId,
      },
    },
    update: {
      coverLetter: coverLetter || null,
    },
    create: {
      candidateId: session.userId,
      jobId,
      coverLetter: coverLetter || null,
    },
  });
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { id } = await params;
  const session = await getSession();

  const job = await prisma.job.findUnique({
    where: {
      id,
    },
    include: {
      company: true,
      category: true,
    },
  });

  if (!job) {
    notFound();
  }

  const isCandidate = session?.role === "CANDIDATE";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <PublicHeader />

      <section className="border-b border-purple-100 bg-white px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="inline-flex rounded-full bg-purple-100 px-4 py-2 text-sm font-bold text-purple-700">
            Job Opportunity
          </p>

          <div className="mt-6 rounded-3xl border border-purple-100 bg-purple-50/70 p-8 shadow-sm">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <p className="text-sm font-bold text-purple-700">
                  {job.company.name}
                </p>

                <h1 className="mt-2 text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
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
                href={isCandidate ? "#apply" : "/login"}
                className="rounded-2xl bg-purple-800 px-7 py-4 text-center text-sm font-bold text-white shadow-lg shadow-purple-800/30 hover:bg-purple-900"
              >
                {isCandidate ? "Apply Now" : "Login to Apply"}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_380px]">
          <div className="rounded-3xl border border-purple-100 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              Job Description
            </h2>

            <p className="mt-5 leading-7 text-slate-700">{job.description}</p>

            <h2 className="mt-10 text-2xl font-black text-slate-950">
              Requirements
            </h2>

            <p className="mt-5 leading-7 text-slate-700">{job.requirements}</p>
          </div>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-purple-100 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-black text-slate-950">
                Company Details
              </h2>

              <div className="mt-5 space-y-3 text-sm text-slate-700">
                <p>
                  <span className="font-bold text-slate-950">Company:</span>{" "}
                  {job.company.name}
                </p>

                {job.company.location && (
                  <p>
                    <span className="font-bold text-slate-950">Location:</span>{" "}
                    {job.company.location}
                  </p>
                )}

                {job.company.website && (
                  <p>
                    <span className="font-bold text-slate-950">Website:</span>{" "}
                    {job.company.website}
                  </p>
                )}

                {job.company.description && (
                  <p className="leading-6">{job.company.description}</p>
                )}
              </div>
            </div>

            <div
              id="apply"
              className="rounded-3xl bg-purple-950 p-6 text-white shadow-xl shadow-purple-950/25"
            >
              <h2 className="text-xl font-black">Apply for this Job</h2>

              {isCandidate ? (
                <form action={applyForJob} className="mt-5 space-y-4">
                  <input type="hidden" name="jobId" value={job.id} />

                  <textarea
                    name="coverLetter"
                    placeholder="Write a short cover letter"
                    className="min-h-32 w-full rounded-2xl border border-purple-200 bg-white px-4 py-3 text-slate-950 outline-none placeholder:text-slate-400 focus:border-purple-400"
                  />

                  <button
                    type="submit"
                    className="w-full rounded-2xl bg-white px-5 py-3 text-sm font-bold text-purple-950 hover:bg-purple-100"
                  >
                    Submit Application
                  </button>

                  <p className="text-center text-xs text-purple-200">
                    Your application status will appear in your candidate
                    dashboard.
                  </p>
                </form>
              ) : (
                <div className="mt-5">
                  <p className="text-sm leading-6 text-purple-100">
                    Login as a candidate to submit your application and track your
                    status.
                  </p>

                  <a
                    href="/login"
                    className="mt-5 block rounded-2xl bg-white px-5 py-3 text-center text-sm font-bold text-purple-950 hover:bg-purple-100"
                  >
                    Login First
                  </a>
                </div>
              )}
            </div>
          </aside>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}