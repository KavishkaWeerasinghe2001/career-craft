export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-8">
        <nav className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Career Craft</h1>

          <div className="flex gap-3 text-sm">
            <a
              href="/jobs"
              className="rounded-full border border-white/20 px-4 py-2 text-slate-200 hover:bg-white hover:text-slate-950"
            >
              Browse Jobs
            </a>
            <a
              href="/login"
              className="rounded-full bg-white px-4 py-2 font-medium text-slate-950 hover:bg-slate-200"
            >
              Login
            </a>
          </div>
        </nav>

        <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-blue-400/40 bg-blue-400/10 px-4 py-2 text-sm text-blue-200">
              Full-Stack Job Application Platform
            </p>

            <h2 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Find jobs, apply faster, and track your career progress.
            </h2>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
              Career Craft is a modern job application system for candidates,
              recruiters, and admins. Candidates can apply for jobs, recruiters
              can manage applications, and admins can monitor the whole platform.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/register"
                className="rounded-xl bg-blue-500 px-6 py-3 font-semibold text-white hover:bg-blue-600"
              >
                Get Started
              </a>
              <a
                href="/jobs"
                className="rounded-xl border border-white/20 px-6 py-3 font-semibold text-white hover:bg-white hover:text-slate-950"
              >
                View Open Jobs
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl">
            <h3 className="text-xl font-semibold">Platform Areas</h3>

            <div className="mt-6 space-y-4">
              <div className="rounded-2xl bg-slate-900 p-5">
                <h4 className="font-semibold text-blue-300">Admin</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Manage users, recruiters, companies, job categories, and
                  platform analytics.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 p-5">
                <h4 className="font-semibold text-green-300">Recruiter</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Create job posts, review candidates, update application
                  status, and manage interviews.
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 p-5">
                <h4 className="font-semibold text-purple-300">Candidate</h4>
                <p className="mt-2 text-sm text-slate-300">
                  Register, build a profile, upload CV, browse jobs, apply, and
                  track application progress.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}