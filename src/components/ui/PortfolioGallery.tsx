'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface Project {
  id: string;
  title: string;
  description: string;
  photos: string[];
}

const PROJECTS: Project[] = [
  {
    id: 'project-1',
    title: 'Project 1',
    description: 'Interior styling & spatial design',
    photos: Array.from(
      { length: 9 },
      (_, i) => `/portfolio/project-1/photo-${i + 1}.jpeg`
    ),
  },
  {
    id: 'project-2',
    title: 'Project 2',
    description: 'Residential interior transformation',
    photos: Array.from(
      { length: 14 },
      (_, i) => `/portfolio/project-2/photo-${i + 1}.jpeg`
    ),
  },
];

export default function PortfolioGallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);

  const openLightbox = useCallback((project: Project, idx: number) => {
    setLightboxProject(project);
    setLightboxIdx(idx);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIdx(null);
    setLightboxProject(null);
  }, []);

  const navigateLightbox = useCallback(
    (dir: 1 | -1) => {
      if (lightboxProject === null || lightboxIdx === null) return;
      const total = lightboxProject.photos.length;
      setLightboxIdx((prev) => ((prev ?? 0) + dir + total) % total);
    },
    [lightboxProject, lightboxIdx]
  );

  // Keyboard nav for lightbox
  useEffect(() => {
    if (lightboxIdx === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
    };
    globalThis.addEventListener('keydown', handler);
    return () => globalThis.removeEventListener('keydown', handler);
  }, [lightboxIdx, closeLightbox, navigateLightbox]);

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Toggle portfolio gallery"
        className="absolute bottom-4 right-4 z-30 rounded-xl border border-[#355139] bg-black/50 px-4 py-2.5 text-sm font-semibold text-zinc-100 backdrop-blur-sm transition hover:bg-black/60 hover:text-[#a8ef8b]"
      >
        {isOpen ? '✕ Close' : '📷 Portfolio'}
      </button>

      {/* Slide-out panel */}
      <aside
        className={`absolute right-0 top-0 z-40 h-full w-full max-w-md transform overflow-y-auto border-l border-[#355139] bg-[#0d140f]/95 backdrop-blur-md transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="p-5">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#a8ef8b]">Portfolio</h2>
              <p className="mt-0.5 text-xs text-zinc-400">
                Interior design work by Interia
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Close portfolio"
              className="rounded-lg border border-[#355139] bg-black/40 px-3 py-1.5 text-xs text-zinc-300 hover:text-zinc-100"
            >
              ✕
            </button>
          </div>

          {/* Project list */}
          <div className="space-y-4">
            {PROJECTS.map((project) => (
              <div
                key={project.id}
                className="rounded-xl border border-[#2a3d2e] bg-[#141f17] overflow-hidden"
              >
                {/* Project header (toggle) */}
                <button
                  onClick={() =>
                    setActiveProject((prev) =>
                      prev === project.id ? null : project.id
                    )
                  }
                  className="flex w-full items-center justify-between p-4 text-left transition hover:bg-[#1a2b1e]"
                >
                  <div>
                    <h3 className="text-sm font-semibold text-zinc-100">
                      {project.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {project.description} &middot; {project.photos.length}{' '}
                      photos
                    </p>
                  </div>
                  <span
                    className={`text-zinc-400 transition-transform ${activeProject === project.id ? 'rotate-180' : ''}`}
                  >
                    ▾
                  </span>
                </button>

                {/* Photo grid */}
                {activeProject === project.id && (
                  <div className="grid grid-cols-3 gap-1 p-2 pt-0">
                    {project.photos.map((src, idx) => (
                      <button
                        key={src}
                        onClick={() => openLightbox(project, idx)}
                        title={`View ${project.title} photo ${idx + 1}`}
                        className="group relative aspect-square overflow-hidden rounded-md"
                      >
                        <Image
                          src={src}
                          alt={`${project.title} photo ${idx + 1}`}
                          fill
                          sizes="120px"
                          className="object-cover transition group-hover:scale-105 group-hover:brightness-110"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Lightbox overlay */}
      {lightboxIdx !== null && lightboxProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Close lightbox backdrop"
            className="absolute inset-0 bg-black/90"
          />
          <div className="relative max-h-[90vh] max-w-[90vw]">
            <Image
              src={lightboxProject.photos[lightboxIdx]}
              alt={`${lightboxProject.title} photo ${lightboxIdx + 1}`}
              width={900}
              height={600}
              className="max-h-[85vh] rounded-lg object-contain"
              priority
            />

            {/* Nav controls */}
            <button
              onClick={() => navigateLightbox(-1)}
              aria-label="Previous photo"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-xl text-white hover:bg-black/80"
            >
              ‹
            </button>
            <button
              onClick={() => navigateLightbox(1)}
              aria-label="Next photo"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-3 py-2 text-xl text-white hover:bg-black/80"
            >
              ›
            </button>

            {/* Counter */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs text-zinc-300">
              {lightboxIdx + 1} / {lightboxProject.photos.length}
            </div>

            {/* Close */}
            <button
              onClick={closeLightbox}
              aria-label="Close lightbox"
              className="absolute right-2 top-2 rounded-full bg-black/60 px-2.5 py-1 text-sm text-white hover:bg-black/80"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
}
