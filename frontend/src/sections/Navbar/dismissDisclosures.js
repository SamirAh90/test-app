// Keep clicks inside an open disclosure interactive; dismiss all other disclosures.
export function dismissDisclosures(root, target) {
  root?.querySelectorAll('details[open]').forEach(detail => {
    if (!target || !detail.contains(target)) detail.open = false;
  });
}
