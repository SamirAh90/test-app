import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dismissDisclosures } from './dismissDisclosures.js';

function navigation() {
  const summary = {};
  const link = {};
  const otherSummary = {};
  const header = {};
  const page = {};
  const practice = { open: true, contains: target => [summary, link].includes(target) };
  const learn = { open: false, contains: target => target === otherSummary };
  const root = { querySelectorAll: () => [practice, learn].filter(detail => detail.open) };
  return { root, practice, learn, summary, link, otherSummary, header, page };
}

test('Öva closes when clicking page content outside the header', () => {
  const nav = navigation();
  dismissDisclosures(nav.root, nav.page);
  assert.equal(nav.practice.open, false);
});

test('Öva also closes when clicking an unused area inside the header', () => {
  const nav = navigation();
  dismissDisclosures(nav.root, nav.header);
  assert.equal(nav.practice.open, false);
});

test('links inside Öva remain interactive until their own navigation handler runs', () => {
  const nav = navigation();
  dismissDisclosures(nav.root, nav.link);
  assert.equal(nav.practice.open, true);
});

test('switching to another menu closes the previous menu', () => {
  const nav = navigation();
  nav.learn.open = true;
  dismissDisclosures(nav.root, nav.otherSummary);
  assert.equal(nav.practice.open, false);
  assert.equal(nav.learn.open, true);
});

test('navigation closes every open disclosure', () => {
  const nav = navigation();
  nav.learn.open = true;
  dismissDisclosures(nav.root);
  assert.equal(nav.practice.open, false);
  assert.equal(nav.learn.open, false);
});
