// Единая точка подключения материалов отдельных учебных треков (пока — AZ-104).
// Базовые агрегаторы (lessons.js, lessonDetails.js, lessonWalkthroughs.js, resources.js) берут данные отсюда,
// поэтому для нового трека достаточно добавить его модули в этот файл.
import { azureLessonsA } from './azureAdminLessonsA.js';
import { azureDetailsA1, azureWalkthroughsA1 } from './azureAdminDetailsA1.js';
import { azureDetailsA2, azureWalkthroughsA2 } from './azureAdminDetailsA2.js';
import { azureResourcesA, azureLessonResourcesA } from './azureAdminResourcesA.js';
import { azureResourcesB, azureLessonResourcesB } from './azureAdminResourcesB.js';

export const trackLessons = { ...azureLessonsA };
export const trackDetails = { ...azureDetailsA1, ...azureDetailsA2 };
export const trackWalkthroughs = { ...azureWalkthroughsA1, ...azureWalkthroughsA2 };
export const trackResources = [...azureResourcesA, ...azureResourcesB];
export const trackLessonResources = { ...azureLessonResourcesA, ...azureLessonResourcesB };
