"use client";
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Tooltip: () => tooltip_default,
  useTooltip: () => useTooltip
});
module.exports = __toCommonJS(src_exports);

// src/tooltip.tsx
var import_react3 = require("react");
var import_system2 = require("@nextui-org/system");
var import_overlays2 = require("@react-aria/overlays");
var import_framer_motion = require("framer-motion");
var import_framer_transitions = require("@nextui-org/framer-transitions");
var import_shared_utils2 = require("@nextui-org/shared-utils");
var import_react4 = require("react");
var import_aria_utils2 = require("@nextui-org/aria-utils");

// src/use-tooltip.ts
var import_react = require("react");
var import_tooltip = require("@react-stately/tooltip");
var import_utils = require("@react-aria/utils");
var import_tooltip2 = require("@react-aria/tooltip");
var import_overlays = require("@react-aria/overlays");
var import_system = require("@nextui-org/system");
var import_theme = require("@nextui-org/theme");
var import_shared_utils = require("@nextui-org/shared-utils");
var import_react_utils = require("@nextui-org/react-utils");
var import_react_utils2 = require("@nextui-org/react-utils");
var import_react2 = require("react");
var import_aria_utils = require("@nextui-org/aria-utils");
function useTooltip(originalProps) {
  const [props, variantProps] = (0, import_system.mapPropsVariants)(originalProps, import_theme.popover.variantKeys);
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
  const state = (0, import_tooltip.useTooltipTriggerState)({
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
  const triggerRef = (0, import_react2.useRef)(null);
  const overlayRef = (0, import_react2.useRef)(null);
  const tooltipId = (0, import_react.useId)();
  const isOpen = state.isOpen && !isDisabled;
  (0, import_react.useImperativeHandle)(
    ref,
    () => (0, import_react_utils2.createDOMRef)(overlayRef)
  );
  const { triggerProps, tooltipProps: triggerTooltipProps } = (0, import_tooltip2.useTooltipTrigger)(
    {
      isDisabled,
      trigger: triggerAction
    },
    state,
    triggerRef
  );
  const { tooltipProps } = (0, import_tooltip2.useTooltip)(
    {
      isOpen,
      ...(0, import_utils.mergeProps)(props, triggerTooltipProps)
    },
    state
  );
  const {
    overlayProps: positionProps,
    arrowProps,
    placement
  } = (0, import_overlays.useOverlayPosition)({
    isOpen,
    targetRef: triggerRef,
    placement: (0, import_aria_utils.toReactAriaPlacement)(placementProp),
    overlayRef,
    offset: showArrow ? offset + 3 : offset,
    crossOffset,
    shouldFlip,
    containerPadding
  });
  const { overlayProps } = (0, import_overlays.useOverlay)(
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
  const slots = (0, import_react2.useMemo)(
    () => {
      var _a, _b, _c;
      return (0, import_theme.popover)({
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
  const baseStyles = (0, import_shared_utils.clsx)(classNames == null ? void 0 : classNames.base, className);
  const getTriggerProps = (0, import_react2.useCallback)(
    (props2 = {}, _ref = null) => ({
      ...(0, import_utils.mergeProps)(triggerProps, props2),
      ref: (0, import_react_utils.mergeRefs)(_ref, triggerRef),
      "aria-describedby": isOpen ? tooltipId : void 0
    }),
    [triggerProps, isOpen, tooltipId, state]
  );
  const getTooltipProps = (0, import_react2.useCallback)(
    () => ({
      ref: overlayRef,
      "data-open": (0, import_shared_utils.dataAttr)(isOpen),
      "data-disabled": (0, import_shared_utils.dataAttr)(isDisabled),
      "data-placement": (0, import_aria_utils.getArrowPlacement)(placement, placementProp),
      className: slots.base({ class: baseStyles }),
      ...(0, import_utils.mergeProps)(tooltipProps, overlayProps, otherProps),
      style: (0, import_utils.mergeProps)(positionProps.style, otherProps.style, props.style),
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
  const getArrowProps = (0, import_react2.useCallback)(
    () => ({
      className: slots.arrow({ class: classNames == null ? void 0 : classNames.arrow }),
      "data-placement": (0, import_aria_utils.getArrowPlacement)(placement, placementProp),
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

// src/tooltip.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var Tooltip = (0, import_system2.forwardRef)((props, ref) => {
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
    const child = import_react4.Children.only(children);
    trigger = (0, import_react4.cloneElement)(child, getTriggerProps(child.props, child.ref));
  } catch (error) {
    trigger = /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {});
    (0, import_shared_utils2.warn)("Tooltip must have only one child node. Please, check your code.");
  }
  const arrowContent = (0, import_react3.useMemo)(() => {
    if (!showArrow)
      return null;
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { ...getArrowProps() });
  }, [showArrow, getArrowProps]);
  const animatedContent = (0, import_react3.useMemo)(() => {
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { ...otherTooltipProps, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(
      import_framer_motion.motion.div,
      {
        animate: "enter",
        exit: "exit",
        initial: "exit",
        style: {
          ...(0, import_aria_utils2.getTransformOrigins)(placement)
        },
        variants: import_framer_transitions.TRANSITION_VARIANTS.scaleSpring,
        ...motionProps,
        children: [
          /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, { className, children: content }),
          arrowContent
        ]
      }
    ) });
  }, [otherTooltipProps, className, placement, motionProps, Component, content, arrowContent]);
  return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
    trigger,
    disableAnimation && isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_overlays2.OverlayContainer, { portalContainer, children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { ...otherTooltipProps, children: [
      /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Component, { className, children: content }),
      arrowContent
    ] }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_framer_motion.AnimatePresence, { children: isOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_overlays2.OverlayContainer, { portalContainer, children: animatedContent }) : null })
  ] });
});
Tooltip.displayName = "NextUI.Tooltip";
var tooltip_default = Tooltip;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Tooltip,
  useTooltip
});
