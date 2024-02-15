import {
  cn,
  mapPropsVariants
} from "./chunk-SF6SJHAM.mjs";

// src/extend-variants.js
import * as React from "react";

// ../theme/src/utils/tv.ts
import { tv as tvBase } from "tailwind-variants";

// ../theme/src/types.ts
var spacingScaleKeys = [
  "0",
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "2xl",
  "3xl",
  "4xl",
  "5xl",
  "6xl",
  "7xl",
  "8xl",
  "9xl",
  "1",
  "2",
  "3",
  "3.5",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "20",
  "24",
  "28",
  "32",
  "36",
  "40",
  "44",
  "48",
  "52",
  "56",
  "60",
  "64",
  "72",
  "80",
  "96"
];
var mappedSpacingScaleKeys = spacingScaleKeys.map((key) => `unit-${key}`);

// ../theme/src/utils/tv.ts
var COMMON_UNITS = ["small", "medium", "large"];
var tv = (options, config) => {
  var _a, _b, _c;
  return tvBase(options, {
    ...config,
    twMerge: (_a = config == null ? void 0 : config.twMerge) != null ? _a : true,
    twMergeConfig: {
      ...config == null ? void 0 : config.twMergeConfig,
      theme: {
        ...(_b = config == null ? void 0 : config.twMergeConfig) == null ? void 0 : _b.theme,
        opacity: ["disabled"],
        spacing: ["divider", "unit", ...mappedSpacingScaleKeys],
        borderWidth: COMMON_UNITS,
        borderRadius: COMMON_UNITS
      },
      classGroups: {
        ...(_c = config == null ? void 0 : config.twMergeConfig) == null ? void 0 : _c.classGroups,
        shadow: [{ shadow: COMMON_UNITS }],
        "font-size": [{ text: ["tiny", ...COMMON_UNITS] }],
        "bg-image": ["bg-stripe-gradient"],
        "min-w": [
          {
            "min-w": ["unit", ...mappedSpacingScaleKeys]
          }
        ],
        "min-h": [
          {
            "min-h": ["unit", ...mappedSpacingScaleKeys]
          }
        ]
      }
    }
  });
};

// src/extend-variants.js
function getSlots(variants) {
  return variants ? Object.values(variants).flatMap(Object.values).reduce((acc, slot) => {
    if (typeof slot === "object" && slot !== null && !(slot instanceof String)) {
      Object.keys(slot).forEach((key) => {
        if (!acc.hasOwnProperty(key)) {
          acc[key] = "";
        }
      });
    }
    return acc;
  }, {}) : {};
}
function extendVariants(BaseComponent, styles = {}, opts = {}) {
  var _a, _b;
  const { variants, defaultVariants, compoundVariants } = styles || {};
  const slots = getSlots(variants);
  const hasSlots = typeof slots === "object" && Object.keys(slots).length !== 0;
  const customTv = tv(
    {
      variants,
      defaultVariants,
      compoundVariants,
      ...hasSlots && { slots }
    },
    {
      twMerge: (_a = opts.twMerge) != null ? _a : true,
      twMergeConfig: (_b = opts.twMergeConfig) != null ? _b : {}
    }
  );
  const ForwardedComponent = React.forwardRef((originalProps, ref) => {
    var _a2;
    const [baseProps, variantProps] = mapPropsVariants(originalProps, customTv.variantKeys, false);
    const newProps = { ...defaultVariants, ...baseProps, ref };
    let classNames = {};
    const result = React.useMemo(() => customTv(variantProps), [...Object.values(variantProps)]);
    if (!hasSlots) {
      newProps.className = cn(result, originalProps.className);
    } else {
      Object.entries(result).forEach(([key, value]) => {
        const slotResult = value();
        if (typeof slotResult === "string") {
          classNames[key] = slotResult;
        }
      });
      Object.entries((_a2 = originalProps.classNames) != null ? _a2 : {}).forEach(([key, value]) => {
        classNames[key] = cn(classNames[key], value);
      });
    }
    if (Object.keys(classNames).length !== 0) {
      newProps.classNames = classNames;
    }
    return React.createElement(BaseComponent, newProps);
  });
  ForwardedComponent.displayName = `Extended(${BaseComponent.displayName || BaseComponent.name})`;
  return ForwardedComponent;
}

export {
  extendVariants
};
