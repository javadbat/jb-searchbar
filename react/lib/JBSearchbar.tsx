'use client';
import React, { useImperativeHandle, useRef, type RefObject } from 'react';
import 'jb-searchbar';
// eslint-disable-next-line no-duplicate-imports
import type { JBSearchbarWebComponent, SizeVariants } from 'jb-searchbar';
import { useEvents, type EventProps } from './events-hook.js';
import './module-declaration.js'
import type { JBElementStandardProps } from 'jb-core/react';

export {JBExtraFilter, Props as ExtraFilterProps} from './JBExtraFilter.js'

export function JBSearchbar(props: Props) {
  const element = useRef<JBSearchbarWebComponent>(null);
  const {  onInit, ref, children, onLoad, onSearch, ...otherProps} = props;

  useImperativeHandle(
    ref,
    () => (element ? element.current : undefined),
    [element],
  );
  //placeholder,searchOnChange is in ...otherProps for shorter code
  useEvents(element, { onInit, onLoad, onSearch });

  return (
    <jb-searchbar ref={element} {...otherProps}>{children}</jb-searchbar>
  );
}
type SearchbarProps = EventProps & {
  ref?: RefObject<JBSearchbarWebComponent>,
  searchOnChange?: boolean,
  isLoading?:boolean,
  size?:SizeVariants
}
export type Props = SearchbarProps & JBElementStandardProps<JBSearchbarWebComponent, keyof SearchbarProps>;
