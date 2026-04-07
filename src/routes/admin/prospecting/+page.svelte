<script lang="ts">
  import { goto } from '$app/navigation';
  import { adminStore } from '$lib/stores/admin.svelte';
  import { supabase } from '$lib/supabase';
  import {
    buildSostenedores,
    exportCSV,
    downloadCSV,
    DEP_LABELS,
    REGION_NAMES,
    type Sostenedor,
  } from '$lib/utils/prospecting';
  import { onMount } from 'svelte';
  import {
    Search,
    Download,
    Building,
    Users,
    Trophy,
    TrendingUp,
    ChevronDown,
    ChevronRight,
    MapPin,
    GraduationCap,
    Filter,
    Loader2,
    Upload,
    BarChart2,
    MessageSquare,
    Calendar,
    CheckCircle,
    Phone,
    Edit,
    X,
    Plus,
  } from '@lucide/svelte';

  // ── Auth guard ──
  $effect(() => {
    if (!adminStore.authenticated) goto('/admin');
  });

  // ── Tab state ──
  let activeTab = $state<'scoring' | 'tracker'>('scoring');

  // ══════════════════════════════════════════
  // SCORING TAB
  // ══════════════════════════════════════════

  let allSostenedores = $state<Sostenedor[]>([]);
  let loadingScoring = $state(true);

  $effect(() => {
    fetch('/data/schools.json')
      .then((r) => r.json())
      .then((data) => {
        allSostenedores = buildSostenedores(data.schools);
        loadingScoring = false;
      });
  });

  let search = $state('');
  let tierFilter = $state<0 | 1 | 2 | 3>(0);
  let depFilter = $state(0);
  let regionFilter = $state(0);
  let minSchools = $state(1);
  let sortBy = $state<'score' | 'enrollment' | 'schools' | 'name'>('score');
  let sortDir = $state<'asc' | 'desc'>('desc');
  let expandedRow = $state<string | null>(null);

  const filtered = $derived.by(() => {
    let list = allSostenedores;

    if (tierFilter) list = list.filter((s) => s.tier === tierFilter);
    if (depFilter) list = list.filter((s) => s.depTypes.includes(depFilter));
    if (regionFilter) list = list.filter((s) => s.regions.includes(regionFilter));
    if (minSchools > 1) list = list.filter((s) => s.schoolCount >= minSchools);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }

    const dir = sortDir === 'desc' ? -1 : 1;
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case 'score': return (a.score - b.score) * dir;
        case 'enrollment': return (a.totalEnrollment - b.totalEnrollment) * dir;
        case 'schools': return (a.schoolCount - b.schoolCount) * dir;
        case 'name': return a.name.localeCompare(b.name) * dir;
        default: return 0;
      }
    });

    return list;
  });

  const stats = $derived({
    total: allSostenedores.length,
    multiSchool: allSostenedores.filter((s) => s.schoolCount >= 2).length,
    tier1: allSostenedores.filter((s) => s.tier === 1).length,
    tier2: allSostenedores.filter((s) => s.tier === 2).length,
    tier3: allSostenedores.filter((s) => s.tier === 3).length,
    totalSchools: allSostenedores.reduce((sum, s) => sum + s.schoolCount, 0),
    totalStudents: allSostenedores.reduce((sum, s) => sum + s.totalEnrollment, 0),
  });

  function toggleSort(col: typeof sortBy) {
    if (sortBy === col) {
      sortDir = sortDir === 'desc' ? 'asc' : 'desc';
    } else {
      sortBy = col;
      sortDir = 'desc';
    }
  }

  function handleExport() {
    const csv = exportCSV(filtered);
    const date = new Date().toISOString().slice(0, 10);
    downloadCSV(csv, `ethoz-prospecting-${date}.csv`);
  }

  function toggleExpand(name: string) {
    expandedRow = expandedRow === name ? null : name;
  }

  function tierColor(tier: 1 | 2 | 3): string {
    switch (tier) {
      case 1: return 'bg-primary/10 text-primary';
      case 2: return 'bg-yellow-100 text-yellow-800';
      case 3: return 'bg-muted text-muted-foreground';
    }
  }

  function resetFilters() {
    search = '';
    tierFilter = 0;
    depFilter = 0;
    regionFilter = 0;
    minSchools = 1;
  }

  // ══════════════════════════════════════════
  // TRACKER TAB
  // ══════════════════════════════════════════

  interface Prospect {
    id: string;
    sostenedor_name: string;
    tier: 1 | 2 | 3;
    score: number;
    school_count: number;
    total_enrollment: number;
    dep_types?: number[];
    regions?: number[];
    communes?: string[];
    status: ProspectStatus;
    channel?: string;
    contact_name?: string;
    contact_email?: string;
    contact_phone?: string;
    contact_role?: string;
    linkedin_url?: string;
    website?: string;
    notes?: string;
    next_step?: string;
    next_step_date?: string;
    assigned_to?: string;
    created_at: string;
    updated_at?: string;
  }

  type ProspectStatus =
    | 'new'
    | 'contacted'
    | 'responded'
    | 'demo_scheduled'
    | 'demo_done'
    | 'negotiating'
    | 'won'
    | 'lost'
    | 'paused';

  const PROSPECT_STATUS_LABELS: Record<ProspectStatus, string> = {
    new: 'Nuevo',
    contacted: 'Contactado',
    responded: 'Respondió',
    demo_scheduled: 'Demo agendada',
    demo_done: 'Demo hecha',
    negotiating: 'Negociando',
    won: 'Ganado',
    lost: 'Perdido',
    paused: 'Pausado',
  };

  const PROSPECT_STATUS_CLASSES: Record<ProspectStatus, string> = {
    new: 'bg-blue-50 text-blue-700 border-blue-200',
    contacted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    responded: 'bg-orange-50 text-orange-700 border-orange-200',
    demo_scheduled: 'bg-green-50 text-green-700 border-green-200',
    demo_done: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    negotiating: 'bg-purple-50 text-purple-700 border-purple-200',
    won: 'bg-green-100 text-green-800 border-green-300',
    lost: 'bg-muted text-muted-foreground border-border',
    paused: 'bg-gray-50 text-gray-600 border-gray-200',
  };

  const ALL_PROSPECT_STATUSES: ProspectStatus[] = [
    'new', 'contacted', 'responded', 'demo_scheduled', 'demo_done',
    'negotiating', 'won', 'lost', 'paused',
  ];

  const CHANNELS = ['Email', 'LinkedIn', 'WhatsApp', 'Llamada', 'Referido', 'Otro'];

  let prospects = $state<Prospect[]>([]);
  let loadingTracker = $state(false);
  let importing = $state(false);
  let importDone = $state(false);

  let trackerSearch = $state('');
  let trackerStatusFilter = $state<ProspectStatus | ''>('');
  let trackerTierFilter = $state<0 | 1 | 2 | 3>(0);
  let trackerChannelFilter = $state('');

  let editingId = $state<string | null>(null);
  let editDraft = $state<Partial<Prospect>>({});
  let savingEdit = $state(false);

  let noteProspectId = $state<string | null>(null);
  let noteText = $state('');
  let savingNote = $state(false);

  let updatingStatusId = $state<string | null>(null);

  const trackerFiltered = $derived.by(() => {
    let list = prospects;
    if (trackerStatusFilter) list = list.filter((p) => p.status === trackerStatusFilter);
    if (trackerTierFilter) list = list.filter((p) => p.tier === trackerTierFilter);
    if (trackerChannelFilter) list = list.filter((p) => p.channel === trackerChannelFilter);
    if (trackerSearch.trim()) {
      const q = trackerSearch.trim().toLowerCase();
      list = list.filter((p) => p.sostenedor_name.toLowerCase().includes(q));
    }
    return list;
  });

  async function loadProspects() {
    if (!supabase) return;
    loadingTracker = true;
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) prospects = data as Prospect[];
    loadingTracker = false;
  }

  onMount(async () => {
    await adminStore.init();
    if (!adminStore.authenticated) {
      goto('/admin');
      return;
    }
  });

  $effect(() => {
    if (activeTab === 'tracker' && prospects.length === 0 && !loadingTracker) {
      loadProspects();
    }
  });

  async function importTier1() {
    if (!supabase || importing) return;
    const tier1 = allSostenedores.filter((s) => s.tier === 1);
    if (!tier1.length) return;

    importing = true;

    // Get existing sostenedor names to avoid duplicates
    const { data: existing } = await supabase
      .from('prospects')
      .select('sostenedor_name');
    const existingNames = new Set((existing ?? []).map((p: { sostenedor_name: string }) => p.sostenedor_name));

    const toInsert = tier1
      .filter((s) => !existingNames.has(s.name))
      .map((s) => ({
        sostenedor_name: s.name,
        tier: s.tier,
        score: s.score,
        school_count: s.schoolCount,
        total_enrollment: s.totalEnrollment,
        dep_types: s.depTypes,
        regions: s.regions,
        communes: s.communes,
        status: 'new' as ProspectStatus,
        created_at: new Date().toISOString(),
      }));

    if (toInsert.length > 0) {
      const { error } = await supabase.from('prospects').insert(toInsert);
      if (!error) {
        await loadProspects();
        importDone = true;
        setTimeout(() => { importDone = false; }, 3000);
      }
    } else {
      importDone = true;
      setTimeout(() => { importDone = false; }, 3000);
    }

    importing = false;
  }

  async function changeProspectStatus(prospect: Prospect, newStatus: ProspectStatus) {
    if (!supabase || prospect.status === newStatus) return;
    updatingStatusId = prospect.id;

    const oldStatus = prospect.status;
    const { error } = await supabase
      .from('prospects')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', prospect.id);

    if (!error) {
      prospects = prospects.map((p) => p.id === prospect.id ? { ...p, status: newStatus } : p);
      // Log activity
      await supabase.from('prospect_activities').insert({
        prospect_id: prospect.id,
        type: 'status_change',
        description: `Estado: ${PROSPECT_STATUS_LABELS[oldStatus]} → ${PROSPECT_STATUS_LABELS[newStatus]}`,
        old_status: oldStatus,
        new_status: newStatus,
        created_by: adminStore.user?.email,
        created_at: new Date().toISOString(),
      });
    }
    updatingStatusId = null;
  }

  function startEdit(prospect: Prospect) {
    editingId = prospect.id;
    editDraft = {
      contact_name: prospect.contact_name,
      contact_email: prospect.contact_email,
      contact_phone: prospect.contact_phone,
      contact_role: prospect.contact_role,
      channel: prospect.channel,
      notes: prospect.notes,
      next_step: prospect.next_step,
      next_step_date: prospect.next_step_date,
      linkedin_url: prospect.linkedin_url,
      website: prospect.website,
    };
  }

  function cancelEdit() {
    editingId = null;
    editDraft = {};
  }

  async function saveEdit(prospect: Prospect) {
    if (!supabase) return;
    savingEdit = true;
    const { error } = await supabase
      .from('prospects')
      .update({ ...editDraft, updated_at: new Date().toISOString() })
      .eq('id', prospect.id);
    if (!error) {
      prospects = prospects.map((p) => p.id === prospect.id ? { ...p, ...editDraft } : p);
      editingId = null;
      editDraft = {};
    }
    savingEdit = false;
  }

  async function addNote(prospect: Prospect) {
    if (!supabase || !noteText.trim()) return;
    savingNote = true;
    const { error } = await supabase.from('prospect_activities').insert({
      prospect_id: prospect.id,
      type: 'note',
      description: noteText.trim(),
      created_by: adminStore.user?.email,
      created_at: new Date().toISOString(),
    });
    if (!error) {
      noteProspectId = null;
      noteText = '';
    }
    savingNote = false;
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
  }
</script>

<svelte:head>
  <title>Prospecting — Ethoz Admin</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if !adminStore.authenticated}
  <!-- Auth guard redirect -->
{:else}
  <main class="min-h-dvh bg-secondary pt-14">
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

      <!-- Page header + tabs -->
      <div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-foreground">Prospecting</h1>
          <p class="mt-0.5 text-sm text-muted-foreground">Scoring de sostenedores y seguimiento de outreach</p>
        </div>
        <div class="flex items-center gap-1 rounded-lg border border-border bg-background p-1">
          <button
            type="button"
            onclick={() => { activeTab = 'scoring'; }}
            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors {activeTab === 'scoring' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}"
          >
            <BarChart2 class="size-3.5" />
            Scoring
          </button>
          <button
            type="button"
            onclick={() => { activeTab = 'tracker'; }}
            class="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors {activeTab === 'tracker' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}"
          >
            <TrendingUp class="size-3.5" />
            Outreach Tracker
          </button>
        </div>
      </div>

      <!-- ── SCORING TAB ── -->
      {#if activeTab === 'scoring'}
        {#if loadingScoring}
          <div class="flex items-center justify-center py-32">
            <Loader2 class="size-8 animate-spin text-primary" />
          </div>
        {:else}

          <!-- Header actions -->
          <div class="mb-6 flex items-center justify-end">
            <button
              type="button"
              onclick={handleExport}
              class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download class="size-4" />
              Exportar CSV ({filtered.length})
            </button>
          </div>

          <!-- Stats -->
          <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div class="rounded-xl border border-border bg-background p-4">
              <div class="flex items-center gap-2 text-muted-foreground">
                <Building class="size-4" />
                <span class="text-xs font-medium">Sostenedores</span>
              </div>
              <p class="mt-1 text-2xl font-bold tabular-nums text-foreground">{stats.total.toLocaleString()}</p>
            </div>
            <div class="rounded-xl border border-border bg-background p-4">
              <div class="flex items-center gap-2 text-muted-foreground">
                <Users class="size-4" />
                <span class="text-xs font-medium">Multi-colegio</span>
              </div>
              <p class="mt-1 text-2xl font-bold tabular-nums text-foreground">{stats.multiSchool.toLocaleString()}</p>
            </div>
            <div class="rounded-xl border border-border bg-background p-4">
              <div class="flex items-center gap-2 text-muted-foreground">
                <Trophy class="size-4" />
                <span class="text-xs font-medium">Tier 1</span>
              </div>
              <p class="mt-1 text-2xl font-bold tabular-nums text-primary">{stats.tier1.toLocaleString()}</p>
            </div>
            <div class="rounded-xl border border-border bg-background p-4">
              <div class="flex items-center gap-2 text-muted-foreground">
                <TrendingUp class="size-4" />
                <span class="text-xs font-medium">Alumnos total</span>
              </div>
              <p class="mt-1 text-2xl font-bold tabular-nums text-foreground">{(stats.totalStudents / 1000000).toFixed(1)}M</p>
            </div>
          </div>

          <!-- Filters -->
          <div class="mb-4 rounded-xl border border-border bg-background p-4">
            <div class="flex flex-wrap items-end gap-3">
              <div class="min-w-[200px] flex-1">
                <label for="search" class="mb-1 block text-[11px] font-medium text-muted-foreground">Buscar</label>
                <div class="relative">
                  <Search class="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="search"
                    type="text"
                    bind:value={search}
                    placeholder="Nombre del sostenedor..."
                    class="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>
              <div>
                <label for="tier" class="mb-1 block text-[11px] font-medium text-muted-foreground">Tier</label>
                <select id="tier" bind:value={tierFilter} class="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary">
                  <option value={0}>Todos</option>
                  <option value={1}>Tier 1</option>
                  <option value={2}>Tier 2</option>
                  <option value={3}>Tier 3</option>
                </select>
              </div>
              <div>
                <label for="dep" class="mb-1 block text-[11px] font-medium text-muted-foreground">Dependencia</label>
                <select id="dep" bind:value={depFilter} class="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary">
                  <option value={0}>Todas</option>
                  {#each Object.entries(DEP_LABELS) as [val, label]}
                    <option value={Number(val)}>{label}</option>
                  {/each}
                </select>
              </div>
              <div>
                <label for="region" class="mb-1 block text-[11px] font-medium text-muted-foreground">Región</label>
                <select id="region" bind:value={regionFilter} class="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary">
                  <option value={0}>Todas</option>
                  {#each Object.entries(REGION_NAMES) as [val, label]}
                    <option value={Number(val)}>{label}</option>
                  {/each}
                </select>
              </div>
              <div>
                <label for="minschools" class="mb-1 block text-[11px] font-medium text-muted-foreground">Min. colegios</label>
                <select id="minschools" bind:value={minSchools} class="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary">
                  <option value={1}>1+</option>
                  <option value={2}>2+</option>
                  <option value={3}>3+</option>
                  <option value={5}>5+</option>
                  <option value={10}>10+</option>
                  <option value={20}>20+</option>
                </select>
              </div>
              <button type="button" onclick={resetFilters} class="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground">
                <Filter class="size-3.5" />
                Limpiar
              </button>
            </div>
          </div>

          <!-- Table -->
          <div class="overflow-hidden rounded-xl border border-border bg-background">
            <div class="overflow-x-auto">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-border bg-muted/30">
                    <th class="w-8 px-4 py-3"></th>
                    <th class="px-3 py-3 text-left">
                      <button type="button" onclick={() => toggleSort('score')} class="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                        Tier {#if sortBy === 'score'}<ChevronDown class="size-3 {sortDir === 'asc' ? 'rotate-180' : ''}" />{/if}
                      </button>
                    </th>
                    <th class="px-3 py-3 text-left">
                      <button type="button" onclick={() => toggleSort('name')} class="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                        Sostenedor {#if sortBy === 'name'}<ChevronDown class="size-3 {sortDir === 'asc' ? 'rotate-180' : ''}" />{/if}
                      </button>
                    </th>
                    <th class="px-3 py-3 text-right">
                      <button type="button" onclick={() => toggleSort('schools')} class="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                        Colegios {#if sortBy === 'schools'}<ChevronDown class="size-3 {sortDir === 'asc' ? 'rotate-180' : ''}" />{/if}
                      </button>
                    </th>
                    <th class="px-3 py-3 text-right">
                      <button type="button" onclick={() => toggleSort('enrollment')} class="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground">
                        Alumnos {#if sortBy === 'enrollment'}<ChevronDown class="size-3 {sortDir === 'asc' ? 'rotate-180' : ''}" />{/if}
                      </button>
                    </th>
                    <th class="hidden px-3 py-3 text-left md:table-cell">
                      <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dependencia</span>
                    </th>
                    <th class="hidden px-3 py-3 text-left lg:table-cell">
                      <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Región</span>
                    </th>
                    <th class="px-3 py-3 text-right">
                      <span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Score</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {#each filtered.slice(0, 100) as sost}
                    <tr class="cursor-pointer border-b border-border transition-colors hover:bg-muted/20" onclick={() => toggleExpand(sost.name)}>
                      <td class="px-4 py-3 text-muted-foreground">
                        {#if expandedRow === sost.name}
                          <ChevronDown class="size-3.5" />
                        {:else}
                          <ChevronRight class="size-3.5" />
                        {/if}
                      </td>
                      <td class="px-3 py-3">
                        <span class="inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold {tierColor(sost.tier)}">T{sost.tier}</span>
                      </td>
                      <td class="max-w-[300px] truncate px-3 py-3 font-medium text-foreground">{sost.name}</td>
                      <td class="px-3 py-3 text-right tabular-nums text-foreground">{sost.schoolCount}</td>
                      <td class="px-3 py-3 text-right tabular-nums text-foreground">{sost.totalEnrollment.toLocaleString()}</td>
                      <td class="hidden px-3 py-3 md:table-cell">
                        <span class="text-xs text-muted-foreground">{sost.depTypes.map((d) => DEP_LABELS[d] || d).join(', ')}</span>
                      </td>
                      <td class="hidden px-3 py-3 lg:table-cell">
                        <span class="text-xs text-muted-foreground">{sost.regions.map((r) => REGION_NAMES[r] || r).join(', ')}</span>
                      </td>
                      <td class="px-3 py-3 text-right">
                        <span class="text-sm font-bold tabular-nums text-foreground">{sost.score}</span>
                      </td>
                    </tr>

                    {#if expandedRow === sost.name}
                      <tr>
                        <td colspan="8" class="bg-muted/10 px-6 py-3">
                          <div class="space-y-1.5">
                            <p class="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{sost.schoolCount} colegios</p>
                            {#each sost.schools.sort((a, b) => (b.m || 0) - (a.m || 0)) as school}
                              <div class="flex items-center justify-between rounded-lg bg-background px-3 py-2 text-xs">
                                <div class="flex items-center gap-2">
                                  <GraduationCap class="size-3.5 shrink-0 text-muted-foreground" />
                                  <span class="font-medium text-foreground">{school.n}</span>
                                </div>
                                <div class="flex items-center gap-4 text-muted-foreground">
                                  <span class="flex items-center gap-1"><MapPin class="size-3" />{school.c}</span>
                                  <span class="tabular-nums">{(school.m || 0).toLocaleString()} alumnos</span>
                                  <span class="rounded bg-muted px-1.5 py-0.5 text-[10px]">RBD {school.r}</span>
                                </div>
                              </div>
                            {/each}
                          </div>
                        </td>
                      </tr>
                    {/if}
                  {/each}
                </tbody>
              </table>
            </div>

            {#if filtered.length > 100}
              <div class="border-t border-border px-4 py-3 text-center text-xs text-muted-foreground">
                Mostrando 100 de {filtered.length.toLocaleString()} — usa los filtros o exporta CSV para ver todos
              </div>
            {/if}

            {#if filtered.length === 0}
              <div class="px-4 py-12 text-center">
                <Search class="mx-auto mb-2 size-8 text-muted-foreground/40" />
                <p class="text-sm font-medium text-foreground">Sin resultados</p>
                <p class="mt-1 text-xs text-muted-foreground">Ajusta los filtros para ver sostenedores</p>
              </div>
            {/if}
          </div>

          <div class="mt-4 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
            <span><span class="inline-block size-2 rounded-full bg-primary/60"></span> Tier 1 (score 60+): Whale accounts — multi-school, high enrollment, private</span>
            <span><span class="inline-block size-2 rounded-full bg-yellow-400/60"></span> Tier 2 (score 35-59): Mid-market — growth targets</span>
            <span><span class="inline-block size-2 rounded-full bg-muted-foreground/40"></span> Tier 3 (&lt;35): Long-tail — smaller/public</span>
          </div>
        {/if}
      {/if}

      <!-- ── TRACKER TAB ── -->
      {#if activeTab === 'tracker'}
        <!-- Toolbar -->
        <div class="mb-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onclick={importTier1}
            disabled={importing || loadingScoring}
            class="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            {#if importing}
              <Loader2 class="size-4 animate-spin" />
              Importando...
            {:else}
              <Upload class="size-4" />
              Importar Tier 1 al Tracker
            {/if}
          </button>
          {#if importDone}
            <span class="flex items-center gap-1.5 text-sm text-green-600">
              <CheckCircle class="size-4" />
              Importación completada
            </span>
          {/if}
          <div class="ml-auto text-sm text-muted-foreground">
            {trackerFiltered.length} de {prospects.length} prospects
          </div>
        </div>

        <!-- Filters -->
        <div class="mb-4 rounded-xl border border-border bg-background p-4">
          <div class="flex flex-wrap items-end gap-3">
            <div class="min-w-[180px] flex-1">
              <label for="tracker-search" class="mb-1 block text-[11px] font-medium text-muted-foreground">Buscar</label>
              <div class="relative">
                <Search class="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input id="tracker-search" type="text" bind:value={trackerSearch} placeholder="Sostenedor..." class="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <div>
              <label for="tracker-status" class="mb-1 block text-[11px] font-medium text-muted-foreground">Estado</label>
              <select id="tracker-status" bind:value={trackerStatusFilter} class="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary">
                <option value="">Todos</option>
                {#each ALL_PROSPECT_STATUSES as s}
                  <option value={s}>{PROSPECT_STATUS_LABELS[s]}</option>
                {/each}
              </select>
            </div>
            <div>
              <label for="tracker-tier" class="mb-1 block text-[11px] font-medium text-muted-foreground">Tier</label>
              <select id="tracker-tier" bind:value={trackerTierFilter} class="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary">
                <option value={0}>Todos</option>
                <option value={1}>Tier 1</option>
                <option value={2}>Tier 2</option>
                <option value={3}>Tier 3</option>
              </select>
            </div>
            <div>
              <label for="tracker-channel" class="mb-1 block text-[11px] font-medium text-muted-foreground">Canal</label>
              <select id="tracker-channel" bind:value={trackerChannelFilter} class="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary">
                <option value="">Todos</option>
                {#each CHANNELS as ch}
                  <option value={ch}>{ch}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>

        <!-- Prospect list -->
        {#if loadingTracker}
          <div class="flex items-center justify-center py-20">
            <Loader2 class="size-8 animate-spin text-primary" />
          </div>
        {:else if trackerFiltered.length === 0}
          <div class="rounded-xl border border-border bg-background px-4 py-12 text-center">
            <Building class="mx-auto mb-2 size-8 text-muted-foreground/40" />
            <p class="text-sm font-medium text-foreground">Sin prospects</p>
            <p class="mt-1 text-xs text-muted-foreground">Importa Tier 1 para empezar o ajusta los filtros</p>
          </div>
        {:else}
          <div class="space-y-2">
            {#each trackerFiltered as prospect}
              <div class="overflow-hidden rounded-xl border border-border bg-background">
                <!-- Prospect header row -->
                <div class="flex flex-wrap items-center gap-3 p-4">
                  <div class="flex min-w-0 flex-1 items-center gap-3">
                    <span class="inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold {tierColor(prospect.tier)}">T{prospect.tier}</span>
                    <span class="min-w-0 truncate font-medium text-foreground">{prospect.sostenedor_name}</span>
                    <span class="hidden shrink-0 text-xs text-muted-foreground sm:inline">{prospect.school_count} colegios · {prospect.total_enrollment.toLocaleString()} alumnos</span>
                  </div>

                  <!-- Status selector -->
                  <!-- svelte-ignore a11y_click_events_have_key_events -->
                  <!-- svelte-ignore a11y_no_static_element_interactions -->
                  <div onclick={(e) => e.stopPropagation()}>
                    <select
                      value={prospect.status}
                      disabled={updatingStatusId === prospect.id}
                      onchange={(e) => changeProspectStatus(prospect, (e.currentTarget as HTMLSelectElement).value as ProspectStatus)}
                      class="cursor-pointer rounded-full border px-2 py-0.5 text-[11px] font-semibold outline-none {PROSPECT_STATUS_CLASSES[prospect.status]} disabled:opacity-50"
                    >
                      {#each ALL_PROSPECT_STATUSES as s}
                        <option value={s}>{PROSPECT_STATUS_LABELS[s]}</option>
                      {/each}
                    </select>
                  </div>

                  <!-- Quick actions -->
                  <div class="flex items-center gap-1">
                    <button
                      type="button"
                      onclick={() => { noteProspectId = noteProspectId === prospect.id ? null : prospect.id; noteText = ''; }}
                      class="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                      title="Agregar nota"
                    >
                      <Plus class="size-3.5" />
                      Nota
                    </button>
                    <button
                      type="button"
                      onclick={() => { if (editingId === prospect.id) { cancelEdit(); } else { startEdit(prospect); } }}
                      class="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
                      title="Editar"
                    >
                      <Edit class="size-3.5" />
                      Editar
                    </button>
                  </div>
                </div>

                <!-- Contact + next step summary -->
                {#if prospect.contact_name || prospect.next_step || prospect.channel}
                  <div class="flex flex-wrap gap-4 border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
                    {#if prospect.contact_name}
                      <span class="flex items-center gap-1">
                        <Users class="size-3.5" />
                        {prospect.contact_name}
                        {#if prospect.contact_role} · {prospect.contact_role}{/if}
                      </span>
                    {/if}
                    {#if prospect.channel}
                      <span class="flex items-center gap-1">
                        <MessageSquare class="size-3.5" />
                        {prospect.channel}
                      </span>
                    {/if}
                    {#if prospect.next_step}
                      <span class="flex items-center gap-1 text-foreground">
                        <CheckCircle class="size-3.5 text-primary" />
                        {prospect.next_step}
                        {#if prospect.next_step_date}
                          <span class="text-muted-foreground">— {formatDate(prospect.next_step_date)}</span>
                        {/if}
                      </span>
                    {/if}
                    {#if prospect.notes}
                      <span class="flex items-center gap-1 italic">
                        <MessageSquare class="size-3.5" />
                        {prospect.notes.slice(0, 80)}{prospect.notes.length > 80 ? '...' : ''}
                      </span>
                    {/if}
                  </div>
                {/if}

                <!-- Note input -->
                {#if noteProspectId === prospect.id}
                  <div class="border-t border-border px-4 py-3">
                    <div class="flex gap-2">
                      <input
                        type="text"
                        bind:value={noteText}
                        placeholder="Escribe una nota..."
                        class="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                      <button
                        type="button"
                        onclick={() => addNote(prospect)}
                        disabled={savingNote || !noteText.trim()}
                        class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                      >
                        {#if savingNote}<Loader2 class="size-3.5 animate-spin" />{:else}<Plus class="size-3.5" />{/if}
                        Guardar
                      </button>
                      <button
                        type="button"
                        onclick={() => { noteProspectId = null; noteText = ''; }}
                        class="inline-flex items-center rounded-lg border border-border px-2 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
                      >
                        <X class="size-3.5" />
                      </button>
                    </div>
                  </div>
                {/if}

                <!-- Edit form -->
                {#if editingId === prospect.id}
                  <div class="border-t border-border p-4">
                    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <label for="edit-contact-name-{prospect.id}" class="mb-1 block text-[11px] font-medium text-muted-foreground">Contacto</label>
                        <input id="edit-contact-name-{prospect.id}" type="text" bind:value={editDraft.contact_name} placeholder="Nombre" class="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label for="edit-contact-role-{prospect.id}" class="mb-1 block text-[11px] font-medium text-muted-foreground">Rol</label>
                        <input id="edit-contact-role-{prospect.id}" type="text" bind:value={editDraft.contact_role} placeholder="Director, Administrador..." class="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label for="edit-contact-email-{prospect.id}" class="mb-1 block text-[11px] font-medium text-muted-foreground">Email</label>
                        <input id="edit-contact-email-{prospect.id}" type="email" bind:value={editDraft.contact_email} placeholder="correo@colegio.cl" class="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label for="edit-contact-phone-{prospect.id}" class="mb-1 block text-[11px] font-medium text-muted-foreground">Teléfono</label>
                        <input id="edit-contact-phone-{prospect.id}" type="tel" bind:value={editDraft.contact_phone} placeholder="+56 9..." class="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label for="edit-channel-{prospect.id}" class="mb-1 block text-[11px] font-medium text-muted-foreground">Canal</label>
                        <select id="edit-channel-{prospect.id}" bind:value={editDraft.channel} class="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary">
                          <option value="">Sin canal</option>
                          {#each CHANNELS as ch}
                            <option value={ch}>{ch}</option>
                          {/each}
                        </select>
                      </div>
                      <div>
                        <label for="edit-linkedin-{prospect.id}" class="mb-1 block text-[11px] font-medium text-muted-foreground">LinkedIn</label>
                        <input id="edit-linkedin-{prospect.id}" type="url" bind:value={editDraft.linkedin_url} placeholder="https://linkedin.com/..." class="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary" />
                      </div>
                      <div class="sm:col-span-2">
                        <label for="edit-next-step-{prospect.id}" class="mb-1 block text-[11px] font-medium text-muted-foreground">Próximo paso</label>
                        <input id="edit-next-step-{prospect.id}" type="text" bind:value={editDraft.next_step} placeholder="Enviar propuesta, llamar..." class="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary" />
                      </div>
                      <div>
                        <label for="edit-next-step-date-{prospect.id}" class="mb-1 block text-[11px] font-medium text-muted-foreground">Fecha próximo paso</label>
                        <input id="edit-next-step-date-{prospect.id}" type="date" bind:value={editDraft.next_step_date} class="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary" />
                      </div>
                      <div class="sm:col-span-2 lg:col-span-3">
                        <label for="edit-notes-{prospect.id}" class="mb-1 block text-[11px] font-medium text-muted-foreground">Notas</label>
                        <textarea id="edit-notes-{prospect.id}" bind:value={editDraft.notes} rows={2} placeholder="Contexto, observaciones..." class="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none focus:border-primary resize-none"></textarea>
                      </div>
                    </div>
                    <div class="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onclick={() => saveEdit(prospect)}
                        disabled={savingEdit}
                        class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
                      >
                        {#if savingEdit}<Loader2 class="size-3.5 animate-spin" />{/if}
                        Guardar cambios
                      </button>
                      <button
                        type="button"
                        onclick={cancelEdit}
                        class="inline-flex items-center rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                {/if}

              </div>
            {/each}
          </div>
        {/if}
      {/if}

    </div>
  </main>
{/if}
