<script lang="ts">
  import { fly, fade, scale } from 'svelte/transition';
  import { quintOut, backOut } from 'svelte/easing';
  import { trackEvent } from '$lib/utils/analytics';
  import {
    Shield, Lock, FileSpreadsheet, Smartphone, BookOpen, AlertTriangle,
    Bell, UserCheck, Eye, Zap, MapPin, Calendar, Play, Pause, Volume2,
    VolumeX, Clock, Check, Building, Fingerprint, ArrowRight, SkipBack,
    SkipForward, ClipboardList, Server, Gavel, X
  } from '@lucide/svelte';

  let { onclose }: { onclose: () => void } = $props();

  function handleClose() {
    const pct = duration ? Math.floor((currentTime / duration) * 100) : 0;
    trackEvent('pitch_closed', { percent_watched: pct, last_slide: currentSlide?.id ?? 'unknown' });
    onclose();
  }

  // ── Audio state ──
  let audioEl = $state<HTMLAudioElement | null>(null);
  let currentTime = $state(0);
  let duration = $state(0);
  let playing = $state(false);
  let muted = $state(false);

  interface Slide { start: number; end: number; id: string; subtitle: string; }

  const slides: Slide[] = [
    { start: 0, end: 5, id: 'intro', subtitle: 'Les presento a Ethoz, el escudo digital diseñado para la comunidad escolar de hoy.' },
    { start: 5, end: 20, id: 'problem', subtitle: '¿Dónde está la información más sensible de los alumnos? La realidad es que vive en planillas, libretas, WhatsApps... está por todos lados.' },
    { start: 20, end: 31, id: 'law', subtitle: 'Ahora se suma un nuevo desafío: la ley de protección de datos. Hablamos de la Ley 21.719. Va a cambiar las reglas del juego para todos.' },
    { start: 31, end: 48, id: 'fines', subtitle: 'La cuenta regresiva ya empezó. En diciembre de 2026, la ley entra en plena vigencia. Las multas pueden llegar hasta 20.000 UTM — más de $1.200 millones.' },
    { start: 48, end: 53, id: 'classification', subtitle: 'La ley clasifica las faltas en leves, graves y gravísimas, con sanciones para cada nivel.' },
    { start: 53, end: 58, id: 'solution', subtitle: 'Aquí es donde entra Ethoz, el escudo digital que protege al colegio y cumple la ley.' },
    { start: 58, end: 71, id: 'features-a', subtitle: 'Centralizamos todo en una ficha 360° por alumno. Las alertas críticas llegan al instante.' },
    { start: 71, end: 80, id: 'features-b', subtitle: 'En portería, validan quién retira a un alumno en segundos. Cada persona ve solo lo que necesita.' },
    { start: 80, end: 92, id: 'implementation', subtitle: 'Implementarlo es fácil. Conectamos el colegio, migramos los datos y listo. En semanas, el equipo ya funciona.' },
    { start: 92, end: 99, id: 'security', subtitle: 'Usamos cifrado de nivel bancario y todos los datos se guardan de forma segura aquí en Chile.' },
    { start: 99, end: 109, id: 'urgency', subtitle: 'La ley no espera. Prepararse hoy significa estar tranquilos mañana. Para 2026, abrimos un programa piloto.' },
    { start: 109, end: 999, id: 'cta', subtitle: 'Los cupos son muy limitados. Agenden su demo en ethoz.cl y aseguren su cupo.' },
  ];

  let currentSlideIndex = $derived(Math.max(0, slides.findIndex(s => currentTime >= s.start && currentTime < s.end)));
  let currentSlide = $derived(slides[currentSlideIndex]);
  let progress = $derived(duration ? (currentTime / duration) * 100 : 0);

  function togglePlay() {
    if (!audioEl) return;
    if (playing) audioEl.pause(); else audioEl.play();
  }
  function seekTo(time: number) { if (audioEl) audioEl.currentTime = time; }
  function goToSlide(i: number) { if (i >= 0 && i < slides.length) seekTo(slides[i].start); }

  function handleProgressClick(e: MouseEvent) {
    const bar = e.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    seekTo(((e.clientX - rect.left) / rect.width) * duration);
  }

  function fmt(sec: number): string {
    return `${Math.floor(sec / 60)}:${Math.floor(sec % 60).toString().padStart(2, '0')}`;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.code === 'Escape') { handleClose(); return; }
    if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
    if (e.code === 'ArrowLeft') { e.preventDefault(); goToSlide(currentSlideIndex - 1); }
    if (e.code === 'ArrowRight') { e.preventDefault(); goToSlide(currentSlideIndex + 1); }
  }

  // Track milestones (25%, 50%, 75%, 100%)
  let trackedMilestones = new Set<number>();

  function checkMilestones() {
    if (!duration) return;
    const pct = Math.floor((currentTime / duration) * 100);
    for (const milestone of [25, 50, 75, 100]) {
      if (pct >= milestone && !trackedMilestones.has(milestone)) {
        trackedMilestones.add(milestone);
        trackEvent('pitch_progress', { milestone, slide: currentSlide.id });
      }
    }
  }

  // Track slide views
  let lastTrackedSlide = '';
  $effect(() => {
    if (currentSlide.id !== lastTrackedSlide) {
      lastTrackedSlide = currentSlide.id;
      trackEvent('pitch_slide_viewed', { slide: currentSlide.id, slide_index: currentSlideIndex });
    }
  });

  // Auto-play on mount + track open
  $effect(() => {
    if (audioEl) {
      audioEl.play().catch(() => {});
      trackEvent('pitch_opened', {});
    }
  });

  // Countdown
  let countdownDays = $state(0);
  $effect(() => {
    const diff = new Date('2026-12-01T00:00:00-03:00').getTime() - Date.now();
    countdownDays = Math.max(0, Math.floor(diff / 86400000));
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<audio
  bind:this={audioEl}
  src="/audio/pitch.m4a"
  preload="auto"
  controlsList="nodownload"
  oncontextmenu={(e) => e.preventDefault()}
  ontimeupdate={() => { if (audioEl) { currentTime = audioEl.currentTime; checkMilestones(); } }}
  onloadedmetadata={() => { if (audioEl) duration = audioEl.duration; }}
  onplay={() => { playing = true; }}
  onpause={() => { playing = false; }}
  onended={() => { playing = false; }}
></audio>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="modal-backdrop" transition:fade={{ duration: 250 }} onclick={(e) => { if (e.target === e.currentTarget) handleClose(); }} onkeydown={handleKeydown}>
  <div class="modal-content">
  <!-- Close button -->
  <button class="close-btn" onclick={handleClose} aria-label="Cerrar">
    <X size={24} />
  </button>

  <!-- Slide area -->
  <div class="slide-area">
    {#key currentSlide.id}
      <div class="slide" in:fly={{ y: 24, duration: 550, easing: quintOut, delay: 150 }} out:fade={{ duration: 200 }}>

        {#if currentSlide.id === 'intro'}
          <div class="sc">
            <div in:scale={{ duration: 700, easing: backOut, delay: 250 }}>
              <img src="/logos/ethoz-final-light.svg" alt="Ethoz" class="logo-hero" />
            </div>
            <p class="sub" in:fly={{ y: 16, duration: 500, delay: 500 }}>El Escudo Digital Escolar</p>
            <span class="pill" in:scale={{ duration: 400, delay: 700 }}>Cumple con Ley 21.719</span>
          </div>

        {:else if currentSlide.id === 'problem'}
          <div class="sc">
            <h2 class="heading">¿Dónde está la información<br/>más sensible?</h2>
            <div class="row gap-6">
              <div class="icon-col" in:fly={{ x: -40, duration: 500, delay: 250 }}>
                <div class="icon-box warn"><FileSpreadsheet size={28} /></div>
                <span class="icon-label">Planillas</span>
              </div>
              <div class="icon-col" in:fly={{ y: -30, duration: 500, delay: 400 }}>
                <div class="icon-box warn"><BookOpen size={28} /></div>
                <span class="icon-label">Libretas</span>
              </div>
              <div class="icon-col" in:fly={{ x: 40, duration: 500, delay: 550 }}>
                <div class="icon-box warn"><Smartphone size={28} /></div>
                <span class="icon-label">WhatsApp</span>
              </div>
            </div>
            <div class="callout danger" in:fly={{ y: 16, duration: 500, delay: 700 }}>
              <AlertTriangle size={18} />
              <span>Órdenes de alejamiento que no llegan · Retiros no autorizados</span>
            </div>
          </div>

        {:else if currentSlide.id === 'law'}
          <div class="sc">
            <div class="icon-accent" in:scale={{ duration: 500, delay: 250 }}><Gavel size={48} strokeWidth={1.5} /></div>
            <h2 class="heading">Ley 21.719</h2>
            <p class="sub">Protección de Datos Personales</p>
            <div class="card-light" in:fly={{ y: 16, duration: 500, delay: 500 }}>
              <p class="card-text">Cambia las reglas del juego<br/><strong>para todos los colegios</strong></p>
            </div>
          </div>

        {:else if currentSlide.id === 'fines'}
          <div class="sc">
            <div class="label-row warn-text" in:fly={{ y: -16, duration: 400, delay: 200 }}>
              <Clock size={18} /><span>Cuenta regresiva</span>
            </div>
            <div in:scale={{ duration: 600, delay: 350, easing: backOut }}>
              <p class="big-text">Diciembre 2026</p>
              <p class="sub-num warn-text">{countdownDays} días restantes</p>
            </div>
            <div in:fly={{ y: 24, duration: 600, delay: 600 }}>
              <p class="big-number danger-text">20.000 <span class="unit">UTM</span></p>
              <p class="sub">= <strong class="danger-text">$1.200 millones CLP</strong></p>
            </div>
            <p class="muted-sm" in:fade={{ duration: 400, delay: 850 }}>Multa máxima por infracciones gravísimas</p>
          </div>

        {:else if currentSlide.id === 'classification'}
          <div class="sc">
            <h2 class="heading">Clasificación de Faltas</h2>
            <div class="severity-list">
              <div class="sev-row" in:fly={{ x: -30, duration: 450, delay: 250 }}>
                <span class="sev-dot leve"></span><span class="sev-name leve-text">Leve</span><span class="sev-range">1 – 100 UTM</span>
              </div>
              <div class="sev-row" in:fly={{ x: -30, duration: 450, delay: 400 }}>
                <span class="sev-dot grave"></span><span class="sev-name grave-text">Grave</span><span class="sev-range">101 – 5.000 UTM</span>
              </div>
              <div class="sev-row" in:fly={{ x: -30, duration: 450, delay: 550 }}>
                <span class="sev-dot gravisima"></span><span class="sev-name gravisima-text">Gravísima</span><span class="sev-range">5.001 – 20.000 UTM</span>
              </div>
            </div>
          </div>

        {:else if currentSlide.id === 'solution'}
          <div class="sc">
            <div class="shield-glow" in:scale={{ duration: 700, easing: backOut, delay: 200 }}>
              <Shield size={80} strokeWidth={1.2} />
            </div>
            <h2 class="heading primary-text" in:fly={{ y: 16, duration: 500, delay: 450 }}>Tu Escudo Digital</h2>
            <p class="sub" in:fly={{ y: 16, duration: 500, delay: 600 }}>Protege al colegio y cumple la ley</p>
          </div>

        {:else if currentSlide.id === 'features-a'}
          <div class="sc">
            <div class="card-grid">
              <div class="fcard" in:fly={{ x: -40, duration: 500, delay: 250 }}>
                <div class="ficon primary-bg"><ClipboardList size={32} strokeWidth={1.5} /></div>
                <h3>Ficha 360°</h3>
                <p>Todo centralizado por alumno. Nada se pierde.</p>
              </div>
              <div class="fcard" in:fly={{ x: 40, duration: 500, delay: 400 }}>
                <div class="ficon danger-bg"><Bell size={32} strokeWidth={1.5} /></div>
                <h3>Alertas Críticas</h3>
                <p>Al instante, solo a quien debe saber.</p>
              </div>
            </div>
          </div>

        {:else if currentSlide.id === 'features-b'}
          <div class="sc">
            <div class="card-grid">
              <div class="fcard" in:fly={{ x: -40, duration: 500, delay: 250 }}>
                <div class="ficon success-bg"><UserCheck size={32} strokeWidth={1.5} /></div>
                <h3>Retiro Seguro</h3>
                <p>Validación en segundos, sin papeles.</p>
              </div>
              <div class="fcard" in:fly={{ x: 40, duration: 500, delay: 400 }}>
                <div class="ficon primary-bg"><Eye size={32} strokeWidth={1.5} /></div>
                <h3>Control por Rol</h3>
                <p>Cada persona ve solo lo que necesita.</p>
              </div>
            </div>
          </div>

        {:else if currentSlide.id === 'implementation'}
          <div class="sc">
            <h2 class="heading">Implementación Simple</h2>
            <div class="row gap-0 items-center">
              <div class="step-col" in:fly={{ y: 24, duration: 450, delay: 250 }}>
                <div class="ficon primary-bg"><Building size={24} /></div>
                <span class="icon-label">Conectamos</span>
              </div>
              <div class="connector" in:scale={{ duration: 300, delay: 400 }}></div>
              <div class="step-col" in:fly={{ y: 24, duration: 450, delay: 450 }}>
                <div class="ficon primary-bg"><Server size={24} /></div>
                <span class="icon-label">Migramos</span>
              </div>
              <div class="connector" in:scale={{ duration: 300, delay: 600 }}></div>
              <div class="step-col" in:fly={{ y: 24, duration: 450, delay: 650 }}>
                <div class="ficon primary-bg"><Zap size={24} /></div>
                <span class="icon-label">Operamos</span>
              </div>
            </div>
            <p class="success-text fw-500" in:fade={{ duration: 400, delay: 850 }}>En semanas, no meses.</p>
          </div>

        {:else if currentSlide.id === 'security'}
          <div class="sc">
            <div class="row gap-4" in:scale={{ duration: 600, delay: 250 }}>
              <div class="ficon primary-bg lg"><Lock size={36} strokeWidth={1.5} /></div>
              <div class="ficon primary-bg lg"><Fingerprint size={36} strokeWidth={1.5} /></div>
            </div>
            <h2 class="heading">Cifrado Nivel Bancario</h2>
            <div class="check-list">
              <div class="check-item" in:fly={{ y: 16, duration: 400, delay: 450 }}><Check size={16} /><span>Encriptación AES-256</span></div>
              <div class="check-item" in:fly={{ y: 16, duration: 400, delay: 550 }}><MapPin size={16} /><span>Datos almacenados en Chile</span></div>
              <div class="check-item" in:fly={{ y: 16, duration: 400, delay: 650 }}><Shield size={16} /><span>Cumplimiento normativo total</span></div>
            </div>
          </div>

        {:else if currentSlide.id === 'urgency'}
          <div class="sc">
            <div class="icon-accent warn-icon" in:scale={{ duration: 500, delay: 200 }}><Calendar size={48} strokeWidth={1.5} /></div>
            <h2 class="heading" in:fly={{ y: 16, duration: 500, delay: 350 }}>La ley no espera</h2>
            <p class="sub" in:fly={{ y: 16, duration: 500, delay: 500 }}>Prepararse hoy significa<br/>estar tranquilos mañana</p>
            <span class="pill warn-pill" in:scale={{ duration: 400, delay: 650 }}>
              <Zap size={14} /> Programa Piloto 2026 — Cupos Limitados
            </span>
          </div>

        {:else if currentSlide.id === 'cta'}
          <div class="sc">
            <div in:scale={{ duration: 700, easing: backOut, delay: 200 }}>
              <img src="/logos/ethoz-final-light.svg" alt="Ethoz" class="logo-cta" />
            </div>
            <h2 class="heading" in:fly={{ y: 16, duration: 500, delay: 350 }}>Agenda tu Demo</h2>
            <p class="sub" in:fly={{ y: 16, duration: 500, delay: 500 }}>Sé de los primeros en cumplir</p>
            <a href="/demo" class="cta-btn" in:scale={{ duration: 400, delay: 650 }} onclick={handleClose}>
              Agendar Demo <ArrowRight size={18} />
            </a>
          </div>
        {/if}

      </div>
    {/key}
  </div>

  <!-- Subtitles — always visible -->
  <div class="subtitle-bar">
    {#key currentSlide.id}
      <p class="subtitle" in:fade={{ duration: 350, delay: 150 }}>{currentSlide.subtitle}</p>
    {/key}
  </div>

  <!-- Controls -->
  <div class="controls">
    <div class="progress" onclick={handleProgressClick} role="slider" tabindex={0} aria-label="Progreso" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
      <div class="track">
        <div class="fill" style="width:{progress}%"></div>
        {#each slides as s, i}
          {#if i > 0}
            <div class="marker" class:active={i <= currentSlideIndex} style="left:{duration ? (s.start / duration) * 100 : 0}%"></div>
          {/if}
        {/each}
      </div>
    </div>
    <div class="ctrl-row">
      <span class="time">{fmt(currentTime)} / {fmt(duration)}</span>
      <div class="ctrl-center">
        <button class="cb" onclick={() => goToSlide(currentSlideIndex - 1)} disabled={currentSlideIndex === 0} aria-label="Anterior"><SkipBack size={18} /></button>
        <button class="cb play" onclick={togglePlay} aria-label={playing ? 'Pausar' : 'Reproducir'}>
          {#if playing}<Pause size={24} />{:else}<Play size={24} />{/if}
        </button>
        <button class="cb" onclick={() => goToSlide(currentSlideIndex + 1)} disabled={currentSlideIndex === slides.length - 1} aria-label="Siguiente"><SkipForward size={18} /></button>
      </div>
      <div class="ctrl-right">
        <button class="cb" onclick={() => { muted = !muted; if (audioEl) audioEl.muted = muted; }} aria-label="Mute">
          {#if muted}<VolumeX size={16} />{:else}<Volume2 size={16} />{/if}
        </button>
      </div>
    </div>
    <div class="dots">
      {#each slides as _, i}
        <button class="dot" class:active={i === currentSlideIndex} onclick={() => goToSlide(i)} aria-label="Slide {i+1}"></button>
      {/each}
    </div>
  </div>
  </div>
</div>

<style>
  /* ── Modal backdrop ── */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: oklch(0 0 0 / 0.6);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    font-family: "Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  .modal-content {
    position: relative;
    max-width: 56rem;
    width: 100%;
    height: min(calc(100vw * 9 / 16), 80vh);
    background: var(--background);
    border-radius: 1rem;
    overflow: hidden;
    box-shadow: 0 24px 48px oklch(0 0 0 / 0.2);
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 640px) {
    .modal-content {
      height: auto;
      min-height: 60vh;
      max-height: 90vh;
      border-radius: 0.75rem;
    }
  }

  .close-btn {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    z-index: 10;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--background);
    color: var(--muted-foreground);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px oklch(0 0 0 / 0.06);
    padding: 0;
  }
  .close-btn:hover { color: var(--foreground); background: var(--secondary); }

  /* ── Slide area ── */
  .slide-area {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .slide {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* ── Slide content shared ── */
  .sc {
    max-width: 48rem;
    width: 100%;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.25rem;
  }

  .heading {
    font-size: clamp(1.75rem, 4.5vw, 3rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: var(--foreground);
  }

  .sub { font-size: clamp(1rem, 2vw, 1.25rem); color: var(--muted-foreground); }
  .muted-sm { font-size: 0.8rem; color: var(--muted-foreground); }
  .fw-500 { font-weight: 500; }

  .primary-text { color: var(--primary); }
  .danger-text { color: oklch(0.45 0.2 25); }
  .warn-text { color: oklch(0.5 0.12 85); }
  .success-text { color: oklch(0.5 0.17 145); }

  /* ── Logo ── */
  .logo-hero {
    height: clamp(3rem, 7vw, 4.5rem);
    width: auto;
    filter: drop-shadow(0 2px 10px oklch(0.546 0.213 264 / 0.1));
  }
  .logo-cta {
    height: clamp(2.25rem, 4.5vw, 3.5rem);
    width: auto;
    filter: drop-shadow(0 2px 10px oklch(0.546 0.213 264 / 0.1));
  }

  /* ── Pill badges ── */
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.4rem 1rem;
    border-radius: 9999px;
    background: oklch(0.546 0.213 264 / 0.07);
    color: var(--primary);
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid oklch(0.546 0.213 264 / 0.12);
  }
  .warn-pill {
    background: oklch(0.75 0.15 85 / 0.07);
    color: oklch(0.5 0.12 85);
    border-color: oklch(0.75 0.15 85 / 0.12);
  }

  /* ── Big numbers ── */
  .big-text {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    color: var(--foreground);
  }
  .big-number {
    font-size: clamp(1.75rem, 4.5vw, 3rem);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }
  .unit { font-size: 0.6em; font-weight: 500; opacity: 0.7; }
  .sub-num { font-size: 0.9rem; font-variant-numeric: tabular-nums; }

  /* ── Layout helpers ── */
  .row { display: flex; flex-wrap: wrap; justify-content: center; }
  .gap-0 { gap: 0; }
  .gap-4 { gap: 1rem; }
  .gap-6 { gap: 1.5rem; }
  .items-center { align-items: center; }

  /* ── Icon boxes ── */
  .icon-col, .step-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
  }
  .icon-label { font-size: 0.85rem; color: var(--muted-foreground); font-weight: 500; }

  .icon-box {
    width: 3.75rem;
    height: 3.75rem;
    border-radius: 0.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .icon-box.warn {
    background: oklch(0.75 0.15 85 / 0.08);
    color: oklch(0.55 0.13 85);
    border: 1px solid oklch(0.75 0.15 85 / 0.15);
  }

  .icon-accent {
    color: var(--primary);
    filter: drop-shadow(0 0 12px oklch(0.546 0.213 264 / 0.15));
  }
  .warn-icon { color: oklch(0.55 0.13 85); filter: drop-shadow(0 0 12px oklch(0.7 0.15 85 / 0.15)); }

  /* ── Feature cards ── */
  .card-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    width: 100%;
    max-width: 38rem;
  }
  @media (max-width: 500px) { .card-grid { grid-template-columns: 1fr; } }

  .fcard {
    padding: 1.5rem;
    border-radius: 0.875rem;
    background: var(--background);
    border: 1px solid var(--border);
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    box-shadow: 0 1px 3px oklch(0 0 0 / 0.04);
  }
  .fcard h3 { font-size: 1.1rem; font-weight: 600; color: var(--foreground); }
  .fcard p { font-size: 0.85rem; color: var(--muted-foreground); line-height: 1.45; }

  .ficon {
    width: 3rem;
    height: 3rem;
    border-radius: 0.625rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ficon.lg { width: 4rem; height: 4rem; border-radius: 0.875rem; }
  .primary-bg { background: oklch(0.546 0.213 264 / 0.07); color: var(--primary); border: 1px solid oklch(0.546 0.213 264 / 0.1); }
  .danger-bg { background: oklch(0.55 0.22 25 / 0.07); color: oklch(0.5 0.2 25); border: 1px solid oklch(0.55 0.22 25 / 0.1); }
  .success-bg { background: oklch(0.62 0.19 145 / 0.07); color: oklch(0.5 0.17 145); border: 1px solid oklch(0.62 0.19 145 / 0.1); }

  .connector { width: 2.5rem; height: 2px; background: oklch(0.546 0.213 264 / 0.15); flex-shrink: 0; }

  /* ── Info card ── */
  .card-light {
    padding: 1rem 1.75rem;
    border-radius: 0.75rem;
    background: oklch(0.546 0.213 264 / 0.04);
    border: 1px solid oklch(0.546 0.213 264 / 0.08);
  }
  .card-text { font-size: 1.1rem; color: var(--foreground); line-height: 1.5; }

  /* ── Callout ── */
  .callout {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.75rem 1.25rem;
    border-radius: 0.625rem;
    font-size: 0.8rem;
  }
  .callout.danger {
    background: oklch(0.55 0.22 25 / 0.05);
    color: oklch(0.45 0.18 25);
    border: 1px solid oklch(0.55 0.22 25 / 0.1);
  }

  /* ── Severity ── */
  .severity-list { display: flex; flex-direction: column; gap: 0.75rem; width: 100%; max-width: 24rem; }
  .sev-row {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.875rem 1.25rem;
    border-radius: 0.625rem;
    background: var(--secondary);
    border: 1px solid var(--border);
  }
  .sev-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
  .sev-dot.leve { background: oklch(0.7 0.15 85); box-shadow: 0 0 6px oklch(0.7 0.15 85 / 0.3); }
  .sev-dot.grave { background: oklch(0.6 0.18 55); box-shadow: 0 0 6px oklch(0.6 0.18 55 / 0.3); }
  .sev-dot.gravisima { background: oklch(0.5 0.2 25); box-shadow: 0 0 6px oklch(0.5 0.2 25 / 0.3); }
  .sev-name { font-weight: 600; font-size: 1rem; flex: 1; text-align: left; }
  .leve-text { color: oklch(0.5 0.12 85); }
  .grave-text { color: oklch(0.45 0.15 55); }
  .gravisima-text { color: oklch(0.4 0.18 25); }
  .sev-range { font-size: 0.8rem; color: var(--muted-foreground); font-variant-numeric: tabular-nums; }

  /* ── Shield glow ── */
  .shield-glow {
    color: var(--primary);
    filter: drop-shadow(0 0 24px oklch(0.546 0.213 264 / 0.2));
    animation: pulse-glow 2s ease-in-out infinite;
  }

  /* ── Check list ── */
  .check-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .check-item { display: flex; align-items: center; gap: 0.6rem; font-size: 0.95rem; color: var(--foreground); }
  .check-item :global(svg) { color: oklch(0.5 0.17 145); flex-shrink: 0; }

  /* ── Label row ── */
  .label-row {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  /* ── CTA button ── */
  .cta-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.875rem 2rem;
    border-radius: 9999px;
    background: var(--primary);
    color: var(--primary-foreground);
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.25s ease;
    box-shadow: 0 4px 16px oklch(0.546 0.213 264 / 0.18);
  }
  .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 24px oklch(0.546 0.213 264 / 0.25); }

  /* ═══ SUBTITLE BAR ═══ */
  .subtitle-bar {
    position: absolute;
    bottom: 8.5rem;
    left: 50%;
    transform: translateX(-50%);
    max-width: 44rem;
    width: calc(100% - 2rem);
    text-align: center;
    pointer-events: none;
    z-index: 10;
  }

  .subtitle {
    font-size: clamp(0.8rem, 1.4vw, 0.95rem);
    color: var(--foreground);
    line-height: 1.6;
    padding: 0.625rem 1.25rem;
    background: oklch(1 0 0 / 0.88);
    backdrop-filter: blur(12px);
    border-radius: 0.625rem;
    border: 1px solid var(--border);
    box-shadow: 0 2px 8px oklch(0 0 0 / 0.05);
  }

  /* ═══ CONTROLS ═══ */
  .controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.5rem 1rem 0.75rem;
    background: linear-gradient(to top, oklch(1 0 0 / 0.96) 0%, oklch(1 0 0 / 0) 100%);
    z-index: 20;
  }

  .progress { width: 100%; padding: 0.4rem 0; cursor: pointer; }
  .track { height: 3px; background: oklch(0.9 0 0); border-radius: 2px; position: relative; transition: height 0.15s ease; }
  .progress:hover .track { height: 5px; }
  .fill { height: 100%; background: var(--primary); border-radius: 2px; position: relative; transition: width 0.1s linear; }
  .fill::after {
    content: '';
    position: absolute;
    right: -5px;
    top: 50%;
    transform: translateY(-50%) scale(0);
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--primary);
    transition: transform 0.15s ease;
  }
  .progress:hover .fill::after { transform: translateY(-50%) scale(1); }
  .marker { position: absolute; top: -1px; width: 2px; height: calc(100% + 2px); background: oklch(0.88 0 0); }
  .marker.active { background: oklch(0.546 0.213 264 / 0.25); }

  .ctrl-row { display: flex; align-items: center; justify-content: space-between; padding: 0.125rem 0; gap: 0.5rem; }
  .time { font-size: 0.75rem; color: var(--muted-foreground); font-variant-numeric: tabular-nums; min-width: 5rem; }
  .ctrl-center { display: flex; align-items: center; gap: 0.5rem; }
  .ctrl-right { display: flex; align-items: center; gap: 0.25rem; min-width: 5rem; justify-content: flex-end; }

  .cb {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: var(--muted-foreground);
    cursor: pointer;
    transition: all 0.2s ease;
    padding: 0;
    text-decoration: none;
  }
  .cb:hover { color: var(--foreground); background: var(--secondary); }
  .cb:disabled { opacity: 0.3; pointer-events: none; }
  .cb.play { width: 2.75rem; height: 2.75rem; background: var(--primary); color: var(--primary-foreground); }
  .cb.play:hover { background: oklch(0.48 0.21 264); color: var(--primary-foreground); transform: scale(1.05); }

  .dots { display: flex; justify-content: center; gap: 0.3rem; padding-top: 0.375rem; }
  .dot {
    width: 5px; height: 5px; border-radius: 9999px; border: none;
    background: oklch(0.85 0 0); cursor: pointer; padding: 0; transition: all 0.3s ease;
  }
  .dot.active { width: 1.25rem; background: var(--primary); }
  .dot:hover:not(.active) { background: oklch(0.7 0 0); }

  /* ═══ ANIMATIONS ═══ */
  @keyframes pulse-glow {
    0%, 100% { filter: drop-shadow(0 0 20px oklch(0.546 0.213 264 / 0.15)); }
    50% { filter: drop-shadow(0 0 36px oklch(0.546 0.213 264 / 0.3)); }
  }

  @media (prefers-reduced-motion: reduce) {
    .shield-glow { animation: none; }
  }

  @media (max-width: 500px) {
    .sc { padding: 1rem; gap: 1rem; }
    .subtitle-bar { bottom: 7.5rem; }
    .close-btn { top: 0.5rem; right: 0.5rem; }
    .callout { flex-wrap: wrap; justify-content: center; text-align: center; }
  }
</style>