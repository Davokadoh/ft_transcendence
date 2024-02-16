# Installation
> `npm install --save @types/flat`

# Summary
This package contains type definitions for flat (https://github.com/hughsk/flat).

# Details
Files were exported from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/flat.
## [index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/flat/index.d.ts)
````ts
declare var flatten: FlatTypes.Flatten;

export = flatten;

declare namespace FlatTypes {
    interface FlattenOptions {
        delimiter?: string | undefined;
        safe?: boolean | undefined;
        maxDepth?: number | undefined;
        transformKey?: ((key: string) => string) | undefined;
    }

    interface Flatten {
        <TTarget, TResult>(
            target: TTarget,
            options?: FlattenOptions,
        ): TResult;

        flatten: Flatten;
        unflatten: Unflatten;
    }

    interface UnflattenOptions {
        delimiter?: string | undefined;
        object?: boolean | undefined;
        overwrite?: boolean | undefined;
        transformKey?: ((key: string) => string) | undefined;
    }

    interface Unflatten {
        <TTarget, TResult>(
            target: TTarget,
            options?: UnflattenOptions,
        ): TResult;
    }
}

````

### Additional Details
 * Last updated: Wed, 18 Oct 2023 01:17:34 GMT
 * Dependencies: none

# Credits
These definitions were written by [ Ilya Mochalov](https://github.com/chrootsu), and [Oz Weiss](https://github.com/thewizarodofoz).
