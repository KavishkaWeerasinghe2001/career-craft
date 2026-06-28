import { registerUser } from "./actions";

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080312] px-6 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        <p className="mt-4 inline-flex rounded-full bg-purple-100 px-4 py-2 text-sm font-bold text-purple-700">
          Create your account
        </p>

        <h1 className="mt-6 text-3xl font-black text-slate-950">Register</h1>
        <p className="mt-2 text-slate-600">
          Create your account as a candidate or recruiter.
        </p>

        <form action={registerUser} className="mt-8 space-y-5">
          <div>
            <label className="text-sm font-semibold text-slate-700">
              Full Name
            </label>
            <input
              name="name"
              type="text"
              placeholder="Your full name"
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Email</label>
            <input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Role</label>
            <select
              name="role"
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-purple-500 focus:outline-none"
            >
              <option value="CANDIDATE">Candidate</option>
              <option value="RECRUITER">Recruiter</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Create a password"
              required
              minLength={6}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full rounded-xl bg-purple-700 px-6 py-4 text-base font-bold text-white shadow-lg shadow-purple-400/30 hover:bg-purple-800"
            >
              Create Account
            </button>

            <a
              href="/"
              className="block w-full rounded-xl border border-purple-200 px-6 py-4 text-center text-base font-bold text-purple-700 hover:bg-purple-50"
            >
              Cancel
            </a>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <a href="/login" className="font-bold text-purple-700">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}