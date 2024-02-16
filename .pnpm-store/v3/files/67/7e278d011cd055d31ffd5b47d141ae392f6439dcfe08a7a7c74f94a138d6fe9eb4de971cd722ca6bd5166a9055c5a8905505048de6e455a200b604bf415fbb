interface UseDataScrollOverflowProps {
    /**
     * The reference to the DOM element on which we're checking overflow.
     */
    domRef?: React.RefObject<HTMLElement>;
    /**
     * Determines the direction of overflow to check.
     * - "horizontal" will check for overflow on the x-axis.
     * - "vertical" will check for overflow on the y-axis.
     * - "both" (default) will check for overflow on both axes.
     *
     * @default "both"
     */
    overflowCheck?: "horizontal" | "vertical" | "both";
    /**
     * Enables or disables the overflow checking mechanism.
     * @default true
     */
    isEnabled?: boolean;
    /**
     * Defines a buffer or margin within which we won't treat the scroll as reaching the edge.
     *
     * @default 0 - meaning the check will behave exactly at the edge.
     */
    offset?: number;
}
declare function useDataScrollOverflow(props?: UseDataScrollOverflowProps): void;
type UseDataScrollOverflowReturn = ReturnType<typeof useDataScrollOverflow>;

export { UseDataScrollOverflowProps, UseDataScrollOverflowReturn, useDataScrollOverflow };
