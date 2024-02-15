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

// src/use-menu.ts
var use_menu_exports = {};
__export(use_menu_exports, {
  useMenu: () => useMenu
});
module.exports = __toCommonJS(use_menu_exports);
var import_menu = require("@react-aria/menu");
var import_theme = require("@nextui-org/theme");
var import_tree = require("@react-stately/tree");
var import_react_utils = require("@nextui-org/react-utils");
var import_react = require("react");
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
  const domRef = (0, import_react_utils.useDOMRef)(ref);
  const innerState = (0, import_tree.useTreeState)(otherProps);
  const state = propState || innerState;
  const { menuProps } = (0, import_menu.useMenu)(otherProps, state, domRef);
  const styles = (0, import_react.useMemo)(() => (0, import_theme.menu)({ className }), [className]);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useMenu
});
