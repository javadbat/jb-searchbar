'use client';
import React, { useEffect, useImperativeHandle, useRef } from 'react';
import 'jb-searchbar';
// eslint-disable-next-line no-duplicate-imports
import type { ExtractDisplayValueCallback, JBExtraFilterWebComponent, SizeVariants } from 'jb-searchbar';
import { useExtraFilterEvents as useEvents, type ExtraFilterEventProps as EventProps } from './events-hook.js';
import './module-declaration.js'
import type { JBElementStandardProps } from 'jb-core/react';

export function JBExtraFilter(props: Props) {
  const element = useRef<JBExtraFilterWebComponent>(null);
  const { onInit, ref, children, onLoad, onIntentSubmit, onExtractDisplayValue, ...otherProps } = props;

  useImperativeHandle(
    ref,
    () => (element?.current ?? undefined),
    [element],
  );
  useEffect(() => {
    if (element.current && onExtractDisplayValue) {
      element.current.extractDisplayValue = onExtractDisplayValue;
    }
  }, [onExtractDisplayValue, element.current]);

  useEvents(element, { onInit, onLoad, onIntentSubmit });

  return (
    <jb-extra-filter slot="extra" ref={element} {...otherProps}>{children}</jb-extra-filter>
  );
}
type ExtraFilterProps = EventProps & {
  ref?: React.ForwardedRef<JBExtraFilterWebComponent | null | undefined>,
  placeholder?: string,
  onExtractDisplayValue?: ExtractDisplayValueCallback
  size?: SizeVariants,
}
export type Props = ExtraFilterProps & JBElementStandardProps<JBExtraFilterWebComponent, keyof ExtraFilterProps>;
