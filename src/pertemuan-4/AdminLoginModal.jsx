export default function AdminLoginModal({
  showLoginModal,
  setShowLoginModal,
  loginForm,
  handleLoginChange,
  handleLoginSubmit,
  loginError,
  setLoginError
}) {
  if (!showLoginModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Login Admin</h2>
          <button
            onClick={() => {
              setShowLoginModal(false);
              setLoginError("");
            }}
            className="rounded-lg px-3 py-1 text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            value={loginForm.email}
            onChange={handleLoginChange}
            placeholder="Email"
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <input
            type="password"
            name="password"
            value={loginForm.password}
            onChange={handleLoginChange}
            placeholder="Sandi"
            className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Login
          </button>

          {loginError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {loginError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}