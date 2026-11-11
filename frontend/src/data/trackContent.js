import { networkEngineerLessons, networkEngineerDetails, networkEngineerWalkthroughs, networkEngineerResources, networkEngineerLessonResources } from './networkEngineer.js';
// Единая точка подключения материалов отдельных учебных треков.
// Базовые агрегаторы (lessons.js, lessonDetails.js, lessonWalkthroughs.js, resources.js) берут данные отсюда,
// поэтому для нового трека достаточно добавить его модули в этот файл.
import { azureLessonsA } from './azureAdminLessonsA.js';
import { azureDetailsA1, azureWalkthroughsA1 } from './azureAdminDetailsA1.js';
import { azureDetailsA2, azureWalkthroughsA2 } from './azureAdminDetailsA2.js';
import { azureResourcesA, azureLessonResourcesA } from './azureAdminResourcesA.js';
import { azureResourcesB, azureLessonResourcesB } from './azureAdminResourcesB.js';
import {
  azureCompletionDetails,
  azureCompletionLessonResources,
  azureCompletionLessons,
  azureCompletionWalkthroughs,
} from './azureAdminComplete.js';
import {
  securityTrackDetails,
  securityTrackLessonResources,
  securityTrackLessons,
  securityTrackResources,
  securityTrackWalkthroughs,
} from './securityTracks.js';
import {
  securityPlusDetails,
  securityPlusLessonResources,
  securityPlusLessons,
  securityPlusResources,
  securityPlusWalkthroughs,
} from './securityPlus.js';
import {
  computerTechnologiesDetails,
  computerTechnologiesLessonResources,
  computerTechnologiesLessons,
  computerTechnologiesResources,
  computerTechnologiesWalkthroughs,
} from './computerTechnologies.js';

export const trackLessons = { ...azureLessonsA, ...azureCompletionLessons, ...securityTrackLessons, ...securityPlusLessons, ...computerTechnologiesLessons, ...networkEngineerLessons };
export const trackDetails = { ...azureDetailsA1, ...azureDetailsA2, ...azureCompletionDetails, ...securityTrackDetails, ...securityPlusDetails, ...computerTechnologiesDetails, ...networkEngineerDetails };
export const trackWalkthroughs = { ...azureWalkthroughsA1, ...azureWalkthroughsA2, ...azureCompletionWalkthroughs, ...securityTrackWalkthroughs, ...securityPlusWalkthroughs, ...computerTechnologiesWalkthroughs, ...networkEngineerWalkthroughs };
export const trackResources = [...azureResourcesA, ...azureResourcesB, ...securityTrackResources, ...securityPlusResources, ...computerTechnologiesResources, ...networkEngineerResources];
export const trackLessonResources = { ...azureLessonResourcesA, ...azureLessonResourcesB, ...azureCompletionLessonResources, ...securityTrackLessonResources, ...securityPlusLessonResources, ...computerTechnologiesLessonResources, ...networkEngineerLessonResources };
