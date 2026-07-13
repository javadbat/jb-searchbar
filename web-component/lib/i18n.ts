import { JBDictionary } from "jb-core/i18n";

export type JBSearchbarDictionary = {
  search: string;
};

export const dictionary = new JBDictionary<JBSearchbarDictionary>({
  fa: { search: "جستجو" },
  en: { search: "Search" },
});
