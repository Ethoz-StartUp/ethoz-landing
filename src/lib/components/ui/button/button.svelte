<script lang="ts" module>
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";
	import { type VariantProps, tv } from "tailwind-variants";

	export const buttonVariants = tv({
		base: "focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 aria-invalid:border-destructive rounded-xl border text-sm font-medium focus-visible:ring-2 focus-visible:ring-offset-2 aria-invalid:ring-2 [&_svg:not([class*='size-'])]:size-4 group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all duration-200 outline-none select-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
		variants: {
			variant: {
				default: "bg-gradient-to-b from-primary to-primary-hover text-primary-foreground hover:from-primary-hover hover:to-primary-active shadow-none",
				outline: "border-border bg-transparent text-foreground hover:bg-muted hover:text-foreground",
				secondary: "bg-muted text-foreground hover:bg-muted/80",
				ghost: "hover:bg-muted hover:text-foreground",
				destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-11 gap-2 px-5",
				xs: "h-7 gap-1 rounded-lg px-2 text-xs [&_svg:not([class*='size-'])]:size-3",
				sm: "h-9 gap-1.5 px-4 text-xs",
				lg: "h-12 gap-2 px-8 text-base",
				xl: "h-14 gap-2.5 px-10 text-base font-semibold",
				icon: "size-10",
				"icon-xs": "size-6 rounded-lg [&_svg:not([class*='size-'])]:size-3",
				"icon-sm": "size-8 rounded-xl",
				"icon-lg": "size-11",
				"icon-xl": "size-14 [&_svg:not([class*='size-'])]:size-5",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	});

	export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
	export type ButtonSize = VariantProps<typeof buttonVariants>["size"];

	export type ButtonProps = WithElementRef<HTMLButtonAttributes> &
		WithElementRef<HTMLAnchorAttributes> & {
			variant?: ButtonVariant;
			size?: ButtonSize;
		};
</script>

<script lang="ts">
	let {
		class: className,
		variant = "default",
		size = "default",
		ref = $bindable(null),
		href = undefined,
		type = "button",
		disabled,
		children,
		...restProps
	}: ButtonProps = $props();
</script>

{#if href}
	<a
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		href={disabled ? undefined : href}
		aria-disabled={disabled}
		role={disabled ? "link" : undefined}
		tabindex={disabled ? -1 : undefined}
		{...restProps}
	>
		{@render children?.()}
	</a>
{:else}
	<button
		bind:this={ref}
		data-slot="button"
		class={cn(buttonVariants({ variant, size }), className)}
		{type}
		{disabled}
		{...restProps}
	>
		{@render children?.()}
	</button>
{/if}
