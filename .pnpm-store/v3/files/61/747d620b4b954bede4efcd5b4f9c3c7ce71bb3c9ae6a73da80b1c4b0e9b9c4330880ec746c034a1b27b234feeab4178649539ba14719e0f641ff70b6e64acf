import { ModalProviderProps } from '@react-aria/overlays';
import { I18nProviderProps } from '@react-aria/i18n';
import '@nextui-org/system-rsc';

interface NextUIProviderProps extends Omit<ModalProviderProps, "children"> {
    children: React.ReactNode;
    /**
     * The locale to apply to the children.
     * @default "en-US"
     */
    locale?: I18nProviderProps["locale"];
}
declare const NextUIProvider: React.FC<NextUIProviderProps>;

export { NextUIProvider, NextUIProviderProps };
