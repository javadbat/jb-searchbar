'use client';
import React, { useImperativeHandle, useRef, type RefObject } from 'react';
import 'jb-searchbar';
// eslint-disable-next-line no-duplicate-imports
import type {ExtractDisplayValueCallback, JBExtraFilterWebComponent, SizeVariants } from 'jb-searchbar';
import { useExtraFilterEvents as useEvents, type ExtraFilterEventProps as EventProps } from './events-hook.js';
import './module-declaration.js'
import type { JBElementStandardProps } from 'jb-core/react';

export function JBExtraFilter(props: Props) {
  const element = useRef<JBExtraFilterWebComponent>(null);
  const {  onInit, ref, children, onLoad, onIntentSubmit, onExtractDisplayValue, ...otherProps} = props;

  useImperativeHandle(
    ref,
    () => (element ? element.current : undefined),
    [element],
  );
  //placeholder, size, searchOnChange is in ...otherProps for shorter code
  useEvents(element, { onInit, onLoad, onIntentSubmit });

  return (
    <jb-extra-filter extractDisplayValue={props.onExtractDisplayValue} slot="extra" ref={element} {...otherProps}>{children}</jb-extra-filter>
  );
}
type ExtraFilterProps = EventProps & {
  ref?: RefObject<JBExtraFilterWebComponent>,
  placeholder?: string,
  onExtractDisplayValue?:ExtractDisplayValueCallback
  size?:SizeVariants,
}
export type Props = ExtraFilterProps & JBElementStandardProps<JBExtraFilterWebComponent, keyof ExtraFilterProps>;
