<script lang="ts">
  import { fly, fade, scale } from 'svelte/transition';
  import { quintOut, backOut } from 'svelte/easing';
  import { trackEvent } from '$lib/utils/analytics';
  import { pitchSlides as slides, getDaysUntilEnforcement } from '$lib/data/pitch-slides';
  import { BRAND } from '$lib/brand';
  import { t } from '$lib/i18n/index.svelte';
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
  let countdownDays = $state(getDaysUntilEnforcement());
</script>

<svelte:window onkeydown={handleKeydown} />

<audio
  bind:this={audioEl}
  src="/audio/pitch.m4a"
  preload="metadata"
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
  <button class="close-btn" onclick={handleClose} aria-label={t('pitchModal.close_label')}>
    <X size={24} />
  </button>

  <!-- Slide area -->
  <div class="slide-area">
    {#key currentSlide.id}
      <div class="slide" in:fly={{ y: 24, duration: 550, easing: quintOut, delay: 150 }} out:fade={{ duration: 200 }}>

        {#if currentSlide.id === 'intro'}
          <div class="sc">
            <div in:scale={{ duration: 700, easing: backOut, delay: 250 }}>
              <img src="/logos/ethoz-final-light.svg" alt={BRAND} class="logo-hero" />
            </div>
            <p class="sub" in:fly={{ y: 16, duration: 500, delay: 500 }}>{t('pitchModal.intro_sub')}</p>
            <span class="pill" in:scale={{ duration: 400, delay: 700 }}>{t('pitchModal.intro_pill')}</span>
          </div>

        {:else if currentSlide.id === 'problem'}
          <div class="sc">
            <h2 class="heading">{t('pitchModal.problem_heading_l1')}<br/>{t('pitchModal.problem_heading_l2')}</h2>
            <div class="row gap-6">
              <div class="icon-col" in:fly={{ x: -40, duration: 500, delay: 250 }}>
                <div class="icon-box warn"><FileSpreadsheet size={28} /></div>
                <span class="icon-label">{t('pitchModal.problem_label_spreadsheets')}</span>
              </div>
              <div class="icon-col" in:fly={{ y: -30, duration: 500, delay: 400 }}>
                <div class="icon-box warn"><BookOpen size={28} /></div>
                <span class="icon-label">{t('pitchModal.problem_label_notebooks')}</span>
              </div>
              <div class="icon-col" in:fly={{ x: 40, duration: 500, delay: 550 }}>
                <div class="icon-box warn"><Smartphone size={28} /></div>
                <span class="icon-label">{t('pitchModal.problem_label_whatsapp')}</span>
              </div>
            </div>
            <div class="callout danger" in:fly={{ y: 16, duration: 500, delay: 700 }}>
              <AlertTriangle size={18} />
              <span>{t('pitchModal.problem_callout')}</span>
            </div>
          </div>

        {:else if currentSlide.id === 'law'}
          <div class="sc">
            <div class="icon-accent" in:scale={{ duration: 500, delay: 250 }}><Gavel size={48} strokeWidth={1.5} /></div>
            <h2 class="heading">{t('pitchModal.law_heading')}</h2>
            <p class="sub">{t('pitchModal.law_sub')}</p>
            <div class="card-light" in:fly={{ y: 16, duration: 500, delay: 500 }}>
              <p class="card-text">{t('pitchModal.law_card_l1')}<br/><strong>{t('pitchModal.law_card_l2')}</strong></p>
            </div>
          </div>

        {:else if currentSlide.id === 'fines'}
          <div class="sc">
            <div class="label-row warn-text" in:fly={{ y: -16, duration: 400, delay: 200 }}>
              <Clock size={18} /><span>{t('pitchModal.fines_countdown_label')}</span>
            </div>
            <div in:scale={{ duration: 600, delay: 350, easing: backOut }}>
              <p class="big-text">{t('pitchModal.fines_date')}</p>
              <p class="sub-num warn-text">{countdownDays} {t('pitchModal.fines_days_remaining')}</p>
            </div>
            <div in:fly={{ y: 24, duration: 600, delay: 600 }}>
              <p class="big-number danger-text">20.000 <span class="unit">UTM</span></p>
              <p class="sub">= <strong class="danger-text">$1.200 millones CLP</strong></p>
            </div>
            <p class="muted-sm" in:fade={{ duration: 400, delay: 850 }}>{t('pitchModal.fines_caption')}</p>
          </div>

        {:else if currentSlide.id === 'classification'}
          <div class="sc">
            <h2 class="heading">{t('pitchModal.classification_heading')}</h2>
            <div class="severity-list">
              <div class="sev-row" in:fly={{ x: -30, duration: 450, delay: 250 }}>
                <span class="sev-dot leve"></span><span class="sev-name leve-text">{t('pitchModal.classification_minor')}</span><span class="sev-range">1 a 100 UTM</span>
              </div>
              <div class="sev-row" in:fly={{ x: -30, duration: 450, delay: 400 }}>
                <span class="sev-dot grave"></span><span class="sev-name grave-text">{t('pitchModal.classification_serious')}</span><span class="sev-range">101 a 5.000 UTM</span>
              </div>
              <div class="sev-row" in:fly={{ x: -30, duration: 450, delay: 550 }}>
                <span class="sev-dot gravisima"></span><span class="sev-name gravisima-text">{t('pitchModal.classification_critical')}</span><span class="sev-range">5.001 a 20.000 UTM</span>
              </div>
            </div>
          </div>

        {:else if currentSlide.id === 'solution'}
          <div class="sc">
            <div class="shield-glow" in:scale={{ duration: 700, easing: backOut, delay: 200 }}>
              <Shield size={80} strokeWidth={1.2} />
            </div>
            <h2 class="heading primary-text" in:fly={{ y: 16, duration: 500, delay: 450 }}>{t('pitchModal.solution_heading')}</h2>
            <p class="sub" in:fly={{ y: 16, duration: 500, delay: 600 }}>{t('pitchModal.solution_sub')}</p>
          </div>

        {:else if currentSlide.id === 'features-a'}
          <div class="sc">
            <div class="card-grid">
              <div class="fcard" in:fly={{ x: -40, duration: 500, delay: 250 }}>
                <div class="ficon primary-bg"><ClipboardList size={32} strokeWidth={1.5} /></div>
                <h3>{t('pitchModal.feature_record_title')}</h3>
                <p>{t('pitchModal.feature_record_desc')}</p>
              </div>
              <div class="fcard" in:fly={{ x: 40, duration: 500, delay: 400 }}>
                <div class="ficon danger-bg"><Bell size={32} strokeWidth={1.5} /></div>
                <h3>{t('pitchModal.feature_alerts_title')}</h3>
                <p>{t('pitchModal.feature_alerts_desc')}</p>
              </div>
            </div>
          </div>

        {:else if currentSlide.id === 'features-b'}
          <div class="sc">
            <div class="card-grid">
              <div class="fcard" in:fly={{ x: -40, duration: 500, delay: 250 }}>
                <div class="ficon success-bg"><UserCheck size={32} strokeWidth={1.5} /></div>
                <h3>{t('pitchModal.feature_pickup_title')}</h3>
                <p>{t('pitchModal.feature_pickup_desc')}</p>
              </div>
              <div class="fcard" in:fly={{ x: 40, duration: 500, delay: 400 }}>
                <div class="ficon primary-bg"><Eye size={32} strokeWidth={1.5} /></div>
                <h3>{t('pitchModal.feature_roles_title')}</h3>
                <p>{t('pitchModal.feature_roles_desc')}</p>
              </div>
            </div>
          </div>

        {:else if currentSlide.id === 'implementation'}
          <div class="sc">
            <h2 class="heading">{t('pitchModal.implementation_heading')}</h2>
            <div class="row gap-0 items-center">
              <div class="step-col" in:fly={{ y: 24, duration: 450, delay: 250 }}>
                <div class="ficon primary-bg"><Building size={24} /></div>
                <span class="icon-label">{t('pitchModal.implementation_step_connect')}</span>
              </div>
              <div class="connector" in:scale={{ duration: 300, delay: 400 }}></div>
              <div class="step-col" in:fly={{ y: 24, duration: 450, delay: 450 }}>
                <div class="ficon primary-bg"><Server size={24} /></div>
                <span class="icon-label">{t('pitchModal.implementation_step_migrate')}</span>
              </div>
              <div class="connector" in:scale={{ duration: 300, delay: 600 }}></div>
              <div class="step-col" in:fly={{ y: 24, duration: 450, delay: 650 }}>
                <div class="ficon primary-bg"><Zap size={24} /></div>
                <span class="icon-label">{t('pitchModal.implementation_step_operate')}</span>
              </div>
            </div>
            <p class="success-text fw-500" in:fade={{ duration: 400, delay: 850 }}>{t('pitchModal.implementation_timeline')}</p>
          </div>

        {:else if currentSlide.id === 'security'}
          <div class="sc">
            <div class="row gap-4" in:scale={{ duration: 600, delay: 250 }}>
              <div class="ficon primary-bg lg"><Lock size={36} strokeWidth={1.5} /></div>
              <div class="ficon primary-bg lg"><Fingerprint size={36} strokeWidth={1.5} /></div>
            </div>
            <h2 class="heading">{t('pitchModal.security_heading')}</h2>
            <div class="check-list">
              <div class="check-item" in:fly={{ y: 16, duration: 400, delay: 450 }}><Check size={16} /><span>{t('pitchModal.security_encryption')}</span></div>
              <div class="check-item" in:fly={{ y: 16, duration: 400, delay: 550 }}><MapPin size={16} /><span>{t('pitchModal.security_storage')}</span></div>
              <div class="check-item" in:fly={{ y: 16, duration: 400, delay: 650 }}><Shield size={16} /><span>{t('pitchModal.security_compliance')}</span></div>
            </div>
          </div>

        {:else if currentSlide.id === 'urgency'}
          <div class="sc">
            <div class="icon-accent warn-icon" in:scale={{ duration: 500, delay: 200 }}><Calendar size={48} strokeWidth={1.5} /></div>
            <h2 class="heading" in:fly={{ y: 16, duration: 500, delay: 350 }}>{t('pitchModal.urgency_heading')}</h2>
            <p class="sub" in:fly={{ y: 16, duration: 500, delay: 500 }}>{t('pitchModal.urgency_sub_l1')}<br/>{t('pitchModal.urgency_sub_l2')}</p>
            <span class="pill warn-pill" in:scale={{ duration: 400, delay: 650 }}>
              <Zap size={14} /> {t('pitchModal.urgency_pill')}
            </span>
          </div>

        {:else if currentSlide.id === 'cta'}
          <div class="sc">
            <div in:scale={{ duration: 700, easing: backOut, delay: 200 }}>
              <img src="/logos/ethoz-final-light.svg" alt={BRAND} class="logo-cta" />
            </div>
            <h2 class="heading" in:fly={{ y: 16, duration: 500, delay: 350 }}>{t('pitchModal.cta_heading')}</h2>
            <p class="sub" in:fly={{ y: 16, duration: 500, delay: 500 }}>{t('pitchModal.cta_sub')}</p>
            <a href="/demo" class="cta-btn" in:scale={{ duration: 400, delay: 650 }} onclick={handleClose}>
              {t('pitchModal.cta_button')} <ArrowRight size={18} />
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
    <div class="progress" onclick={handleProgressClick} onkeydown={(e) => { if (e.key === 'ArrowRight') { e.preventDefault(); seekTo(Math.min(currentTime + 5, duration)); } if (e.key === 'ArrowLeft') { e.preventDefault(); seekTo(Math.max(currentTime - 5, 0)); } }} role="slider" tabindex={0} aria-label={t('pitchModal.progress_label')} aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
      <div class="track">
        <div class="fill" style="width:{progress}%"></div>
        {#each slides as s, i (s.start)}
          {#if i > 0}
            <div class="marker" class:active={i <= currentSlideIndex} style="left:{duration ? (s.start / duration) * 100 : 0}%"></div>
          {/if}
        {/each}
      </div>
    </div>
    <div class="ctrl-row">
      <span class="time">{fmt(currentTime)} / {fmt(duration)}</span>
      <div class="ctrl-center">
        <button class="cb" onclick={() => goToSlide(currentSlideIndex - 1)} disabled={currentSlideIndex === 0} aria-label={t('pitchModal.prev_label')}><SkipBack size={18} /></button>
        <button class="cb play" onclick={togglePlay} aria-label={playing ? t('pitchModal.pause_label') : t('pitchModal.play_label')}>
          {#if playing}<Pause size={24} />{:else}<Play size={24} />{/if}
        </button>
        <button class="cb" onclick={() => goToSlide(currentSlideIndex + 1)} disabled={currentSlideIndex === slides.length - 1} aria-label={t('pitchModal.next_label')}><SkipForward size={18} /></button>
      </div>
      <div class="ctrl-right">
        <button class="cb" onclick={() => { muted = !muted; if (audioEl) audioEl.muted = muted; }} aria-label={t('pitchModal.mute_label')}>
          {#if muted}<VolumeX size={16} />{:else}<Volume2 size={16} />{/if}
        </button>
      </div>
    </div>
    <div class="dots">
      {#each slides as s, i (s.start)}
        <button class="dot" class:active={i === currentSlideIndex} onclick={() => goToSlide(i)} aria-label={`${t('pitchModal.slide_label')} ${i+1}`}></button>
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
    background: var(--overlay);
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
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.10); /* lint-ok: flat brand shadow (no rgba-black token in app.css) */
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 640px) {
    .modal-content {
      height: auto;
      min-height: 80vh;
      min-height: 80dvh;
      max-height: 95vh;
      max-height: 95dvh;
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
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* lint-ok: flat brand shadow (no rgba-black token in app.css) */
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
  .danger-text { color: var(--destructive); }
  .warn-text { color: var(--warning); }
  .success-text { color: var(--success); }

  /* ── Logo ── */
  .logo-hero {
    height: clamp(3rem, 7vw, 4.5rem);
    width: auto;
  }
  .logo-cta {
    height: clamp(2.25rem, 4.5vw, 3.5rem);
    width: auto;
  }

  /* ── Pill badges ── */
  .pill {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.4rem 1rem;
    border-radius: 9999px;
    background: color-mix(in srgb, var(--primary) 7%, transparent);
    color: var(--primary);
    font-size: 0.8rem;
    font-weight: 500;
    border: 1px solid color-mix(in srgb, var(--primary) 12%, transparent);
  }
  .warn-pill {
    background: color-mix(in srgb, var(--warning) 7%, transparent);
    color: var(--warning);
    border-color: color-mix(in srgb, var(--warning) 12%, transparent);
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
    background: color-mix(in srgb, var(--warning) 8%, transparent);
    color: var(--warning);
    border: 1px solid color-mix(in srgb, var(--warning) 15%, transparent);
  }

  .icon-accent {
    color: var(--primary);
  }

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
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* lint-ok: flat brand shadow (no rgba-black token in app.css) */
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
  .primary-bg { background: color-mix(in srgb, var(--primary) 7%, transparent); color: var(--primary); border: 1px solid color-mix(in srgb, var(--primary) 10%, transparent); }
  .danger-bg { background: color-mix(in srgb, var(--destructive) 7%, transparent); color: var(--destructive); border: 1px solid color-mix(in srgb, var(--destructive) 10%, transparent); }
  .success-bg { background: color-mix(in srgb, var(--success) 7%, transparent); color: var(--success); border: 1px solid color-mix(in srgb, var(--success) 10%, transparent); }

  .connector { width: 2.5rem; height: 2px; background: color-mix(in srgb, var(--primary) 15%, transparent); flex-shrink: 0; }

  /* ── Info card ── */
  .card-light {
    padding: 1rem 1.75rem;
    border-radius: 0.75rem;
    background: color-mix(in srgb, var(--primary) 4%, transparent);
    border: 1px solid color-mix(in srgb, var(--primary) 8%, transparent);
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
    background: color-mix(in srgb, var(--destructive) 5%, transparent);
    color: var(--destructive);
    border: 1px solid color-mix(in srgb, var(--destructive) 10%, transparent);
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
  .sev-dot.leve { background: var(--warning); }
  .sev-dot.grave { background: var(--warning); }
  .sev-dot.gravisima { background: var(--destructive); }
  .sev-name { font-weight: 600; font-size: 1rem; flex: 1; text-align: left; }
  .leve-text { color: var(--warning); }
  .grave-text { color: var(--warning); }
  .gravisima-text { color: var(--destructive); }
  .sev-range { font-size: 0.8rem; color: var(--muted-foreground); font-variant-numeric: tabular-nums; }

  /* ── Shield glow ── */
  .shield-glow {
    color: var(--primary);
  }

  /* ── Check list ── */
  .check-list { display: flex; flex-direction: column; gap: 0.5rem; }
  .check-item { display: flex; align-items: center; gap: 0.6rem; font-size: 0.95rem; color: var(--foreground); }
  .check-item :global(svg) { color: var(--success); flex-shrink: 0; }

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
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* lint-ok: flat brand shadow (no rgba-black token in app.css) */
  }
  .cta-btn:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08); } /* lint-ok: flat brand shadow (no rgba-black token in app.css) */

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
    background: color-mix(in srgb, var(--background) 88%, transparent);
    backdrop-filter: blur(12px);
    border-radius: 0.625rem;
    border: 1px solid var(--border);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05); /* lint-ok: flat brand shadow (no rgba-black token in app.css) */
  }

  /* ═══ CONTROLS ═══ */
  .controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0.5rem 1rem 0.75rem;
    background: linear-gradient(to top, color-mix(in srgb, var(--background) 96%, transparent) 0%, color-mix(in srgb, var(--background) 0%, transparent) 100%);
    z-index: 20;
  }

  .progress { width: 100%; padding: 0.4rem 0; cursor: pointer; }
  .track { height: 3px; background: var(--border); border-radius: 2px; position: relative; transition: height 0.15s ease; }
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
  .marker { position: absolute; top: -1px; width: 2px; height: calc(100% + 2px); background: var(--border); }
  .marker.active { background: color-mix(in srgb, var(--primary) 25%, transparent); }

  .ctrl-row { display: flex; align-items: center; justify-content: space-between; padding: 0.125rem 0; gap: 0.5rem; }
  .time { font-size: 0.75rem; color: var(--muted-foreground); font-variant-numeric: tabular-nums; min-width: 5rem; }
  .ctrl-center { display: flex; align-items: center; gap: 0.5rem; }
  .ctrl-right { display: flex; align-items: center; gap: 0.25rem; min-width: 5rem; justify-content: flex-end; }

  .cb {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.75rem;
    height: 2.75rem;
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
  .cb.play:hover { background: var(--primary-active); color: var(--primary-foreground); transform: scale(1.05); }

  .dots { display: flex; justify-content: center; gap: 0.3rem; padding-top: 0.375rem; }
  .dot {
    width: 8px; height: 8px; border-radius: 9999px; border: none;
    background: var(--border); cursor: pointer; padding: 10px; box-sizing: content-box;
    background-clip: content-box; transition: all 0.3s ease;
  }
  .dot.active { width: 1.25rem; background: var(--primary); background-clip: content-box; }
  .dot:hover:not(.active) { background: var(--muted-soft); }

  @media (max-width: 500px) {
    .slide-area { padding-bottom: 2rem; }
    .sc { padding: 0.75rem; gap: 0.75rem; }
    .subtitle-bar {
      position: relative;
      bottom: auto; left: auto; transform: none;
      width: 100%; padding: 0 0.5rem;
      margin-bottom: 5rem;
    }
    .subtitle { font-size: 0.75rem; padding: 0.5rem 0.75rem; line-height: 1.5; }
    .close-btn { top: 0.5rem; right: 0.5rem; width: 2rem; height: 2rem; }
    .callout { flex-wrap: wrap; justify-content: center; text-align: center; font-size: 0.65rem; }
    .heading { font-size: clamp(1rem, 5vw, 1.5rem); }
    .sub { font-size: 0.8rem; }
    .icon-box { width: 2.5rem; height: 2.5rem; }
    .icon-label { font-size: 0.6rem; }
  }
</style>