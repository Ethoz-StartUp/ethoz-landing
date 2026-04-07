<script lang="ts">
  import { goto } from '$app/navigation';
  import { adminStore } from '$lib/stores/admin.svelte';
  import { supabase } from '$lib/supabase';
  import { onMount } from 'svelte';
  import { toast } from 'svelte-sonner';
  import * as Table from '$lib/components/ui/table';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Sheet from '$lib/components/ui/sheet';
  import * as Select from '$lib/components/ui/select';
  import { Input } from '$lib/components/ui/input';
  import { Label } from '$lib/components/ui/label';
  import { Badge } from '$lib/components/ui/badge';
  import { Button } from '$lib/components/ui/button';
  import { Skeleton } from '$lib/components/ui/skeleton';
  import {
    Search,
    RefreshCw,
    Mail,
    Phone,
    User,
    Building,
    FileText,
    Calendar,
    MoreHorizontal,
    Eye,
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
  let search = $state('');
  let statusFilter = $state<LeadStatus | 'all'>('all');
  let updatingId = $state<string | null>(null);
  let detailLead = $state<Lead | null>(null);
  let sheetOpen = $state(false);

  // ── Load data ──
  async function loadLeads() {
    if (!supabase) return;
    refreshing = true;

    const { data, error } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Error al cargar leads', { description: error.message });
    } else if (data) {
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

    if (statusFilter !== 'all') {
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

  const STATUS_VARIANTS: Record<LeadStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    new: 'default',
    contacted: 'secondary',
    demo_scheduled: 'default',
    demo_done: 'secondary',
    closed: 'outline',
  };

  const ALL_STATUSES: LeadStatus[] = ['new', 'contacted', 'demo_scheduled', 'demo_done', 'closed'];

  // ── Handlers ──
  function openDetail(lead: Lead) {
    detailLead = lead;
    sheetOpen = true;
  }

  async function changeStatus(lead: Lead, newStatus: LeadStatus) {
    if (!supabase || lead.status === newStatus) return;
    updatingId = lead.id;

    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', lead.id);

    if (error) {
      toast.error('Error al actualizar', { description: error.message });
    } else {
      leads = leads.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l));
      toast.success('Estado actualizado', {
        description: `${lead.contact_name} → ${STATUS_LABELS[newStatus]}`,
      });
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

  function formatDateTime(iso: string): string {
    return new Date(iso).toLocaleString('es-CL', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
    <div class="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-foreground">Leads</h1>
          <p class="mt-0.5 text-sm text-muted-foreground">
            {filtered.length.toLocaleString()} de {leads.length.toLocaleString()} contactos
          </p>
        </div>
        <Button variant="outline" onclick={loadLeads} disabled={refreshing}>
          <RefreshCw class="size-4 {refreshing ? 'animate-spin' : ''}" />
          Actualizar
        </Button>
      </div>

      <!-- Status summary cards -->
      <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {#each ALL_STATUSES as s}
          {@const count = leads.filter((l) => l.status === s).length}
          <button
            type="button"
            onclick={() => (statusFilter = statusFilter === s ? 'all' : s)}
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
          <div class="min-w-[240px] flex-1">
            <Label for="search" class="mb-1.5 block text-xs">Buscar</Label>
            <div class="relative">
              <Search class="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                type="text"
                bind:value={search}
                placeholder="Nombre, email o colegio..."
                class="pl-9"
              />
            </div>
          </div>
          <div class="min-w-[180px]">
            <Label for="status-filter" class="mb-1.5 block text-xs">Estado</Label>
            <Select.Root type="single" bind:value={statusFilter as any}>
              <Select.Trigger id="status-filter" class="w-full">
                {statusFilter === 'all' ? 'Todos' : STATUS_LABELS[statusFilter as LeadStatus]}
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="all">Todos</Select.Item>
                {#each ALL_STATUSES as s}
                  <Select.Item value={s}>{STATUS_LABELS[s]}</Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="overflow-hidden rounded-xl border border-border bg-background">
        {#if loading}
          <div class="p-4 space-y-3">
            {#each Array(5) as _}
              <div class="flex items-center gap-3">
                <Skeleton class="h-8 w-8 rounded-full" />
                <Skeleton class="h-4 flex-1" />
                <Skeleton class="h-4 w-24" />
                <Skeleton class="h-4 w-32" />
                <Skeleton class="h-6 w-20 rounded-full" />
              </div>
            {/each}
          </div>
        {:else}
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.Head>Nombre</Table.Head>
                <Table.Head>Email</Table.Head>
                <Table.Head class="hidden md:table-cell">Colegio</Table.Head>
                <Table.Head>Estado</Table.Head>
                <Table.Head class="hidden sm:table-cell">Fuente</Table.Head>
                <Table.Head class="hidden lg:table-cell text-right">Fecha</Table.Head>
                <Table.Head class="w-10"></Table.Head>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {#each filtered as lead (lead.id)}
                <Table.Row class="cursor-pointer" onclick={() => openDetail(lead)}>
                  <Table.Cell class="font-medium">{lead.contact_name}</Table.Cell>
                  <Table.Cell class="text-muted-foreground">{lead.contact_email}</Table.Cell>
                  <Table.Cell class="hidden max-w-[200px] truncate md:table-cell text-muted-foreground">
                    {lead.school_name || '—'}
                  </Table.Cell>
                  <Table.Cell>
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger onclick={(e: Event) => e.stopPropagation()}>
                        <Badge variant={STATUS_VARIANTS[lead.status]} class="cursor-pointer">
                          {STATUS_LABELS[lead.status]}
                        </Badge>
                      </DropdownMenu.Trigger>
                      <DropdownMenu.Content>
                        <DropdownMenu.Label>Cambiar estado</DropdownMenu.Label>
                        <DropdownMenu.Separator />
                        {#each ALL_STATUSES as s}
                          <DropdownMenu.Item
                            disabled={updatingId === lead.id || s === lead.status}
                            onclick={() => changeStatus(lead, s)}
                          >
                            {STATUS_LABELS[s]}
                          </DropdownMenu.Item>
                        {/each}
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                  </Table.Cell>
                  <Table.Cell class="hidden sm:table-cell text-xs text-muted-foreground">
                    {lead.contact_source ?? '—'}
                  </Table.Cell>
                  <Table.Cell class="hidden lg:table-cell text-right text-xs text-muted-foreground">
                    {formatDate(lead.created_at)}
                  </Table.Cell>
                  <Table.Cell>
                    <Button variant="ghost" size="sm" onclick={(e: Event) => { e.stopPropagation(); openDetail(lead); }}>
                      <Eye class="size-4" />
                    </Button>
                  </Table.Cell>
                </Table.Row>
              {/each}
            </Table.Body>
          </Table.Root>

          {#if filtered.length === 0}
            <div class="px-4 py-12 text-center">
              <Search class="mx-auto mb-2 size-8 text-muted-foreground/40" />
              <p class="text-sm font-medium text-foreground">Sin resultados</p>
              <p class="mt-1 text-xs text-muted-foreground">Ajusta los filtros para ver leads</p>
            </div>
          {/if}
        {/if}
      </div>
    </div>

    <!-- Detail Sheet -->
    <Sheet.Root bind:open={sheetOpen}>
      <Sheet.Content class="w-full sm:max-w-md overflow-y-auto">
        {#if detailLead}
          <Sheet.Header>
            <Sheet.Title>{detailLead.contact_name}</Sheet.Title>
            <Sheet.Description>
              Creado {formatDateTime(detailLead.created_at)}
            </Sheet.Description>
          </Sheet.Header>

          <div class="mt-6 space-y-6 px-6 pb-6">
            <!-- Status -->
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado</p>
              <Badge variant={STATUS_VARIANTS[detailLead.status]}>
                {STATUS_LABELS[detailLead.status]}
              </Badge>
            </div>

            <!-- Contact -->
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contacto</p>
              <div class="space-y-2 text-sm">
                <div class="flex items-center gap-2">
                  <User class="size-4 text-muted-foreground" />
                  <span>{detailLead.contact_name}</span>
                  {#if detailLead.contact_role}
                    <span class="text-muted-foreground">· {detailLead.contact_role}</span>
                  {/if}
                </div>
                <div class="flex items-center gap-2">
                  <Mail class="size-4 text-muted-foreground" />
                  <a href="mailto:{detailLead.contact_email}" class="text-primary hover:underline">
                    {detailLead.contact_email}
                  </a>
                </div>
                {#if detailLead.contact_phone}
                  <div class="flex items-center gap-2">
                    <Phone class="size-4 text-muted-foreground" />
                    <a href="tel:{detailLead.contact_phone}" class="hover:underline">
                      {detailLead.contact_phone}
                    </a>
                  </div>
                {/if}
              </div>
            </div>

            <!-- School -->
            {#if detailLead.school_name}
              <div>
                <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Colegio</p>
                <div class="space-y-1 text-sm">
                  <div class="flex items-center gap-2">
                    <Building class="size-4 text-muted-foreground" />
                    <span class="font-medium">{detailLead.school_name}</span>
                  </div>
                  {#if detailLead.school_commune}
                    <p class="ml-6 text-muted-foreground">{detailLead.school_commune}</p>
                  {/if}
                  {#if detailLead.school_rbd}
                    <p class="ml-6 text-muted-foreground">RBD {detailLead.school_rbd}</p>
                  {/if}
                </div>
              </div>
            {/if}

            <!-- Notes -->
            {#if detailLead.notes}
              <div>
                <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notas</p>
                <div class="flex items-start gap-2 text-sm">
                  <FileText class="mt-0.5 size-4 text-muted-foreground" />
                  <p class="whitespace-pre-wrap">{detailLead.notes}</p>
                </div>
              </div>
            {/if}

            <!-- Source -->
            {#if detailLead.contact_source}
              <div>
                <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fuente</p>
                <p class="text-sm">{detailLead.contact_source}</p>
              </div>
            {/if}

            <!-- Date -->
            <div>
              <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fechas</p>
              <div class="space-y-1 text-sm text-muted-foreground">
                <div class="flex items-center gap-2">
                  <Calendar class="size-4" />
                  <span>Creado: {formatDateTime(detailLead.created_at)}</span>
                </div>
                {#if detailLead.updated_at}
                  <div class="flex items-center gap-2">
                    <Calendar class="size-4" />
                    <span>Actualizado: {formatDateTime(detailLead.updated_at)}</span>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        {/if}
      </Sheet.Content>
    </Sheet.Root>
  </main>
{/if}
