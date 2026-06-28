import { loginUser } from "./actions";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

function getErrorMessage(error?: string) {
  if (error === "missing") {
    return "Please enter both email and password.";
  }

  if (error === "invalid") {
    return "Invalid email or password. Please try again.";
  }

  return "";
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : {};
  const errorMessage = getErrorMessage(params.error);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080312] px-6 py-10">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        

        <p className="mt-4 inline-flex rounded-full bg-purple-100 px-4 py-2 text-sm font-bold text-purple-700">
          Welcome back
        </p>

        <h1 className="mt-6 text-3xl font-black text-slate-950">Login</h1>
        <p className="mt-2 text-slate-600">Sign in to access your dashboard.</p>

        {errorMessage && (
          <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        <form action={loginUser} className="mt-8 space-y-5">
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
            <label className="text-sm font-semibold text-slate-700">
              Password
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 focus:border-purple-500 focus:outline-none"
            />
          </div>

          <div className="space-y-3">
            <button
              type="submit"
              className="w-full rounded-xl bg-purple-700 px-6 py-4 text-base font-bold text-white shadow-lg shadow-purple-400/30 hover:bg-purple-800"
            >
              Login
            </button>

            <a
              href="/"
              className="block w-full rounded-xl border border-purple-200 px-6 py-4 text-center text-base font-bold text-purple-700 hover:bg-purple-50"
            >
              Cancel
            </a>
          </div>
        </form>

        <div className="mt-6 rounded-2xl bg-purple-50 p-4 text-sm text-slate-700">
          <p className="font-bold text-slate-950">Test Accounts</p>
          <p className="mt-2">Admin: admin@careercraft.test</p>
          <p>Recruiter: recruiter@careercraft.test</p>
          <p>Candidate: candidate@careercraft.test</p>
          <p className="mt-2">Password: Password123!</p>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          Do not have an account?{" "}
          <a href="/register" className="font-bold text-purple-700">
            Register
          </a>
        </p>
      </div>
    </main>
  );
}