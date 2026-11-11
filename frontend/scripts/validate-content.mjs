import { curriculum } from './content-data.mjs';
import { curriculumSchema } from '../src/lib/contentSchema.js';
import { russianLessonVideos } from '../src/data/russianLessonVideos.js';
import { russianVideosSchema } from '../src/lib/videoSchema.js';

const result = curriculumSchema.safeParse(curriculum);
if (!result.success) {
  for (const issue of result.error.issues) console.error(`${issue.path.join('.')}: ${issue.message}`);
  process.exitCode = 1;
} else {
  console.log(`Content valid: ${curriculum.topics.length} lessons, ${curriculum.resources.length} sources, ${curriculum.exam.length} exam questions.`);
}

const videos = russianVideosSchema.safeParse(russianLessonVideos);
if (!videos.success) {
  for (const issue of videos.error.issues) console.error(`videos.${issue.path.join('.')}: ${issue.message}`);
  process.exitCode = 1;
}
for (const id of Object.keys(russianLessonVideos)) {
  if (!curriculum.topics.some((topic) => topic.id === id)) {
    console.error(`videos.${id}: неизвестный урок`);
    process.exitCode = 1;
  }
}
