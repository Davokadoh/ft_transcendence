// src/index.ts
import { useEffect } from "react";
function useDataScrollOverflow(props = {}) {
  const { domRef, isEnabled = true, overflowCheck = "vertical", offset = 0 } = props;
  useEffect(() => {
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
export {
  useDataScrollOverflow
};
