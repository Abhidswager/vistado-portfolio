'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import Reveal from '@/components/Reveal';
import SectionLabel from '@/components/SectionLabel';
import { projects, BRAND_GRAD } from '@/lib/content';
import type { Project } from '@/lib/types';

/** A url counts as a "real link" only if it isn't empty or a bare "#". */
function hasLink(p: Project): boolean {
  return !!p.url && p.url.trim() !== '' && p.url.trim() !== '#';
}

export default function Portfolio() {
  const [filter, setFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  // The project whose image is currently zoomed open in the lightbox.
  const [zoom, setZoom] = useState<Project | null>(null);

  const isAll = filter === 'All';
  const INITIAL = 6;
  const filtered = projects.items.filter((p) => isAll || p.category === filter);
  // In the "All" view, only 6 show until "Load More" is clicked.
  const visible = isAll && !showAll ? filtered.slice(0, INITIAL) : filtered;
  const canLoadMore = isAll && !showAll && filtered.length > INITIAL;

  const closeZoom = useCallback(() => setZoom(null), []);

  // Close the lightbox on Escape and lock body scroll while it is open.
  useEffect(() => {
    if (!zoom) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeZoom();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [zoom, closeZoom]);

  // Card click: open the external link if present, otherwise zoom the image.
  const handleClick = (p: Project) => {
    if (hasLink(p)) {
      window.open(p.url, '_blank', 'noopener,noreferrer');
    } else {
      setZoom(p);
    }
  };

  return (
    <section id="portfolio" style={{ padding: '90px 24px', background: '#0E0E10', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -120, right: -80, width: 420, height: 420, background: 'radial-gradient(circle,rgba(255,90,31,0.22),transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ maxWidth: 1180, margin: '0 auto', position: 'relative' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 38 }}>
          <SectionLabel label="Selected Work" center />
          <h2 style={{ fontFamily: 'Sora', fontWeight: 700, fontSize: 'clamp(30px,4.6vw,52px)', lineHeight: 1.05, letterSpacing: '-0.025em', margin: 0, color: '#fff' }}>
            A Look at My <span style={{ fontFamily: "'Instrument Serif'", fontStyle: 'italic', fontWeight: 400, color: '#FF5A1F' }}>Portfolio</span>
          </h2>
        </Reveal>

        <Reveal dataR="pf-filter" duration={0.7} y={20} style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 44 }}>
          {projects.categories.map((c) => {
            const active = c === filter;
            return (
              <span
                key={c}
                onClick={() => {
                  setFilter(c);
                  setShowAll(false);
                }}
                style={{
                  cursor: 'pointer',
                  fontSize: 14,
                  fontWeight: 600,
                  padding: '11px 20px',
                  borderRadius: 999,
                  whiteSpace: 'nowrap',
                  transition: 'all .3s ease',
                  background: active ? BRAND_GRAD : 'rgba(255,255,255,0.7)',
                  color: active ? '#fff' : '#56534c',
                  border: active ? '1px solid transparent' : '1px solid rgba(20,18,12,0.08)',
                  boxShadow: active ? '0 14px 28px -14px rgba(255,90,31,0.6)' : 'none',
                }}
              >
                {c}
              </span>
            );
          })}
        </Reveal>

        <div data-r="pf-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 22 }}>
          <AnimatePresence mode="popLayout">
            {visible.map((p, i) => {
              const linked = hasLink(p);
              return (
                <motion.button
                  key={p.name}
                  type="button"
                  onClick={() => handleClick(p)}
                  aria-label={linked ? `Open ${p.name} link` : `Zoom ${p.name} image`}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.45, delay: (i % 3) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  style={{ textAlign: 'left', font: 'inherit', cursor: 'pointer', padding: 0, textDecoration: 'none', borderRadius: 22, overflow: 'hidden', background: '#161618', border: '1px solid #232325', display: 'block', width: '100%' }}
                >
                  <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden' }}>
                    <Image src={p.image} alt={`${p.name} — ${p.category}`} fill loading="lazy" sizes="(max-width: 560px) 100vw, (max-width: 860px) 50vw, 380px" style={{ objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: 14, left: 14, fontSize: 11.5, fontWeight: 600, color: '#fff', background: 'rgba(14,14,16,0.7)', backdropFilter: 'blur(8px)', padding: '7px 13px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.12)' }}>{p.category}</span>
                    {/* Hint icon: link vs zoom */}
                    <span style={{ position: 'absolute', top: 14, right: 14, width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#fff', background: 'rgba(14,14,16,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.12)' }}>
                      {linked ? '↗' : '⤢'}
                    </span>
                  </div>
                  <div style={{ padding: '20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                      <div style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 17, color: '#fff' }}>{p.name}</div>
                      <div style={{ fontSize: 12.5, color: '#8a8a8e', marginTop: 2 }}>{linked ? 'View Project' : 'View Image'}</div>
                    </div>
                    <span style={{ width: 42, height: 42, borderRadius: '50%', background: BRAND_GRAD, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 17, flexShrink: 0 }}>↗</span>
                  </div>
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Load More — only in the "All" view while more items remain */}
        {canLoadMore && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 44 }}>
            <motion.button
              type="button"
              onClick={() => setShowAll(true)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                fontFamily: 'Manrope',
                fontWeight: 600,
                fontSize: 15,
                color: '#fff',
                background: BRAND_GRAD,
                border: 'none',
                padding: '15px 30px',
                borderRadius: 999,
                cursor: 'pointer',
                boxShadow: '0 18px 38px -14px rgba(255,90,31,0.65)',
              }}
            >
              Load More <span style={{ fontSize: 17 }}>↓</span>
            </motion.button>
          </div>
        )}
      </div>

      {/* ===================== LIGHTBOX / ZOOM POPUP ===================== */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeZoom}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 300,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              background: 'rgba(6,6,8,0.86)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeZoom}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: 22,
                right: 22,
                width: 46,
                height: 46,
                borderRadius: '50%',
                border: '1px solid rgba(255,255,255,0.2)',
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                fontSize: 20,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              ✕
            </button>

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                width: 'min(1100px, 92vw)',
                maxHeight: '82vh',
                borderRadius: 20,
                overflow: 'hidden',
                boxShadow: '0 40px 100px -30px rgba(0,0,0,0.8)',
                border: '1px solid rgba(255,255,255,0.14)',
                background: '#0E0E10',
              }}
            >
              {/* Natural-size image so full graphic is visible when zoomed */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={zoom.image}
                alt={`${zoom.name} — ${zoom.category}`}
                style={{ display: 'block', width: '100%', height: 'auto', maxHeight: '82vh', objectFit: 'contain', background: '#0E0E10' }}
              />
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '18px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, background: 'linear-gradient(0deg, rgba(6,6,8,0.85), transparent)' }}>
                <div>
                  <div style={{ fontFamily: 'Sora', fontWeight: 600, fontSize: 18, color: '#fff' }}>{zoom.name}</div>
                  <div style={{ fontSize: 12.5, color: '#c9c9cd', marginTop: 2 }}>{zoom.category}</div>
                </div>
              </div>
            </motion.div>

            <div style={{ marginTop: 16, fontSize: 12.5, color: 'rgba(255,255,255,0.55)' }}>
              Click anywhere or press Esc to close
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
