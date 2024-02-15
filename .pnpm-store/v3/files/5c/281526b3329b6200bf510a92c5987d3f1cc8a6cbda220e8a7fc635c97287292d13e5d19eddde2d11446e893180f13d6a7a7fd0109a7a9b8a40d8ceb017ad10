"use client";
import {
  menu_section_default
} from "./chunk-7HMQ7MB7.mjs";
import {
  menu_item_default
} from "./chunk-ZIIFKCEW.mjs";
import {
  useMenu
} from "./chunk-5CL57MFM.mjs";

// src/menu.tsx
import { forwardRef } from "@nextui-org/system";
import { jsx } from "react/jsx-runtime";
var Menu = forwardRef((props, ref) => {
  const {
    Component,
    state,
    getMenuProps,
    closeOnSelect,
    color,
    disableAnimation,
    variant,
    onClose,
    onAction,
    itemClasses
  } = useMenu({ ...props, ref });
  return /* @__PURE__ */ jsx(Component, { ...getMenuProps(), children: [...state.collection].map((item) => {
    const itemProps = {
      closeOnSelect,
      color,
      disableAnimation,
      item,
      state,
      variant,
      onClose,
      onAction,
      ...item.props
    };
    if (item.type === "section") {
      return /* @__PURE__ */ jsx(menu_section_default, { ...itemProps, itemClasses }, item.key);
    }
    let menuItem = /* @__PURE__ */ jsx(menu_item_default, { ...itemProps, classNames: itemClasses }, item.key);
    if (item.wrapper) {
      menuItem = item.wrapper(menuItem);
    }
    return menuItem;
  }) });
});
Menu.displayName = "NextUI.Menu";
var menu_default = Menu;

export {
  menu_default
};
