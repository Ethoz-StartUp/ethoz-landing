<script lang="ts">
  interface Props {
    /** Unique id, used for the section's aria-labelledby and the eyebrow's id. */
    id: string;
    eyebrow: string;
    statement: string;
    body: string;
  }

  let { id, eyebrow, statement, body }: Props = $props();
</script>

<section class="py-12 sm:py-14" aria-labelledby={id}>
  <div class="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
    <span class="mx-auto block h-px w-12 bg-foreground" aria-hidden="true"></span>
    <p {id} class="mt-6 text-mockup-sm font-mono font-semibold uppercase tracking-[0.1em] text-muted-foreground">{eyebrow}</p>
    <blockquote class="mt-5 font-heading text-2xl leading-[1.35] text-foreground sm:text-[2rem] lg:text-[2.25rem] lg:leading-[1.3]">
      {statement}
    </blockquote>
    <p class="mt-6 text-sm text-muted-foreground">
      {body}
    </p>
  </div>
</section>
