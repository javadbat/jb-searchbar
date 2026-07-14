import { JBDictionary } from "jb-core/i18n";

export type JBSearchbarDictionary = {
  search: string;
  deleteFilter: string;
};

export const dictionary = new JBDictionary<JBSearchbarDictionary>({
  fa: { search: "جستجو", deleteFilter: "حذف فیلتر" },
  en: { search: "Search", deleteFilter: "Delete filter" },
});
