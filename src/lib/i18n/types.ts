import type en from './locales/en';

export type Locale = 'en' | 'zh-CN';

type StringLeaves<T> = {
	[K in keyof T]: T[K] extends string ? string : StringLeaves<T[K]>;
};

/** Every locale must provide the same nested string keys as English. */
export type Dictionary = StringLeaves<typeof en>;

type LeafPaths<T> = {
	[K in keyof T & string]: T[K] extends string ? K : `${K}.${LeafPaths<T[K]>}`;
}[keyof T & string];

export type TranslationKey = LeafPaths<typeof en>;
export type TranslationValues = Record<string, string | number>;
