import * as _nextui_org_theme from '@nextui-org/theme';
import { MenuVariantProps } from '@nextui-org/theme';
import * as react from 'react';
import * as _nextui_org_system from '@nextui-org/system';
import { HTMLNextUIProps, PropGetter } from '@nextui-org/system';
import { AriaMenuProps } from '@react-types/menu';
import { AriaMenuOptions } from '@react-aria/menu';
import { TreeState } from '@react-stately/tree';
import { ReactRef } from '@nextui-org/react-utils';
import { MenuItemProps } from './menu-item.js';
import './use-menu-item.js';
import './base/menu-item-base.js';
import '@react-types/shared';
import '@nextui-org/aria-utils';
import 'tailwind-variants';

interface Props<T> {
    /**
     * Ref to the DOM node.
     */
    ref?: ReactRef<HTMLElement | null>;
    /**
     * The controlled state of the menu.
     */
    state?: TreeState<T>;
    /**
     * The menu aria props.
     */
    menuProps?: AriaMenuOptions<T>;
    /**
     * The menu items variant.
     */
    variant?: MenuItemProps["variant"];
    /**
     * The menu items color.
     */
    color?: MenuItemProps["color"];
    /**
     * Whether to disable the items animation.
     * @default false
     */
    disableAnimation?: boolean;
    /**
     * Whether the menu should close when the menu item is selected.
     * @default true
     */
    closeOnSelect?: MenuItemProps["closeOnSelect"];
    /**
     * The menu items classNames.
     */
    itemClasses?: MenuItemProps["classNames"];
}
type UseMenuProps<T = object> = Props<T> & Omit<HTMLNextUIProps<"ul">, keyof AriaMenuProps<T>> & AriaMenuProps<T> & MenuVariantProps;
declare function useMenu(props: UseMenuProps): {
    Component: _nextui_org_system.As<any>;
    state: TreeState<object>;
    variant: "light" | "flat" | "shadow" | "solid" | "bordered" | "faded" | undefined;
    color: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
    disableAnimation: boolean | undefined;
    onAction: ((key: react.Key) => void) | undefined;
    onClose: (() => void) | undefined;
    closeOnSelect: boolean | undefined;
    className: string | undefined;
    itemClasses: _nextui_org_theme.SlotsToClasses<"base" | "title" | "description" | "wrapper" | "selectedIcon" | "shortcut"> | undefined;
    getMenuProps: PropGetter<Record<string, unknown>, _nextui_org_system.DOMAttributes<_nextui_org_system.DOMElement>>;
};
type UseMenuReturn = ReturnType<typeof useMenu>;

export { UseMenuProps, UseMenuReturn, useMenu };
