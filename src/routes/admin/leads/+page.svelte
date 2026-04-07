<script lang="ts">
  import { goto } from '$app/navigation';
  import { adminStore } from '$lib/stores/admin.svelte';
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import {
    Search,
    ChevronDown,
    ChevronRight,
    RefreshCw,
    Loader2,
    Mail,
    Phone,
    User,
    Building,
    FileText,
    Calendar,
  } from '@lucide/svelte';

  // ── Types ──
  interface Lead {
    id: string;
    contact_name: string;
    contact_email: string;
    contact_phone?: string;
    contact_role?: string;
    contact_source?: string;
    school_name: string;
    school_rbd?: number;
    school_commune?: string;
    status: 'new' | 'contacted' | 'demo_scheduled' | 'demo_done' | 'closed';
    notes?: string;
    metadata?: Record<string, unknown>;
    visitor_id?: string;
    created_at: string;
    updated_at?: string;
  }

  type LeadStatus = Lead['status'];

  // ── Auth guard ──
  $effect(() => {
    if (!adminStore.authenticated) goto('/admin');
  });

  // ── State ──
  let leads = $state<Lead[]>([]);
  let loading = $state(true);
  let refreshing = $state(false);
  let expandedRow = $state<string | null>(null);
  let search = $state('');
  let statusFilter = $state<LeadStatus | ''>('');
  let updatingId = $state<string | null>(null);

  // ── Load data ──
  async function loadLeads() {
    if (!supabase) return;
    refreshing = true;

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      leads = data as Lead[];
    }
    loading = false;
    refreshing = false;
  }

  onMount(async () => {
    await adminStore.init();
    if (!adminStore.authenticated) {
      goto('/admin');
      return;
    }
    await loadLeads();
  });

  // ── Derived ──
  const filtered = $derived.by(() => {
    let list = leads;

    if (statusFilter) {
      list = list.filter((l) => l.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (l) =>
          l.contact_name.toLowerCase().includes(q) ||
          l.contact_email.toLowerCase().includes(q) ||
          l.school_name.toLowerCase().includes(q)
      );
    }

    return list;
  });

  // ── Status config ──
  const STATUS_LABELS: Record<LeadStatus, string> = {
    new: 'Nuevo',
    contacted: 'Contactado',
    demo_scheduled: 'Demo agendada',
    demo_done: 'Demo hecha',
    closed: 'Cerrado',
  };

  const STATUS_CLASSES: Record<LeadStatus, string> = {
    new: 'bg-blue-50 text-blue-700 border-blue-200',
    contacted: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    demo_scheduled: 'bg-green-50 text-green-700 border-green-200',
    demo_done: 'bg-purple-50 text-purple-700 border-purple-200',
    closed: 'bg-muted text-muted-foreground border-border',
  };

  const ALL_STATUSES: LeadStatus[] = ['new', 'contacted', 'demo_scheduled', 'demo_done', 'closed'];

  // ── Handlers ──
  function toggleExpand(id: string) {
    expandedRow = expandedRow === id ? null : id;
  }

  async function changeStatus(lead: Lead, newStatus: LeadStatus) {
    if (!supabase || lead.status === newStatus) return;
    updatingId = lead.id;

    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', lead.id);

    if (!error) {
      leads = leads.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l));
    }
    updatingId = null;
  }

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }
</script>

<svelte:head>
  <title>Leads — Ethoz Admin</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#if !adminStore.authenticated}
  <!-- Auth guard redirect -->
{:else}
  <main class="min-h-dvh bg-secondary pt-14">
    {#if loading}
      <div class="flex items-center justify-center py-32">
        <Loader2 class="size-8 animate-spin text-primary" />
      </div>
    {:else}
      <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        <!-- Header -->
        <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 class="text-2xl font-bold tracking-tight text-foreground">Leads</h1>
            <p class="mt-0.5 text-sm text-muted-foreground">
              {filtered.length.toLocaleString()} de {leads.length.toLocaleString()} contactos
            </p>
          </div>
          <button
            type="button"
            onclick={loadLeads}
            disabled={refreshing}
            class="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted/50 disabled:opacity-50"
          >
            <RefreshCw class="size-4 {refreshing ? 'animate-spin' : ''}" />
            Actualizar
          </button>
        </div>

        <!-- Status summary -->
        <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {#each ALL_STATUSES as s}
            {@const count = leads.filter((l) => l.status === s).length}
            <button
              type="button"
              onclick={() => { statusFilter = statusFilter === s ? '' : s; }}
              class="rounded-xl border p-4 text-left transition-colors hover:bg-background/80 {statusFilter === s ? 'border-primary bg-primary/5' : 'border-border bg-background'}"
            >
              <p class="text-xs font-medium text-muted-foreground">{STATUS_LABELS[s]}</p>
              <p class="mt-1 text-2xl font-bold tabular-nums text-foreground">{count}</p>
            </button>
          {/each}
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
                  placeholder="Nombre, email o colegio..."
                  class="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>
            <div>
              <label for="status-filter" class="mb-1 block text-[11px] font-medium text-muted-foreground">Estado</label>
              <select
                id="status-filter"
                bind:value={statusFilter}
                class="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
              >
                <option value="">Todos</option>
                {#each ALL_STATUSES as s}
                  <option value={s}>{STATUS_LABELS[s]}</option>
                {/each}
              </select>
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="overflow-hidden rounded-xl border border-border bg-background">
          <div class="overflow-x-auto">
            <table class="w-full text-sm">
              <thead>
                <tr class="border-b border-border bg-muted/30">
                  <th class="w-8 px-4 py-3"></th>
                  <th class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Nombre</th>
                  <th class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
                  <th class="hidden px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground md:table-cell">Colegio</th>
                  <th class="px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</th>
                  <th class="hidden px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Fuente</th>
                  <th class="hidden px-3 py-3 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground lg:table-cell">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {#each filtered as lead}
                  <tr
                    class="cursor-pointer border-b border-border transition-colors hover:bg-muted/20"
                    onclick={() => toggleExpand(lead.id)}
                  >
                    <td class="px-4 py-3 text-muted-foreground">
                      {#if expandedRow === lead.id}
                        <ChevronDown class="size-3.5" />
                      {:else}
                        <ChevronRight class="size-3.5" />
                      {/if}
                    </td>
                    <td class="px-3 py-3 font-medium text-foreground">{lead.contact_name}</td>
                    <td class="px-3 py-3 text-muted-foreground">{lead.contact_email}</td>
                    <td class="hidden max-w-[200px] truncate px-3 py-3 text-muted-foreground md:table-cell">{lead.school_name}</td>
                    <td class="px-3 py-3">
                      <!-- Clicking status cell opens dropdown without triggering row expand -->
                      <!-- svelte-ignore a11y_click_events_have_key_events -->
                      <!-- svelte-ignore a11y_no_static_element_interactions -->
                      <div onclick={(e) => e.stopPropagation()} class="relative">
                        <select
                          value={lead.status}
                          disabled={updatingId === lead.id}
                          onchange={(e) => changeStatus(lead, (e.currentTarget as HTMLSelectElement).value as LeadStatus)}
                          class="cursor-pointer rounded-full border px-2 py-0.5 text-[11px] font-semibold outline-none {STATUS_CLASSES[lead.status]} disabled:opacity-50"
                        >
                          {#each ALL_STATUSES as s}
                            <option value={s}>{STATUS_LABELS[s]}</option>
                          {/each}
                        </select>
                      </div>
                    </td>
                    <td class="hidden px-3 py-3 text-xs text-muted-foreground sm:table-cell">
                      {lead.contact_source ?? '—'}
                    </td>
                    <td class="hidden px-3 py-3 text-right text-xs text-muted-foreground lg:table-cell">
                      {formatDate(lead.created_at)}
                    </td>
                  </tr>

                  <!-- Expanded detail row -->
                  {#if expandedRow === lead.id}
                    <tr>
                      <td colspan="7" class="bg-muted/10 px-6 py-4">
                        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          <!-- Contact info -->
                          <div class="space-y-2">
                            <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Contacto</p>
                            <div class="space-y-1.5">
                              <div class="flex items-center gap-2 text-xs text-foreground">
                                <User class="size-3.5 shrink-0 text-muted-foreground" />
                                {lead.contact_name}
                                {#if lead.contact_role}
                                  <span class="text-muted-foreground">· {lead.contact_role}</span>
                                {/if}
                              </div>
                              <div class="flex items-center gap-2 text-xs text-foreground">
                                <Mail class="size-3.5 shrink-0 text-muted-foreground" />
                                <a href="mailto:{lead.contact_email}" class="hover:text-primary" onclick={(e) => e.stopPropagation()}>{lead.contact_email}</a>
                              </div>
                              {#if lead.contact_phone}
                                <div class="flex items-center gap-2 text-xs text-foreground">
                                  <Phone class="size-3.5 shrink-0 text-muted-foreground" />
                                  {lead.contact_phone}
                                </div>
                              {/if}
                            </div>
                          </div>

                          <!-- School info -->
                          <div class="space-y-2">
                            <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Colegio</p>
                            <div class="space-y-1.5">
                              <div class="flex items-center gap-2 text-xs text-foreground">
                                <Building class="size-3.5 shrink-0 text-muted-foreground" />
                                {lead.school_name}
                              </div>
                              {#if lead.school_commune}
                                <p class="text-xs text-muted-foreground">{lead.school_commune}</p>
                              {/if}
                              {#if lead.school_rbd}
                                <p class="text-xs text-muted-foreground">RBD {lead.school_rbd}</p>
                              {/if}
                            </div>
                          </div>

                          <!-- Notes & dates -->
                          <div class="space-y-2">
                            <p class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Detalles</p>
                            <div class="space-y-1.5">
                              <div class="flex items-center gap-2 text-xs text-muted-foreground">
                                <Calendar class="size-3.5 shrink-0" />
                                Creado {formatDate(lead.created_at)}
                              </div>
                              {#if lead.notes}
                                <div class="flex items-start gap-2 text-xs text-foreground">
                                  <FileText class="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                                  <span>{lead.notes}</span>
                                </div>
                              {/if}
                              {#if lead.contact_source}
                                <p class="text-xs text-muted-foreground">Fuente: {lead.contact_source}</p>
                              {/if}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  {/if}
                {/each}
              </tbody>
            </table>
          </div>

          {#if filtered.length === 0}
            <div class="px-4 py-12 text-center">
              <Search class="mx-auto mb-2 size-8 text-muted-foreground/40" />
              <p class="text-sm font-medium text-foreground">Sin resultados</p>
              <p class="mt-1 text-xs text-muted-foreground">Ajusta los filtros para ver leads</p>
            </div>
          {/if}
        </div>

      </div>
    {/if}
  </main>
{/if}
