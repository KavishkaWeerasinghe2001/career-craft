export default function Home() {
  return (
    <main className="min-h-screen bg-[#080312] text-white">
      <nav className="border-b border-white/10 bg-black/30 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="/" className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-purple-600 text-lg font-black text-white shadow-lg shadow-purple-600/30">
              CC
            </span>

            <div>
              <p className="text-xl font-bold">Career Craft</p>
              <p className="text-xs text-purple-200">Job Board</p>
            </div>
          </a>

          <div className="hidden items-center gap-8 text-sm font-semibold text-slate-300 md:flex">
            <a href="/jobs" className="hover:text-white">
              Find Jobs
            </a>
            <a href="/login" className="hover:text-white">
              Login
            </a>
            <a
              href="/register"
              className="rounded-xl bg-purple-600 px-5 py-2.5 text-white shadow-lg shadow-purple-600/30 hover:bg-purple-700"
            >
              Get Started
            </a>
          </div>

          <div className="flex gap-3 md:hidden">
            <a
              href="/jobs"
              className="rounded-xl border border-white/20 px-3 py-2 text-sm font-semibold text-white"
            >
              Jobs
            </a>
            <a
              href="/login"
              className="rounded-xl bg-white px-3 py-2 text-sm font-semibold text-slate-950"
            >
              Login
            </a>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute left-0 top-20 h-72 w-72 rounded-full bg-purple-700/30 blur-3xl" />
        <div className="absolute right-0 top-36 h-96 w-96 rounded-full bg-fuchsia-600/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-2 lg:items-center lg:py-16">
          <div>
            <p className="mb-6 inline-flex rounded-full border border-purple-400/30 bg-purple-500/10 px-4 py-2 text-sm font-semibold text-purple-200">
              ✦ Smart job platform for software students
            </p>

            <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight lg:text-6xl">
              Launch your{" "}
              <span className="text-purple-500">software</span> career today.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              Find internships, entry-level jobs, and career opportunities.
              Apply as a candidate, manage hiring as a recruiter, and monitor
              the platform as an admin.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/register"
                className="rounded-xl bg-purple-600 px-6 py-3 font-bold text-white shadow-xl shadow-purple-600/30 hover:bg-purple-700"
              >
                Create Account
              </a>

              <a
                href="/jobs"
                className="rounded-xl border border-white/20 px-6 py-3 font-bold text-white hover:bg-white hover:text-slate-950"
              >
                Find Jobs
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-[2rem] bg-purple-600/20 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 p-3 shadow-2xl shadow-purple-950/60">
              <img
                src="/images/career-hero.jpg"
                alt="Career Craft job platform"
                className="h-[430px] w-full rounded-[1.5rem] object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-100 px-6 py-16 text-slate-950">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase text-purple-600">
            Platform Areas
          </p>

          <h2 className="mt-3 max-w-2xl text-3xl font-black">
            One platform for candidates, recruiters, and admins.
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">Admin</h3>
              <p className="mt-3 text-slate-600">
                Manage users, companies, categories, settings, and platform
                analytics.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">Recruiter</h3>
              <p className="mt-3 text-slate-600">
                Create job posts, review candidates, and update application
                status.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold">Candidate</h3>
              <p className="mt-3 text-slate-600">
                Build a profile, browse jobs, apply, and track application
                progress.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
