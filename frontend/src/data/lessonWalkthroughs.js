import { foundationWalkthroughs } from './lessonWalkthroughsFoundations.js';
import { operationsWalkthroughs } from './lessonWalkthroughsOperations.js';
import { windowsWalkthroughs } from './lessonWalkthroughsWindows.js';

export const lessonWalkthroughs = {
  ...foundationWalkthroughs,
  ...operationsWalkthroughs,
  ...windowsWalkthroughs,
};
