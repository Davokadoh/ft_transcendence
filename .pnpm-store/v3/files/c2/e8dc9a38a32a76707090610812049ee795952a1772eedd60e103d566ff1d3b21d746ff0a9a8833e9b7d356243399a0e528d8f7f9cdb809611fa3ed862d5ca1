import * as tailwind_variants from 'tailwind-variants';
import * as _nextui_org_system from '@nextui-org/system';
import { PropGetter, HTMLNextUIProps } from '@nextui-org/system';
import { PaginationVariantProps, SlotsToClasses, PaginationSlots } from '@nextui-org/theme';
import { Ref, ReactNode } from 'react';
import { PaginationItemValue, UsePaginationProps as UsePaginationProps$1 } from '@nextui-org/use-pagination';

type PaginationItemRenderProps = {
    /**
     * The pagination item ref.
     */
    ref?: Ref<any>;
    /**
     * The pagination item value.
     */
    value: PaginationItemValue;
    /**
     * The pagination item index.
     */
    index: number;
    /**
     * The active page number.
     */
    activePage: number;
    /**
     * Whether the pagination item is active.
     */
    isActive: boolean;
    /**
     * Whether the pagination item is the first item in the pagination.
     */
    isFirst: boolean;
    /**
     * Whether the pagination item is the last item in the pagination.
     */
    isLast: boolean;
    /**
     * Whether the pagination item is the next item in the pagination.
     */
    isNext: boolean;
    /**
     * Whether the pagination item is the previous item in the pagination.
     */
    isPrevious: boolean;
    /**
     * The pagination item className.
     */
    className: string;
    /**
     * Callback to go to the next page.
     */
    onNext: () => void;
    /**
     * Callback to go to the previous page.
     */
    onPrevious: () => void;
    /**
     * Callback to go to the page.
     */
    setPage: (page: number) => void;
};
interface Props extends Omit<HTMLNextUIProps<"nav">, "onChange"> {
    /**
     * Ref to the DOM node.
     */
    ref?: Ref<HTMLElement>;
    /**
     * Number of pages that are added or subtracted on the '...' button.
     * @default 5
     */
    dotsJump?: number;
    /**
     * Non disable next/previous controls
     * @default false
     */
    loop?: boolean;
    /**
     * Whether the pagination should display controls (left/right arrows).
     * @default true
     */
    showControls?: boolean;
    /**
     * Render a custom pagination item.
     * @param props Pagination item props
     * @returns ReactNode
     */
    renderItem?: (props: PaginationItemRenderProps) => ReactNode;
    /**
     * Function to get the aria-label of the item. If not provided, pagination will use the default one.
     */
    getItemAriaLabel?: (page?: string) => string;
    /**
     * Classname or List of classes to change the classNames of the element.
     * if `className` is passed, it will be added to the base slot.
     *
     * @example
     * ```ts
     * <Pagination classNames={{
     *    base:"base-classes",
     *    prev: "prev-classes", // prev button classes
     *    item: "item-classes",
     *    next: "next-classes", // next button classes
     *    cursor: "cursor-classes", // this is the one that moves when an item is selected
     *    forwardIcon: "forward-icon-classes", // forward icon
     *    ellipsis: "ellipsis-classes", // ellipsis icon
     *    chevronNext: "chevron-next-classes", // chevron next icon
     * }} />
     * ```
     */
    classNames?: SlotsToClasses<PaginationSlots>;
}
type UsePaginationProps = Props & UsePaginationProps$1 & PaginationVariantProps;
declare const CURSOR_TRANSITION_TIMEOUT = 300;
declare function usePagination(originalProps: UsePaginationProps): {
    Component: _nextui_org_system.As<any>;
    showControls: boolean;
    dotsJump: number;
    slots: {
        base: (slotProps?: ({
            color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
            variant?: "bordered" | "light" | "flat" | "faded" | undefined;
            size?: "sm" | "md" | "lg" | undefined;
            radius?: "sm" | "md" | "lg" | "none" | "full" | undefined;
            isCompact?: boolean | undefined;
            isDisabled?: boolean | undefined;
            showShadow?: boolean | undefined;
            disableCursorAnimation?: boolean | undefined;
            disableAnimation?: boolean | undefined;
        } & tailwind_variants.ClassProp<tailwind_variants.ClassValue>) | undefined) => string;
        prev: (slotProps?: ({
            color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
            variant?: "bordered" | "light" | "flat" | "faded" | undefined;
            size?: "sm" | "md" | "lg" | undefined;
            radius?: "sm" | "md" | "lg" | "none" | "full" | undefined;
            isCompact?: boolean | undefined;
            isDisabled?: boolean | undefined;
            showShadow?: boolean | undefined;
            disableCursorAnimation?: boolean | undefined;
            disableAnimation?: boolean | undefined;
        } & tailwind_variants.ClassProp<tailwind_variants.ClassValue>) | undefined) => string;
        next: (slotProps?: ({
            color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
            variant?: "bordered" | "light" | "flat" | "faded" | undefined;
            size?: "sm" | "md" | "lg" | undefined;
            radius?: "sm" | "md" | "lg" | "none" | "full" | undefined;
            isCompact?: boolean | undefined;
            isDisabled?: boolean | undefined;
            showShadow?: boolean | undefined;
            disableCursorAnimation?: boolean | undefined;
            disableAnimation?: boolean | undefined;
        } & tailwind_variants.ClassProp<tailwind_variants.ClassValue>) | undefined) => string;
        forwardIcon: (slotProps?: ({
            color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
            variant?: "bordered" | "light" | "flat" | "faded" | undefined;
            size?: "sm" | "md" | "lg" | undefined;
            radius?: "sm" | "md" | "lg" | "none" | "full" | undefined;
            isCompact?: boolean | undefined;
            isDisabled?: boolean | undefined;
            showShadow?: boolean | undefined;
            disableCursorAnimation?: boolean | undefined;
            disableAnimation?: boolean | undefined;
        } & tailwind_variants.ClassProp<tailwind_variants.ClassValue>) | undefined) => string;
        ellipsis: (slotProps?: ({
            color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
            variant?: "bordered" | "light" | "flat" | "faded" | undefined;
            size?: "sm" | "md" | "lg" | undefined;
            radius?: "sm" | "md" | "lg" | "none" | "full" | undefined;
            isCompact?: boolean | undefined;
            isDisabled?: boolean | undefined;
            showShadow?: boolean | undefined;
            disableCursorAnimation?: boolean | undefined;
            disableAnimation?: boolean | undefined;
        } & tailwind_variants.ClassProp<tailwind_variants.ClassValue>) | undefined) => string;
        chevronNext: (slotProps?: ({
            color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
            variant?: "bordered" | "light" | "flat" | "faded" | undefined;
            size?: "sm" | "md" | "lg" | undefined;
            radius?: "sm" | "md" | "lg" | "none" | "full" | undefined;
            isCompact?: boolean | undefined;
            isDisabled?: boolean | undefined;
            showShadow?: boolean | undefined;
            disableCursorAnimation?: boolean | undefined;
            disableAnimation?: boolean | undefined;
        } & tailwind_variants.ClassProp<tailwind_variants.ClassValue>) | undefined) => string;
        wrapper: (slotProps?: ({
            color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
            variant?: "bordered" | "light" | "flat" | "faded" | undefined;
            size?: "sm" | "md" | "lg" | undefined;
            radius?: "sm" | "md" | "lg" | "none" | "full" | undefined;
            isCompact?: boolean | undefined;
            isDisabled?: boolean | undefined;
            showShadow?: boolean | undefined;
            disableCursorAnimation?: boolean | undefined;
            disableAnimation?: boolean | undefined;
        } & tailwind_variants.ClassProp<tailwind_variants.ClassValue>) | undefined) => string;
        item: (slotProps?: ({
            color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
            variant?: "bordered" | "light" | "flat" | "faded" | undefined;
            size?: "sm" | "md" | "lg" | undefined;
            radius?: "sm" | "md" | "lg" | "none" | "full" | undefined;
            isCompact?: boolean | undefined;
            isDisabled?: boolean | undefined;
            showShadow?: boolean | undefined;
            disableCursorAnimation?: boolean | undefined;
            disableAnimation?: boolean | undefined;
        } & tailwind_variants.ClassProp<tailwind_variants.ClassValue>) | undefined) => string;
        cursor: (slotProps?: ({
            color?: "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined;
            variant?: "bordered" | "light" | "flat" | "faded" | undefined;
            size?: "sm" | "md" | "lg" | undefined;
            radius?: "sm" | "md" | "lg" | "none" | "full" | undefined;
            isCompact?: boolean | undefined;
            isDisabled?: boolean | undefined;
            showShadow?: boolean | undefined;
            disableCursorAnimation?: boolean | undefined;
            disableAnimation?: boolean | undefined;
        } & tailwind_variants.ClassProp<tailwind_variants.ClassValue>) | undefined) => string;
    };
    classNames: SlotsToClasses<"base" | "prev" | "next" | "forwardIcon" | "ellipsis" | "chevronNext" | "wrapper" | "item" | "cursor"> | undefined;
    loop: boolean;
    total: number;
    range: PaginationItemValue[];
    activePage: number;
    getItemRef: (node: HTMLElement | null, value: number) => void;
    disableCursorAnimation: boolean | undefined;
    disableAnimation: boolean | undefined;
    setPage: (pageNumber: number) => void;
    onPrevious: () => void;
    onNext: () => void;
    renderItem: ((props: PaginationItemRenderProps) => ReactNode) | undefined;
    getBaseProps: PropGetter<Record<string, unknown>, _nextui_org_system.DOMAttributes<_nextui_org_system.DOMElement>>;
    getWrapperProps: PropGetter<Record<string, unknown>, _nextui_org_system.DOMAttributes<_nextui_org_system.DOMElement>>;
    getItemProps: PropGetter<Record<string, unknown>, _nextui_org_system.DOMAttributes<_nextui_org_system.DOMElement>>;
    getCursorProps: PropGetter<Record<string, unknown>, _nextui_org_system.DOMAttributes<_nextui_org_system.DOMElement>>;
    getItemAriaLabel: (page?: string) => string | undefined;
};
type UsePaginationReturn = ReturnType<typeof usePagination>;

export { CURSOR_TRANSITION_TIMEOUT, PaginationItemRenderProps, UsePaginationProps, UsePaginationReturn, usePagination };
