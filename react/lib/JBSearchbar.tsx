import React, { useCallback, useEffect, useRef } from 'react';
import {useBindEvent} from '../../../../common/hooks/use-event.js';
import 'jb-searchbar';
// eslint-disable-next-line no-duplicate-imports
import {JBSearchbarWebComponent, FilterColumn} from 'jb-searchbar';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'jb-searchbar': JBSearchbarType;
    }
    interface JBSearchbarType extends React.DetailedHTMLProps<React.HTMLAttributes<JBSearchbarWebComponent>, JBSearchbarWebComponent> {
      "class"?: string,
      "type"?: string,
      "placeholder"?:string,
    }
  }
}
export function JBSearchbar(props:Props) {
  const element = useRef<JBSearchbarWebComponent>();
  useEffect(() => {
    element.current.columnList = props.columnList;
  }, [element.current, props.columnList]);

  useEffect(() => {
    if(element.current){
      element.current.searchOnChange = Boolean(props.searchOnChange);
    }
  },[element.current, props.searchOnChange]);

  const onSearch = useCallback((e:CustomEvent)=>{
    if(element.current && typeof props.onSearch === 'function'){
      props.onSearch(e);
    }
  },[element.current, props.onSearch]);

  useBindEvent(element, 'search', onSearch);

  return (
    <jb-searchbar placeholder={props.placeholder} ref={element}></jb-searchbar>
  );
}
type Props = {
  placeholder: string,
  searchOnChange: boolean,
  onSearch: (e:CustomEvent)=>void,
  columnList:FilterColumn[],
}
