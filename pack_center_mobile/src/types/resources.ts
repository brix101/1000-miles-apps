import enTranslation from "../i18n/locales/en/translation.json";

const resources = {
  translation: enTranslation,
} as const;

// type NestedTranslationKeys<T> = T extends object
//   ? {
//       [K in keyof T]:
//         | `${Extract<K, string>}`
//         | `${Extract<K, string>}.${NestedTranslationKeys<T[K]>}`;
//     }[keyof T]
//   : '';

type NestedTranslationKeys<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends string
        ? `${Extract<K, string>}`
        : T[K] extends Record<string, any>
        ? `${Extract<K, string>}.${NestedTranslationKeys<T[K]>}`
        : never;
    }[keyof T]
  : "";

export type TranslationKeys =
  | TemplateStringsArray
  | NestedTranslationKeys<typeof resources.translation>;

export default resources;
