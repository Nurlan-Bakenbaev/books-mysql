import { curriculum } from './content-data.mjs';
import { curriculumSchema } from '../src/lib/contentSchema.js';

const result = curriculumSchema.safeParse(curriculum);
if (!result.success) {
  for (const issue of result.error.issues) console.error(`${issue.path.join('.')}: ${issue.message}`);
  process.exitCode = 1;
} else {
  console.log(`Content valid: ${curriculum.topics.length} lessons, ${curriculum.resources.length} sources, ${curriculum.exam.length} exam questions.`);
}
