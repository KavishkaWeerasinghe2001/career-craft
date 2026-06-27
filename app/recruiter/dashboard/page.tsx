import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function formatStatus(status: string) {
  return status
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

const statusOptions = [
  "APPLIED",
  "SHORTLISTED",
  "INTERVIEW",
  "OFFERED",
  "REJECTED",
] as const;

type ApplicationStatusValue = (typeof statusOptions)[number];

async function updateApplicationStatus(formData: FormData) {
  "use server";

  const session = await requireRole(["RECRUITER"]);

  const applicationId = formData.get("applicationId")?.toString();
  const status = formData.get("status")?.toString();

  if (!applicationId || !statusOptions.includes(status as ApplicationStatusValue)) {
    return;
  }

  await prisma.application.updateMany({
    where: {
      id: applicationId,
      job: {
        recruiterId: session.userId,
      },
    },
    data: {
      status: status as ApplicationStatusValue,
    },
  });

  revalidatePath("/recruiter/dashboard");
}

export default async function RecruiterDashboardPage() {
  const session = await requireRole(["RECRUITER"]);

  const [jobs, applications] = await Promise.all([
    prisma.job.findMany({
      where: {
        recruiterId: session.userId,
      },
      include: {
        company: true,
        applications: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    prisma.application.findMany({
      where: {
        job: {
          recruiterId: session.userId,
        },
      },
      include: {
        candidate: true,
        job: {
          include: {
            company: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  const appliedCount = applications.filter(
    (application) => application.status === "APPLIED",
  ).length;

  const shortlistedCount = applications.filter(
    (application) => application.status === "SHORTLISTED",
  ).length;

  const interviewCount = applications.filter(
    (application) => application.status === "INTERVIEW",
  ).length;

  const offeredCount = applications.filter(
    (application) => application.status === "OFFERED",
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === "REJECTED",
  ).length;

  const pipeline = [
    { label: "Applied", value: appliedCount },
    { label: "Shortlisted", value: shortlistedCount },
    { label: "Interview", value: interviewCount },
    { label: "Offered", value: offeredCount },
    { label: "Rejected", value: rejectedCount },
  ];

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

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">My Job Posts</h2>

            {jobs.length === 0 ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-medium text-slate-900">
                  You have not created any jobs yet.
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Job creation will be added in the next feature step.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <p className="font-semibold text-slate-900">{job.title}</p>
                    <p className="text-sm text-slate-600">{job.company.name}</p>
                    <p className="mt-2 text-sm text-slate-500">
                      {job.applications.length} applications
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">
              Recent Applicants
            </h2>

            {applications.length === 0 ? (
              <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="font-medium text-slate-900">
                  No applications yet.
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Candidate applications will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {applications.map((application) => (
                  <div
                    key={application.id}
                    className="rounded-xl border border-slate-200 p-4"
                  >
                    <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {application.candidate.name}
                        </p>
                        <p className="text-sm text-slate-600">
                          Applied for {application.job.title}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {application.job.company.name}
                        </p>
                      </div>

                      <form action={updateApplicationStatus} className="flex flex-wrap items-center gap-2">
                        <input type="hidden" name="applicationId" value={application.id} />

                        <select
                            name="status"
                            defaultValue={application.status}
                            className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700"
                        >
                            {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {formatStatus(status)}
                            </option>
                            ))}
                        </select>

                        <button
                            type="submit"
                            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                            Update
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}