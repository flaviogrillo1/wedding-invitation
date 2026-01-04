"use client";

import { useState } from "react";

const USERNAME = "flaviogrillo";
const PASSWORD = "6Junio2026";

export default function DataPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [authorized, setAuthorized] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (user === USERNAME && pass === PASSWORD) {
      setAuthorized(true);
      setError("");
    } else {
      setError("Credenciales incorrectas");
      setAuthorized(false);
    }
  };

  return (
    <main className="min-h-screen bg-ivory text-sage-dark">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6">
        <h1 className="text-center font-display text-3xl text-sage-dark">Acceso a datos</h1>
        {!authorized ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-cream/70 bg-white/80 p-6 shadow-sm backdrop-blur"
          >
            <div className="flex flex-col gap-2 text-sm font-display text-sage-dark">
              <label htmlFor="username">Usuario</label>
              <input
                id="username"
                name="username"
                className="rounded-md border border-cream/70 bg-ivory px-3 py-2 text-sm"
                value={user}
                onChange={(e) => setUser(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="flex flex-col gap-2 text-sm font-display text-sage-dark">
              <label htmlFor="password">Contraseña</label>
              <input
                id="password"
                name="password"
                type="password"
                className="rounded-md border border-cream/70 bg-ivory px-3 py-2 text-sm"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                autoComplete="current-password"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit"
              className="w-full rounded-full bg-sage-dark px-6 py-3 text-sm font-display text-ivory transition hover:-translate-y-1 hover:bg-sage"
            >
              Entrar
            </button>
          </form>
        ) : (
          <div className="space-y-4 rounded-2xl border border-cream/70 bg-white/80 p-4 shadow-sm">
            <p className="text-sm font-display text-sage-dark">Dashboard RSVP</p>
            <div className="h-[calc(100vh-160px)] w-full">
              <iframe
                className="h-full w-full"
                src="https://airtable.com/embed/appnBdK6mY1gGFKKg/shrVP6IU11FjKrNXJ"
                frameBorder="0"
                style={{ background: "transparent", border: "1px solid #ccc" }}
                title="RSVP Dashboard"
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
