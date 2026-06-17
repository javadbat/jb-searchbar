'use client';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import 'jb-searchbar';
// eslint-disable-next-line no-duplicate-imports
import type { JBSearchbarWebComponent, SizeVariants } from 'jb-searchbar';
import { useEvents, type EventProps } from './events-hook.js';
import './module-declaration.js'
import type { JBElementStandardProps } from 'jb-core/react';

export { JBExtraFilter, type Props as ExtraFilterProps } from './JBExtraFilter.js'

export function JBSearchbar(props: Props) {
  const element = useRef<JBSearchbarWebComponent>(null);
  const { isLoading, onInit, ref, children, onLoad, onSearch, searchOnChange, ...otherProps } = props;

  useImperativeHandle(
    ref,
    () => (element?.current ?? undefined),
    [element],
  );
  useEffect(() => {
    if (element.current && typeof searchOnChange === "boolean") {
      element.current.searchOnChange = searchOnChange;
    }
  }, [searchOnChange, element.current]);

  useEffect(() => {
    if (element.current && typeof isLoading === "boolean") {
      element.current.isLoading = isLoading;
    }
  }, [isLoading, element.current]);

  useEvents(element, { onInit, onLoad, onSearch });

  return (
    <jb-searchbar ref={element} {...otherProps}>{children}</jb-searchbar>
  );
}
type SearchbarProps = EventProps & {
  ref?: React.ForwardedRef<JBSearchbarWebComponent | undefined>,
  searchOnChange?: boolean,
  isLoading?: boolean,
  size?: SizeVariants
}
export type Props = SearchbarProps & JBElementStandardProps<JBSearchbarWebComponent, keyof SearchbarProps>;
