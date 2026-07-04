import {JBDictionary} from 'jb-core/i18n';
export type JBExtraFilterDictionary = {
  selectPlaceholder:string
  submitTitle:string
}

export const dictionary = new JBDictionary<JBExtraFilterDictionary>({
  "fa":{
    selectPlaceholder:"انتخاب فیلتر",
    submitTitle:"ثبت فیلتر"
  },
  "en":{
    selectPlaceholder:"Select Filter",
    submitTitle:"Submit Filter"
  }

});