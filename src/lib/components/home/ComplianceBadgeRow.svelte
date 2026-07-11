<script lang="ts">
  import { t, type TranslationKey } from '$lib/i18n/index.svelte';
  import { FileCheck, Landmark, LockKeyhole, MapPin } from '@lucide/svelte';

  const badges: Array<{
    icon: typeof FileCheck;
    label: TranslationKey;
    status: TranslationKey;
  }> = [
    {
      icon: Landmark,
      label: 'home.compliance_badges.law',
      status: 'home.compliance_badges.status_ready',
    },
    {
      icon: LockKeyhole,
      label: 'home.compliance_badges.encryption',
      status: 'home.compliance_badges.status_active',
    },
    {
      icon: MapPin,
      label: 'home.compliance_badges.hosting',
      status: 'home.compliance_badges.status_local',
    },
    {
      icon: FileCheck,
      label: 'home.compliance_badges.arco',
      status: 'home.compliance_badges.status_supported',
    },
  ];
</script>

<ul
  class="grid gap-2 sm:grid-cols-2 xl:grid-cols-4"
  aria-label={t('home.compliance_badges.label')}
>
  {#each badges as badge (badge.label)}
    {@const BadgeIcon = badge.icon}
    <li class="flex min-h-14 items-center gap-3 rounded-lg border border-hairline bg-card px-3 py-2.5">
      <BadgeIcon class="size-4 shrink-0 text-primary" aria-hidden="true" />
      <div class="min-w-0 flex-1">
        <p class="text-xs font-semibold leading-tight text-foreground">{t(badge.label)}</p>
        <span class="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary-active">
          {t(badge.status)}
        </span>
      </div>
    </li>
  {/each}
</ul>
