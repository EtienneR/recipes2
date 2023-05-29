declare module 'astro:content' {
	interface Render {
		'.md': Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	}
}

declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof AnyEntryMap> = AnyEntryMap[C][keyof AnyEntryMap[C]];

	// TODO: Remove this when having this fallback is no longer relevant. 2.3? 3.0? - erika, 2023-04-04
	/**
	 * @deprecated
	 * `astro:content` no longer provide `image()`.
	 *
	 * Please use it through `schema`, like such:
	 * ```ts
	 * import { defineCollection, z } from "astro:content";
	 *
	 * defineCollection({
	 *   schema: ({ image }) =>
	 *     z.object({
	 *       image: image(),
	 *     }),
	 * });
	 * ```
	 */
	export const image: never;

	// This needs to be in sync with ImageMetadata
	export type ImageFunction = () => import('astro/zod').ZodObject<{
		src: import('astro/zod').ZodString;
		width: import('astro/zod').ZodNumber;
		height: import('astro/zod').ZodNumber;
		format: import('astro/zod').ZodUnion<
			[
				import('astro/zod').ZodLiteral<'png'>,
				import('astro/zod').ZodLiteral<'jpg'>,
				import('astro/zod').ZodLiteral<'jpeg'>,
				import('astro/zod').ZodLiteral<'tiff'>,
				import('astro/zod').ZodLiteral<'webp'>,
				import('astro/zod').ZodLiteral<'gif'>,
				import('astro/zod').ZodLiteral<'svg'>
			]
		>;
	}>;

	type BaseSchemaWithoutEffects =
		| import('astro/zod').AnyZodObject
		| import('astro/zod').ZodUnion<import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodDiscriminatedUnion<string, import('astro/zod').AnyZodObject[]>
		| import('astro/zod').ZodIntersection<
				import('astro/zod').AnyZodObject,
				import('astro/zod').AnyZodObject
		  >;

	type BaseSchema =
		| BaseSchemaWithoutEffects
		| import('astro/zod').ZodEffects<BaseSchemaWithoutEffects>;

	export type SchemaContext = { image: ImageFunction };

	type DataCollectionConfig<S extends BaseSchema> = {
		type: 'data';
		schema?: S | ((context: SchemaContext) => S);
	};

	type ContentCollectionConfig<S extends BaseSchema> = {
		type?: 'content';
		schema?: S | ((context: SchemaContext) => S);
	};

	type CollectionConfig<S> = ContentCollectionConfig<S> | DataCollectionConfig<S>;

	export function defineCollection<S extends BaseSchema>(
		input: CollectionConfig<S>
	): CollectionConfig<S>;

	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
		ContentEntryMap[C]
	>['slug'];

	export function getEntryBySlug<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;

	export function getDataEntryById<C extends keyof DataEntryMap, E extends keyof DataEntryMap[C]>(
		collection: C,
		entryId: E
	): Promise<CollectionEntry<C>>;

	export function getCollection<C extends keyof AnyEntryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof AnyEntryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(entry: {
		collection: C;
		slug: E;
	}): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(entry: {
		collection: C;
		id: E;
	}): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof ContentEntryMap,
		E extends ValidContentEntrySlug<C> | (string & {})
	>(
		collection: C,
		slug: E
	): E extends ValidContentEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getEntry<
		C extends keyof DataEntryMap,
		E extends keyof DataEntryMap[C] | (string & {})
	>(
		collection: C,
		id: E
	): E extends keyof DataEntryMap[C]
		? Promise<DataEntryMap[C][E]>
		: Promise<CollectionEntry<C> | undefined>;

	/** Resolve an array of entry references from the same collection */
	export function getEntries<C extends keyof ContentEntryMap>(
		entries: {
			collection: C;
			slug: ValidContentEntrySlug<C>;
		}[]
	): Promise<CollectionEntry<C>[]>;
	export function getEntries<C extends keyof DataEntryMap>(
		entries: {
			collection: C;
			id: keyof DataEntryMap[C];
		}[]
	): Promise<CollectionEntry<C>[]>;

	export function reference<C extends keyof AnyEntryMap>(
		collection: C
	): import('astro/zod').ZodEffects<
		import('astro/zod').ZodString,
		C extends keyof ContentEntryMap
			? {
					collection: C;
					slug: ValidContentEntrySlug<C>;
			  }
			: {
					collection: C;
					id: keyof DataEntryMap[C];
			  }
	>;
	// Allow generic `string` to avoid excessive type errors in the config
	// if `dev` is not running to update as you edit.
	// Invalid collection names will be caught at build time.
	export function reference<C extends string>(
		collection: C
	): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

	type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
	type InferEntrySchema<C extends keyof AnyEntryMap> = import('astro/zod').infer<
		ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
	>;

	type ContentEntryMap = {
		"recipes": {
"batbouts.md": {
	id: "batbouts.md";
  slug: "batbouts";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"brioche-facile.md": {
	id: "brioche-facile.md";
  slug: "brioche-facile";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"brownie-seigle.md": {
	id: "brownie-seigle.md";
  slug: "brownie-seigle";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"cake-citron.md": {
	id: "cake-citron.md";
  slug: "cake-citron";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"cake-orange.md": {
	id: "cake-orange.md";
  slug: "cake-orange";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"cake-pommes.md": {
	id: "cake-pommes.md";
  slug: "cake-pommes";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"caramel-beurre-sale.md": {
	id: "caramel-beurre-sale.md";
  slug: "caramel-beurre-sale";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"carres-amandes.md": {
	id: "carres-amandes.md";
  slug: "carres-amandes";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"carres-citron.md": {
	id: "carres-citron.md";
  slug: "carres-citron";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"carres-flan.md": {
	id: "carres-flan.md";
  slug: "carres-flan";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"cookies-brownie.md": {
	id: "cookies-brownie.md";
  slug: "cookies-brownie";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"cookies-moelleux.md": {
	id: "cookies-moelleux.md";
  slug: "cookies-moelleux";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"cookies-natures-canelle.md": {
	id: "cookies-natures-canelle.md";
  slug: "cookies-natures-canelle";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"cremes-cacao.md": {
	id: "cremes-cacao.md";
  slug: "cremes-cacao";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"cremes-vanille.md": {
	id: "cremes-vanille.md";
  slug: "cremes-vanille";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"crepes.md": {
	id: "crepes.md";
  slug: "crepes";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"crinkles-chocolat.md": {
	id: "crinkles-chocolat.md";
  slug: "crinkles-chocolat";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"far-breton.md": {
	id: "far-breton.md";
  slug: "far-breton";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"financiers.md": {
	id: "financiers.md";
  slug: "financiers";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"flan-michalak.md": {
	id: "flan-michalak.md";
  slug: "flan-michalak";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"galette-franc-comtoise.md": {
	id: "galette-franc-comtoise.md";
  slug: "galette-franc-comtoise";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"galettes-ble-noir.md": {
	id: "galettes-ble-noir.md";
  slug: "galettes-ble-noir";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"gateau-basque.md": {
	id: "gateau-basque.md";
  slug: "gateau-basque";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"gateau-chocolat.md": {
	id: "gateau-chocolat.md";
  slug: "gateau-chocolat";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"gateau-cookie.md": {
	id: "gateau-cookie.md";
  slug: "gateau-cookie";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"gateau-yaourt-chocolat.md": {
	id: "gateau-yaourt-chocolat.md";
  slug: "gateau-yaourt-chocolat";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"lemon-curd.md": {
	id: "lemon-curd.md";
  slug: "lemon-curd";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"madeleine-geante.md": {
	id: "madeleine-geante.md";
  slug: "madeleine-geante";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"mini-cakes-orange.md": {
	id: "mini-cakes-orange.md";
  slug: "mini-cakes-orange";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"moelleux-chocolat.md": {
	id: "moelleux-chocolat.md";
  slug: "moelleux-chocolat";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"pains-epices.md": {
	id: "pains-epices.md";
  slug: "pains-epices";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"pancakes.md": {
	id: "pancakes.md";
  slug: "pancakes";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"pizza.md": {
	id: "pizza.md";
  slug: "pizza";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"quatre-quarts.md": {
	id: "quatre-quarts.md";
  slug: "quatre-quarts";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"quiche-lorraine.md": {
	id: "quiche-lorraine.md";
  slug: "quiche-lorraine";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"quiche-saumon-fume.md": {
	id: "quiche-saumon-fume.md";
  slug: "quiche-saumon-fume";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"riz-lait.md": {
	id: "riz-lait.md";
  slug: "riz-lait";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"sbriciolata-pommes.md": {
	id: "sbriciolata-pommes.md";
  slug: "sbriciolata-pommes";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"smoothie-banane.md": {
	id: "smoothie-banane.md";
  slug: "smoothie-banane";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"the-glace-citron.md": {
	id: "the-glace-citron.md";
  slug: "the-glace-citron";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
"twix-maison.md": {
	id: "twix-maison.md";
  slug: "twix-maison";
  body: string;
  collection: "recipes";
  data: InferEntrySchema<"recipes">
} & { render(): Render[".md"] };
};

	};

	type DataEntryMap = {
		
	};

	type AnyEntryMap = ContentEntryMap & DataEntryMap;

	type ContentConfig = typeof import("../src/content/config");
}
