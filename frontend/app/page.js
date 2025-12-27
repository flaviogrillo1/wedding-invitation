"use client";

import Link from "next/link";
import { useAOS } from "../components/useAOS";

export default function HomePage() {
  useAOS();

  return (
    <main className="font-sitka h-dvh overflow-hidden sm:h-screen">
      <div
        className="relative flex h-full w-full items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/img/background.jpg')" }}
      >
        <img
          className="pointer-events-none absolute left-4 top-4 w-24 opacity-80 sm:w-32 lg:w-40"
          src="/img/Picture2.png"
          alt="Acuarela decorativa superior izquierda"
          aria-hidden="true"
        />
        <img
          className="pointer-events-none absolute bottom-4 right-4 w-24 opacity-80 sm:w-32 lg:w-40"
          src="/img/Picture2.png"
          alt="Acuarela decorativa inferior derecha"
          aria-hidden="true"
        />
        <div className="relative flex flex-col items-center justify-center gap-16">
          <img className="size-10 md:size-12 xl:size-14" src="/img/reshot-icon-wedding-rings-EAZN5FT2GH.svg" alt="Rings" />
          <div className="flex flex-col items-center justify-center gap-2 lg:gap-6">
            <h2 className="text-custom-blue text-3xl font-bold drop-shadow-md md:text-4xl lg:text-5xl" data-aos="fade-up">
              Te invitamos a la boda de
            </h2>
            <h1
              className="text-custom-gold text-4xl font-bold uppercase drop-shadow-md md:text-5xl lg:text-6xl"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              Aitana &amp; Flavio
            </h1>
          </div>
          <Link
            href="/details"
            className="bg-custom-blue rounded-full px-6 py-2 text-white shadow-xl transition-transform duration-500 ease-out hover:scale-95 md:text-lg"
            data-aos="zoom"
            data-aos-delay="300"
          >
            Abrir invitación
          </Link>
          <img className="size-10 md:size-12 xl:size-14" src="/img/reshot-icon-wedding-flowers-LDB6YCXSZQ.svg" alt="Flowers" />

          {/* LANDING PATTERN IMAGES START */}
          {/* TOP */}
          <div className="fixed -top-1 h-32 w-full overflow-hidden md:hidden">
            <div className="animate-marquee-lr flex w-[200%]">
              <div className="h-32 w-[100%] bg-[url('/img/landing-top.png')] bg-contain bg-top bg-no-repeat"></div>
              <div className="h-32 w-[100%] bg-[url('/img/landing-top.png')] bg-contain bg-top bg-no-repeat"></div>
            </div>
          </div>

          {/* BOTTOM */}
          <div className="fixed -bottom-1 h-32 w-full overflow-hidden md:hidden">
            <div className="animate-marquee-rl flex w-[200%]">
              <div className="h-32 w-[100%] bg-[url('/img/landing-bottom.png')] bg-contain bg-bottom bg-no-repeat"></div>
              <div className="h-32 w-[100%] bg-[url('/img/landing-bottom.png')] bg-contain bg-bottom bg-no-repeat"></div>
            </div>
          </div>

          {/* LEFT */}
          {/* LEFT */}
          {/* removed per request */}

          {/* RIGHT */}
          {/* removed per request */}
          {/* LANDING PATTERN IMAGES END */}
        </div>
      </div>
    </main>
  );
}
