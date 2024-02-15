"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  cn: () => cn,
  extendVariants: () => extendVariants,
  forwardRef: () => forwardRef,
  mapPropsVariants: () => mapPropsVariants,
  mapPropsVariantsWithCommon: () => mapPropsVariantsWithCommon,
  toIterator: () => toIterator
});
module.exports = __toCommonJS(src_exports);

// src/utils.ts
var import_clsx = __toESM(require("clsx"));
var import_react = require("react");
function forwardRef(component) {
  return (0, import_react.forwardRef)(component);
}
var toIterator = (obj) => {
  return {
    ...obj,
    [Symbol.iterator]: function() {
      const keys = Object.keys(this);
      let index = 0;
      return {
        next: () => {
          if (index >= keys.length) {
            return { done: true };
          }
          const key = keys[index];
          const value = this[key];
          index++;
          return { value: { key, value }, done: false };
        }
      };
    }
  };
};
var mapPropsVariants = (props, variantKeys, removeVariantProps = true) => {
  if (!variantKeys) {
    return [props, {}];
  }
  const picked = variantKeys.reduce((acc, key) => {
    if (key in props) {
      return { ...acc, [key]: props[key] };
    } else {
      return acc;
    }
  }, {});
  if (removeVariantProps) {
    const omitted = Object.keys(props).filter((key) => !variantKeys.includes(key)).reduce((acc, key) => ({ ...acc, [key]: props[key] }), {});
    return [omitted, picked];
  } else {
    return [props, picked];
  }
};
var mapPropsVariantsWithCommon = (originalProps, variantKeys, commonKeys) => {
  const props = Object.keys(originalProps).filter((key) => !variantKeys.includes(key) || (commonKeys == null ? void 0 : commonKeys.includes(key))).reduce((acc, key) => ({ ...acc, [key]: originalProps[key] }), {});
  const variants = variantKeys.reduce(
    (acc, key) => ({ ...acc, [key]: originalProps[key] }),
    {}
  );
  return [props, variants];
};
var cn = import_clsx.default;

// src/extend-variants.js
var React = __toESM(require("react"));

// ../theme/src/utils/tv.ts
var import_tailwind_variants = require("tailwind-variants");

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
  return (0, import_tailwind_variants.tv)(options, {
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  cn,
  extendVariants,
  forwardRef,
  mapPropsVariants,
  mapPropsVariantsWithCommon,
  toIterator
});
