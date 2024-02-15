"use client";
import {
  useReactAriaPopover
} from "./chunk-JGMU3RCI.mjs";

// src/use-popover.ts
import { useEffect } from "react";
import { useDOMRef } from "@nextui-org/react-utils";
import { useOverlayTriggerState } from "@react-stately/overlays";
import { useFocusRing } from "@react-aria/focus";
import { ariaHideOutside, useOverlayTrigger } from "@react-aria/overlays";
import { mapPropsVariants } from "@nextui-org/system";
import { getArrowPlacement, getShouldUseAxisPlacement } from "@nextui-org/aria-utils";
import { popover } from "@nextui-org/theme";
import { mergeProps, mergeRefs } from "@react-aria/utils";
import { clsx, dataAttr } from "@nextui-org/shared-utils";
import { useMemo, useCallback, useRef } from "react";
function usePopover(originalProps) {
  var _a, _b;
  const [props, variantProps] = mapPropsVariants(originalProps, popover.variantKeys);
  const {
    as,
    children,
    ref,
    state: stateProp,
    triggerRef: triggerRefProp,
    scrollRef,
    isOpen,
    defaultOpen,
    onOpenChange,
    isNonModal = true,
    shouldFlip = true,
    containerPadding = 12,
    shouldBlockScroll = false,
    shouldCloseOnBlur,
    portalContainer,
    placement: placementProp = "top",
    triggerType = "dialog",
    showArrow = false,
    offset = 7,
    crossOffset = 0,
    boundaryElement,
    isKeyboardDismissDisabled,
    shouldCloseOnInteractOutside,
    motionProps,
    className,
    classNames,
    onClose,
    ...otherProps
  } = props;
  const Component = as || "div";
  const domRef = useDOMRef(ref);
  const domTriggerRef = useRef(null);
  const triggerRef = triggerRefProp || domTriggerRef;
  const disableAnimation = (_a = originalProps.disableAnimation) != null ? _a : false;
  const innerState = useOverlayTriggerState({
    isOpen,
    defaultOpen,
    onOpenChange: (isOpen2) => {
      onOpenChange == null ? void 0 : onOpenChange(isOpen2);
      if (!isOpen2) {
        onClose == null ? void 0 : onClose();
      }
    }
  });
  const state = stateProp || innerState;
  const {
    popoverProps,
    underlayProps,
    arrowProps,
    placement: ariaPlacement
  } = useReactAriaPopover(
    {
      triggerRef,
      isNonModal,
      popoverRef: domRef,
      placement: placementProp,
      offset,
      scrollRef,
      shouldCloseOnBlur,
      boundaryElement,
      crossOffset,
      shouldFlip,
      containerPadding,
      isKeyboardDismissDisabled,
      shouldCloseOnInteractOutside
    },
    state
  );
  const { triggerProps } = useOverlayTrigger({ type: triggerType }, state, triggerRef);
  const { isFocusVisible, isFocused, focusProps } = useFocusRing();
  const slots = useMemo(
    () => popover({
      ...variantProps
    }),
    [...Object.values(variantProps)]
  );
  const baseStyles = clsx(classNames == null ? void 0 : classNames.base, className);
  const getPopoverProps = (props2 = {}) => ({
    ref: domRef,
    ...mergeProps(popoverProps, otherProps, props2),
    style: mergeProps(popoverProps.style, otherProps.style, props2.style)
  });
  const getDialogProps = (props2 = {}) => ({
    "data-open": dataAttr(state.isOpen),
    "data-focus": dataAttr(isFocused),
    "data-focus-visible": dataAttr(isFocusVisible),
    "data-placement": getArrowPlacement(ariaPlacement, placementProp),
    ...mergeProps(focusProps, props2),
    className: slots.base({ class: clsx(baseStyles, props2.className) }),
    style: {
      outline: "none"
    }
  });
  const placement = useMemo(
    () => getShouldUseAxisPlacement(ariaPlacement, placementProp) ? ariaPlacement : placementProp,
    [ariaPlacement, placementProp]
  );
  const getTriggerProps = useCallback(
    (props2 = {}, _ref = null) => {
      return {
        "aria-haspopup": "dialog",
        ...mergeProps(triggerProps, props2),
        className: slots.trigger({ class: clsx(classNames == null ? void 0 : classNames.trigger, props2.className) }),
        ref: mergeRefs(_ref, triggerRef)
      };
    },
    [isOpen, state, triggerProps, triggerRef]
  );
  const getBackdropProps = useCallback(
    (props2 = {}) => ({
      className: slots.backdrop({ class: classNames == null ? void 0 : classNames.backdrop }),
      onClick: () => state.close(),
      ...underlayProps,
      ...props2
    }),
    [slots, classNames, underlayProps]
  );
  const getArrowProps = useCallback(
    () => ({
      className: slots.arrow({ class: classNames == null ? void 0 : classNames.arrow }),
      "data-placement": getArrowPlacement(ariaPlacement, placementProp),
      ...arrowProps
    }),
    [arrowProps, ariaPlacement, placementProp, slots, classNames]
  );
  useEffect(() => {
    if (state.isOpen && (domRef == null ? void 0 : domRef.current)) {
      return ariaHideOutside([domRef == null ? void 0 : domRef.current]);
    }
  }, [state.isOpen, domRef]);
  return {
    state,
    Component,
    children,
    classNames,
    showArrow,
    triggerRef,
    placement,
    isNonModal,
    popoverRef: domRef,
    portalContainer,
    isOpen: state.isOpen,
    onClose: state.close,
    disableAnimation,
    shouldBlockScroll,
    backdrop: (_b = originalProps.backdrop) != null ? _b : "transparent",
    motionProps,
    getBackdropProps,
    getPopoverProps,
    getTriggerProps,
    getArrowProps,
    getDialogProps
  };
}

export {
  usePopover
};
