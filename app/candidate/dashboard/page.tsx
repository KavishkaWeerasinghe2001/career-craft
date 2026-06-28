import prisma from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function formatStatus(status: string) {
  return status
    .replace("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function updateCandidateProfile(formData: FormData) {
  "use server";

  const session = await requireRole(["CANDIDATE"]);

  const phone = formData.get("phone")?.toString();
  const location = formData.get("location")?.toString();
  const bio = formData.get("bio")?.toString();
  const cvUrl = formData.get("cvUrl")?.toString();

  await prisma.candidateProfile.upsert({
    where: {
      userId: session.userId,
    },
    update: {
      phone: phone || null,
      location: location || null,
      bio: bio || null,
      cvUrl: cvUrl || null,
    },
    create: {
      userId: session.userId,
      phone: phone || null,
      location: location || null,
      bio: bio || null,
      cvUrl: cvUrl || null,
    },
  });

  revalidatePath("/candidate/dashboard");
}

async function getCandidateProfileId(userId: string) {
  const profile = await prisma.candidateProfile.upsert({
    where: {
      userId,
    },
    update: {},
    create: {
      userId,
    },
    select: {
      id: true,
    },
  });

  return profile.id;
}

async function addSkill(formData: FormData) {
  "use server";

  const session = await requireRole(["CANDIDATE"]);
  const name = formData.get("name")?.toString();

  if (!name) {
    return;
  }

  const profileId = await getCandidateProfileId(session.userId);

  await prisma.skill.create({
    data: {
      name,
      profileId,
    },
  });

  revalidatePath("/candidate/dashboard");
}

async function addEducation(formData: FormData) {
  "use server";

  const session = await requireRole(["CANDIDATE"]);

  const school = formData.get("school")?.toString();
  const degree = formData.get("degree")?.toString();
  const fieldOfStudy = formData.get("fieldOfStudy")?.toString();
  const startYear = formData.get("startYear")?.toString();
  const endYear = formData.get("endYear")?.toString();

  if (!school || !degree) {
    return;
  }

  const profileId = await getCandidateProfileId(session.userId);

  await prisma.education.create({
    data: {
      school,
      degree,
      fieldOfStudy: fieldOfStudy || null,
      startYear: startYear ? Number(startYear) : null,
      endYear: endYear ? Number(endYear) : null,
      profileId,
    },
  });

  revalidatePath("/candidate/dashboard");
}

async function addWorkExperience(formData: FormData) {
  "use server";

  const session = await requireRole(["CANDIDATE"]);

  const companyName = formData.get("companyName")?.toString();
  const jobTitle = formData.get("jobTitle")?.toString();
  const startDate = formData.get("startDate")?.toString();
  const endDate = formData.get("endDate")?.toString();
  const description = formData.get("description")?.toString();

  if (!companyName || !jobTitle) {
    return;
  }

  const profileId = await getCandidateProfileId(session.userId);

  await prisma.workExperience.create({
    data: {
      companyName,
      jobTitle,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      description: description || null,
      profileId,
    },
  });

  revalidatePath("/candidate/dashboard");
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
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-600 text-base font-black text-white shadow-lg shadow-purple-600/30">
              CC
            </span>

            <span>
              <span className="block text-lg font-bold leading-none text-slate-950">
                Career Craft
              </span>
              <span className="mt-1 block text-xs text-purple-700">Job Board</span>
            </span>
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

        <div className="mt-6 rounded-3xl bg-purple-950 p-8 text-white shadow-xl shadow-purple-950/20">
          <p className="text-sm text-purple-200">Candidate Area</p>

          <h1 className="mt-2 text-3xl font-bold">Candidate Dashboard</h1>

          <p className="mt-2 text-slate-300">
            Welcome, {session.name}. Build your profile, upload CV, browse jobs,
            apply, and track your application progress.
          </p>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Applications</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {applications.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Profile Completion</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {profileCompletion}%
            </h2>
          </div>

          <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Interviews</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {interviewCount}
            </h2>
          </div>
        </div>

        <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">My Profile</h2>

            <form action={updateCandidateProfile} className="mt-4 grid gap-4 md:grid-cols-2">
                <input
                name="phone"
                placeholder="Phone number"
                defaultValue={profile?.phone ?? ""}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />

                <input
                name="location"
                placeholder="Location"
                defaultValue={profile?.location ?? ""}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />

                <input
                name="cvUrl"
                placeholder="CV URL"
                defaultValue={profile?.cvUrl ?? ""}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm md:col-span-2"
                />

                <textarea
                name="bio"
                placeholder="Short bio"
                defaultValue={profile?.bio ?? ""}
                className="min-h-28 rounded-xl border border-slate-300 px-4 py-3 text-sm md:col-span-2"
                />

                <button
                type="submit"
                className="rounded-xl bg-purple-800 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-900 md:col-span-2"
                >
                Update Profile
                </button>
            </form>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="font-bold text-slate-900">Skills</h3>

                <form action={addSkill} className="mt-3 flex gap-3">
                <input
                    name="name"
                    placeholder="Example: React"
                    required
                    className="min-w-0 flex-1 rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />

                <button
                    type="submit"
                    className="rounded-xl bg-purple-800 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-900"
                >
                    Add
                </button>
                </form>

                <div className="mt-4 flex flex-wrap gap-2">
                {profile?.skills.length ? (
                    profile.skills.map((skill) => (
                    <span
                        key={skill.id}
                        className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700"
                    >
                        {skill.name}
                    </span>
                    ))
                ) : (
                    <p className="text-sm text-slate-500">No skills added yet.</p>
                )}
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="font-bold text-slate-900">Education</h3>

                <form action={addEducation} className="mt-3 grid gap-3">
                <input
                    name="school"
                    placeholder="School or university"
                    required
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />

                <input
                    name="degree"
                    placeholder="Degree"
                    required
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />

                <input
                    name="fieldOfStudy"
                    placeholder="Field of study"
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                    <input
                    name="startYear"
                    type="number"
                    placeholder="Start year"
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                    />

                    <input
                    name="endYear"
                    type="number"
                    placeholder="End year"
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="rounded-xl bg-purple-800 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-900"
                >
                    Add Education
                </button>
                </form>

                <div className="mt-4 space-y-3">
                {profile?.education.length ? (
                    profile.education.map((education) => (
                    <div key={education.id} className="rounded-xl bg-slate-50 p-3">
                        <p className="font-semibold text-slate-900">{education.degree}</p>
                        <p className="text-sm text-slate-600">{education.school}</p>
                    </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-500">No education added yet.</p>
                )}
                </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
                <h3 className="font-bold text-slate-900">Work Experience</h3>

                <form action={addWorkExperience} className="mt-3 grid gap-3">
                <input
                    name="companyName"
                    placeholder="Company name"
                    required
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />

                <input
                    name="jobTitle"
                    placeholder="Job title"
                    required
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />

                <div className="grid gap-3 sm:grid-cols-2">
                    <input
                    name="startDate"
                    type="date"
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                    />

                    <input
                    name="endDate"
                    type="date"
                    className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
                    />
                </div>

                <textarea
                    name="description"
                    placeholder="Short description"
                    className="min-h-24 rounded-xl border border-slate-300 px-4 py-3 text-sm"
                />

                <button
                    type="submit"
                    className="rounded-xl bg-purple-800 px-4 py-3 text-sm font-semibold text-white hover:bg-purple-900"
                >
                    Add Experience
                </button>
                </form>

                <div className="mt-4 space-y-3">
                {profile?.workExperience.length ? (
                    profile.workExperience.map((experience) => (
                    <div key={experience.id} className="rounded-xl bg-slate-50 p-3">
                        <p className="font-semibold text-slate-900">
                        {experience.jobTitle}
                        </p>
                        <p className="text-sm text-slate-600">
                        {experience.companyName}
                        </p>
                    </div>
                    ))
                ) : (
                    <p className="text-sm text-slate-500">No work experience added yet.</p>
                )}
                </div>
            </div>
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
                className="mt-4 inline-flex rounded-xl bg-purple-800 px-5 py-3 text-sm font-semibold text-white hover:bg-purple-900"
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

                    <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
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
                              ? "rounded-full bg-purple-800 px-3 py-1 font-medium text-white"
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
