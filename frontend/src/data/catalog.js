import { orderCourses } from './courseOrder.js';
import { networkEngineerCourse } from './networkEngineer.js';
import { phases } from './guide.js';
import { windowsSecurityCourse } from './windowsSecurity.js';
import { azureAdminCourse } from './azureAdmin.js';
import { ethicalHackingCourse, linuxSecurityCourse } from './securityTracks.js';
import { securityPlusCourse } from './securityPlus.js';
import { computerTechnologiesCourse } from './computerTechnologies.js';

export const courseCatalog = orderCourses([
  { id: 'roadmap', title: 'Путь системного администратора', topics: phases.flatMap((phase) => phase.topics) },
  computerTechnologiesCourse, windowsSecurityCourse, azureAdminCourse,
  linuxSecurityCourse, ethicalHackingCourse, securityPlusCourse, networkEngineerCourse,
]);
export const allTopics = courseCatalog.flatMap((course) => course.topics);
export const topicById = new Map(allTopics.map((topic) => [topic.id, topic]));
