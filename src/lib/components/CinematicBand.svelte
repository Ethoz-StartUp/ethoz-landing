<!--
  CinematicBand — full-bleed muted video band (brand B-roll).
  Plays only while in view (IntersectionObserver), pauses off-screen to spare
  CPU/data on low-end mobile. Respects prefers-reduced-motion (shows poster,
  never autoplays). Decorative: aria-hidden video, section carries the label.
-->
<script lang="ts">
  type Props = {
    /** /videos/*.mp4 */
    src: string;
    /** poster frame shown before play / under reduced-motion */
    poster: string;
    /** accessible description of the clip */
    label: string;
  };

  let { src, poster, label }: Props = $props();

  let videoEl = $state<HTMLVideoElement | null>(null);

  $effect(() => {
    if (typeof window === 'undefined' || !videoEl) return;
    const v = videoEl;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return; // poster only

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(v);
    return () => io.disconnect();
  });
</script>

<section class="relative w-full overflow-hidden bg-background" aria-label={label}>
  <video
    bind:this={videoEl}
    class="block aspect-video max-h-[82vh] w-full object-cover"
    {poster}
    muted
    loop
    playsinline
    preload="none"
    aria-hidden="true"
    tabindex="-1"
  >
    <source {src} type="video/mp4" />
  </video>
</section>
