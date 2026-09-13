import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();

function read(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

describe('content review MVP contract', () => {
  it('exposes an opt-in key on the reusable text atoms', () => {
    expect(read('src/components/ui/atoms/Heading.astro')).toContain('contentKey?: string');
    expect(read('src/components/ui/atoms/Text.astro')).toContain('contentKey?: string');
    expect(read('src/components/ui/atoms/Button.astro')).toContain('contentKey?: string');
    expect(read('src/components/ui/atoms/Heading.astro')).toContain("data-content-key");
    expect(read('src/components/ui/atoms/Text.astro')).toContain("data-content-key");
    expect(read('src/components/ui/atoms/Button.astro')).toContain("data-review-mirror-key");
  });

  it('ships the editor script and gates activation in the browser', () => {
    const layout = read('src/layouts/Layout.astro');
    const editor = read('public/js/content-review.js');
    expect(layout).toContain('/js/content-review.js');
    expect(editor).toContain("get('edit') === '1'");
    expect(editor).toContain("searchParams.set('edit', '1')");
    expect(editor).toContain("searchParams.delete('edit')");
    expect(editor).toContain('contenteditable');
    expect(editor).not.toContain('Zapisz tekst');
  });

  it('keeps the local fixture outside the production scope', () => {
    const fixture = read('src/pages/qa/content-review.astro');
    const siteConfig = read('site.config.mjs');
    expect(fixture).toContain('noIndex={true}');
    expect(siteConfig).toContain("'qa'");
  });

  it('keeps draft persistence and retry behavior in the editor', () => {
    const editor = read('public/js/content-review.js');
    const styles = read('src/styles/content-review.css');
    expect(editor).toContain('localStorage');
    expect(editor).toContain('last-submission');
    expect(editor).toContain('Zmiany nadal są zapisane lokalnie.');
    expect(editor).toContain('data-review-toggle');
    expect(styles).not.toContain('outline: 1px dashed');
  });

  it('supports full button targeting and reversible local edits', () => {
    const editor = read('public/js/content-review.js');
    const styles = read('src/styles/content-review.css');

    expect(editor).toContain("event.target.closest('.ui-button')");
    expect(editor).toContain("createActionButton('undo'");
    expect(editor).toContain("createActionButton('restore'");
    expect(editor).toContain('state.history');
    expect(editor).toContain('Przywrócono oryginalną treść.');
    expect(editor).toContain('ph-pencil');
    expect(editor).toContain('ph-copy');
    expect(styles).toContain('.content-review-edit-indicator');
    expect(styles).toContain('.content-review-action');
  });
});
