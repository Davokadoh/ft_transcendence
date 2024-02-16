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

// src/use-listbox.ts
var use_listbox_exports = {};
__export(use_listbox_exports, {
  useListbox: () => useListbox
});
module.exports = __toCommonJS(use_listbox_exports);
var import_listbox = require("@react-aria/listbox");
var import_theme = require("@nextui-org/theme");
var import_list = require("@react-stately/list");
var import_react_utils = require("@nextui-org/react-utils");
var import_react = require("react");
function useListbox(props) {
  const {
    ref,
    as,
    state: propState,
    variant,
    color,
    onAction,
    onSelectionChange,
    disableAnimation,
    itemClasses,
    className,
    ...otherProps
  } = props;
  const Component = as || "ul";
  const shouldFilterDOMProps = typeof Component === "string";
  const domRef = (0, import_react_utils.useDOMRef)(ref);
  const innerState = (0, import_list.useListState)({ ...props, onSelectionChange });
  const state = propState || innerState;
  const { listBoxProps } = (0, import_listbox.useListBox)({ ...props, onAction }, state, domRef);
  const styles = (0, import_react.useMemo)(() => (0, import_theme.listbox)({ className }), [className]);
  const getBaseProps = (props2 = {}) => {
    return {
      ref: domRef,
      className: styles,
      ...listBoxProps,
      ...(0, import_react_utils.filterDOMProps)(otherProps, {
        enabled: shouldFilterDOMProps
      }),
      ...props2
    };
  };
  return {
    Component,
    state,
    variant,
    color,
    disableAnimation,
    className,
    itemClasses,
    getBaseProps
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useListbox
});
