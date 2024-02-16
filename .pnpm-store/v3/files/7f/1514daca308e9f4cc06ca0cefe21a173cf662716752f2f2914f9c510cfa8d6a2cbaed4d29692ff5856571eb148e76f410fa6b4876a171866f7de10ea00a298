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

// src/use-select.ts
var use_select_exports = {};
__export(use_select_exports, {
  useSelect: () => useSelect
});
module.exports = __toCommonJS(use_select_exports);
var import_system = require("@nextui-org/system");
var import_theme = require("@nextui-org/theme");
var import_react_utils = require("@nextui-org/react-utils");
var import_react = require("react");
var import_use_aria_button = require("@nextui-org/use-aria-button");
var import_focus = require("@react-aria/focus");
var import_shared_utils = require("@nextui-org/shared-utils");
var import_utils = require("@react-aria/utils");
var import_interactions = require("@react-aria/interactions");
var import_use_aria_multiselect = require("@nextui-org/use-aria-multiselect");
function useSelect(originalProps) {
  var _a, _b;
  const [props, variantProps] = (0, import_system.mapPropsVariants)(originalProps, import_theme.select.variantKeys);
  const disableAnimation = (_a = originalProps.disableAnimation) != null ? _a : false;
  let {
    ref,
    as,
    isOpen,
    label,
    name,
    children,
    isLoading,
    selectorIcon,
    defaultOpen,
    onOpenChange,
    startContent,
    endContent,
    description,
    errorMessage,
    renderValue,
    onSelectionChange,
    placeholder,
    disallowEmptySelection = false,
    selectionMode = "single",
    spinnerRef,
    scrollRef: scrollRefProp,
    popoverProps: userPopoverProps,
    scrollShadowProps: userScrollShadowProps,
    listboxProps: userListboxProps,
    validationState,
    spinnerProps,
    onChange,
    onClose,
    className,
    classNames,
    ...otherProps
  } = props;
  const scrollShadowRef = (0, import_react_utils.useDOMRef)(scrollRefProp);
  const defaultRelatedComponentsProps = {
    popoverProps: {
      placement: "bottom",
      triggerScaleOnOpen: false,
      offset: 5,
      disableAnimation
    },
    scrollShadowProps: {
      ref: scrollShadowRef,
      isEnabled: (_b = originalProps.showScrollIndicators) != null ? _b : true,
      hideScrollBar: true,
      offset: 15
    },
    listboxProps: {
      disableAnimation
    }
  };
  userPopoverProps = { ...defaultRelatedComponentsProps.popoverProps, ...userPopoverProps };
  userScrollShadowProps = {
    ...defaultRelatedComponentsProps.scrollShadowProps,
    ...userScrollShadowProps
  };
  userListboxProps = { ...defaultRelatedComponentsProps.listboxProps, ...userListboxProps };
  const Component = as || "button";
  const shouldFilterDOMProps = typeof Component === "string";
  const domRef = (0, import_react_utils.useDOMRef)(ref);
  const triggerRef = (0, import_react.useRef)(null);
  const listboxRef = (0, import_react.useRef)(null);
  const popoverRef = (0, import_react.useRef)(null);
  const state = (0, import_use_aria_multiselect.useMultiSelectState)({
    ...props,
    isOpen,
    selectionMode,
    disallowEmptySelection,
    children,
    isRequired: originalProps == null ? void 0 : originalProps.isRequired,
    isDisabled: originalProps == null ? void 0 : originalProps.isDisabled,
    defaultOpen,
    onOpenChange: (open) => {
      onOpenChange == null ? void 0 : onOpenChange(open);
      if (!open) {
        onClose == null ? void 0 : onClose();
      }
    },
    onSelectionChange: (keys) => {
      onSelectionChange == null ? void 0 : onSelectionChange(keys);
      if (onChange && typeof onChange === "function" && domRef.current) {
        const event = {
          target: {
            ...domRef.current,
            value: Array.from(keys).join(","),
            name: domRef.current.name
          }
        };
        onChange(event);
      }
    }
  });
  const { labelProps, triggerProps, valueProps, menuProps, descriptionProps, errorMessageProps } = (0, import_use_aria_multiselect.useMultiSelect)(
    { ...props, disallowEmptySelection, isDisabled: originalProps == null ? void 0 : originalProps.isDisabled },
    state,
    triggerRef
  );
  const { isPressed, buttonProps } = (0, import_use_aria_button.useAriaButton)(triggerProps, triggerRef);
  const { focusProps, isFocused, isFocusVisible } = (0, import_focus.useFocusRing)();
  const { isHovered, hoverProps } = (0, import_interactions.useHover)({ isDisabled: originalProps == null ? void 0 : originalProps.isDisabled });
  const labelPlacement = (0, import_react.useMemo)(() => {
    var _a2;
    if ((!originalProps.labelPlacement || originalProps.labelPlacement === "inside") && !label) {
      return "outside";
    }
    return (_a2 = originalProps.labelPlacement) != null ? _a2 : "inside";
  }, [originalProps.labelPlacement, label]);
  const hasHelper = !!description || !!errorMessage;
  const hasPlaceholder = !!placeholder;
  const isInvalid = validationState === "invalid" || originalProps.isInvalid;
  const shouldLabelBeOutside = labelPlacement === "outside-left" || labelPlacement === "outside" && hasPlaceholder;
  const shouldLabelBeInside = labelPlacement === "inside";
  const isLabelPlaceholder = !hasPlaceholder && labelPlacement !== "outside-left";
  const isFilled = state.isOpen || !!state.selectedItems || !!startContent || !!endContent;
  const baseStyles = (0, import_shared_utils.clsx)(classNames == null ? void 0 : classNames.base, className);
  const slots = (0, import_react.useMemo)(
    () => (0, import_theme.select)({
      ...variantProps,
      isLabelPlaceholder,
      isInvalid,
      className
    }),
    [...Object.values(variantProps), isInvalid, isLabelPlaceholder, className]
  );
  (0, import_react.useEffect)(() => {
    if (state.isOpen && popoverRef.current && listboxRef.current) {
      let selectedItem = listboxRef.current.querySelector("[aria-selected=true] [data-label=true]");
      let scrollShadow = scrollShadowRef.current;
      if (selectedItem && scrollShadow && selectedItem.parentElement) {
        let scrollShadowRect = scrollShadow == null ? void 0 : scrollShadow.getBoundingClientRect();
        let scrollShadowHeight = scrollShadowRect.height;
        scrollShadow.scrollTop = selectedItem.parentElement.offsetTop - scrollShadowHeight / 2 + selectedItem.parentElement.clientHeight / 2;
      }
    }
  }, [state.isOpen, disableAnimation]);
  (0, import_react.useEffect)(() => {
    if (state.isOpen && popoverRef.current && triggerRef.current) {
      let selectRect = triggerRef.current.getBoundingClientRect();
      let popover = popoverRef.current;
      popover.style.width = selectRect.width + "px";
    }
  }, [state.isOpen]);
  const getBaseProps = (0, import_react.useCallback)(
    (props2 = {}) => ({
      "data-filled": (0, import_shared_utils.dataAttr)(isFilled),
      "data-has-helper": (0, import_shared_utils.dataAttr)(hasHelper),
      className: slots.base({
        class: (0, import_shared_utils.clsx)(baseStyles, props2.className)
      }),
      ...props2
    }),
    [slots, hasHelper, isFilled, baseStyles]
  );
  const getTriggerProps = (0, import_react.useCallback)(
    (props2 = {}) => {
      return {
        ref: triggerRef,
        "data-open": (0, import_shared_utils.dataAttr)(state.isOpen),
        "data-disabled": (0, import_shared_utils.dataAttr)(originalProps == null ? void 0 : originalProps.isDisabled),
        "data-focus": (0, import_shared_utils.dataAttr)(isFocused),
        "data-pressed": (0, import_shared_utils.dataAttr)(isPressed),
        "data-focus-visible": (0, import_shared_utils.dataAttr)(isFocusVisible),
        "data-hover": (0, import_shared_utils.dataAttr)(isHovered),
        className: slots.trigger({ class: classNames == null ? void 0 : classNames.trigger }),
        ...(0, import_utils.mergeProps)(
          buttonProps,
          focusProps,
          hoverProps,
          (0, import_react_utils.filterDOMProps)(otherProps, {
            enabled: shouldFilterDOMProps
          }),
          (0, import_react_utils.filterDOMProps)(props2)
        )
      };
    },
    [
      slots,
      triggerRef,
      state.isOpen,
      classNames == null ? void 0 : classNames.trigger,
      originalProps == null ? void 0 : originalProps.isDisabled,
      isFocused,
      isPressed,
      isFocusVisible,
      isHovered,
      buttonProps,
      focusProps,
      hoverProps,
      otherProps,
      shouldFilterDOMProps
    ]
  );
  const getHiddenSelectProps = (0, import_react.useCallback)(
    (props2 = {}) => ({
      state,
      triggerRef,
      selectRef: domRef,
      selectionMode,
      label: originalProps == null ? void 0 : originalProps.label,
      name: originalProps == null ? void 0 : originalProps.name,
      isRequired: originalProps == null ? void 0 : originalProps.isRequired,
      autoComplete: originalProps == null ? void 0 : originalProps.autoComplete,
      isDisabled: originalProps == null ? void 0 : originalProps.isDisabled,
      onChange,
      ...props2
    }),
    [
      state,
      selectionMode,
      originalProps == null ? void 0 : originalProps.label,
      originalProps == null ? void 0 : originalProps.autoComplete,
      originalProps == null ? void 0 : originalProps.name,
      originalProps == null ? void 0 : originalProps.isDisabled,
      triggerRef
    ]
  );
  const getLabelProps = (0, import_react.useCallback)(
    (props2 = {}) => ({
      className: slots.label({
        class: (0, import_shared_utils.clsx)(classNames == null ? void 0 : classNames.label, props2.className)
      }),
      ...labelProps,
      ...props2
    }),
    [slots, classNames == null ? void 0 : classNames.label, labelProps]
  );
  const getValueProps = (0, import_react.useCallback)(
    (props2 = {}) => ({
      className: slots.value({
        class: (0, import_shared_utils.clsx)(classNames == null ? void 0 : classNames.value, props2.className)
      }),
      ...valueProps,
      ...props2
    }),
    [slots, classNames == null ? void 0 : classNames.value, valueProps]
  );
  const getListboxWrapperProps = (0, import_react.useCallback)(
    (props2 = {}) => ({
      className: slots.listboxWrapper({
        class: (0, import_shared_utils.clsx)(classNames == null ? void 0 : classNames.listboxWrapper, props2 == null ? void 0 : props2.className)
      }),
      ...(0, import_utils.mergeProps)(userScrollShadowProps, props2)
    }),
    [slots.listboxWrapper, classNames == null ? void 0 : classNames.listboxWrapper, userScrollShadowProps]
  );
  const getListboxProps = (props2 = {}) => {
    return {
      state,
      ref: listboxRef,
      className: slots.listbox({
        class: (0, import_shared_utils.clsx)(classNames == null ? void 0 : classNames.listbox, props2 == null ? void 0 : props2.className)
      }),
      ...(0, import_utils.mergeProps)(userListboxProps, props2, menuProps)
    };
  };
  const getPopoverProps = (0, import_react.useCallback)(
    (props2 = {}) => {
      return {
        state,
        triggerRef,
        ref: popoverRef,
        scrollRef: listboxRef,
        triggerType: "listbox",
        className: slots.popover({
          class: (0, import_shared_utils.clsx)(classNames == null ? void 0 : classNames.popover, props2.className)
        }),
        ...(0, import_utils.mergeProps)(userPopoverProps, props2),
        offset: state.selectedItems && state.selectedItems.length > 0 ? state.selectedItems.length * 1e-8 + ((userPopoverProps == null ? void 0 : userPopoverProps.offset) || 0) : userPopoverProps == null ? void 0 : userPopoverProps.offset
      };
    },
    [slots, classNames == null ? void 0 : classNames.popover, userPopoverProps, triggerRef, state, state.selectedItems]
  );
  const getSelectorIconProps = (0, import_react.useCallback)(
    () => ({
      "aria-hidden": (0, import_shared_utils.dataAttr)(true),
      "data-open": (0, import_shared_utils.dataAttr)(state.isOpen),
      className: slots.selectorIcon({ class: classNames == null ? void 0 : classNames.selectorIcon })
    }),
    [slots, classNames == null ? void 0 : classNames.selectorIcon, state == null ? void 0 : state.isOpen]
  );
  const getInnerWrapperProps = (0, import_react.useCallback)(
    (props2 = {}) => {
      return {
        ...props2,
        className: slots.innerWrapper({
          class: (0, import_shared_utils.clsx)(classNames == null ? void 0 : classNames.innerWrapper, props2 == null ? void 0 : props2.className)
        })
      };
    },
    [slots, classNames == null ? void 0 : classNames.innerWrapper]
  );
  const getHelperWrapperProps = (0, import_react.useCallback)(
    (props2 = {}) => {
      return {
        ...props2,
        className: slots.helperWrapper({
          class: (0, import_shared_utils.clsx)(classNames == null ? void 0 : classNames.helperWrapper, props2 == null ? void 0 : props2.className)
        })
      };
    },
    [slots, classNames == null ? void 0 : classNames.helperWrapper]
  );
  const getDescriptionProps = (0, import_react.useCallback)(
    (props2 = {}) => {
      return {
        ...props2,
        ...descriptionProps,
        className: slots.description({ class: (0, import_shared_utils.clsx)(classNames == null ? void 0 : classNames.description, props2 == null ? void 0 : props2.className) })
      };
    },
    [slots, classNames == null ? void 0 : classNames.description]
  );
  const getMainWrapperProps = (0, import_react.useCallback)(
    (props2 = {}) => {
      return {
        ...props2,
        className: slots.mainWrapper({
          class: (0, import_shared_utils.clsx)(classNames == null ? void 0 : classNames.mainWrapper, props2 == null ? void 0 : props2.className)
        })
      };
    },
    [slots, classNames == null ? void 0 : classNames.mainWrapper]
  );
  const getErrorMessageProps = (0, import_react.useCallback)(
    (props2 = {}) => {
      return {
        ...props2,
        ...errorMessageProps,
        className: slots.errorMessage({ class: (0, import_shared_utils.clsx)(classNames == null ? void 0 : classNames.errorMessage, props2 == null ? void 0 : props2.className) })
      };
    },
    [slots, errorMessageProps, classNames == null ? void 0 : classNames.errorMessage]
  );
  const getSpinnerProps = (0, import_react.useCallback)(
    (props2 = {}) => {
      return {
        "aria-hidden": (0, import_shared_utils.dataAttr)(true),
        color: "current",
        size: "sm",
        ...spinnerProps,
        ...props2,
        ref: spinnerRef,
        className: slots.spinner({ class: (0, import_shared_utils.clsx)(classNames == null ? void 0 : classNames.spinner, props2 == null ? void 0 : props2.className) })
      };
    },
    [slots, spinnerRef, spinnerProps, classNames == null ? void 0 : classNames.spinner]
  );
  return {
    Component,
    domRef,
    state,
    label,
    name,
    triggerRef,
    isLoading,
    placeholder,
    startContent,
    endContent,
    description,
    selectorIcon,
    errorMessage,
    hasHelper,
    labelPlacement,
    hasPlaceholder,
    renderValue,
    selectionMode,
    disableAnimation,
    shouldLabelBeOutside,
    shouldLabelBeInside,
    getBaseProps,
    getTriggerProps,
    getLabelProps,
    getValueProps,
    getListboxProps,
    getPopoverProps,
    getSpinnerProps,
    getMainWrapperProps,
    getListboxWrapperProps,
    getHiddenSelectProps,
    getInnerWrapperProps,
    getHelperWrapperProps,
    getDescriptionProps,
    getErrorMessageProps,
    getSelectorIconProps
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useSelect
});
