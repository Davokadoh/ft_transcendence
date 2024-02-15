"use client";
import {
  useTooltip
} from "./chunk-62U42LRQ.mjs";

// src/tooltip.tsx
import { useMemo } from "react";
import { forwardRef } from "@nextui-org/system";
import { OverlayContainer } from "@react-aria/overlays";
import { AnimatePresence, motion } from "framer-motion";
import { TRANSITION_VARIANTS } from "@nextui-org/framer-transitions";
import { warn } from "@nextui-org/shared-utils";
import { Children, cloneElement } from "react";
import { getTransformOrigins } from "@nextui-org/aria-utils";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var Tooltip = forwardRef((props, ref) => {
  const {
    Component,
    children,
    content,
    isOpen,
    portalContainer,
    placement,
    disableAnimation,
    motionProps,
    showArrow,
    getTriggerProps,
    getTooltipProps,
    getArrowProps
  } = useTooltip({
    ...props,
    ref
  });
  let trigger;
  const { className, ...otherTooltipProps } = getTooltipProps();
  try {
    const child = Children.only(children);
    trigger = cloneElement(child, getTriggerProps(child.props, child.ref));
  } catch (error) {
    trigger = /* @__PURE__ */ jsx("span", {});
    warn("Tooltip must have only one child node. Please, check your code.");
  }
  const arrowContent = useMemo(() => {
    if (!showArrow)
      return null;
    return /* @__PURE__ */ jsx("span", { ...getArrowProps() });
  }, [showArrow, getArrowProps]);
  const animatedContent = useMemo(() => {
    return /* @__PURE__ */ jsx("div", { ...otherTooltipProps, children: /* @__PURE__ */ jsxs(
      motion.div,
      {
        animate: "enter",
        exit: "exit",
        initial: "exit",
        style: {
          ...getTransformOrigins(placement)
        },
        variants: TRANSITION_VARIANTS.scaleSpring,
        ...motionProps,
        children: [
          /* @__PURE__ */ jsx(Component, { className, children: content }),
          arrowContent
        ]
      }
    ) });
  }, [otherTooltipProps, className, placement, motionProps, Component, content, arrowContent]);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    trigger,
    disableAnimation && isOpen ? /* @__PURE__ */ jsx(OverlayContainer, { portalContainer, children: /* @__PURE__ */ jsxs("div", { ...otherTooltipProps, children: [
      /* @__PURE__ */ jsx(Component, { className, children: content }),
      arrowContent
    ] }) }) : /* @__PURE__ */ jsx(AnimatePresence, { children: isOpen ? /* @__PURE__ */ jsx(OverlayContainer, { portalContainer, children: animatedContent }) : null })
  ] });
});
Tooltip.displayName = "NextUI.Tooltip";
var tooltip_default = Tooltip;

export {
  tooltip_default
};
