'use client';

import { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';

interface Project {
  id: string;
  title: string;
  description: string;
  brief: string;
  challenge: string;
  solution: string;
  materials: string[];
  tags: string[];
  beforeAfter: {
    before: string;
    after: string;
  };
  photos: string[];
}

const PROJECTS: Project[] = [
  {
    id: 'project-1',
    title: 'Urban Zen Living',
    description: 'Interior styling & spatial design',
    brief: 'Converted a compact living room into a daylight-first social zone.',
    challenge:
      'Client needed flexible hosting space without losing calm daily living flow.',
    solution:
      'Layered low-profile seating, warm textures, and modular decor zoning for day/night use.',
    materials: ['Oak veneer', 'Linen blend', 'Soft concrete', 'Matte brass'],
    tags: ['Biophilic', 'Compact Space', 'Warm Minimal'],
    beforeAfter: {
      before: '/portfolio/project-1/photo-1.jpeg',
      after: '/portfolio/project-1/photo-5.jpeg',
    },
    photos: Array.from(
      { length: 9 },
      (_, i) => `/portfolio/project-1/photo-${i + 1}.jpeg`
    ),
  },
  {
    id: 'project-2',
    title: 'Lightwell Residence',
    description: 'Residential interior transformation',
    brief:
      'Reframed a traditional interior into a brighter, more breathable home narrative.',
    challenge:
      'Dark circulation and visual clutter made rooms feel disconnected and heavy.',
    solution:
      'Introduced material continuity, mirrored bounce points, and curated vertical storage.',
    materials: ['Microcement', 'Smoked glass', 'Walnut', 'Woven textiles'],
    tags: ['Residential', 'Daylight Upgrade', 'Contemporary'],
    beforeAfter: {
      before: '/portfolio/project-2/photo-1.jpeg',
      after: '/portfolio/project-2/photo-9.jpeg',
    },
    photos: Array.from(
      { length: 14 },
      (_, i) => `/portfolio/project-2/photo-${i + 1}.jpeg`
    ),
  },
];

const BEFORE_AFTER_WIDTH_CLASSES: Record<number, string> = {
  0: 'w-0',
  5: 'w-[5%]',
  10: 'w-[10%]',
  15: 'w-[15%]',
  20: 'w-[20%]',
  25: 'w-1/4',
  30: 'w-[30%]',
  35: 'w-[35%]',
  40: 'w-2/5',
  45: 'w-[45%]',
  50: 'w-1/2',
  55: 'w-[55%]',
  60: 'w-3/5',
  65: 'w-[65%]',
  70: 'w-[70%]',
  75: 'w-3/4',
  80: 'w-4/5',
  85: 'w-[85%]',
  90: 'w-[90%]',
  95: 'w-[95%]',
  100: 'w-full',
};

const BEFORE_AFTER_DIVIDER_CLASSES: Record<number, string> = {
  0: 'left-0',
  5: 'left-[5%]',
  10: 'left-[10%]',
  15: 'left-[15%]',
  20: 'left-[20%]',
  25: 'left-1/4',
  30: 'left-[30%]',
  35: 'left-[35%]',
  40: 'left-2/5',
  45: 'left-[45%]',
  50: 'left-1/2',
  55: 'left-[55%]',
  60: 'left-3/5',
  65: 'left-[65%]',
  70: 'left-[70%]',
  75: 'left-3/4',
  80: 'left-4/5',
  85: 'left-[85%]',
  90: 'left-[90%]',
  95: 'left-[95%]',
  100: 'left-full',
};

function getBeforeAfterState(
  projectId: string,
  values: Record<string, number>
) {
  const sliderValue = values[projectId] ?? 50;
  const snapped = Math.round(sliderValue / 5) * 5;

  return {
    sliderValue,
    overlayWidthClass: BEFORE_AFTER_WIDTH_CLASSES[snapped] ?? 'w-1/2',
    dividerClass: BEFORE_AFTER_DIVIDER_CLASSES[snapped] ?? 'left-1/2',
  };
}

export default function PortfolioGallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const [lightboxProject, setLightboxProject] = useState<Project | null>(null);
  const [beforeAfter, setBeforeAfter] = useState<Record<string, number>>({});

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
            {PROJECTS.map((project) => {
              const { sliderValue, overlayWidthClass, dividerClass } =
                getBeforeAfterState(project.id, beforeAfter);

              return (
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
                    <div className="space-y-3 p-3 pt-0">
                      <div className="rounded-lg border border-[#2f4b36] bg-[#111a14] p-3">
                        <p className="text-[11px] uppercase tracking-wide text-[#8fcf7d]">
                          Brief
                        </p>
                        <p className="mt-1 text-xs text-zinc-200">
                          {project.brief}
                        </p>
                        <p className="mt-3 text-[11px] uppercase tracking-wide text-[#8fcf7d]">
                          Challenge
                        </p>
                        <p className="mt-1 text-xs text-zinc-300">
                          {project.challenge}
                        </p>
                        <p className="mt-3 text-[11px] uppercase tracking-wide text-[#8fcf7d]">
                          Solution
                        </p>
                        <p className="mt-1 text-xs text-zinc-200">
                          {project.solution}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full border border-[#365741] bg-[#16241b] px-2 py-0.5 text-[10px] text-zinc-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <div className="mt-3">
                          <p className="text-[11px] uppercase tracking-wide text-[#8fcf7d]">
                            Materials
                          </p>
                          <p className="mt-1 text-xs text-zinc-300">
                            {project.materials.join(' • ')}
                          </p>
                        </div>
                      </div>

                      <div className="rounded-lg border border-[#2f4b36] bg-[#111a14] p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-[11px] uppercase tracking-wide text-[#8fcf7d]">
                            Before / After
                          </p>
                          <span className="text-[10px] text-zinc-400">
                            Drag slider
                          </span>
                        </div>
                        <div className="relative mb-2 aspect-4/3 overflow-hidden rounded-md border border-[#2a3d2e]">
                          <Image
                            src={project.beforeAfter.before}
                            alt={`${project.title} before`}
                            fill
                            sizes="360px"
                            className="object-cover"
                          />
                          <div
                            className={`absolute inset-y-0 left-0 overflow-hidden ${overlayWidthClass}`}
                          >
                            <Image
                              src={project.beforeAfter.after}
                              alt={`${project.title} after`}
                              fill
                              sizes="360px"
                              className="object-cover"
                            />
                          </div>
                          <div className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-zinc-100">
                            Before
                          </div>
                          <div className="absolute bottom-2 right-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-zinc-100">
                            After
                          </div>
                          <div
                            className={`pointer-events-none absolute inset-y-0 w-0.5 bg-[#a8ef8b] ${dividerClass}`}
                          />
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          step={5}
                          value={sliderValue}
                          onChange={(event) => {
                            const value = Number(event.target.value);
                            setBeforeAfter((prev) => ({
                              ...prev,
                              [project.id]: value,
                            }));
                          }}
                          className="w-full accent-[#7ddf64]"
                          aria-label={`${project.title} before after slider`}
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-1">
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
                    </div>
                  )}
                </div>
              );
            })}
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
