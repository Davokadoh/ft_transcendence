"use client";

// src/use-pagination-item.ts
import { useMemo } from "react";
import { clsx, dataAttr } from "@nextui-org/shared-utils";
import { chain, mergeProps } from "@react-aria/utils";
import { useDOMRef } from "@nextui-org/react-utils";
import { useHover, usePress } from "@react-aria/interactions";
import { useFocusRing } from "@react-aria/focus";
function usePaginationItem(props) {
  const {
    as,
    ref,
    value,
    children,
    isActive,
    isDisabled,
    onPress,
    onClick,
    getAriaLabel,
    className,
    ...otherProps
  } = props;
  const Component = as || "li";
  const domRef = useDOMRef(ref);
  const ariaLabel = useMemo(
    () => isActive ? `${getAriaLabel == null ? void 0 : getAriaLabel(value)} active` : getAriaLabel == null ? void 0 : getAriaLabel(value),
    [value, isActive]
  );
  const { isPressed, pressProps } = usePress({
    isDisabled,
    onPress
  });
  const { focusProps, isFocused, isFocusVisible } = useFocusRing({});
  const { isHovered, hoverProps } = useHover({ isDisabled });
  const getItemProps = (props2 = {}) => {
    return {
      ref: domRef,
      role: "button",
      tabIndex: isDisabled ? -1 : 0,
      "aria-label": ariaLabel,
      "aria-current": dataAttr(isActive),
      "aria-disabled": dataAttr(isDisabled),
      "data-disabled": dataAttr(isDisabled),
      "data-active": dataAttr(isActive),
      "data-focus": dataAttr(isFocused),
      "data-hover": dataAttr(isHovered),
      "data-pressed": dataAttr(isPressed),
      "data-focus-visible": dataAttr(isFocusVisible),
      ...mergeProps(props2, pressProps, focusProps, hoverProps, otherProps),
      className: clsx(className, props2.className),
      onClick: chain(pressProps.onClick, onClick)
    };
  };
  return {
    Component,
    children,
    ariaLabel,
    isFocused,
    isFocusVisible,
    getItemProps
  };
}

export {
  usePaginationItem
};
