import { createHighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

const languages = {
  bash: () => import('shiki/langs/bash.mjs'),
  powershell: () => import('shiki/langs/powershell.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
  json: () => import('shiki/langs/json.mjs'),
};
let highlighter;
const loading = new Map();
async function engine(language) {
  highlighter ||= createHighlighterCore({
    themes: [import('shiki/themes/github-dark-default.mjs')],
    langs: [], engine: createJavaScriptRegexEngine(),
  });
  const instance = await highlighter;
  if (languages[language] && !instance.getLoadedLanguages().includes(language)) {
    if (!loading.has(language)) loading.set(language, instance.loadLanguage(languages[language]()));
    await loading.get(language);
  }
  return instance;
}

export function codeLanguage(label, code) {
  if (/KQL|SQL\b|XML/i.test(label)) return 'text';
  if (/POWERSHELL/i.test(label) || /^(?:Get|Set|Import|Connect|New|Select|Write|Install)-[A-Za-z]/m.test(code)) return 'powershell';
  if (/<<['"]?\w+/.test(code)) return 'bash';
  if (/PYTHON/i.test(label)) return 'python';
  if (/YAML/i.test(label)) return 'yaml';
  if (/JSON/i.test(label)) return 'json';
  return 'bash';
}

export async function highlightCode(code, label) {
  const language = codeLanguage(label, code);
  const instance = await engine(language);
  const tokens = instance.codeToTokens(code, { lang: language, theme: 'github-dark-default' }).tokens;
  // Shell examples often contain real Python/YAML/JSON inside a heredoc.
  // Tokenize its body with the matching grammar without changing the source.
  if (language === 'bash') {
    const lines = code.split('\n');
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(/<<\s*['"]?(PY|PYTHON|YAML|JSON)['"]?\s*$/);
      if (!match) continue;
      const end = lines.indexOf(match[1], i + 1);
      if (end < 0) continue;
      const embeddedLanguage = { PY: 'python', PYTHON: 'python', YAML: 'yaml', JSON: 'json' }[match[1]];
      await engine(embeddedLanguage);
      const body = lines.slice(i + 1, end).join('\n');
      const embedded = instance.codeToTokens(body, { lang: embeddedLanguage, theme: 'github-dark-default' }).tokens;
      for (let line = i + 1; line < end; line++) tokens[line] = embedded[line - i - 1];
      i = end;
    }
  }
  return tokens;
}
