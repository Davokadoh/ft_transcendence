"use client";
import {
  useInput
} from "./chunk-JECUHD2P.mjs";

// src/textarea.tsx
import { forwardRef } from "@nextui-org/system";
import { mergeProps } from "@react-aria/utils";
import TextareaAutosize from "react-textarea-autosize";
import { jsx, jsxs } from "react/jsx-runtime";
var Textarea = forwardRef(
  ({ style, minRows = 3, maxRows = 8, cacheMeasurements = false, onHeightChange, ...otherProps }, ref) => {
    const {
      Component,
      label,
      description,
      shouldLabelBeOutside,
      shouldLabelBeInside,
      errorMessage,
      getBaseProps,
      getLabelProps,
      getInputProps,
      getInputWrapperProps,
      getHelperWrapperProps,
      getDescriptionProps,
      getErrorMessageProps
    } = useInput({ ...otherProps, ref, isMultiline: true });
    const labelContent = /* @__PURE__ */ jsx("label", { ...getLabelProps(), children: label });
    const inputProps = getInputProps();
    return /* @__PURE__ */ jsxs(Component, { ...getBaseProps(), children: [
      shouldLabelBeOutside ? labelContent : null,
      /* @__PURE__ */ jsxs("div", { ...getInputWrapperProps(), children: [
        shouldLabelBeInside ? labelContent : null,
        /* @__PURE__ */ jsx(
          TextareaAutosize,
          {
            ...inputProps,
            cacheMeasurements,
            maxRows,
            minRows,
            style: mergeProps(inputProps.style, style != null ? style : {}),
            onHeightChange
          }
        )
      ] }),
      /* @__PURE__ */ jsx("div", { ...getHelperWrapperProps(), children: errorMessage ? /* @__PURE__ */ jsx("div", { ...getErrorMessageProps(), children: errorMessage }) : description ? /* @__PURE__ */ jsx("div", { ...getDescriptionProps(), children: description }) : null })
    ] });
  }
);
Textarea.displayName = "NextUI.Textarea";
var textarea_default = Textarea;

export {
  textarea_default
};
