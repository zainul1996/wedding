// src/components/Layout.tsx

import React, { type ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

import Image from "next/image";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="bg-purple-200">
      <header className="relative isolate overflow-hidden bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
        <div
          className="absolute inset-0 -z-10 h-full w-full bg-cover bg-center"
          style={{
            backgroundImage: `url('https://d1qc9wtuffqlue.cloudfront.net/images/professionals/cover_image/orchid-country-club-1585111860-gardenocc.jpg')`,
          }}
        ></div>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative">
          <div
            className="absolute -top-10 left-1/2 -z-10 -translate-x-1/2 transform-gpu sm:right-1/2 sm:top-auto sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
            aria-hidden="true"
          >
            <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-full bg-white shadow-lg">
              <div className="relative h-full w-full">
                <Image
                  src="/wedding-rings.svg"
                  alt="Wedding rings"
                  layout="fill"
                  objectFit="contain"
                />
              </div>
            </div>
          </div>
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
              {/* Zainul <span className="text-red-500">&hearts;</span> Sara */}
              Zainul &amp; Sara
            </h1>
          </div>
        </div>
      </header>

      <main className="absolute w-full bg-purple-200 px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
