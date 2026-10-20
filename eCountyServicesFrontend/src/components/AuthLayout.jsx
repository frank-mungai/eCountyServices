export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <aside className="relative hidden flex-col justify-between bg-brand p-12 text-white lg:flex">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-full bg-white text-lg font-bold text-brand">
            GP
          </div>
          <span className="text-lg font-semibold">Government Services Portal</span>
        </div>

        <div>
          <h2 className="max-w-md text-4xl font-semibold leading-tight">
            Government services, in one place.
          </h2>
          <p className="mt-4 max-w-md text-white/80">
            Apply for permits, pay fees and track your applications with a single account.
          </p>
        </div>

        <div className="flex h-1.5 w-40 overflow-hidden rounded-full">
          <span className="flex-1 bg-black" />
          <span className="flex-1 bg-flag-red" />
          <span className="flex-1 bg-white" />
        </div>
      </aside>

      <main className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <h1 className="text-2xl font-semibold">{title}</h1>
          {subtitle && <p className="mt-1 text-slate-600">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-center text-sm text-slate-600">{footer}</div>}
        </div>
      </main>
    </div>
  );
}
