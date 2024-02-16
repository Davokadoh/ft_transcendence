import * as react from 'react';
import { ReactNode } from 'react';

/**
 * Gets only the valid children of a component,
 * and ignores any nullish or falsy child.
 *
 * @param children the children
 */
declare function getValidChildren(children: React.ReactNode): react.ReactElement<any, string | react.JSXElementConstructor<any>>[];
declare const pickChildren: <T = ReactNode>(children: ReactNode | undefined, targetChild: React.ElementType) => [ReactNode | T, ReactNode[] | undefined];

export { getValidChildren, pickChildren };
