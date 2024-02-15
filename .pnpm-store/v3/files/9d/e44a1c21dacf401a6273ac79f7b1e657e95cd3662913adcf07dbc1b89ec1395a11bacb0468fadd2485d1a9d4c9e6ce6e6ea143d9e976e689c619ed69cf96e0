"use client";

// src/use-tooltip.ts
import { useId, useImperativeHandle } from "react";
import { useTooltipTriggerState } from "@react-stately/tooltip";
import { mergeProps } from "@react-aria/utils";
import { useTooltip as useReactAriaTooltip, useTooltipTrigger } from "@react-aria/tooltip";
import { useOverlayPosition, useOverlay } from "@react-aria/overlays";
import { mapPropsVariants } from "@nextui-org/system";
import { popover } from "@nextui-org/theme";
import { clsx, dataAttr } from "@nextui-org/shared-utils";
import { mergeRefs } from "@nextui-org/react-utils";
import { createDOMRef } from "@nextui-org/react-utils";
import { useMemo, useRef, useCallback } from "react";
import { toReactAriaPlacement, getArrowPlacement } from "@nextui-org/aria-utils";
function useTooltip(originalProps) {
  const [props, variantProps] = mapPropsVariants(originalProps, popover.variantKeys);
  const {
    ref,
    as,
    isOpen: isOpenProp,
    content,
    children,
    defaultOpen,
    onOpenChange,
    isDisabled,
    trigger: triggerAction,
    shouldFlip = true,
    containerPadding = 12,
    placement: placementProp = "top",
    delay = 0,
    closeDelay = 500,
    showArrow = false,
    offset = 7,
    crossOffset = 0,
    isDismissable,
    shouldCloseOnBlur = true,
    portalContainer,
    isKeyboardDismissDisabled = false,
    shouldCloseOnInteractOutside,
    className,
    onClose,
    motionProps,
    classNames,
    ...otherProps
  } = props;
  const Component = as || "div";
  const state = useTooltipTriggerState({
    delay,
    closeDelay,
    isDisabled,
    defaultOpen,
    isOpen: isOpenProp,
    onOpenChange: (isOpen2) => {
      onOpenChange == null ? void 0 : onOpenChange(isOpen2);
      if (!isOpen2) {
        onClose == null ? void 0 : onClose();
      }
    }
  });
  const triggerRef = useRef(null);
  const overlayRef = useRef(null);
  const tooltipId = useId();
  const isOpen = state.isOpen && !isDisabled;
  useImperativeHandle(
    ref,
    () => createDOMRef(overlayRef)
  );
  const { triggerProps, tooltipProps: triggerTooltipProps } = useTooltipTrigger(
    {
      isDisabled,
      trigger: triggerAction
    },
    state,
    triggerRef
  );
  const { tooltipProps } = useReactAriaTooltip(
    {
      isOpen,
      ...mergeProps(props, triggerTooltipProps)
    },
    state
  );
  const {
    overlayProps: positionProps,
    arrowProps,
    placement
  } = useOverlayPosition({
    isOpen,
    targetRef: triggerRef,
    placement: toReactAriaPlacement(placementProp),
    overlayRef,
    offset: showArrow ? offset + 3 : offset,
    crossOffset,
    shouldFlip,
    containerPadding
  });
  const { overlayProps } = useOverlay(
    {
      isOpen,
      onClose: state.close,
      isDismissable,
      shouldCloseOnBlur,
      isKeyboardDismissDisabled,
      shouldCloseOnInteractOutside
    },
    overlayRef
  );
  const slots = useMemo(
    () => {
      var _a, _b, _c;
      return popover({
        ...variantProps,
        radius: (_a = originalProps == null ? void 0 : originalProps.radius) != null ? _a : "md",
        size: (_b = originalProps == null ? void 0 : originalProps.size) != null ? _b : "md",
        shadow: (_c = originalProps == null ? void 0 : originalProps.shadow) != null ? _c : "sm"
      });
    },
    [
      ...Object.values(variantProps),
      originalProps == null ? void 0 : originalProps.radius,
      originalProps == null ? void 0 : originalProps.size,
      originalProps == null ? void 0 : originalProps.shadow
    ]
  );
  const baseStyles = clsx(classNames == null ? void 0 : classNames.base, className);
  const getTriggerProps = useCallback(
    (props2 = {}, _ref = null) => ({
      ...mergeProps(triggerProps, props2),
      ref: mergeRefs(_ref, triggerRef),
      "aria-describedby": isOpen ? tooltipId : void 0
    }),
    [triggerProps, isOpen, tooltipId, state]
  );
  const getTooltipProps = useCallback(
    () => ({
      ref: overlayRef,
      "data-open": dataAttr(isOpen),
      "data-disabled": dataAttr(isDisabled),
      "data-placement": getArrowPlacement(placement, placementProp),
      className: slots.base({ class: baseStyles }),
      ...mergeProps(tooltipProps, overlayProps, otherProps),
      style: mergeProps(positionProps.style, otherProps.style, props.style),
      id: tooltipId
    }),
    [
      baseStyles,
      overlayProps,
      otherProps,
      overlayRef,
      positionProps,
      slots,
      tooltipId,
      tooltipProps
    ]
  );
  const getArrowProps = useCallback(
    () => ({
      className: slots.arrow({ class: classNames == null ? void 0 : classNames.arrow }),
      "data-placement": getArrowPlacement(placement, placementProp),
      ...arrowProps
    }),
    [arrowProps, placement, placementProp, slots, classNames]
  );
  return {
    Component,
    content,
    children,
    isOpen,
    triggerRef,
    showArrow,
    portalContainer,
    placement: placementProp,
    disableAnimation: originalProps == null ? void 0 : originalProps.disableAnimation,
    isDisabled,
    motionProps,
    getTriggerProps,
    getTooltipProps,
    getArrowProps
  };
}

export {
  useTooltip
};
