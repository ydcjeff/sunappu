import { assertStrictEquals } from 'https://deno.land/std@0.121.0/testing/asserts.ts';
import * as path from 'https://deno.land/std@0.121.0/path/mod.ts';
import * as fs from 'https://deno.land/std@0.121.0/fs/mod.ts';

/**
 * Setup snapshot directory and file and dynamically import as ES Module.
 *
 * The imported module can have a number of named exports to compare.
 * If not, it will write the string version of `actual` to it.
 *
 * _**PLEASE REVIEW TO THE CHANGES CAREFULLY.**_
 *
 * @param file The current test file, it should always be `import.meta.url`.
 * @returns (actual, name) function
 * - `actual` should be the actual object to stringify.
 * - `name` to use as the named export in the snapshot module.
 *
 * ```ts
 * import { setupSnapshot } from 'https://deno.land/x/sunappu/mod.ts';
 *
 * const assertSnapshot = await setupSnapshot(import.meta.url);
 *
 * test('...', () => {
 *    assertSnapshot(actual, 'named export')
 *  })
 * ```
 */
export async function setupSnapshot(file: string) {
  file = path.fromFileUrl(path.normalize(file));
  file = path.join(
    path.dirname(file),
    '__snapshots__',
    path.basename(file) + '.txt',
  );
  await fs.ensureFile(file);
  const exported = await import(path.toFileUrl(file).href);

  return (actual: unknown, name: string) => {
    name = name.trim().replace(/([^a-zA-Z])/g, '_');
    const expected = exported[name];
    actual = typeof actual === 'string'
      ? actual
      : JSON.stringify(actual, null, 2);
    if (expected) {
      assertStrictEquals(actual, expected, 'Snapshot mismatched.');
    } else {
      const data = `export const ${name} = \`${actual}\`;\n\n`;
      Deno.writeTextFileSync(file, data, { append: true });
    }
  };
}
