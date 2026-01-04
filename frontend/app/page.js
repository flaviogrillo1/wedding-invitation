"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAOS } from "../components/useAOS";

export default function HomePage() {
  useAOS();
  const router = useRouter();
  const [showContent, setShowContent] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    setTimeout(() => router.push("/details"), 900);
    setTimeout(() => setIsOpening(false), 1200);
  };

  return (
    <main className="font-sitka h-dvh overflow-hidden sm:h-screen">
      <div
        className="relative flex h-full w-full items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/img/background.jpg')" }}
      >
        <div className="relative flex flex-col items-center justify-center gap-10">
          <img
            className={`size-40 md:size-56 xl:size-64 transition-transform duration-700 ease-out ${
              showContent ? "-translate-y-10 md:-translate-y-12" : ""
            }`}
            src="/img/anillos_acuarela.png"
            alt="Rings"
          />
          <div
            className={`flex flex-col items-center justify-center gap-2 text-center lg:gap-6 transition-opacity duration-700 ease-out ${
              showContent ? "opacity-100" : "opacity-0"
            }`}
          >
            <h2 className="text-custom-blue text-3xl font-bold drop-shadow-md md:text-4xl lg:text-5xl">
              Te invitamos a la boda de
            </h2>
            <h1 className="text-custom-gold text-4xl font-bold uppercase drop-shadow-md md:text-5xl lg:text-6xl">
              Aitana &amp; Flavio
            </h1>
            <button
              onClick={handleOpen}
              className="bg-custom-blue rounded-full px-6 py-2 text-white shadow-xl transition-transform duration-500 ease-out hover:scale-95 md:text-lg"
            >
              Abrir invitación
            </button>
          </div>
        </div>

        {isOpening && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="envelope-scale relative w-64 sm:w-80">
              <svg viewBox="0 0 300 200" className="w-full drop-shadow-xl">
                <rect x="20" y="60" width="260" height="120" rx="8" fill="#f7f0e8" stroke="#d3c5b2" strokeWidth="4" />
                <polygon points="20,60 280,60 150,150" fill="#f0e6d7" stroke="#d3c5b2" strokeWidth="4" />
                <polygon
                  className={`envelope-flap ${isOpening ? "open" : ""}`}
                  points="20,60 280,60 150,140"
                  fill="#e2d8c8"
                  stroke="#d3c5b2"
                  strokeWidth="4"
                />
                <line x1="20" y1="60" x2="150" y2="180" stroke="#d3c5b2" strokeWidth="3" />
                <line x1="280" y1="60" x2="150" y2="180" stroke="#d3c5b2" strokeWidth="3" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .envelope-flap {
          transform-origin: 50% 30%;
          transform-box: fill-box;
        }
        .envelope-flap.open {
          animation: flap-open 0.9s forwards ease-in-out;
        }
        @keyframes flap-open {
          from {
            transform: rotateX(0deg);
          }
          to {
            transform: rotateX(-180deg);
          }
        }
        .envelope-scale {
          animation: envelope-pop 0.4s ease-out;
        }
        @keyframes envelope-pop {
          from {
            transform: scale(0.92);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}
