import { foundationWalkthroughs } from './lessonWalkthroughsFoundations.js';
import { operationsWalkthroughs } from './lessonWalkthroughsOperations.js';
import { windowsWalkthroughs } from './lessonWalkthroughsWindows.js';
import { mergeWalkthroughSteps } from './enrichmentMerge.js';
import { roadmapEnrichmentB } from './lessonEnrichmentRoadmapB.js';
import { roadmapEnrichmentC } from './lessonEnrichmentRoadmapC.js';
import { trackWalkthroughs } from './trackContent.js';

const baseWalkthroughs = {
  ...foundationWalkthroughs,
  ...operationsWalkthroughs,
  ...windowsWalkthroughs,
};

export const lessonWalkthroughs = {
  ...mergeWalkthroughSteps(baseWalkthroughs, [roadmapEnrichmentB, roadmapEnrichmentC]),
  ...trackWalkthroughs,
};
