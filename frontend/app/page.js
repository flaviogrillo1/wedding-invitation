"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const WEDDING_DATE = "2026-06-06T12:00:00";
const CEREMONY_LOCATION = "Iglesia de Santa Elena, Revilla-Cabriada (Burgos)";
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
  const [contentVisible, setContentVisible] = useState(false);
  const [muted, setMuted] = useState(false);
  const [showIban, setShowIban] = useState(false);
  const [rsvpStep, setRsvpStep] = useState("form"); // form | video | thanks
  const [attendance, setAttendance] = useState("yes");
  const [totalPeople, setTotalPeople] = useState(1);
  const [persons, setPersons] = useState([{ name: "", hasAllergies: false, allergies: "" }]);
  const [busNeeded, setBusNeeded] = useState("no");
  const [playConfirmVideo, setPlayConfirmVideo] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rsvpMessage, setRsvpMessage] = useState("");
  const audioRef = useRef(null);
  const introVideoRef = useRef(null);
  const confirmationVideoRef = useRef(null);

  useEffect(() => {
    const video = introVideoRef.current;
    if (!video) return;
    const handleTime = () => {
      if (video.duration && video.duration - video.currentTime < 0.8 && introState === "playing") {
        setIntroState("fading");
        setContentVisible(true);
        setTimeout(() => setShowIntro(false), 700);
      }
    };
    video.addEventListener("timeupdate", handleTime);
    return () => video.removeEventListener("timeupdate", handleTime);
  }, [introState]);

  useEffect(() => {
    setPersons((prev) => {
      if (totalPeople > prev.length) {
        const additions = Array.from({ length: totalPeople - prev.length }, () => ({ name: "", hasAllergies: false, allergies: "" }));
        return [...prev, ...additions];
      }
      if (totalPeople < prev.length) {
        return prev.slice(0, totalPeople);
      }
      return prev;
    });
  }, [totalPeople]);

  useEffect(() => {
    if (attendance === "no") {
      setBusNeeded("no");
    }
  }, [attendance]);

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

  const handleSubmitRsvp = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const attendanceValue = attendance;
    const normalizedPersons =
      attendanceValue === "yes"
        ? persons.slice(0, totalPeople).map((person) => ({
            name: person.name.trim(),
            hasAllergies: Boolean(person.hasAllergies),
            allergies: person.hasAllergies ? person.allergies.trim() : "",
          }))
        : [];

    const payload = {
      contactName: formData.get("contactName")?.toString().trim() || "",
      contactEmail: formData.get("contactEmail")?.toString().trim() || "",
      attendance: attendanceValue,
      totalPeople: attendanceValue === "yes" ? totalPeople : 0,
      persons: normalizedPersons,
      busNeeded: attendanceValue === "yes" && busNeeded === "yes",
      busOrigin: attendanceValue === "yes" && busNeeded === "yes" ? formData.get("busOrigin")?.toString() || "" : "",
      busTrip: attendanceValue === "yes" && busNeeded === "yes" ? formData.get("busTrip")?.toString() || "" : "",
      message: formData.get("message")?.toString().trim() || "",
    };

    try {
      setIsSubmitting(true);
      setRsvpMessage("");
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const detail = errJson.detail || errJson.error || "Error al enviar la confirmaci?n";
        throw new Error(detail);
      }
      setRsvpMessage("Confirmación enviada. Gracias!");
      if (payload.attendance === "yes") {
        setPlayConfirmVideo(true);
        setRsvpStep("thanks");
        setTimeout(() => confirmationVideoRef.current?.play().catch(() => {}), 50);
      } else {
        setPlayConfirmVideo(false);
        setRsvpStep("thanks");
      }
    } catch (error) {
      setRsvpMessage(`No se pudo enviar: ${error.message || "Int?ntalo de nuevo."}`);
    } finally {
      setIsSubmitting(false);
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
          className="fixed inset-0 z-40 cursor-pointer overflow-hidden bg-ivory transition-opacity duration-700"
          style={{ opacity: introState === "fading" ? 0 : 1 }}
          onClick={handleEnter}
        >
          <video
            ref={introVideoRef}
            className="h-full w-full object-cover"
            poster="/assets/intro-poster-BQrMtd4k.png"
            src="/assets/videosobre.mp4"
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

      <div
        className={`relative transform-gpu transition-all duration-700 ease-out ${
          contentVisible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-6 opacity-0"
        }`}
      >
        <Hero onCtaClick={handleScrollToRsvp} />
        <Countdown days={days} hours={hours} minutes={minutes} seconds={seconds} />
        <Details />
        <SectionSeparator />
        <Timeline />
        <SectionSeparator />
        <InfoCards />
        <SectionSeparator />
        <Lodging />
        <SectionSeparator />
        <Gifts showIban={showIban} onRevealIban={() => setShowIban(true)} />
        <SectionSeparator />
        <Faq />
        <SectionSeparator />
        <Rsvp
          onSubmit={handleSubmitRsvp}
          attendance={attendance}
          setAttendance={setAttendance}
          totalPeople={totalPeople}
          setTotalPeople={setTotalPeople}
          persons={persons}
          setPersons={setPersons}
          busNeeded={busNeeded}
          setBusNeeded={setBusNeeded}
          playConfirmVideo={playConfirmVideo}
          step={rsvpStep}
          confirmationVideoRef={confirmationVideoRef}
          onVideoEnd={onVideoEnd}
          isSubmitting={isSubmitting}
          rsvpMessage={rsvpMessage}
        />
        <Footer />
      </div>
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
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  const safe = (v) => (isClient ? v : "--");

  const items = [
    { label: "Días", value: safe(days) },
    { label: "Horas", value: safe(hours) },
    { label: "Minutos", value: safe(minutes) },
    { label: "Segundos", value: safe(seconds) },
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
  const calendarUrl = buildCalendarUrl("Ceremonia - Aitana & Flavio", WEDDING_DATE, CEREMONY_LOCATION);
  const celebrationCalendar = buildCalendarUrl("Celebración - Aitana & Flavio", WEDDING_DATE, RECEPTION_LOCATION);

  return (
    <section className="bg-ivory py-16 sm:py-20" id="detalles">
      <div className="mx-auto max-w-6xl px-6">
        <SectionTitle title="Lugares" subtitle="Ceremonia y celebración" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-cream/70 bg-white/80 shadow-sm">
            <img
              src="https://lh3.googleusercontent.com/gps-cs-s/AG0ilSx94tRebQJlJdKCjH446ixgDhTGYfZxfQowKZpc4uM6-IKhgfGKQQotGDcq3fi00gdG3bgUemYks4eJ85eK-f4-i8FQSY3VHAWUbuXOFtseJDY25wrIlNrIUATEg7lrupgAja8KjQ=s1360-w1360-h1020-rw"
              alt="Iglesia de Santa Elena en Revilla-Cabriada"
              className="h-56 w-full object-cover"
            />
            <div className="space-y-3 p-6">
              <div className="flex items-center justify-between">
                <p className="font-display text-xl text-sage-dark">Iglesia de Santa Elena</p>
                <span className="rounded-full bg-sage/20 px-3 py-1 text-xs font-display text-sage-dark">11:30 · 13:15</span>
              </div>
              <p className="text-sm text-sage-dark/70">Revilla-Cabriada (Burgos)</p>
              <p className="text-sm text-sage-dark/80">
                Llegada de invitados a las 11:30, boda a las 12:00. Después, bus a la finca a las 13:15.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://www.google.com/maps?q=Iglesia+de+Santa+Elena+Revilla-Cabriada&hl=es&output=embed"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-sage-dark/40 px-4 py-2 text-sm font-display text-sage-dark transition hover:bg-sage-dark hover:text-ivory"
                >
                  Ver en mapa
                </a>
                <a
                  href={calendarUrl}
                  download="ceremonia.ics"
                  className="rounded-full border border-sage-dark/40 px-4 py-2 text-sm font-display text-sage-dark transition hover:bg-sage-dark hover:text-ivory"
                >
                  Añadir a calendario
                </a>
              </div>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-cream/70 bg-white/80 shadow-sm">
            <img
              src="https://www.fincasantarosalia.com/wp-content/uploads/2024/01/Restaurante_1-1-scaled.jpg"
              alt="Finca Santa Rosalía"
              className="h-56 w-full object-cover"
            />
            <div className="space-y-3 p-6">
              <div className="flex items-center justify-between">
                <p className="font-display text-xl text-sage-dark">Finca Santa Rosalía</p>
                <span className="rounded-full bg-sage/20 px-3 py-1 text-xs font-display text-sage-dark">14:00 · 02:00</span>
              </div>
              <p className="text-sm text-sage-dark/70">Vizmalo (Burgos)</p>
              <p className="text-sm text-sage-dark/80">
                Bus desde la iglesia 13:15. Cóctel en jardines 14:00, comida 16:00, chill out y fiesta con DJ hasta tarde.
              </p>
              <div className="flex flex-wrap gap-2">
                <a
                  href="https://www.google.com/maps?q=Finca+Santa+Rosalia+Vizmalo&hl=es&output=embed"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-sage-dark/40 px-4 py-2 text-sm font-display text-sage-dark transition hover:bg-sage-dark hover:text-ivory"
                >
                  Ver en mapa
                </a>
                <a
                  href={celebrationCalendar}
                  download="celebracion.ics"
                  className="rounded-full border border-sage-dark/40 px-4 py-2 text-sm font-display text-sage-dark transition hover:bg-sage-dark hover:text-ivory"
                >
                  Añadir a calendario
                </a>
              </div>
            </div>
          </div>
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
      body: "Hay hoteles rurales y casas cerca de Revilla-Cabriada y Vizmalo, y más opciones en Burgos capital. Te ayudamos con recomendaciones si lo necesitas.",
      icon: "🏡",
    },
    {
      title: "Buses",
      body: "Habrá buses desde Burgos, Villalmanzo y Lerma hacia Revilla-Cabriada para la ceremonia, luego a la finca y vuelta a cada origen.",
      icon: "🚌",
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
    <section className="bg-ivory py-16 sm:py-20">
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

function Lodging() {
  const hotels = [
    {
      name: "Silken Burgos",
      location: "Burgos",
      link: "https://www.hoteles-silken.com/es/hotel-gran-teatro-burgos/",
      note: "Hotel céntrico, perfecto para conectar con el bus.",
    },
    {
      name: "Parador de Lerma",
      location: "Lerma",
      link: "https://paradores.es/es/reservas/parador/110",
      note: "Parador histórico con encanto a pocos minutos de las rutas de bus.",
    },
  ];

  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <SectionTitle title="Alojamientos" subtitle="Opciones cercanas para descansar" />
        <div className="grid gap-4 md:grid-cols-2">
          {hotels.map((hotel) => (
            <div
              key={hotel.name}
              className="rounded-2xl border border-cream/70 bg-white/80 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <p className="font-display text-xl text-sage-dark">{hotel.name}</p>
              <p className="text-sm text-sage-dark/70">{hotel.location}</p>
              <p className="mt-2 text-sm text-sage-dark/80">{hotel.note}</p>
              <a
                href={hotel.link}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block rounded-full border border-sage-dark/40 px-4 py-2 text-sm font-display text-sage-dark transition hover:bg-sage-dark hover:text-ivory"
              >
                Ver web
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Faq() {
  const items = [
    { q: "¿Dónde salen los buses?", a: "Desde Burgos, Villalmanzo y Lerma hacia Revilla-Cabriada; luego a la finca y vuelta a cada origen." },
    { q: "¿A qué hora llego a la iglesia?", a: "Llegada 11:30; ceremonia a las 12:00. El bus a la finca sale a las 13:15." },
    { q: "Dress code", a: "Elegante de verano. Evita blanco y marfil." },
    { q: "Niños", a: "Bienvenidos. Tendremos zona infantil y cuidadoras." },
    { q: "Alergias", a: "Indícalas en el formulario de RSVP." },
    { q: "Contacto con los novios", a: "Teléfono/WhatsApp: +34 600 000 001 (Aitana) · +34 600 000 002 (Flavio)" },
  ];
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="bg-cream py-16 sm:py-20">
      <div className="mx-auto max-w-5xl px-6">
        <SectionTitle title="FAQ" subtitle="Preguntas frecuentes" />
        <div className="space-y-3">
          {items.map((item, idx) => {
            const open = openIndex === idx;
            return (
              <div key={item.q} className="overflow-hidden rounded-2xl border border-cream/70 bg-white/85 shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : idx)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                  aria-expanded={open}
                >
                  <span className="font-display text-lg text-sage-dark">{item.q}</span>
                  <span className="text-sage-dark">{open ? "−" : "+"}</span>
                </button>
                {open && (
                  <div className="px-4 pb-4 text-sm text-sage-dark/80">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


function Rsvp({
  onSubmit,
  attendance,
  setAttendance,
  totalPeople,
  setTotalPeople,
  persons,
  setPersons,
  busNeeded,
  setBusNeeded,
  playConfirmVideo,
  step,
  confirmationVideoRef,
  onVideoEnd,
  isSubmitting,
  rsvpMessage,
}) {
  const handlePersonFieldChange = (index, field, value) => {
    setPersons((prev) => prev.map((person, idx) => (idx === index ? { ...person, [field]: value } : person)));
  };

  const handleAllergyToggle = (index, hasAllergies) => {
    setPersons((prev) =>
      prev.map((person, idx) =>
        idx === index ? { ...person, hasAllergies, allergies: hasAllergies ? person.allergies : '' } : person
      )
    );
  };

  return (
    <section className="bg-ivory py-16 sm:py-20" id="rsvp">
      <div className="mx-auto max-w-3xl px-6">
        <SectionTitle title="Confirmar asistencia" subtitle="Cuéntanos si podrás acompañarnos" />

        {step === 'thanks' ? (
          <div className="rounded-2xl border border-cream/70 bg-white/80 p-8 text-center shadow-sm">
            <div className="space-y-4">
              <p className="font-script text-3xl text-sage-dark">Gracias!</p>
              <p className="mt-2 font-body text-sage-dark/80">
                Nos hace muchísima ilusión compartir este día contigo. Si necesitas algo, avísanos.
              </p>
              {playConfirmVideo && (
                <div className="relative overflow-hidden rounded-2xl border border-cream/70 shadow-lg">
                  <video
                    ref={confirmationVideoRef}
                    className="h-[420px] w-full object-cover"
                    src="/assets/rsvp-confirmation-DYbKwzwP.webm"
                    autoPlay
                    muted
                    playsInline
                    onEnded={onVideoEnd}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-6 rounded-2xl border border-cream/70 bg-white/80 p-6 shadow-sm backdrop-blur">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-display text-sage-dark">
                Nombre y apellidos del contacto
                <input
                  required
                  className="rounded-md border border-cream/70 bg-ivory px-3 py-2 text-sm"
                  placeholder="Tu nombre"
                  name="contactName"
                />
              </label>
              <label className="flex flex-col gap-2 text-sm font-display text-sage-dark">
                Email de contacto (opcional)
                <input className="rounded-md border border-cream/70 bg-ivory px-3 py-2 text-sm" placeholder="Email" name="contactEmail" />
              </label>
            </div>

            <div className="space-y-3 rounded-lg border border-cream/70 bg-ivory/50 p-4">
              <p className="text-sm font-display text-sage-dark">¿Asistirás a la boda?</p>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                <label className="inline-flex items-center gap-2 text-sm text-sage-dark">
                  <input
                    type="radio"
                    name="attendance"
                    value="yes"
                    checked={attendance === 'yes'}
                    onChange={() => setAttendance('yes')}
                  />
                  Sí
                </label>
                <label className="inline-flex items-center gap-2 text-sm text-sage-dark">
                  <input
                    type="radio"
                    name="attendance"
                    value="no"
                    checked={attendance === 'no'}
                    onChange={() => setAttendance('no')}
                  />
                  No
                </label>
              </div>
            </div>

            {attendance === 'yes' && (
              <>
                <div className="flex flex-col gap-2 text-sm font-display text-sage-dark">
                  ¿Cuántas personas asistiréis en total? (incluyéndote)
                  <select
                    name="totalPeople"
                    className="rounded-md border border-cream/70 bg-ivory px-3 py-2 text-sm"
                    value={totalPeople}
                    onChange={(e) => setTotalPeople(Number(e.target.value))}
                  >
                    {[1, 2, 3, 4, 5].map((num) => (
                      <option key={num} value={num}>
                        {num}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-4">
                  {persons.map((person, idx) => (
                    <div key={idx} className="rounded-lg border border-cream/70 bg-ivory/60 p-4 shadow-sm">
                      <div className="flex items-center justify-between text-sage-dark">
                        <p className="font-display text-base">Persona {idx + 1}</p>
                      </div>
                      <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <label className="flex flex-col gap-2 text-sm font-display text-sage-dark">
                          Nombre y apellidos
                          <input
                            required
                            name={`person-${idx}-name`}
                            className="rounded-md border border-cream/70 bg-ivory px-3 py-2 text-sm"
                            value={person.name}
                            onChange={(e) => handlePersonFieldChange(idx, 'name', e.target.value)}
                          />
                        </label>
                        <div className="flex flex-col gap-2 text-sm font-display text-sage-dark">
                          ¿Tiene alergias o intolerancias?
                          <div className="flex flex-wrap items-center gap-3">
                            <label className="inline-flex items-center gap-2 text-sage-dark">
                              <input
                                type="radio"
                                name={`hasAllergies-${idx}`}
                                value="no"
                                checked={!person.hasAllergies}
                                onChange={() => handleAllergyToggle(idx, false)}
                              />
                              No
                            </label>
                            <label className="inline-flex items-center gap-2 text-sage-dark">
                              <input
                                type="radio"
                                name={`hasAllergies-${idx}`}
                                value="yes"
                                checked={person.hasAllergies}
                                onChange={() => handleAllergyToggle(idx, true)}
                              />
                              Sí
                            </label>
                          </div>
                        </div>
                      </div>
                      {person.hasAllergies && (
                        <label className="mt-3 flex flex-col gap-2 text-sm font-display text-sage-dark">
                          Especifica (texto corto)
                          <input
                            name={`allergies-${idx}`}
                            className="rounded-md border border-cream/70 bg-ivory px-3 py-2 text-sm"
                            value={person.allergies}
                            onChange={(e) => handlePersonFieldChange(idx, 'allergies', e.target.value)}
                          />
                        </label>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-3 rounded-lg border border-cream/70 bg-ivory/50 p-4">
                  <p className="text-sm font-display text-sage-dark">¿Necesitáis autobús?</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6">
                    <label className="inline-flex items-center gap-2 text-sm text-sage-dark">
                      <input
                        type="radio"
                        name="busNeeded"
                        value="yes"
                        checked={busNeeded === 'yes'}
                        onChange={() => setBusNeeded('yes')}
                      />
                      Sí
                    </label>
                    <label className="inline-flex items-center gap-2 text-sm text-sage-dark">
                      <input
                        type="radio"
                        name="busNeeded"
                        value="no"
                        checked={busNeeded === 'no'}
                        onChange={() => setBusNeeded('no')}
                      />
                      No
                    </label>
                  </div>

                  {busNeeded === 'yes' && (
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                      <label className="flex flex-col gap-2 text-sm font-display text-sage-dark">
                        Origen del bus
                        <select name="busOrigin" className="rounded-md border border-cream/70 bg-ivory px-3 py-2 text-sm">
                          <option value="Burgos">Burgos</option>
                          <option value="Lerma">Lerma</option>
                          <option value="Villalmanzo">Villalmanzo</option>
                          <option value="Revilla-Cabriada">Revilla-Cabriada</option>
                        </select>
                      </label>
                      <label className="flex flex-col gap-2 text-sm font-display text-sage-dark">
                        Trayecto
                        <select name="busTrip" className="rounded-md border border-cream/70 bg-ivory px-3 py-2 text-sm">
                          <option value="Ida y vuelta">Ida y vuelta</option>
                          <option value="Solo ida">Solo ida</option>
                          <option value="Solo vuelta">Solo vuelta</option>
                        </select>
                      </label>
                    </div>
                  )}
                </div>
              </>
            )}

            <label className="flex flex-col gap-2 text-sm font-display text-sage-dark">
              Mensaje para los novios (opcional)
              <textarea
                className="rounded-md border border-cream/70 bg-ivory px-3 py-2 text-sm"
                rows={3}
                placeholder="Nos encantaría leerte"
                name="message"
              />
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full bg-sage-dark px-6 py-3 text-sm font-display text-ivory transition hover:-translate-y-1 hover:bg-sage disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Enviando...' : 'Enviar formulario'}
            </button>
            {rsvpMessage && <p className="text-center text-sm text-sage-dark/80">{rsvpMessage}</p>}
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
  const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

  const toDate = (date) => {
    const y = date.getUTCFullYear();
    const m = String(date.getUTCMonth() + 1).padStart(2, "0");
    const d = String(date.getUTCDate()).padStart(2, "0");
    return `${y}${m}${d}`;
  };

  const dtstamp = toDate(new Date()) + "T000000Z";
  const dtstart = toDate(start);
  const dtend = toDate(end);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Boda Aitana y Flavio//ES",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${title}-${dtstart}@boda-aitana-flavio`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${dtstart}`,
    `DTEND;VALUE=DATE:${dtend}`,
    `SUMMARY:${title}`,
    `LOCATION:${location}`,
    "DESCRIPTION:Celebración de la boda de Aitana y Flavio",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return `data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`;
}
