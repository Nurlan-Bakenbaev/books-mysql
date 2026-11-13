import { coreById } from '../src/data/coreCurriculum.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import { allTopics } from '../src/data/catalog.js';
import { lessonVideos } from '../src/data/lessonVideos.js';
import { securityPlusLessonResources } from '../src/data/securityPlus.js';
import { russianLessonVideos, videoUrls } from '../src/data/russianLessonVideos.js';
import { russianVideoSchema, russianVideosSchema } from '../src/lib/videoSchema.js';
import { computerTechnologiesCourse } from '../src/data/computerTechnologies.js';

test('Russian alternatives have explicit lesson associations and sourced media IDs', () => {
  assert.equal(russianVideosSchema.safeParse(russianLessonVideos).success, true);
  const ids = new Set(allTopics.map((topic) => topic.id));
  for (const [id, media] of Object.entries(russianLessonVideos)) {
    assert.ok(ids.has(id), id);
    assert.ok(lessonVideos[id], `${id}: English original is preserved`);
    assert.ok(media.focus, `${id}: explain the alternative's scope`);
    assert.notEqual(videoUrls(media).embed, videoUrls(lessonVideos[id]).embed, id);
  }
  for (const topic of allTopics) {
    if (lessonVideos[topic.id] || coreById[topic.id]) continue;
    if (computerTechnologiesCourse.topics.some((item) => item.id === topic.id)) continue;
    assert.equal(topic.id, 'secplus-exam-orientation');
    assert.ok(securityPlusLessonResources[topic.id].some((resource) => resource.sourceId === 'sp-messer'));
  }
});

test('Fundamental Computer Science uses the supplied Russian videos as curated primary media', () => {
  for (const topic of computerTechnologiesCourse.topics) {
    assert.equal(lessonVideos[topic.id].language, 'ru', topic.id);
    assert.equal(new URL(lessonVideos[topic.id].source).protocol, 'https:', topic.id);
    assert.equal(russianLessonVideos[topic.id], undefined, topic.id);
  }
});

test('media URLs distinguish individual videos from playlists without autoplay', () => {
  assert.deepEqual(videoUrls({ id: 'I18TNwZ2Nqg' }), {
    embed: 'https://www.youtube-nocookie.com/embed/I18TNwZ2Nqg?rel=0',
    watch: 'https://www.youtube.com/watch?v=I18TNwZ2Nqg',
  });
  const urls = videoUrls(russianLessonVideos['linux-basics']);
  assert.equal(new URL(urls.embed).pathname, '/embed/videoseries');
  assert.equal(new URL(urls.embed).searchParams.get('list'), russianLessonVideos['linux-basics'].playlistId);
  assert.equal(new URL(urls.embed).searchParams.has('autoplay'), false);
  assert.equal(new URL(urls.watch).pathname, '/playlist');
});

test('video validation rejects invented formats, insecure sources and ambiguous players', () => {
  const sample = russianLessonVideos['devops-basics'];
  for (const invalid of [
    { ...sample, id: 'invalid' },
    { ...sample, source: 'http://example.com' },
    { ...sample, playlistId: russianLessonVideos['linux-basics'].playlistId },
    { ...sample, id: undefined },
    { ...sample, focus: '' },
  ]) assert.equal(russianVideoSchema.safeParse(invalid).success, false);
});
