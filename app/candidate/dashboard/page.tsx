import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";

function formatStatus(status: string) {
  return status
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function CandidateDashboardPage() {
  const session = await requireRole(["CANDIDATE"]);

  const applications = await prisma.application.findMany({
    where: {
      candidateId: session.userId,
    },
    include: {
      job: {
        include: {
          company: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const profile = await prisma.candidateProfile.findUnique({
    where: {
      userId: session.userId,
    },
    include: {
      skills: true,
      education: true,
      workExperience: true,
    },
  });

  let completedProfileItems = 0;
  const totalProfileItems = 7;

  if (profile?.phone) completedProfileItems++;
  if (profile?.location) completedProfileItems++;
  if (profile?.bio) completedProfileItems++;
  if (profile?.cvUrl) completedProfileItems++;
  if (profile && profile.skills.length > 0) completedProfileItems++;
  if (profile && profile.education.length > 0) completedProfileItems++;
  if (profile && profile.workExperience.length > 0) completedProfileItems++;

  const profileCompletion = Math.round(
    (completedProfileItems / totalProfileItems) * 100,
  );

  const interviewCount = applications.filter(
    (application) => application.status === "INTERVIEW",
  ).length;

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
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {applications.length}
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Profile Completion</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {profileCompletion}%
            </h2>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Interviews</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {interviewCount}
            </h2>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">My Applications</h2>

          {applications.length === 0 ? (
            <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="font-medium text-slate-900">
                You have not applied for any jobs yet.
              </p>

              <p className="mt-1 text-sm text-slate-600">
                Browse jobs and submit your first application.
              </p>

              <a
                href="/jobs"
                className="mt-4 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Browse Jobs
              </a>
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
                        {application.job.title}
                      </p>

                      <p className="text-sm text-slate-600">
                        {application.job.company.name}
                      </p>

                      <p className="mt-2 text-sm text-slate-500">
                        Applied on{" "}
                        {application.createdAt.toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                      {formatStatus(application.status)}
                    </span>
                  </div>

                  <div className="mt-4 rounded-xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      Status Timeline
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2 text-xs">
                      {[
                        "APPLIED",
                        "SHORTLISTED",
                        "INTERVIEW",
                        "OFFERED",
                        "REJECTED",
                      ].map((status) => (
                        <span
                          key={status}
                          className={
                            application.status === status
                              ? "rounded-full bg-blue-600 px-3 py-1 font-medium text-white"
                              : "rounded-full bg-slate-200 px-3 py-1 font-medium text-slate-600"
                          }
                        >
                          {formatStatus(status)}
                        </span>
                      ))}
                    </div>
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