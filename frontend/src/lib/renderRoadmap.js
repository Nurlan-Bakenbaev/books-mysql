let renderer;
let sequence = 0;

export async function renderRoadmap(source) {
  if (!renderer) {
    renderer = import('mermaid').then(({ default: mermaid }) => {
      mermaid.initialize({ startOnLoad: false, securityLevel: 'loose', suppressErrorRendering: true });
      return mermaid;
    });
  }
  const mermaid = await renderer;
  return mermaid.render(`sysadmin-roadmap-${++sequence}`, source);
}
