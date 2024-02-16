import * as react from 'react';
import * as _nextui_org_system from '@nextui-org/system';
import { PropGetter, HTMLNextUIProps } from '@nextui-org/system';
import { ScrollShadowVariantProps } from '@nextui-org/theme';
import { ReactRef } from '@nextui-org/react-utils';

interface Props extends HTMLNextUIProps<"div"> {
    /**
     * Ref to the DOM node.
     */
    ref?: ReactRef<HTMLElement | null>;
    /**
     * The shadow size in pixels.
     * @default 40
     */
    size?: number;
    /**
     * The scroll offset to show the shadow.
     * @default 0
     */
    offset?: number;
    /**
     * Whether the shadow is enabled.
     * @default true
     */
    isEnabled?: boolean;
}
type UseScrollShadowProps = Props & ScrollShadowVariantProps;
declare function useScrollShadow(originalProps: UseScrollShadowProps): {
    Component: _nextui_org_system.As<any>;
    styles: string;
    domRef: react.RefObject<HTMLElement>;
    children: react.ReactNode;
    getBaseProps: PropGetter<Record<string, unknown>, _nextui_org_system.DOMAttributes<_nextui_org_system.DOMElement>>;
};
type UseScrollShadowReturn = ReturnType<typeof useScrollShadow>;

export { UseScrollShadowProps, UseScrollShadowReturn, useScrollShadow };
