"use client";

// src/use-listbox.ts
import { useListBox as useAriaListbox } from "@react-aria/listbox";
import { listbox } from "@nextui-org/theme";
import { useListState } from "@react-stately/list";
import { filterDOMProps, useDOMRef } from "@nextui-org/react-utils";
import { useMemo } from "react";
function useListbox(props) {
  const {
    ref,
    as,
    state: propState,
    variant,
    color,
    onAction,
    onSelectionChange,
    disableAnimation,
    itemClasses,
    className,
    ...otherProps
  } = props;
  const Component = as || "ul";
  const shouldFilterDOMProps = typeof Component === "string";
  const domRef = useDOMRef(ref);
  const innerState = useListState({ ...props, onSelectionChange });
  const state = propState || innerState;
  const { listBoxProps } = useAriaListbox({ ...props, onAction }, state, domRef);
  const styles = useMemo(() => listbox({ className }), [className]);
  const getBaseProps = (props2 = {}) => {
    return {
      ref: domRef,
      className: styles,
      ...listBoxProps,
      ...filterDOMProps(otherProps, {
        enabled: shouldFilterDOMProps
      }),
      ...props2
    };
  };
  return {
    Component,
    state,
    variant,
    color,
    disableAnimation,
    className,
    itemClasses,
    getBaseProps
  };
}

export {
  useListbox
};
