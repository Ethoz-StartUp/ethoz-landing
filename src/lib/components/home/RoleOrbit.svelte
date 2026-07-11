<script lang="ts">
  import { BookOpen, Building2, DoorOpen, HeartHandshake, ShieldCheck } from '@lucide/svelte';
</script>

<div class="role-orbit relative mx-auto size-44" aria-hidden="true">
  <div class="absolute inset-5 rounded-full border border-dashed border-primary/30"></div>
  <div class="orbit-track absolute inset-0">
    <span class="orbit-role left-1/2 top-0 -translate-x-1/2">
      <BookOpen class="size-4" />
    </span>
    <span class="orbit-role right-0 top-1/2 -translate-y-1/2">
      <Building2 class="size-4" />
    </span>
    <span class="orbit-role bottom-0 left-1/2 -translate-x-1/2">
      <HeartHandshake class="size-4" />
    </span>
    <span class="orbit-role left-0 top-1/2 -translate-y-1/2">
      <DoorOpen class="size-4" />
    </span>
  </div>
  <div class="absolute inset-0 flex items-center justify-center">
    <span class="flex size-16 items-center justify-center rounded-full border border-primary/20 bg-card text-primary shadow-card-dark">
      <ShieldCheck class="size-7" />
    </span>
  </div>
</div>

<style>
  .orbit-role {
    position: absolute;
    display: flex;
    width: 2.5rem;
    height: 2.5rem;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border);
    border-radius: var(--radius-full);
    background: var(--card);
    color: var(--primary);
    box-shadow: 0 1px 2px color-mix(in srgb, var(--foreground) 8%, transparent);
    animation: role-highlight 8s var(--ease-standard) infinite;
  }

  .orbit-role:nth-child(2) { animation-delay: 2s; }
  .orbit-role:nth-child(3) { animation-delay: 4s; }
  .orbit-role:nth-child(4) { animation-delay: 6s; }

  .orbit-track {
    animation: orbit 18s linear infinite;
  }

  @keyframes orbit {
    to { transform: rotate(360deg); }
  }

  @keyframes role-highlight {
    0%, 18%, 100% {
      border-color: var(--border);
      background: var(--card);
      box-shadow: 0 1px 2px color-mix(in srgb, var(--foreground) 8%, transparent);
    }
    6%, 12% {
      border-color: var(--primary);
      background: var(color-mix(in srgb, var(--primary) 10%, transparent));
      box-shadow: 0 0 0 5px var(color-mix(in srgb, var(--primary) 10%, transparent));
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .orbit-track { animation: none; }
    .orbit-role { animation: none; }
  }
</style>
