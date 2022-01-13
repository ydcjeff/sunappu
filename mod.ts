import { assertStrictEquals } from 'https://deno.land/std@0.121.0/testing/asserts.ts';
import * as path from 'https://deno.land/std@0.121.0/path/mod.ts';
import * as fs from 'https://deno.land/std@0.121.0/fs/mod.ts';

export async function setupSnapshot(file: string) {
  file = path.fromFileUrl(path.normalize(file));
  const fname = path.basename(file);
  file = path.join(path.dirname(file), '__snapshots__', fname + '.txt');
  await fs.ensureFile(file);
  const exported = await import(file);

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
