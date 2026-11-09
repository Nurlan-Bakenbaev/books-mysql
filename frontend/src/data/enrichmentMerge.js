// Объединяет базовые данные уроков с "обогащением" (глубокий разбор, пример кода, терминал,
// макет интерфейса, практические задания, расширенные шаги лабораторной и прохождения).
// Каждый enrichment-файл экспортирует объект { [topicId]: { deepDive, example, terminal, uiMockup,
// practiceTasks, labSteps, walkthroughSteps } }; отсутствующие поля просто не переопределяют базу.

export function mergeDetails(baseMap, enrichmentMaps) {
  const result = { ...baseMap };
  for (const enrichment of enrichmentMaps) {
    for (const [id, extra] of Object.entries(enrichment)) {
      if (!result[id]) continue;
      result[id] = {
        ...result[id],
        ...(extra.deepDive ? { deepDive: extra.deepDive } : {}),
        ...(extra.example ? { example: extra.example } : {}),
        ...(extra.terminal ? { terminal: extra.terminal } : {}),
        ...(extra.uiMockup ? { uiMockup: extra.uiMockup } : {}),
        ...(extra.practiceTasks ? { practiceTasks: extra.practiceTasks } : {}),
      };
    }
  }
  return result;
}

export function mergeLessonLabs(baseMap, enrichmentMaps) {
  const result = { ...baseMap };
  for (const enrichment of enrichmentMaps) {
    for (const [id, extra] of Object.entries(enrichment)) {
      if (!result[id]?.lab || !extra.labSteps?.length) continue;
      result[id] = { ...result[id], lab: { ...result[id].lab, steps: extra.labSteps } };
    }
  }
  return result;
}

export function mergeWalkthroughSteps(baseMap, enrichmentMaps) {
  const result = { ...baseMap };
  for (const enrichment of enrichmentMaps) {
    for (const [id, extra] of Object.entries(enrichment)) {
      if (!result[id] || !extra.walkthroughSteps?.length) continue;
      result[id] = { ...result[id], steps: extra.walkthroughSteps };
    }
  }
  return result;
}
