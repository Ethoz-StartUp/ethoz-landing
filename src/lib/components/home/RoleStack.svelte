<script lang="ts">
  import { t, type TranslationKey } from '$lib/i18n/index.svelte';
  import { BookOpen, Building2, DoorOpen, HeartHandshake, UserRound } from '@lucide/svelte';

  const roles: Array<{ icon: typeof BookOpen; label: TranslationKey }> = [
    { icon: BookOpen, label: 'home.roles.docente.title' },
    { icon: UserRound, label: 'home.roles.directora.title' },
    { icon: DoorOpen, label: 'home.roles.portero.title' },
    { icon: HeartHandshake, label: 'home.roles.apoderado.title' },
    { icon: Building2, label: 'home.roles.sostenedor.title' },
  ];
</script>

<div class="flex items-center gap-4">
  <ul class="flex shrink-0 -space-x-3" aria-label={t('home.roles.stack_label')}>
    {#each roles as role (role.label)}
      {@const RoleIcon = role.icon}
      <li
        class="relative flex size-11 items-center justify-center rounded-full border-2 border-background bg-card text-primary shadow-card"
      >
        <RoleIcon class="size-4" aria-hidden="true" />
        <span class="sr-only">{t(role.label)}</span>
      </li>
    {/each}
  </ul>
  <p class="max-w-xs text-sm font-semibold leading-snug text-foreground">
    {t('home.roles.stack_text')}
  </p>
</div>
