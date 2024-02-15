import * as _nextui_org_theme from '@nextui-org/theme';
import { ListboxVariantProps } from '@nextui-org/theme';
import * as _nextui_org_system from '@nextui-org/system';
import { PropGetter, HTMLNextUIProps } from '@nextui-org/system';
import { KeyboardDelegate } from '@react-types/shared';
import { AriaListBoxProps } from '@react-aria/listbox';
import { ListState } from '@react-stately/list';
import { ReactRef } from '@nextui-org/react-utils';
import { ListboxItemProps } from './listbox-item.js';
import './use-listbox-item.js';
import './base/listbox-item-base.js';
import '@nextui-org/aria-utils';
import 'react';
import 'tailwind-variants';

interface AriaListBoxOptions<T> extends AriaListBoxProps<T> {
    /** Whether the listbox uses virtual scrolling. */
    isVirtualized?: boolean;
    /**
     * An optional keyboard delegate implementation for type to select,
     * to override the default.
     */
    keyboardDelegate?: KeyboardDelegate;
    /**
     * Whether the listbox items should use virtual focus instead of being focused directly.
     */
    shouldUseVirtualFocus?: boolean;
    /** Whether selection should occur on press up instead of press down. */
    shouldSelectOnPressUp?: boolean;
    /** Whether options should be focused when the user hovers over them. */
    shouldFocusOnHover?: boolean;
}
interface Props<T> extends Omit<HTMLNextUIProps<"ul">, "children"> {
    /**
     * Ref to the DOM node.
     */
    ref?: ReactRef<HTMLElement | null>;
    /**
     * The controlled state of the listbox.
     */
    state?: ListState<T>;
    /**
     * The listbox items variant.
     */
    variant?: ListboxItemProps["variant"];
    /**
     * The listbox items color.
     */
    color?: ListboxItemProps["color"];
    /**
     * Whether to disable the items animation.
     * @default false
     */
    disableAnimation?: boolean;
    /**
     * The menu items classNames.
     */
    itemClasses?: ListboxItemProps["classNames"];
}
type UseListboxProps<T = object> = Props<T> & AriaListBoxOptions<T> & ListboxVariantProps;
declare function useListbox<T extends object>(props: UseListboxProps<T>): {
    Component: _nextui_org_system.As<any>;
    state: ListState<T>;
    variant: "solid" | "bordered" | "light" | "faded" | "flat" | "shadow" | undefined;
    color: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
    disableAnimation: boolean | undefined;
    className: string | undefined;
    itemClasses: _nextui_org_theme.SlotsToClasses<"base" | "title" | "description" | "wrapper" | "selectedIcon" | "shortcut"> | undefined;
    getBaseProps: PropGetter<Record<string, unknown>, _nextui_org_system.DOMAttributes<_nextui_org_system.DOMElement>>;
};
type UseListboxReturn = ReturnType<typeof useListbox>;

export { UseListboxProps, UseListboxReturn, useListbox };
