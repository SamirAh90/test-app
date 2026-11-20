export function navigationLocation(pathname) {
  const pages = {
    '/studiematerial': ['learn', 'material'],
    '/begrepp': ['learn', 'glossary'],
    '/studietips': ['learn', 'tips'],
    '/trainer': ['practice', 'subjects'],
    '/trainer/demo': ['practice', 'free'],
    '/min-traning/smart-training': ['practice', 'smart'],
    '/min-traning/simulator': ['practice', 'simulator'],
    '/om-provet': ['exam', 'format'],
    '/provdatum': ['exam', 'dates'],
    '/vanliga-fragor': ['exam', 'faq'],
    '/medborgarskap': ['citizenship', 'path'],
    '/medborgarskap/krav': ['citizenship', 'requirements'],
    '/medborgarskap/ansokan': ['citizenship', 'application'],
  };
  const exact = pages[pathname.replace(/\/$/, '')];
  if (exact) return { group: exact[0], item: exact[1] };
  if (pathname.startsWith('/amnen/')) return { group: 'learn', item: pathname.endsWith('/begrepp') ? 'glossary' : 'material', subject: true };
  if (pathname.startsWith('/trainer/') || pathname.startsWith('/min-traning/')) return { group: 'practice', item: 'subjects' };
  return null;
}
