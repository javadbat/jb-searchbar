import React, { useEffect, useRef } from 'react';
import 'jb-searchbar';
// eslint-disable-next-line no-duplicate-imports
import {JBSearchbarWebComponent, FilterColumn} from 'jb-searchbar';
import { useEvents } from './events-hook.js';

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

  useEvents(element,props);

  return (
    <jb-searchbar placeholder={props.placeholder} ref={element}></jb-searchbar>
  );
}
export type Props = {
  placeholder: string,
  searchOnChange: boolean,
  onSearch: (e:CustomEvent)=>void,
  columnList:FilterColumn[],
}
