"use client";

import { useEffect, useRef, useState } from "react";
import { useAOS } from "../../components/useAOS";

const squareImg = "https://placehold.co/600x600";
const wideImg = "https://placehold.co/1200x800";
const tallImg = "https://placehold.co/1080x1920";

export default function DetailsPage() {
  useAOS();

  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [copyStatus, setCopyStatus] = useState("Pulsa para copiar");
  const [modalSrc, setModalSrc] = useState(null);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        setModalSrc(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const toggleAudio = () => setIsPlaying((prev) => !prev);

  const copyAccount = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus("Cuenta copiada");
      setTimeout(() => setCopyStatus("Pulsa para copiar"), 1500);
    } catch (err) {
      console.error("Failed to copy text", err);
      setCopyStatus("Error al copiar");
    }
  };

  const openModal = (src) => setModalSrc(src);
  const closeModal = () => setModalSrc(null);

  return (
    <main
      className="relative min-h-screen overflow-x-hidden bg-cover bg-center"
      style={{ backgroundImage: "url('/img/background.jpg')" }}
    >


      <div className="relative mx-auto w-full max-w-screen-xl px-4 pt-8 pb-12 sm:px-6 lg:px-10 font-sitka">
        {/* Modal de imagen */}
        {modalSrc && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-85 px-2" onClick={closeModal}>
            <button className="absolute right-4 top-4 text-3xl text-white" aria-label="Cerrar" onClick={closeModal}>
              &times;
            </button>
            <img className="max-h-full max-w-full" src={modalSrc} alt="Ampliación" />
          </div>
        )}

        {/* Contenido principal */}
        <div className="relative flex flex-col items-center justify-center gap-8 rounded-sm bg-contain bg-center bg-repeat px-2 md:gap-16 md:px-4">
          {/* Audio */}
          <section className="flex flex-col items-center justify-center gap-4" data-aos="zoom-in" data-aos-duration="500">
            <button
              onClick={toggleAudio}
              className="flex flex-row items-center gap-2 px-3 py-2"
              aria-label={isPlaying ? "Pausar música" : "Reproducir música"}
            >
              {!isPlaying ? (
                <svg className="text-custom-blue size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="text-custom-blue size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <p className="text-custom-blue text-xs drop-shadow-sm md:text-sm lg:text-base">Canon en Re - Pachelbel (por Kassia)</p>
            </button>
            <audio ref={audioRef} src="/img/music.mp3" loop />
          </section>

          <img className="size-10 md:size-12 lg:size-14" src="/img/logo.svg" alt="Logo" data-aos="fade-up" />

          {/* Apertura */}
          <section className="my-8 flex flex-col items-center justify-center gap-12 md:gap-16 lg:gap-20">
            <div className="grid w-full grid-cols-1 items-center gap-4 md:grid-cols-2 lg:gap-8" data-aos="fade-up">
              <div className="h-auto w-full overflow-hidden shadow-md">
                <img
                  onClick={() => openModal(squareImg)}
                  className="h-full w-full cursor-pointer rounded-sm object-cover"
                  src={squareImg}
                  alt="Pareja"
                />
              </div>
              <div className="h-auto w-full overflow-hidden shadow-md">
                <img
                  onClick={() => openModal(squareImg)}
                  className="h-full w-full cursor-pointer rounded-sm object-cover"
                  src={squareImg}
                  alt="Pareja"
                />
              </div>
            </div>
            <div className="w-full max-w-lg text-center text-sm md:text-base lg:text-lg">
              <p className="text-custom-blue italic drop-shadow-sm" data-aos="fade-up">
                Y entre Sus señales está que creó para vosotros esposas de entre vosotros para que encontréis sosiego en ellas, y puso entre vosotros amor y
                compasión. En esto hay signos para quienes reflexionan.
              </p>
              <p className="text-custom-gold drop-shadow-sm" data-aos="fade-up">
                QS Ar-Rum : 21
              </p>
            </div>
            <div className="h-auto w-full overflow-hidden shadow-md" data-aos="fade-up">
              <img
                onClick={() => openModal(wideImg)}
                className="h-full w-full cursor-pointer rounded-sm object-cover"
                src={wideImg}
                alt="Pareja"
              />
            </div>
          </section>

          <img className="size-10 md:size-12 lg:size-14" src="/img/logo.svg" alt="Logo" data-aos="fade-up" />

          {/* Novios */}
          <section className="my-8 flex flex-col items-center justify-center gap-12 md:gap-16 lg:gap-20">
            <div className="text-custom-blue flex flex-col items-center gap-4 text-center">
              <p className="text-base lg:text-xl" data-aos="fade-up">
                Junto a nuestras familias,
              </p>
              <div data-aos="fade-up">
                <h2 className="text-xl font-bold sm:text-2xl lg:text-4xl">Aitana Martínez Serrano</h2>
                <p className="text-sm italic sm:text-lg lg:text-xl">
                  Hija de Sr. Lorem
                  <br />
                  y Sra. Ipsum
                </p>
              </div>
              <p className="text-custom-gold text-base italic lg:text-xl" data-aos="fade-up">
                y
              </p>
              <div data-aos="fade-up">
                <h2 className="text-xl font-bold sm:text-2xl lg:text-4xl">Flavio Grillo Marín</h2>
                <p className="text-sm italic sm:text-lg lg:text-xl">
                  Hijo de Sr. Lorem
                  <br />
                  y Sra. Ipsum
                </p>
              </div>
            </div>

            <p className="text-custom-blue w-full max-w-lg text-center text-base leading-tight lg:text-xl" data-aos="fade-up">
              Nos encantaría contar con tu compañía en nuestra boda, que se celebrará el:
            </p>

            <div className="text-custom-blue flex flex-col items-center gap-y-12 text-center lg:flex-row lg:justify-center lg:gap-x-24">
              <div className="text-custom-blue flex flex-col items-center gap-1" data-aos="fade-up">
                <h3 className="text-custom-gold text-3xl font-bold lg:text-4xl">Ceremonia</h3>
                <p className="text-base lg:text-lg">
                  Sabado, 6 de junio de 2026
                </p>
                <p className="text-lg font-bold lg:text-xl">17:00 - 18:00</p>
                <div className="leading-none">
                  <p className="text-lg font-bold lg:text-xl">Iglesia de Santa Elena</p>
                  <p className="text-base lg:text-lg">Revilla Cabriada (Burgos)</p>
                </div>
              </div>
              <div className="text-custom-blue flex flex-col items-center gap-1" data-aos="fade-up">
                <h3 className="text-custom-gold text-3xl font-bold lg:text-4xl">Recepcion</h3>
                <p className="text-base lg:text-lg">
                  Sabado, 6 de junio de 2026
                </p>
                <p className="text-lg font-bold lg:text-xl">19:00 - 01:00</p>
                <div className="leading-none">
                  <p className="text-lg font-bold lg:text-xl">Finca Santa Rosalia</p>
                  <p className="text-base lg:text-lg">Vizmalo (Burgos)</p>
                </div>
              </div>
            </div>

            <div className="border-custom-blue flex items-center justify-center rounded border-2 md:h-80 md:w-full lg:h-96" data-aos="zoom-in">
              <iframe
                className="h-full w-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.2183765161717!2d112.6318416748081!3d-7.976367679520048!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd6283c7e9abbd3%3A0xcce9af9698d6a3a5!2sSMA%20Negeri%204%20Malang!5e0!3m2!1sen!2sid!4v1729519776499!5m2!1sen!2sid"
                src="https://www.google.com/maps?q=Finca+Santa+Rosalia+Vizmalo&output=embed"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa del lugar"
              ></iframe>
            </div>
          </section>

          <img className="size-10 md:size-12 lg:size-14" src="/img/logo.svg" alt="Logo" data-aos="fade-up" />

          {/* Frases */}
          <section className="my-8 flex flex-col items-center justify-center gap-12 md:gap-16 lg:gap-20">
            <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-6 md:gap-4 lg:gap-8">
              <div className="col-span-1 overflow-hidden shadow-md md:col-span-4" data-aos="fade-right">
                <img
                  onClick={() => openModal(wideImg)}
                  className="h-full w-full cursor-pointer rounded-sm object-cover"
                  src={wideImg}
                  alt="Frase"
                />
              </div>
              <p className="text-custom-blue col-span-1 text-xs italic md:col-span-2 md:text-base lg:text-lg" data-aos="fade-left">
                &quot;Lorem ipsum dolor sit amet ...
              </p>
            </div>
            <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-6 md:gap-4 lg:gap-8">
              <p className="text-custom-blue col-span-1 text-right text-xs italic md:col-span-2 md:text-base lg:text-lg" data-aos="fade-right">
                ...consectetur adipisicing elit.
              </p>
              <div className="col-span-1 overflow-hidden shadow-md md:col-span-4" data-aos="fade-left">
                <img
                  onClick={() => openModal(wideImg)}
                  className="h-full w-full cursor-pointer rounded-sm object-cover"
                  src={wideImg}
                  alt="Frase"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-6 md:gap-4 lg:gap-8">
              <div className="col-span-1 overflow-hidden shadow-md md:col-span-4" data-aos="fade-right">
                <img
                  onClick={() => openModal(wideImg)}
                  className="h-full w-full cursor-pointer rounded-sm object-cover"
                  src={wideImg}
                  alt="Frase"
                />
              </div>
              <p className="text-custom-blue col-span-1 text-xs italic md:col-span-2 md:text-base lg:text-lg" data-aos="fade-left">
                Perspiciatis, corporis....
              </p>
            </div>
            <div className="grid grid-cols-1 items-center gap-2 md:grid-cols-6 md:gap-4 lg:gap-8">
              <p className="text-custom-blue col-span-1 text-right text-xs italic md:col-span-2 md:text-base lg:text-lg" data-aos="fade-right">
                ...Consectetur facere fuga a est?&quot;
              </p>
              <div className="col-span-1 overflow-hidden shadow-md md:col-span-4" data-aos="fade-left">
                <img
                  onClick={() => openModal(wideImg)}
                  className="h-full w-full cursor-pointer rounded-sm object-cover"
                  src={wideImg}
                  alt="Frase"
                />
              </div>
            </div>
              <p className="text-custom-blue text-center text-sm italic md:text-base lg:text-xl" data-aos="fade-up">
                Tempore incidunt similique distinctio,
                <br />
                nemo vel saepe quasi dicta quidem.
              </p>
          </section>

          <img className="size-10 md:size-12 lg:size-14" src="/img/logo.svg" alt="Logo" data-aos="fade-up" />

          {/* Regalos */}
          <section className="my-8 flex flex-col items-center justify-center gap-8 md:gap-12 lg:gap-16">
            <div className="text-custom-blue flex w-full max-w-lg flex-col items-center gap-4">
              <h3 className="text-2xl font-bold md:text-3xl lg:text-4xl" data-aos="fade-up">
                Regalos
              </h3>
              <p className="text-center text-sm md:text-base lg:text-lg" data-aos="fade-up">
                Tu presencia y buenos deseos son el mejor regalo. Si quieres enviar un detalle, contáctanos para la dirección. Si prefieres una
                transferencia, aquí tienes nuestros datos:
              </p>
            </div>
            <div
              className="text-custom-blue grid grid-cols-1 items-center justify-center gap-x-4 gap-y-4 sm:grid-cols-2 md:gap-x-8 lg:gap-x-12 lg:gap-y-8"
              data-aos="zoom-in"
            >
              <button
                onClick={() => copyAccount("123456789")}
                className="border-custom-blue flex flex-col items-center rounded-lg border-2 px-8 py-4"
              >
                <div className="flex flex-col items-center gap-2 text-base md:text-lg lg:text-xl">
                  <div className="flex flex-row items-baseline gap-1">
                    <p className="font-semibold">Banco Lorem</p>
                    <p>123456789</p>
                  </div>
                  <p>a nombre de Aitana</p>
                </div>
              </button>

              <button
                onClick={() => copyAccount("123456789")}
                className="border-custom-blue flex flex-col items-center rounded-lg border-2 px-8 py-4"
              >
                <div className="flex flex-col items-center gap-2 text-base md:text-lg lg:text-xl">
                  <div className="flex flex-row items-baseline gap-1">
                    <p className="font-semibold">Banco Ipsum</p>
                    <p>123456789</p>
                  </div>
                  <p>a nombre de Flavio</p>
                </div>
              </button>

              <p className="text-custom-blue text-center text-xs italic text-opacity-85 sm:col-span-2 md:text-sm lg:text-base">{copyStatus}</p>
            </div>
          </section>

          <img className="size-10 md:size-12 lg:size-14" src="/img/logo.svg" alt="Logo" data-aos="fade-up" />

          {/* Deseos */}
          <section className="my-8 flex flex-col items-center justify-center gap-8">
            <div className="text-custom-blue text-center">
              <h3 className="mb-4 text-2xl font-bold md:text-3xl lg:text-4xl" data-aos="fade-up">
                Tus buenos deseos
              </h3>
              <p className="text-sm md:text-base lg:max-w-prose lg:text-lg" data-aos="fade-up">
                ¡Queremos leerte! Déjanos un mensaje y cuéntanos si celebrarás con nosotros.
              </p>
            </div>
            <form className="text-custom-blue border-custom-blue flex w-full flex-col gap-4 rounded border-2 p-6 text-sm lg:max-w-prose" data-aos="fade-up">
              <input className="border-custom-blue rounded text-sm" placeholder="Nombre" type="text" />
              <textarea className="border-custom-blue rounded text-sm" placeholder="Deseos" rows="4" />
              <div className="mx-auto flex flex-col gap-2">
                <p className="text-center font-bold lg:text-lg">Asistencia:</p>
                <div className="flex flex-row items-center justify-start gap-2">
                  <input type="radio" id="attendance-yes" name="attendance" />
                  <label className="lg:text-base" htmlFor="attendance-yes">
                    Confirmo asistencia
                  </label>
                </div>
                <div className="flex flex-row items-center justify-start gap-2">
                  <input type="radio" id="attendance-no" name="attendance" />
                  <label className="lg:text-base" htmlFor="attendance-no">
                    No podré asistir
                  </label>
                </div>
              </div>

              <p className="text-custom-gold hidden text-center text-xs italic md:text-sm lg:text-base">Por favor, completa todos los campos.</p>
              <button
                className="bg-custom-blue flex flex-row items-center justify-center gap-2 rounded px-4 py-2 text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50 lg:text-base"
                type="button"
                disabled
              >
                Enviar
              </button>
              <hr className="border-custom-blue border-t-2" />

              <div className="flex h-60 w-full flex-col gap-3 overflow-scroll lg:text-base">
                <div>
                  <p className="font-bold">Persona de ejemplo</p>
                  <p>Enhorabuena por vuestro matrimonio. ¡Os deseo lo mejor!</p>
                  <p className="text-xs">4 oct 2024</p>
                </div>
              </div>
            </form>
          </section>

          <img className="size-10 md:size-12 lg:size-14" src="/img/logo.svg" alt="Logo" data-aos="fade-up" />

          {/* Galería */}
          <section className="text-custom-blue my-8 flex flex-col items-center justify-center gap-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold md:text-3xl lg:text-4xl" data-aos="fade-up">
                Nuestros mejores momentos
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-4 lg:gap-4">
              {[...Array(8)].map((_, idx) => (
                <div
                  key={idx}
                  className="h-auto w-auto overflow-hidden shadow-md md:w-56 lg:w-72"
                  data-aos="zoom-in"
                  onClick={() => openModal(tallImg)}
                >
                  <img className="h-full w-full cursor-pointer rounded object-cover" src={tallImg} alt={`Galería ${idx + 1}`} />
                </div>
              ))}
            </div>
          </section>

          <img className="size-10 md:size-12 lg:size-14" src="/img/logo.svg" alt="Logo" data-aos="fade-up" />

          {/* Cierre */}
          <section className="text-custom-blue my-8 flex flex-col items-center justify-center gap-4">
            <h3 className="text-custom-gold text-2xl font-semibold md:text-3xl lg:text-4xl" data-aos="fade-up">
              Querido invitado,
            </h3>
            <div className="flex flex-col text-center" data-aos="fade-up">
              <p className="text-sm leading-snug md:text-base lg:text-lg">
                Gracias por compartir nuestra alegría y por ser
                <br />
                parte de este momento inolvidable en nuestras vidas.
              </p>
              <p className="mt-2 text-xs font-bold italic md:text-sm lg:text-base">Aitana &amp; Flavio</p>
            </div>
          </section>

          {/* Footer */}
          <section className="mt-8 flex flex-col items-center justify-center gap-4 pb-12" data-aos="zoom-in" data-aos-delay="500">
            <div className="text-custom-blue space-y-1 text-center text-sm md:text-base lg:text-lg">
              <p>
                Diseño por{" "}
                <a className="font-semibold" href="https://www.instagram.com/psychoctator/" target="_blank" rel="noopener noreferrer">
                  Bride Permata
                  <svg className="inline size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </p>

              <p>
                Código por{" "}
                <a className="font-semibold" href="https://odhyp.com" target="_blank" rel="noopener noreferrer">
                  Odhy Pradhana
                  <svg className="inline size-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5.22 14.78a.75.75 0 0 0 1.06 0l7.22-7.22v5.69a.75.75 0 0 0 1.5 0v-7.5a.75.75 0 0 0-.75-.75h-7.5a.75.75 0 0 0 0 1.5h5.69l-7.22 7.22a.75.75 0 0 0 0 1.06Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
