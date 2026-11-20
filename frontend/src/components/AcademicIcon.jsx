const paths = {
  material: 'M3 4h6a3 3 0 0 1 3 3v14a4 4 0 0 0-4-2H3V4Zm18 0h-6a3 3 0 0 0-3 3v14a4 4 0 0 1 4-2h5V4Z',
  glossary: 'M5 3h14v18H5V3Zm3 5h8M8 12h8M8 16h4',
  tips: 'm4 6 8-3 8 3-8 3-8-3Zm3 2v5c3 2 7 2 10 0V8M20 6v9M6 20h12',
  free: 'M8 3h8v3H8V3Zm-2 2H4v16h16V5h-2M8 13l3 3 5-6',
  subjects: 'M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z',
  smart: 'M4 19V5M4 19h16M8 15l4-5 4 2 4-7',
  simulator: 'M9 2h6M12 2v3M18 6l2-2M12 9v5l3 2M20 14a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z',
  format: 'M5 3h10l4 4v14H5V3Zm10 0v5h4M8 12h8M8 16h6',
  dates: 'M4 5h16v16H4V5ZM8 3v4M16 3v4M4 10h16M8 14h2M14 14h2M8 17h2',
  faq: 'M9 9a3 3 0 1 1 5 2c-1 1-2 1-2 3M12 17h.01M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  path: 'M5 20h4v-5h5v-5h5V4M15 4h4v4',
  requirements: 'M9 3h6v4H9V3ZM7 5H4v16h16V5h-3M8 12h8M8 16h6',
  application: 'M12 4H4v16h16v-8M9 15l1-4L18 3l3 3-8 8-4 1Z',
  language: 'M2 12h20M12 2c5 5 5 15 0 20-5-5-5-15 0-20ZM22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0Z',
  account: 'M4 21v-2a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v2M16 6a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'm6 6 12 12M6 18 18 6',
};

export default function AcademicIcon({ name, className = '' }) {
  return <svg className={`academic-icon ${className}`} width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false"><path d={paths[name] || paths.material} /></svg>;
}
