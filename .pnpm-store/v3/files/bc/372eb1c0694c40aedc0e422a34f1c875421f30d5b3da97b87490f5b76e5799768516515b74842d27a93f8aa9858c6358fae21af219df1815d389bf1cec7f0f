"use client";
import {
  tab_panel_default
} from "./chunk-FUVFJH5A.mjs";
import {
  tab_default
} from "./chunk-3ZTZI2M3.mjs";
import {
  useTabs
} from "./chunk-VOQUMKEW.mjs";

// src/tabs.tsx
import { useId } from "react";
import { LayoutGroup } from "framer-motion";
import { forwardRef } from "@nextui-org/system";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
function Tabs(props, ref) {
  var _a;
  const { Component, values, state, getBaseProps, getTabListProps } = useTabs({
    ...props,
    ref
  });
  const layoutId = useId();
  const layoutGroupEnabled = !props.disableAnimation && !props.disableCursorAnimation;
  const tabsProps = {
    state,
    listRef: values.listRef,
    slots: values.slots,
    classNames: values.classNames,
    isDisabled: values.isDisabled,
    motionProps: values.motionProps,
    disableAnimation: values.disableAnimation,
    disableCursorAnimation: values.disableCursorAnimation
  };
  const tabs = [...state.collection].map((item) => /* @__PURE__ */ jsx(tab_default, { item, ...item.props, ...tabsProps }, item.key));
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("div", { ...getBaseProps(), children: /* @__PURE__ */ jsx(Component, { ...getTabListProps(), children: layoutGroupEnabled ? /* @__PURE__ */ jsx(LayoutGroup, { id: layoutId, children: tabs }) : tabs }) }),
    /* @__PURE__ */ jsx(
      tab_panel_default,
      {
        classNames: values.classNames,
        slots: values.slots,
        state: values.state
      },
      (_a = state.selectedItem) == null ? void 0 : _a.key
    )
  ] });
}
var tabs_default = forwardRef(Tabs);
Tabs.displayName = "NextUI.Tabs";

export {
  tabs_default
};
