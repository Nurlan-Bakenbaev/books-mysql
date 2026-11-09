import { foundationDetails } from './lessonDetailsFoundations.js';
import { operationsDetails } from './lessonDetailsOperations.js';
import { securityDetails } from './lessonDetailsSecurity.js';

export const lessonDetails = { ...foundationDetails, ...operationsDetails, ...securityDetails };
