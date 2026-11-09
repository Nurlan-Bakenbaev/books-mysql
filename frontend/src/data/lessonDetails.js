import { foundationDetails } from './lessonDetailsFoundations.js';
import { operationsDetails } from './lessonDetailsOperations.js';
import { securityDetails } from './lessonDetailsSecurity.js';
import { mergeDetails } from './enrichmentMerge.js';
import { roadmapEnrichmentB } from './lessonEnrichmentRoadmapB.js';
import { roadmapEnrichmentC } from './lessonEnrichmentRoadmapC.js';
import { trackDetails } from './trackContent.js';

const baseDetails = { ...foundationDetails, ...operationsDetails, ...securityDetails };

export const lessonDetails = {
  ...mergeDetails(baseDetails, [roadmapEnrichmentB, roadmapEnrichmentC]),
  ...trackDetails,
};
