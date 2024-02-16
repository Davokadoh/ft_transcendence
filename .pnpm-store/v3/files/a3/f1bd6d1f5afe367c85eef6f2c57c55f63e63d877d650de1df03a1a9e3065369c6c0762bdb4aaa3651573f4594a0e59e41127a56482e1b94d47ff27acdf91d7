"use client";

// src/use-menu.ts
import { useMenu as useAriaMenu } from "@react-aria/menu";
import { menu } from "@nextui-org/theme";
import { useTreeState } from "@react-stately/tree";
import { useDOMRef } from "@nextui-org/react-utils";
import { useMemo } from "react";
function useMenu(props) {
  const {
    as,
    ref,
    variant,
    color,
    disableAnimation,
    onAction,
    closeOnSelect,
    itemClasses,
    className,
    state: propState,
    menuProps: userMenuProps,
    onClose,
    ...otherProps
  } = props;
  const Component = as || "ul";
  const domRef = useDOMRef(ref);
  const innerState = useTreeState(otherProps);
  const state = propState || innerState;
  const { menuProps } = useAriaMenu(otherProps, state, domRef);
  const styles = useMemo(() => menu({ className }), [className]);
  const getMenuProps = (props2 = {}) => {
    return {
      ref: domRef,
      className: styles,
      ...userMenuProps,
      ...menuProps,
      ...props2
    };
  };
  return {
    Component,
    state,
    variant,
    color,
    disableAnimation,
    onAction,
    onClose,
    closeOnSelect,
    className,
    itemClasses,
    getMenuProps
  };
}

export {
  useMenu
};
