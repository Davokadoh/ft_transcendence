"use client";

// src/use-select.ts
import { mapPropsVariants } from "@nextui-org/system";
import { select } from "@nextui-org/theme";
import { useDOMRef, filterDOMProps } from "@nextui-org/react-utils";
import { useMemo, useCallback, useRef, useEffect } from "react";
import { useAriaButton } from "@nextui-org/use-aria-button";
import { useFocusRing } from "@react-aria/focus";
import { clsx, dataAttr } from "@nextui-org/shared-utils";
import { mergeProps } from "@react-aria/utils";
import { useHover } from "@react-aria/interactions";
import {
  useMultiSelect,
  useMultiSelectState
} from "@nextui-org/use-aria-multiselect";
function useSelect(originalProps) {
  var _a, _b;
  const [props, variantProps] = mapPropsVariants(originalProps, select.variantKeys);
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
  const scrollShadowRef = useDOMRef(scrollRefProp);
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
  const domRef = useDOMRef(ref);
  const triggerRef = useRef(null);
  const listboxRef = useRef(null);
  const popoverRef = useRef(null);
  const state = useMultiSelectState({
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
  const { labelProps, triggerProps, valueProps, menuProps, descriptionProps, errorMessageProps } = useMultiSelect(
    { ...props, disallowEmptySelection, isDisabled: originalProps == null ? void 0 : originalProps.isDisabled },
    state,
    triggerRef
  );
  const { isPressed, buttonProps } = useAriaButton(triggerProps, triggerRef);
  const { focusProps, isFocused, isFocusVisible } = useFocusRing();
  const { isHovered, hoverProps } = useHover({ isDisabled: originalProps == null ? void 0 : originalProps.isDisabled });
  const labelPlacement = useMemo(() => {
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
  const baseStyles = clsx(classNames == null ? void 0 : classNames.base, className);
  const slots = useMemo(
    () => select({
      ...variantProps,
      isLabelPlaceholder,
      isInvalid,
      className
    }),
    [...Object.values(variantProps), isInvalid, isLabelPlaceholder, className]
  );
  useEffect(() => {
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
  useEffect(() => {
    if (state.isOpen && popoverRef.current && triggerRef.current) {
      let selectRect = triggerRef.current.getBoundingClientRect();
      let popover = popoverRef.current;
      popover.style.width = selectRect.width + "px";
    }
  }, [state.isOpen]);
  const getBaseProps = useCallback(
    (props2 = {}) => ({
      "data-filled": dataAttr(isFilled),
      "data-has-helper": dataAttr(hasHelper),
      className: slots.base({
        class: clsx(baseStyles, props2.className)
      }),
      ...props2
    }),
    [slots, hasHelper, isFilled, baseStyles]
  );
  const getTriggerProps = useCallback(
    (props2 = {}) => {
      return {
        ref: triggerRef,
        "data-open": dataAttr(state.isOpen),
        "data-disabled": dataAttr(originalProps == null ? void 0 : originalProps.isDisabled),
        "data-focus": dataAttr(isFocused),
        "data-pressed": dataAttr(isPressed),
        "data-focus-visible": dataAttr(isFocusVisible),
        "data-hover": dataAttr(isHovered),
        className: slots.trigger({ class: classNames == null ? void 0 : classNames.trigger }),
        ...mergeProps(
          buttonProps,
          focusProps,
          hoverProps,
          filterDOMProps(otherProps, {
            enabled: shouldFilterDOMProps
          }),
          filterDOMProps(props2)
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
  const getHiddenSelectProps = useCallback(
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
  const getLabelProps = useCallback(
    (props2 = {}) => ({
      className: slots.label({
        class: clsx(classNames == null ? void 0 : classNames.label, props2.className)
      }),
      ...labelProps,
      ...props2
    }),
    [slots, classNames == null ? void 0 : classNames.label, labelProps]
  );
  const getValueProps = useCallback(
    (props2 = {}) => ({
      className: slots.value({
        class: clsx(classNames == null ? void 0 : classNames.value, props2.className)
      }),
      ...valueProps,
      ...props2
    }),
    [slots, classNames == null ? void 0 : classNames.value, valueProps]
  );
  const getListboxWrapperProps = useCallback(
    (props2 = {}) => ({
      className: slots.listboxWrapper({
        class: clsx(classNames == null ? void 0 : classNames.listboxWrapper, props2 == null ? void 0 : props2.className)
      }),
      ...mergeProps(userScrollShadowProps, props2)
    }),
    [slots.listboxWrapper, classNames == null ? void 0 : classNames.listboxWrapper, userScrollShadowProps]
  );
  const getListboxProps = (props2 = {}) => {
    return {
      state,
      ref: listboxRef,
      className: slots.listbox({
        class: clsx(classNames == null ? void 0 : classNames.listbox, props2 == null ? void 0 : props2.className)
      }),
      ...mergeProps(userListboxProps, props2, menuProps)
    };
  };
  const getPopoverProps = useCallback(
    (props2 = {}) => {
      return {
        state,
        triggerRef,
        ref: popoverRef,
        scrollRef: listboxRef,
        triggerType: "listbox",
        className: slots.popover({
          class: clsx(classNames == null ? void 0 : classNames.popover, props2.className)
        }),
        ...mergeProps(userPopoverProps, props2),
        offset: state.selectedItems && state.selectedItems.length > 0 ? state.selectedItems.length * 1e-8 + ((userPopoverProps == null ? void 0 : userPopoverProps.offset) || 0) : userPopoverProps == null ? void 0 : userPopoverProps.offset
      };
    },
    [slots, classNames == null ? void 0 : classNames.popover, userPopoverProps, triggerRef, state, state.selectedItems]
  );
  const getSelectorIconProps = useCallback(
    () => ({
      "aria-hidden": dataAttr(true),
      "data-open": dataAttr(state.isOpen),
      className: slots.selectorIcon({ class: classNames == null ? void 0 : classNames.selectorIcon })
    }),
    [slots, classNames == null ? void 0 : classNames.selectorIcon, state == null ? void 0 : state.isOpen]
  );
  const getInnerWrapperProps = useCallback(
    (props2 = {}) => {
      return {
        ...props2,
        className: slots.innerWrapper({
          class: clsx(classNames == null ? void 0 : classNames.innerWrapper, props2 == null ? void 0 : props2.className)
        })
      };
    },
    [slots, classNames == null ? void 0 : classNames.innerWrapper]
  );
  const getHelperWrapperProps = useCallback(
    (props2 = {}) => {
      return {
        ...props2,
        className: slots.helperWrapper({
          class: clsx(classNames == null ? void 0 : classNames.helperWrapper, props2 == null ? void 0 : props2.className)
        })
      };
    },
    [slots, classNames == null ? void 0 : classNames.helperWrapper]
  );
  const getDescriptionProps = useCallback(
    (props2 = {}) => {
      return {
        ...props2,
        ...descriptionProps,
        className: slots.description({ class: clsx(classNames == null ? void 0 : classNames.description, props2 == null ? void 0 : props2.className) })
      };
    },
    [slots, classNames == null ? void 0 : classNames.description]
  );
  const getMainWrapperProps = useCallback(
    (props2 = {}) => {
      return {
        ...props2,
        className: slots.mainWrapper({
          class: clsx(classNames == null ? void 0 : classNames.mainWrapper, props2 == null ? void 0 : props2.className)
        })
      };
    },
    [slots, classNames == null ? void 0 : classNames.mainWrapper]
  );
  const getErrorMessageProps = useCallback(
    (props2 = {}) => {
      return {
        ...props2,
        ...errorMessageProps,
        className: slots.errorMessage({ class: clsx(classNames == null ? void 0 : classNames.errorMessage, props2 == null ? void 0 : props2.className) })
      };
    },
    [slots, errorMessageProps, classNames == null ? void 0 : classNames.errorMessage]
  );
  const getSpinnerProps = useCallback(
    (props2 = {}) => {
      return {
        "aria-hidden": dataAttr(true),
        color: "current",
        size: "sm",
        ...spinnerProps,
        ...props2,
        ref: spinnerRef,
        className: slots.spinner({ class: clsx(classNames == null ? void 0 : classNames.spinner, props2 == null ? void 0 : props2.className) })
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

export {
  useSelect
};
