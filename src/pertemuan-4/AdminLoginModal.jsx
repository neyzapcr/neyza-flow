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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-[34px] border-[3px] border-black/10 bg-white/90 p-6 shadow-2xl">
        <div className="absolute left-4 top-4 text-xl">💚</div>
        <div className="absolute right-14 top-4 text-xl">✨</div>
        <div className="absolute bottom-4 left-6 text-xl">🐰</div>
        <div className="absolute bottom-4 right-6 text-xl">📱</div>

        <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-lime-300/40 blur-2xl"></div>
        <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-full bg-violet-300/40 blur-2xl"></div>

        <div className="relative mb-5 flex items-center justify-between">
          <div>
            <p className="mb-2 inline-block rounded-full bg-lime-100 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-700">
              Admin Access
            </p>
            <h2 className="text-2xl font-black text-slate-800">
              Login Admin 🔐
            </h2>
          </div>

          <button
            onClick={() => {
              setShowLoginModal(false);
              setLoginError("");
            }}
            className="rounded-full bg-slate-100 px-3 py-1 font-bold text-slate-500 transition hover:bg-slate-200"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleLoginSubmit} className="relative space-y-4">
          <input
            type="email"
            name="email"
            value={loginForm.email}
            onChange={handleLoginChange}
            placeholder="Email 💌"
            className="w-full rounded-full border-2 border-lime-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-lime-400 focus:ring-4 focus:ring-lime-100"
          />

          <input
            type="password"
            name="password"
            value={loginForm.password}
            onChange={handleLoginChange}
            placeholder="Sandi 🔑"
            className="w-full rounded-full border-2 border-violet-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-100"
          />

          <button
            type="submit"
            className="w-full rounded-full border-2 border-black/10 bg-gradient-to-r from-[#c9f76f] to-[#d8c8ff] px-4 py-3 font-black text-slate-800 shadow-lg transition hover:scale-[1.01]"
          >
            Login ✨
          </button>

          {loginError && (
            <div className="rounded-[20px] border border-rose-200 bg-rose-50 p-3 text-sm font-bold text-rose-700">
              {loginError}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}