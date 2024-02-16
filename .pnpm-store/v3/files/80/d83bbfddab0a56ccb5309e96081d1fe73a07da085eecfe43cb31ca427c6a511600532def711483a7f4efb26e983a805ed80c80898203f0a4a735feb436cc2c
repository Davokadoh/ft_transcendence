"use client";
import {
  listbox_section_default
} from "./chunk-D5CCA3FI.mjs";
import {
  listbox_item_default
} from "./chunk-5POLKMQM.mjs";
import {
  useListbox
} from "./chunk-3OM65JFI.mjs";

// src/listbox.tsx
import { forwardRef } from "@nextui-org/system";
import { mergeProps } from "@react-aria/utils";
import { jsx } from "react/jsx-runtime";
function Listbox(props, ref) {
  const { Component, state, getBaseProps, color, disableAnimation, variant, itemClasses } = useListbox({ ...props, ref });
  return /* @__PURE__ */ jsx(Component, { ...getBaseProps(), children: [...state.collection].map((item) => {
    var _a;
    const itemProps = {
      color,
      disableAnimation,
      item,
      state,
      variant,
      ...item.props
    };
    if (item.type === "section") {
      return /* @__PURE__ */ jsx(listbox_section_default, { ...itemProps, itemClasses }, item.key);
    }
    let listboxItem = /* @__PURE__ */ jsx(
      listbox_item_default,
      {
        ...itemProps,
        classNames: mergeProps(itemClasses, (_a = item.props) == null ? void 0 : _a.classNames)
      },
      item.key
    );
    if (item.wrapper) {
      listboxItem = item.wrapper(listboxItem);
    }
    return listboxItem;
  }) });
}
Listbox.displayName = "NextUI.Listbox";
var listbox_default = forwardRef(Listbox);
Listbox.displayName = "NextUI.Listbox";

export {
  listbox_default
};
