import test from 'node:test';
import assert from 'node:assert/strict';
import { coreLessons, corePhases } from '../src/data/coreCurriculum.js';
import { allTopics, courseCatalog } from '../src/data/catalog.js';
import { phases } from '../src/data/guide.js';
import { azureAdminPhases } from '../src/data/azureAdmin.js';
import { securityPlusPhases, securityPlusCourse } from '../src/data/securityPlus.js';
import { linuxSecurityPhases, ethicalHackingPhases } from '../src/data/securityTracks.js';
import { computerTechnologiesPhases } from '../src/data/computerTechnologies.js';
import { networkEngineerPhases } from '../src/data/networkEngineer.js';
import { securityVideoTopics, securityObjectives } from '../src/data/securityVideoTopics.js';
import { moduleQuestions } from '../src/data/moduleAssessments.js';
import { lessonExercises } from '../src/data/lessonExercises.js';
import { ASSESSMENT_KEY, PROGRESS_KEY, LEARNING_KEY, importStudy, exportStudy, readAssessment, fingerprint } from '../src/lib/studyProgress.js';
const storage=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};};
test('31 main lessons follow 3/5/6/6/4/4/3 blocks with three distinct fault scenarios',()=>{
 assert.deepEqual(corePhases.map(p=>p.topics.length),[3,5,6,6,4,4,3]);
 assert.equal(new Set(coreLessons.map(l=>l.id)).size,31);
 for(const l of coreLessons){assert.ok(allTopics.some(t=>t.id===l.id));assert.ok(l.business.length>100,l.id);assert.ok(l.theory.length>=2);assert.ok(l.theory.every(t=>t.length>100),l.id);assert.equal(l.problems.length,3);assert.equal(new Set(l.problems.map(p=>p[0])).size,3);assert.ok(l.problems.every(p=>p[1].length>80),l.id);assert.ok(l.commands.length>200);assert.ok(l.tasks.length>=2&&l.tasks.length<=3);assert.ok(l.sources.length>=2);}
});
test('121 video topics have unique IDs, notes, 29 objectives and one existing owner each',()=>{
 assert.equal(securityVideoTopics.length,121);assert.equal(new Set(securityVideoTopics.map(v=>v.id)).size,121);assert.equal(securityObjectives.length,29);assert.ok(securityObjectives.includes('4.9'));
 assert.equal(new Set(securityVideoTopics.map(v=>v.note)).size,121);
 for(const v of securityVideoTopics){assert.match(v.id,/^[\w-]{11}$/);assert.ok(v.note&&v.rule&&v.example);assert.ok(securityPlusCourse.topics.some(t=>t.id===v.lessonId));}
 assert.ok(securityPlusCourse.topics.every(t=>securityVideoTopics.some(v=>v.lessonId===t.id)));
});
test('each published module has ten unique questions with valid permuted answers',()=>{
 const modules=[...phases,...azureAdminPhases,...securityPlusPhases,...linuxSecurityPhases,...ethicalHackingPhases,...computerTechnologiesPhases,...networkEngineerPhases];
 for(const m of modules){const q=moduleQuestions(m.topics);assert.equal(q.length,10,m.id);assert.equal(new Set(q.map(x=>x.question)).size,10,m.id);for(const x of q){assert.ok(x.answer>=0&&x.answer<x.options.length);assert.ok(x.options[x.answer]);assert.equal(new Set(x.options).size,x.options.length);}}
 assert.equal(moduleQuestions(securityPlusPhases[0].topics)[1].options[moduleQuestions(securityPlusPhases[0].topics)[1].answer],'Разобрать механизм и выполнить лабораторию');
});
test('every lesson has seven written exercises in addition to its automatic question',()=>{for(const t of allTopics){const e=lessonExercises(t.id);assert.equal(e.length,7);assert.equal(new Set(e.map(x=>x.title)).size,7);assert.ok(e.every(x=>x.task&&x.criteria),t.id);}});
test('question fingerprint changes reset drafts while preserving attempts',()=>{
 const s=storage(),attempt={title:'Test',date:'2026-11-12T10:00:00Z',score:1,total:2};
 s.setItem(ASSESSMENT_KEY,JSON.stringify({test:{fingerprint:fingerprint([{question:'old',options:['a'],answer:0}]),answers:{0:0},attempts:[attempt]}}));
 assert.deepEqual(readAssessment('test',[{question:'new',options:['b'],answer:0}],s),{answers:{},attempts:[attempt]});
});
test('import merges unknown IDs and history without discarding current data',()=>{
 const s=storage();s.setItem(PROGRESS_KEY,JSON.stringify(['future-id']));s.setItem(LEARNING_KEY,JSON.stringify({course:'roadmap'}));
 const attempt={title:'Test',date:'2026-11-12T10:00:00Z',score:1,total:2};
 const data={version:1,progress:['network-models'],learning:{course:'security-plus'},assessments:{test:{attempts:[attempt]}}};importStudy(data,s);importStudy(data,s);
 assert.deepEqual(exportStudy(s).progress,['future-id','network-models']);assert.equal(exportStudy(s).learning.course,'roadmap');assert.equal(exportStudy(s).assessments.test.attempts.length,1);
});
test('invalid attempt ranges and dates are rejected before any writes',()=>{
 for(const bad of [{score:3,total:2,date:'2026-11-12'},{score:1,total:2,date:'not-a-date'}]){const s=storage();s.setItem(PROGRESS_KEY,'["future-id"]');assert.throws(()=>importStudy({version:1,progress:['new'],learning:{},assessments:{a:{attempts:[{title:'Test',...bad}]}}},s));assert.equal(s.getItem(PROGRESS_KEY),'["future-id"]');}
});
test('a partial storage write failure restores prior values and reports failure',()=>{
 const s=storage();s.setItem(PROGRESS_KEY,'["future-id"]');s.setItem(LEARNING_KEY,'{"course":"roadmap"}');const before=exportStudy(s);const set=s.setItem;let n=0;s.setItem=(k,v)=>{if(++n===2)throw Error('quota');set(k,v);};
 assert.throws(()=>importStudy({version:1,progress:['new'],learning:{},assessments:{}},s),/не удалось/);assert.deepEqual(exportStudy(s),before);
});
test('course order is consistent with the agreed prerequisite sequence',()=>{assert.deepEqual(courseCatalog.map(c=>c.id),['computer-technologies','roadmap','network-engineer','azure-admin','security-plus','windows-security','linux-security','ethical-hacking']);});

test('all core procedures and lab step checks cover the published objects',async()=>{
 const {coreProcedures}=await import('../src/data/coreProcedures.js');const {labs}=await import('../src/data/guide.js');const {labStepChecks}=await import('../src/data/labStepChecks.js');
 assert.deepEqual(Object.keys(coreProcedures).sort(),coreLessons.map(l=>l.id).sort());
 for(const l of coreLessons)assert.ok(coreProcedures[l.id].length>=4,l.id);
 for(const lab of labs){assert.equal(labStepChecks[lab.id].length,lab.steps.length,lab.id);for(const check of labStepChecks[lab.id])assert.ok(check.expected&&check.verify&&check.diagnosis);}
});
test('import rejects malformed learning positions without overwriting data',()=>{const s=storage();s.setItem(PROGRESS_KEY,'["future-id"]');assert.throws(()=>importStudy({version:1,progress:['new'],learning:{positions:{'network-models':-100}},assessments:{}},s));assert.equal(s.getItem(PROGRESS_KEY),'["future-id"]');});
