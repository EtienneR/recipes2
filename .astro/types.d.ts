declare module 'astro:content' {
	export { z } from 'astro/zod';
	export type CollectionEntry<C extends keyof typeof entryMap> =
		(typeof entryMap)[C][keyof (typeof entryMap)[C]] & Render;

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

	type BaseCollectionConfig<S extends BaseSchema> = {
		schema?: S;
		slug?: (entry: {
			id: CollectionEntry<keyof typeof entryMap>['id'];
			defaultSlug: string;
			collection: string;
			body: string;
			data: import('astro/zod').infer<S>;
		}) => string | Promise<string>;
	};
	export function defineCollection<S extends BaseSchema>(
		input: BaseCollectionConfig<S>
	): BaseCollectionConfig<S>;

	type EntryMapKeys = keyof typeof entryMap;
	type AllValuesOf<T> = T extends any ? T[keyof T] : never;
	type ValidEntrySlug<C extends EntryMapKeys> = AllValuesOf<(typeof entryMap)[C]>['slug'];

	export function getEntryBySlug<
		C extends keyof typeof entryMap,
		E extends ValidEntrySlug<C> | (string & {})
	>(
		collection: C,
		// Note that this has to accept a regular string too, for SSR
		entrySlug: E
	): E extends ValidEntrySlug<C>
		? Promise<CollectionEntry<C>>
		: Promise<CollectionEntry<C> | undefined>;
	export function getCollection<C extends keyof typeof entryMap, E extends CollectionEntry<C>>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => entry is E
	): Promise<E[]>;
	export function getCollection<C extends keyof typeof entryMap>(
		collection: C,
		filter?: (entry: CollectionEntry<C>) => unknown
	): Promise<CollectionEntry<C>[]>;

	type InferEntrySchema<C extends keyof typeof entryMap> = import('astro/zod').infer<
		Required<ContentConfig['collections'][C]>['schema']
	>;

	type Render = {
		render(): Promise<{
			Content: import('astro').MarkdownInstance<{}>['Content'];
			headings: import('astro').MarkdownHeading[];
			remarkPluginFrontmatter: Record<string, any>;
		}>;
	};

	const entryMap: {
		"recipes": {
"batbouts.md": {
  id: "batbouts.md",
  slug: "batbouts",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"brioche-facile.md": {
  id: "brioche-facile.md",
  slug: "brioche-facile",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"brownie-seigle.md": {
  id: "brownie-seigle.md",
  slug: "brownie-seigle",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"cake-bananes.md": {
  id: "cake-bananes.md",
  slug: "cake-bananes",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"cake-citron.md": {
  id: "cake-citron.md",
  slug: "cake-citron",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"cake-orange.md": {
  id: "cake-orange.md",
  slug: "cake-orange",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"caramel-beurre-sale.md": {
  id: "caramel-beurre-sale.md",
  slug: "caramel-beurre-sale",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"carres-amandes.md": {
  id: "carres-amandes.md",
  slug: "carres-amandes",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"carres-citron.md": {
  id: "carres-citron.md",
  slug: "carres-citron",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"carres-flan.md": {
  id: "carres-flan.md",
  slug: "carres-flan",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"cookies-brownie.md": {
  id: "cookies-brownie.md",
  slug: "cookies-brownie",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"cookies-moelleux.md": {
  id: "cookies-moelleux.md",
  slug: "cookies-moelleux",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"cookies-natures-canelle.md": {
  id: "cookies-natures-canelle.md",
  slug: "cookies-natures-canelle",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"cremes-cacao.md": {
  id: "cremes-cacao.md",
  slug: "cremes-cacao",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"cremes-vanille.md": {
  id: "cremes-vanille.md",
  slug: "cremes-vanille",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"crepes.md": {
  id: "crepes.md",
  slug: "crepes",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"crinkles-chocolat.md": {
  id: "crinkles-chocolat.md",
  slug: "crinkles-chocolat",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"far-breton.md": {
  id: "far-breton.md",
  slug: "far-breton",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"financiers.md": {
  id: "financiers.md",
  slug: "financiers",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"flan-michalak.md": {
  id: "flan-michalak.md",
  slug: "flan-michalak",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"galette-franc-comtoise.md": {
  id: "galette-franc-comtoise.md",
  slug: "galette-franc-comtoise",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"galettes-ble-noir.md": {
  id: "galettes-ble-noir.md",
  slug: "galettes-ble-noir",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"gateau-basque.md": {
  id: "gateau-basque.md",
  slug: "gateau-basque",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"gateau-chocolat.md": {
  id: "gateau-chocolat.md",
  slug: "gateau-chocolat",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"gateau-cookie.md": {
  id: "gateau-cookie.md",
  slug: "gateau-cookie",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"gateau-yaourt-chocolat.md": {
  id: "gateau-yaourt-chocolat.md",
  slug: "gateau-yaourt-chocolat",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"lemon-curd.md": {
  id: "lemon-curd.md",
  slug: "lemon-curd",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"madeleine-geante.md": {
  id: "madeleine-geante.md",
  slug: "madeleine-geante",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"mini-cakes-orange.md": {
  id: "mini-cakes-orange.md",
  slug: "mini-cakes-orange",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"moelleux-chocolat.md": {
  id: "moelleux-chocolat.md",
  slug: "moelleux-chocolat",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"pains-epices.md": {
  id: "pains-epices.md",
  slug: "pains-epices",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"pancakes.md": {
  id: "pancakes.md",
  slug: "pancakes",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"pizza.md": {
  id: "pizza.md",
  slug: "pizza",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"quatre-quarts.md": {
  id: "quatre-quarts.md",
  slug: "quatre-quarts",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"quiche-lorraine.md": {
  id: "quiche-lorraine.md",
  slug: "quiche-lorraine",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"quiche-saumon-fume.md": {
  id: "quiche-saumon-fume.md",
  slug: "quiche-saumon-fume",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"sbriciolata-pommes.md": {
  id: "sbriciolata-pommes.md",
  slug: "sbriciolata-pommes",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"smoothie-banane.md": {
  id: "smoothie-banane.md",
  slug: "smoothie-banane",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"the-glace-citron.md": {
  id: "the-glace-citron.md",
  slug: "the-glace-citron",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
"twix-maison.md": {
  id: "twix-maison.md",
  slug: "twix-maison",
  body: string,
  collection: "recipes",
  data: InferEntrySchema<"recipes">
},
},

	};

	type ContentConfig = typeof import("../src/content/config");
}
