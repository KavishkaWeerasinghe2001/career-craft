export default function PublicFooter() {
  return (
    <footer className="border-t border-purple-500/20 bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
        <div>
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-600 text-base font-black shadow-lg shadow-purple-600/30">
              CC
            </div>

            <div>
              <p className="text-lg font-bold leading-none">Career Craft</p>
              <p className="mt-1 text-xs text-purple-200">Job Board</p>
            </div>
          </a>

          <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
            A job application platform for candidates, recruiters, and admins.
          </p>
        </div>

        <div>
          <p className="font-semibold">Quick Links</p>

          <div className="mt-4 space-y-2 text-sm text-slate-400">
            <a href="/" className="block hover:text-purple-300">
              Home
            </a>
            <a href="/jobs" className="block hover:text-purple-300">
              Find Jobs
            </a>
            <a href="/login" className="block hover:text-purple-300">
              Login
            </a>
            <a href="/register" className="block hover:text-purple-300">
              Register
            </a>
          </div>
        </div>

        <div>
          <p className="font-semibold">Platform</p>

          <div className="mt-4 space-y-2 text-sm text-slate-400">
            <p>Admin dashboard</p>
            <p>Recruiter dashboard</p>
            <p>Candidate dashboard</p>
            <p>Application tracking</p>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-purple-500/20 pt-6 text-sm text-slate-500">
        © 2026 Career Craft. All rights reserved.
      </div>
    </footer>
  );
}