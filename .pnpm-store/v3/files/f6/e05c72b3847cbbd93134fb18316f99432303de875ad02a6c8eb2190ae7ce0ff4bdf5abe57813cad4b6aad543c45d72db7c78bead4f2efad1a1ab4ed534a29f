import {
  colorVariants
} from "./chunk-2PIR7DFM.mjs";
import {
  tv
} from "./chunk-6AEINX52.mjs";
import {
  dataFocusVisibleClasses
} from "./chunk-T7JNS25F.mjs";

// src/components/popover.ts
var popover = tv({
  slots: {
    base: [
      "z-10",
      "relative",
      "inline-flex",
      "flex-col",
      "items-center",
      "justify-center",
      "box-border",
      "subpixel-antialiased",
      "px-4",
      "py-1",
      "outline-none",
      "box-border",
      ...dataFocusVisibleClasses
    ],
    trigger: ["z-10"],
    backdrop: ["hidden"],
    arrow: [
      "z-[-1]",
      "absolute",
      "rotate-45",
      "w-2.5",
      "h-2.5",
      "rounded-sm",
      "data-[placement=top]:-bottom-1",
      "data-[placement=top]:-translate-x-1/2",
      "data-[placement=top-start]:-bottom-1",
      "data-[placement=top-start]:-translate-x-8",
      "data-[placement=top-end]:-bottom-1",
      "data-[placement=top-end]:translate-x-6",
      "data-[placement=bottom]:-top-1",
      "data-[placement=bottom]:-translate-x-1/2",
      "data-[placement=bottom-start]:-top-1",
      "data-[placement=bottom-start]:-translate-x-8",
      "data-[placement=bottom-end]:-top-1",
      "data-[placement=bottom-end]:translate-x-6",
      "data-[placement=left]:-right-1",
      "data-[placement=left]:-translate-y-1/2",
      "data-[placement=left-start]:-right-1",
      "data-[placement=left-start]:-translate-y-3",
      "data-[placement=left-end]:-right-1",
      "data-[placement=left-end]:translate-y-0.5",
      "data-[placement=right]:-left-1",
      "data-[placement=right]:-translate-y-1/2",
      "data-[placement=right-start]:-left-1",
      "data-[placement=right-start]:-translate-y-3",
      "data-[placement=right-end]:-left-1",
      "data-[placement=right-end]:translate-y-0.5"
    ]
  },
  variants: {
    size: {
      sm: { base: "text-tiny" },
      md: { base: "text-small" },
      lg: { base: "text-medium" }
    },
    color: {
      default: {
        base: "bg-content1",
        arrow: "shadow-small bg-content1"
      },
      foreground: {
        base: colorVariants.solid.foreground,
        arrow: "bg-foreground"
      },
      primary: {
        base: colorVariants.solid.primary,
        arrow: "bg-primary"
      },
      secondary: {
        base: colorVariants.solid.secondary,
        arrow: "bg-secondary"
      },
      success: {
        base: colorVariants.solid.success,
        arrow: "bg-success"
      },
      warning: {
        base: colorVariants.solid.warning,
        arrow: "bg-warning"
      },
      danger: {
        base: colorVariants.solid.danger,
        arrow: "bg-danger"
      }
    },
    radius: {
      none: { base: "rounded-none" },
      sm: { base: "rounded-small" },
      md: { base: "rounded-medium" },
      lg: { base: "rounded-large" },
      full: { base: "rounded-full" }
    },
    shadow: {
      sm: {
        base: "shadow-small"
      },
      md: {
        base: "shadow-medium"
      },
      lg: {
        base: "shadow-large"
      }
    },
    backdrop: {
      transparent: {},
      opaque: {
        backdrop: "bg-overlay/50 backdrop-opacity-disabled"
      },
      blur: {
        backdrop: "backdrop-blur-sm backdrop-saturate-150 bg-overlay/30"
      }
    },
    triggerScaleOnOpen: {
      true: {
        trigger: ["aria-expanded:scale-[0.97]", "aria-expanded:opacity-70", "subpixel-antialiased"]
      },
      false: {}
    },
    disableAnimation: {
      true: {
        base: "animate-none"
      }
    }
  },
  defaultVariants: {
    color: "default",
    radius: "lg",
    size: "md",
    shadow: "md",
    backdrop: "transparent",
    disableAnimation: false,
    triggerScaleOnOpen: true
  },
  compoundVariants: [
    {
      backdrop: ["opaque", "blur"],
      class: {
        backdrop: "block w-full h-full fixed inset-0 -z-30"
      }
    }
  ]
});

export {
  popover
};
