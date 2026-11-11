import { terms, labs } from '../src/data/guide.js';
import { allTopics } from '../src/data/catalog.js';
import { lessons } from '../src/data/lessons.js';
import { lessonDetails } from '../src/data/lessonDetails.js';
import { lessonWalkthroughs } from '../src/data/lessonWalkthroughs.js';
import { resources, lessonResources } from '../src/data/resources.js';
import { securityPlusExam } from '../src/data/securityPlusExam.js';
export const curriculum = {
  topics: allTopics, terms, labs, lessons, details: lessonDetails, walkthroughs: lessonWalkthroughs,
  resources, references: lessonResources, exam: securityPlusExam,
};
