<script lang="ts">
  import { page } from '$app/state';
  import { Button } from '$lib/components/ui/button';
  import NavBar from '$lib/components/NavBar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import { ArrowRight } from '@lucide/svelte';
</script>

<svelte:head>
  <title>Página no encontrada — Ethoz</title>
  <meta name="robots" content="noindex, nofollow" />
</svelte:head>

<main class="flex min-h-dvh flex-col bg-background">
  <NavBar />

  <section class="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
    <p class="text-8xl font-bold tracking-tighter text-primary">{page.status}</p>
    <h1 class="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
      Página no encontrada
    </h1>
    <p class="mt-3 max-w-md text-base text-muted-foreground">
      La página que buscas no existe o fue movida. Vuelve al inicio para seguir explorando.
    </p>
    <div class="mt-8">
      <Button size="lg" href="/">
        Volver al inicio
        <ArrowRight class="size-4" />
      </Button>
    </div>
  </section>

  <Footer />
</main>
