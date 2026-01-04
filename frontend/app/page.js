"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const WEDDING_DATE = "2026-06-06T12:00:00";
const CEREMONY_LOCATION = "Iglesia de Santa Elena, Revilla Cabriada (Burgos)";
const RECEPTION_LOCATION = "Finca Santa Rosalía, Vizmalo (Burgos)";

const timeline = [
  { time: "11:30", title: "Llegada invitados", description: "Os esperamos en la iglesia" },
  { time: "12:00", title: "Ceremonia", description: "Boda en Iglesia de Santa Elena" },
  { time: "13:15", title: "Bus a la finca", description: "Traslado a Finca Santa Rosalía" },
  { time: "14:00", title: "Cóctel en jardines", description: "Brindis y aperitivos al aire libre" },
  { time: "16:00", title: "Comida", description: "Banquete en la finca" },
  { time: "18:00", title: "Chill out", description: "Relax entre viñedos" },
  { time: "21:00", title: "Fiesta con DJ", description: "A bailar hasta que el cuerpo aguante" },
];

export default function HomePage() {
  const [showIntro, setShowIntro] = useState(true);
  const [introState, setIntroState] = useState("idle");
  const [muted, setMuted] = useState(false);
  const [showIban, setShowIban] = useState(false);
  const [rsvpStep, setRsvpStep] = useState("form"); // form | video | thanks
  const [attendance, setAttendance] = useState("yes");
  const audioRef = useRef(null);
  const introVideoRef = useRef(null);
  const confirmationVideoRef = useRef(null);

  useEffect(() => {
    const video = introVideoRef.current;
    if (!video) return;
    const handleTime = () => {
      if (video.duration && video.duration - video.currentTime < 0.8 && introState === "playing") {
        setIntroState("fading");
        setTimeout(() => setShowIntro(false), 600);
      }
    };
    video.addEventListener("timeupdate", handleTime);
    return () => video.removeEventListener("timeupdate", handleTime);
  }, [introState]);

  const handleEnter = () => {
    if (introState !== "idle") return;
    setIntroState("playing");
    introVideoRef.current?.play().catch(() => {});
    audioRef.current?.play().catch(() => {});
  };

  const toggleSound = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = !audio.muted;
    setMuted(audio.muted);
    if (audio.paused) {
      audio.play().catch(() => {});
    }
  };

  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE);

  const handleScrollToRsvp = () => {
    document.getElementById("rsvp")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitRsvp = (event) => {
    event.preventDefault();
    setRsvpStep(attendance === "yes" ? "video" : "thanks");
    if (attendance === "yes") {
      confirmationVideoRef.current?.play().catch(() => setRsvpStep("thanks"));
    }
  };

  const onVideoEnd = () => setRsvpStep("thanks");

  return (
    <main className="min-h-screen bg-ivory text-sage-dark">
      <audio ref={audioRef} src="/assets/intro-music-S2szIoUv.mp3" loop preload="auto" muted={muted} />

      <button
        onClick={toggleSound}
        className="fixed right-4 top-4 z-50 rounded-full bg-sage-dark/90 px-4 py-2 text-sm text-ivory shadow-lg transition hover:scale-95"
      >
        {muted ? "Activar música" : "Silenciar"}
      </button>

      {showIntro && (
        <div
          className="fixed inset-0 z-40 cursor-pointer overflow-hidden bg-ivory transition-opacity"
          style={{ opacity: introState === "fading" ? 0 : 1 }}
          onClick={handleEnter}
        >
          <video
            ref={introVideoRef}
            className="h-full w-full object-cover"
            poster="/assets/intro-poster-BQrMtd4k.png"
            src="/assets/intro-video-BpkZMtTn.mov"
            muted
            playsInline
            preload="auto"
          />
          <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/50 via-black/20 to-transparent p-8 text-center text-ivory">
            <div className="space-y-2">
              <p className="font-body text-xs tracking-[0.3em] uppercase">Haz clic para entrar</p>
              <p className="font-script text-3xl md:text-4xl">Aitana &amp; Flavio</p>
            </div>
          </div>
        </div>
      )}

      <Hero onCtaClick={handleScrollToRsvp} />
      <SectionSeparator />
      <Countdown days={days} hours={hours} minutes={minutes} seconds={seconds} />
      <SectionSeparator />
      <Details />
      <SectionSeparator />
      <Venues />
      <SectionSeparator />
      <Timeline />
      <SectionSeparator />
      <InfoCards />
      <SectionSeparator />
      <Gifts showIban={showIban} onRevealIban={() => setShowIban(true)} />
      <SectionSeparator />
      <Rsvp
        onSubmit={handleSubmitRsvp}
        attendance={attendance}
        setAttendance={setAttendance}
        step={rsvpStep}
        confirmationVideoRef={confirmationVideoRef}
        onVideoEnd={onVideoEnd}
      />
      <Footer />
    </main>
  );
}

function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState(() => new Date(target).getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(new Date(target).getTime() - Date.now()), 1000);
    return () => clearInterval(id);
  }, [target]);

  return useMemo(() => {
    const total = Math.max(timeLeft, 0);
    const days = Math.floor(total / (1000 * 60 * 60 * 24));
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((total / (1000 * 60)) % 60);
    const seconds = Math.floor((total / 1000) % 60);
    return { days, hours, minutes, seconds };
  }, [timeLeft]);
}

function Hero({ onCtaClick }) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/assets/intro-video-BSNlV4m4.webm"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center text-ivory">
        <p className="font-body text-xs uppercase tracking-[0.5em] text-ivory/80">Nos casamos</p>
        <h1 className="mt-4 flex flex-col items-center gap-2">
          <span className="font-script text-5xl md:text-7xl drop-shadow-lg">Aitana</span>
          <span className="font-display text-2xl md:text-3xl italic text-gold drop-shadow"> &amp; </span>
          <span className="font-script text-5xl md:text-7xl drop-shadow-lg">Flavio</span>
        </h1>
        <p className="mt-6 font-display text-lg md:text-2xl text-ivory/90 drop-shadow-sm">
          6 de junio de 2026 · {CEREMONY_LOCATION}
        </p>
        <button
          onClick={onCtaClick}
          className="mt-10 flex flex-col items-center gap-3 text-sm uppercase tracking-[0.3em] text-ivory/80 transition hover:text-ivory"
        >
          Confirmar asistencia
          <span className="animate-bounce text-xl">⌄</span>
        </button>
      </div>
    </section>
  );
}

function Countdown({ days, hours, minutes, seconds }) {
  const items = [
    { label: "Días", value: days },
    { label: "Horas", value: hours },
    { label: "Minutos", value: minutes },
    { label: "Segundos", value: seconds },
  ];

  return (
    <section className="bg-sage-dark py-16 text-ivory">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="font-script text-4xl md:text-5xl">Cuenta atrás</h2>
        <p className="mt-2 font-body text-lg text-ivory/80">Para el día más especial de nuestras vidas</p>
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.label}
              className="rounded-xl border border-ivory/10 bg-white/10 px-6 py-5 backdrop-blur-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="font-display text-4xl md:text-5xl">{String(item.value).padStart(2, "0")}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.3em] text-ivory/70">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Details() {
  const calendarUrl = buildCalendarUrl("Boda Aitana & Flavio - Ceremonia", WEDDING_DATE, CEREMONY_LOCATION);
  const celebrationCalendar = buildCalendarUrl("Celebración en Finca Santa Rosalía", WEDDING_DATE, RECEPTION_LOCATION);

  return (
    <section className="bg-ivory py-16 sm:py-20" id="detalles">
      <div className="mx-auto max-w-5xl px-6">
        <SectionTitle title="Detalles del día" subtitle="Todo lo que necesitas saber" />
        <div className="overflow-hidden rounded-2xl border border-cream/60 bg-white/80 shadow-lg">
          <div className="grid items-center gap-8 md:grid-cols-2">
            <div className="p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sage/20 text-sage-dark">
                <span className="text-xl">📍</span>
              </div>
              <h3 className="mt-4 font-display text-2xl text-sage-dark">Iglesia de Santa Elena</h3>
              <p className="mt-2 font-body text-sage-dark/80">Revilla Cabriada · Burgos</p>
              <p className="mt-4 font-body text-sm text-sage-dark/70">
                Ceremonia religiosa en la iglesia de Santa Elena. Tras la ceremonia nos desplazamos a Finca Santa Rosalía en Vizmalo para
                el cóctel, la comida y la fiesta.
              </p>
              <div className="mt-6 flex flex-col gap-3 text-sm font-display text-sage-dark">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🕑</span>
                  <span>17:00 h — 01:00 h</span>
                </div>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <a
                    href="https://www.google.com/maps?q=Iglesia+de+Santa+Elena+Revilla+Cabriada&output=embed"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full rounded-full border border-sage-dark/40 px-4 py-2 text-center text-sage-dark transition hover:bg-sage-dark hover:text-ivory sm:w-auto"
                  >
                    Ceremonia
                  </a>
                  <a
                    href="https://www.google.com/maps?q=Finca+Santa+Rosal%C3%ADa+Vizmalo&output=embed"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full rounded-full border border-sage-dark/40 px-4 py-2 text-center text-sage-dark transition hover:bg-sage-dark hover:text-ivory sm:w-auto"
                  >
                    Celebración
                  </a>
                  <a
                    href={calendarUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full rounded-full border border-sage-dark/40 px-4 py-2 text-center text-sage-dark transition hover:bg-sage-dark hover:text-ivory sm:w-auto"
                  >
                    Añadir ceremonia
                  </a>
                  <a
                    href={celebrationCalendar}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full rounded-full border border-sage-dark/40 px-4 py-2 text-center text-sage-dark transition hover:bg-sage-dark hover:text-ivory sm:w-auto"
                  >
                    Añadir celebración
                  </a>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden">
              <img
                src="/assets/finca-biniagual-tpK1hn9e.webp"
                alt="Finca Santa Rosalía"
                className="h-full w-full object-cover transition duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
            </div>
          </div>
          <iframe
            title="Mapa Finca Santa Rosalía"
            src="https://www.google.com/maps?q=Finca+Santa+Rosal%C3%ADa+Vizmalo&output=embed"
            className="h-72 w-full border-t border-cream/60"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}

function Venues() {
  const cards = [
    {
      title: "Iglesia de Santa Elena",
      location: "Revilla Cabriada, Burgos",
      time: "11:30 - 13:00",
      image: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Iglesia_de_Santa_Elena%2C_Revilla_Cabriada.jpg",
      description: "Llegada de invitados y ceremonia.",
      map: "https://www.google.com/maps?q=Iglesia+de+Santa+Elena+Revilla+Cabriada&output=embed",
    },
    {
      title: "Finca Santa Rosalía",
      location: "Vizmalo, Burgos",
      time: "14:00 - 02:00",
      image: "https://fincasantarosalia.com/wp-content/uploads/2023/01/bodas_en_la_finca_santa_rosalia.jpg",
      description: "Bus desde la iglesia, cóctel, comida y fiesta con DJ.",
      map: "https://www.google.com/maps?q=Finca+Santa+Rosalia+Vizmalo&output=embed",
    },
  ];

  return (
    <section className="bg-ivory py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle title="Lugares" subtitle="Dos paradas, un mismo día inolvidable" />
        <div className="grid gap-6 md:grid-cols-2">
          {cards.map((card) => (
            <div key={card.title} className="overflow-hidden rounded-2xl border border-cream/70 bg-white/80 shadow-sm">
              <img src={card.image} alt={card.title} className="h-56 w-full object-cover" />
              <div className="space-y-2 p-6">
                <div className="flex items-center justify-between">
                  <p className="font-display text-xl text-sage-dark">{card.title}</p>
                  <span className="rounded-full bg-sage/20 px-3 py-1 text-xs font-display text-sage-dark">{card.time}</span>
                </div>
                <p className="text-sm text-sage-dark/70">{card.location}</p>
                <p className="text-sm text-sage-dark/80">{card.description}</p>
                <div className="overflow-hidden rounded-lg border border-cream/60">
                  <iframe title={card.title} src={card.map} className="h-48 w-full" loading="lazy" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <SectionTitle title="Programa del día" subtitle="Así queremos vivirlo contigo" />
        <div className="hidden gap-4 md:grid md:grid-cols-7">
          {timeline.map((item, index) => (
            <div
              key={item.time}
              className="relative flex flex-col items-center rounded-xl border border-cream/70 bg-ivory p-4 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="rounded-full bg-sage-dark px-3 py-1 text-sm text-ivory">{item.time}</div>
              <div className="mt-3 text-2xl">✺</div>
              <p className="mt-2 font-display text-base text-sage-dark">{item.title}</p>
              <p className="mt-1 text-sm text-sage-dark/70">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="space-y-4 md:hidden">
          {timeline.map((item) => (
            <div
              key={item.time}
              className="flex gap-4 rounded-xl border border-cream/70 bg-ivory p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sage-dark text-ivory">{item.time}</div>
              <div>
                <p className="font-display text-base text-sage-dark">{item.title}</p>
                <p className="text-sm text-sage-dark/70">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InfoCards() {
  const cards = [
    {
      title: "Dress code",
      body: "Elegante de verano. Colores suaves y tejidos ligeros para disfrutar de la finca. Evita el blanco y los tonos marfil.",
      icon: "🌾",
    },
    {
      title: "Niños",
      body: "Los peques son bienvenidos. Tendremos zona de juegos y cuidadoras para que todos podamos disfrutar.",
      icon: "🧸",
    },
    {
      title: "Alojamiento",
      body: "Hay hoteles rurales y casas cerca de Revilla Cabriada y Vizmalo, y más opciones en Burgos capital. Te ayudamos con recomendaciones si lo necesitas.",
      icon: "🏡",
    },
  ];

  return (
    <section className="bg-ivory py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <SectionTitle title="Información útil" subtitle="Pequeños detalles que nos ayudarán a todos" />
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="flex flex-col gap-3 rounded-2xl border border-cream/70 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span className="text-2xl">{card.icon}</span>
              <p className="font-display text-xl text-sage-dark">{card.title}</p>
              <p className="text-sm text-sage-dark/70">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gifts({ showIban, onRevealIban }) {
  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <SectionTitle title="Regalos" subtitle="Tu presencia es nuestro mayor regalo" />
        <p className="font-body text-base text-sage-dark/80">
          Si lo prefieres, el regalo puede ser en efectivo el día de la boda o mediante transferencia.
        </p>
        <div className="mt-6 space-y-3">
          {showIban ? (
            <div className="space-y-1 rounded-xl border border-sage-dark/40 bg-white/80 p-4 font-mono text-sage-dark">
              <p className="text-xs uppercase tracking-[0.3em] text-sage-dark/70">IBAN</p>
              <p className="select-all text-lg">ES00 0000 0000 0000 0000 0000</p>
              <p className="text-xs text-sage-dark/60">Concepto: Boda Aitana &amp; Flavio</p>
            </div>
          ) : (
            <button
              onClick={onRevealIban}
              className="rounded-full border border-sage-dark/40 px-5 py-3 text-sm font-display text-sage-dark transition hover:bg-sage-dark hover:text-ivory"
            >
              Mostrar datos para transferencia
            </button>
          )}
        </div>
        <div className="mt-8 flex justify-center">
          <img src="/assets/confetti-CrGrT4ka.gif" alt="Confeti" className="h-20 w-20 rounded-full object-cover shadow" />
        </div>
      </div>
    </section>
  );
}

function Rsvp({ onSubmit, attendance, setAttendance, step, confirmationVideoRef, onVideoEnd }) {
  return (
    <section className="bg-ivory py-16 sm:py-20" id="rsvp">
      <div className="mx-auto max-w-3xl px-6">
        <SectionTitle title="Confirmar asistencia" subtitle="Cuéntanos si podrás acompañarnos" />

        {step === "video" && (
          <div className="relative mb-6 overflow-hidden rounded-2xl border border-cream/70 shadow-lg">
            <video
              ref={confirmationVideoRef}
              className="h-[420px] w-full object-cover"
              src="/assets/rsvp-confirmation-DYbKwzwP.webm"
              autoPlay
              muted
              playsInline
              onEnded={onVideoEnd}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
        )}

        {step === "thanks" ? (
          <div className="rounded-2xl border border-cream/70 bg-white/80 p-8 text-center shadow-sm">
            <p className="font-script text-3xl text-sage-dark">¡Gracias!</p>
            <p className="mt-2 font-body text-sage-dark/80">
              Nos hace muchísima ilusión compartir este día contigo. Si necesitas algo, avísanos.
            </p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="space-y-6 rounded-2xl border border-cream/70 bg-white/80 p-6 shadow-sm backdrop-blur"
          >
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-display text-sage-dark">
                Nombre completo
                <input
                  required
                  className="rounded-md border border-cream/70 bg-ivory px-3 py-2 text-sm"
                  placeholder="Tu nombre"
                  name="name"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-display text-sage-dark">
                Email
                <input className="rounded-md border border-cream/70 bg-ivory px-3 py-2 text-sm" placeholder="Opcional" name="email" />
              </label>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-display text-sage-dark">
                Asistencia
                <select
                  className="rounded-md border border-cream/70 bg-ivory px-3 py-2 text-sm"
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                >
                  <option value="yes">Sí, asistiré</option>
                  <option value="no">No podré asistir</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-display text-sage-dark">
                Número de acompañantes
                <input
                  type="number"
                  min={1}
                  defaultValue={1}
                  className="rounded-md border border-cream/70 bg-ivory px-3 py-2 text-sm"
                  name="guests"
                />
              </label>
            </div>

            <label className="flex flex-col gap-2 text-sm font-display text-sage-dark">
              Alergias o restricciones
              <textarea
                className="rounded-md border border-cream/70 bg-ivory px-3 py-2 text-sm"
                rows={3}
                placeholder="Cuéntanos lo que necesitemos saber"
                name="allergies"
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-display text-sage-dark">
              Mensaje para los novios
              <textarea
                className="rounded-md border border-cream/70 bg-ivory px-3 py-2 text-sm"
                rows={3}
                placeholder="Nos encantará leerte"
                name="message"
              />
            </label>

            <button
              type="submit"
              className="w-full rounded-full bg-sage-dark px-6 py-3 text-sm font-display text-ivory transition hover:-translate-y-1 hover:bg-sage"
            >
              Enviar confirmación
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-sage-dark py-12 text-center text-ivory">
      <div className="space-y-2">
        <p className="font-script text-3xl">Aitana &amp; Flavio</p>
        <p className="text-sm text-ivory/80">6 de junio de 2026 · {CEREMONY_LOCATION}</p>
        <p className="text-xs text-ivory/60">Hecho con amor · Las mismas imágenes y vídeos del sitio original</p>
      </div>
    </footer>
  );
}

function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-10 text-center">
      <p className="font-script text-4xl text-sage-dark">{title}</p>
      {subtitle && <p className="mt-2 font-body text-sage-dark/70">{subtitle}</p>}
    </div>
  );
}

function SectionSeparator() {
  return (
    <div className="flex items-center justify-center bg-ivory py-3">
      <span className="h-px w-24 bg-sage-dark/30" />
      <span className="mx-3 text-sage-dark/60">✦</span>
      <span className="h-px w-24 bg-sage-dark/30" />
    </div>
  );
}

function buildCalendarUrl(title, isoDate, location) {
  const start = new Date(isoDate);
  const end = new Date(start.getTime() + 8 * 60 * 60 * 1000);
  const format = (date) => date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${format(start)}/${format(
    end,
  )}&location=${encodeURIComponent(location)}&details=${encodeURIComponent("Celebración de la boda de Aitana y Flavio")}`;
}
