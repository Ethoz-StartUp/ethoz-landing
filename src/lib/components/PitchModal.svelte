<script lang="ts">
  import { fly, fade, scale } from 'svelte/transition';
  import { quintOut, backOut } from 'svelte/easing';
  import { trackEvent } from '$lib/utils/analytics';
  import { pitchSlides as slides, getDaysUntilEnforcement } from '$lib/data/pitch-slides';
  import { BRAND } from '$lib/brand';
  import { t } from '$lib/i18n/index.svelte';
  import pitchModalCss from './PitchModal.css?inline';
  import {
    Shield, Lock, FileSpreadsheet, Smartphone, BookOpen, AlertTriangle,
    Bell, UserCheck, Eye, Zap, MapPin, Calendar, Play, Pause, Volume2,
    VolumeX, Clock, Check, Building, Fingerprint, ArrowRight, SkipBack,
    SkipForward, ClipboardList, Server, Gavel, X
  } from '@lucide/svelte';

  let { onclose }: { onclose: () => void } = $props();

  const styleId = 'ethoz-pitch-modal-styles';
  if (typeof document !== 'undefined' && !document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = pitchModalCss;
    document.head.appendChild(style);
  }

  function handleClose() {
    const pct = duration ? Math.floor((currentTime / duration) * 100) : 0;
    trackEvent('pitch_closed', { percent_watched: pct, last_slide: currentSlide?.id ?? 'unknown' });
    onclose();
  }

  // ── Dialog a11y: focus trap + restore ──
  let modalEl = $state<HTMLDivElement | null>(null);
  let closeBtn = $state<HTMLButtonElement | null>(null);

  // Initial focus to the close button; restore focus to the trigger on close.
  $effect(() => {
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeBtn?.focus();
    return () => trigger?.focus();
  });

  function trapTab(e: KeyboardEvent) {
    if (!modalEl) return;
    const focusables = Array.from(
      modalEl.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], [tabindex]:not([tabindex="-1"])')
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement as HTMLElement | null;
    const inside = !!active && modalEl.contains(active);
    if (e.shiftKey) {
      if (!inside || active === first) { e.preventDefault(); last.focus(); }
    } else if (!inside || active === last) {
      e.preventDefault();
      first.focus();
    }
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
    if (e.key === 'Tab') { trapTab(e); return; }
    if (e.code === 'Escape') { handleClose(); return; }
    // Don't hijack keys aimed at interactive elements (buttons, links, the
    // progress slider): Space must activate them natively, arrows must seek.
    const target = e.target as HTMLElement | null;
    if (target?.closest('button, a, input, select, textarea, [role="slider"]')) return;
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

<div class="ethoz-pitch-modal">
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

<!-- Keyboard handling lives on svelte:window only (a second handler here double-fired Space). -->
<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
<div class="modal-backdrop" transition:fade={{ duration: 250 }} onclick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
  <div class="modal-content" bind:this={modalEl} role="dialog" aria-modal="true" aria-label={t('pitchModal.intro_sub')}>
  <!-- Close button -->
  <button class="close-btn" bind:this={closeBtn} onclick={handleClose} aria-label={t('pitchModal.close_label')}>
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
              <p class="sub">= <strong class="danger-text">más de $1.300 millones CLP</strong></p>
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
</div>
