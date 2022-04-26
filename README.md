> # Deno now has https://deno.land/std/testing/snapshot.ts

# Sunappu (スナップ)

[![ci](https://github.com/ydcjeff/sunappu/actions/workflows/ci.yml/badge.svg)](https://github.com/ydcjeff/sunappu/actions/workflows/ci.yml)
[![deno module](https://shield.deno.dev/x/sunappu)](https://deno.land/x/sunappu)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https://deno.land/x/sunappu/mod.ts)

> Simple Snapshot Assertion in Deno using `JSON.stringify`

## Usage

Snapshot files are saved as ES Modules with named exports in the `__snapshots__`
directory.

This module needs `--allow-read` and `--allow-write` runtime flag of Deno.

For snapshot updating, delete the snapshot file and regenerate it for now.

```ts
// import from deno.land/x
import { setupSnapshot } from 'https://deno.land/x/sunappu@<version>/mod.ts';

// setup Snapshot file to write/read
// argument should be always `import.meta.url`.
const assertSnapshot = await setupSnapshot(import.meta.url);

Deno.test('...', () => {
  const actual = ...

  // call the function for snapshot assertion
  // the second argument is used as the named export in the snapshot file
  assertSnapshot(actual, 'test something')
})
```

## LICENSE

[MIT](./LICENSE)
