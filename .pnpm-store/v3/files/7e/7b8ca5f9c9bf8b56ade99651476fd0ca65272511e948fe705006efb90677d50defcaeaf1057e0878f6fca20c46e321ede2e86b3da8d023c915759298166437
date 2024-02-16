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
  useDataScrollOverflow: () => useDataScrollOverflow
});
module.exports = __toCommonJS(src_exports);
var import_react = require("react");
function useDataScrollOverflow(props = {}) {
  const { domRef, isEnabled = true, overflowCheck = "vertical", offset = 0 } = props;
  (0, import_react.useEffect)(() => {
    const el = domRef == null ? void 0 : domRef.current;
    const checkOverflow = () => {
      if (!el)
        return;
      if (overflowCheck === "vertical" || overflowCheck === "both") {
        const hasElementsAbove = el.scrollTop > offset;
        const hasElementsBelow = el.scrollTop + el.clientHeight + offset < el.scrollHeight;
        if (hasElementsAbove && hasElementsBelow) {
          el.dataset.topBottomScroll = "true";
          el.removeAttribute("data-top-scroll");
          el.removeAttribute("data-bottom-scroll");
        } else {
          el.dataset.topScroll = hasElementsAbove.toString();
          el.dataset.bottomScroll = hasElementsBelow.toString();
          el.removeAttribute("data-top-bottom-scroll");
        }
      }
      if (overflowCheck === "horizontal" || overflowCheck === "both") {
        const hasElementsLeft = el.scrollLeft > offset;
        const hasElementsRight = el.scrollLeft + el.clientWidth + offset < el.scrollWidth;
        if (hasElementsLeft && hasElementsRight) {
          el.dataset.leftRightScroll = "true";
          el.removeAttribute("data-left-scroll");
          el.removeAttribute("data-right-scroll");
        } else {
          el.dataset.leftScroll = hasElementsLeft.toString();
          el.dataset.rightScroll = hasElementsRight.toString();
          el.removeAttribute("data-left-right-scroll");
        }
      }
    };
    const clearOverflow = () => {
      if (!el)
        return;
      el.removeAttribute("data-top-scroll");
      el.removeAttribute("data-bottom-scroll");
      el.removeAttribute("data-top-bottom-scroll");
      el.removeAttribute("data-left-scroll");
      el.removeAttribute("data-right-scroll");
      el.removeAttribute("data-left-right-scroll");
    };
    if (isEnabled) {
      checkOverflow();
      el == null ? void 0 : el.addEventListener("scroll", checkOverflow);
    } else {
      clearOverflow();
    }
    return () => {
      el == null ? void 0 : el.removeEventListener("scroll", checkOverflow);
      clearOverflow();
    };
  }, [isEnabled, overflowCheck, domRef]);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  useDataScrollOverflow
});
