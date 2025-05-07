import { parse } from 'csv-parse/sync';
import fs from 'fs';

import { FullCandidate } from '@/common/schema/entity/candidate/type';
import { isBlankString } from '@/common/util/string';

// ********************************************************************************
// == Constant ====================================================================
const CLEANUP_HTML_REGEX = /<[^>]*>/g;
const CLEANUP_SPECIAL_CHARACTERS_REGEX = /[^a-zA-Z0-9 ]/g;
const REMOVE_COMMAS_REGEX = /,/g;
const SPLIT_CHARACTER = '|';

// ================================================================================
export const readCandidateDb = (): FullCandidate[] => {
 console.debug('Preprocessing data...');

 const usedPath = process.env.NODE_ENV === 'production' ? `${process.cwd()}/public/db.csv` : 'public/db.csv';
 const raw = fs.readFileSync(usedPath, 'utf8');
 const records: string[][] = parse(raw, { columns: false/*no named columns*/, skip_empty_lines: true });

 const candidates: FullCandidate[] = [];
 for (let i = 1 /* skip header */; i < records.length; i++) {
  const row = records[i];
  const [name, job_title, job_department, job_location, headline, creation_time, stage, tags, source, type, summary, keywords, educations, experiences, skills, disqualified, disqualified_at, disqualification_category, disqualification_reason, disqualification_note, q1, a1, q2, a2, q3, a3, q4, a4, q5, a5, q6, a6, q7, a7] = row;

  const candidate: FullCandidate = {
   created_at: creation_time,
   disqualification: disqualified === 'Yes'
    ? {
     created_at: disqualified_at,
     category: disqualification_category,
     reason: disqualification_reason,
     note: disqualification_note,
    }
    : null,
   educations: educations.split(SPLIT_CHARACTER).map((e) => normalize(e)).filter((e) => !isBlankString(e)),
   experiences: experiences.split(SPLIT_CHARACTER).map((e) => normalize(e)).filter((e) => !isBlankString(e)),
   id: normalize(name),
   job: {
    department: normalize(job_department),
    headline: normalize(headline),
    id: normalize(job_title),
    keywords: keywords.split(SPLIT_CHARACTER).map((k) => normalize(k)),
    location: normalize(job_location),
   },
   job_id: normalize(job_title),
   qa: [
    { question: normalize(q1), answer: normalize(a1) },
    { question: normalize(q2), answer: normalize(a2) },
    { question: normalize(q3), answer: normalize(a3) },
    { question: normalize(q4), answer: normalize(a4) },
    { question: normalize(q5), answer: normalize(a5) },
    { question: normalize(q6), answer: normalize(a6) },
    { question: normalize(q7), answer: normalize(a7) },
   ],
   skills: skills.split(SPLIT_CHARACTER).map((s) => normalize(s)),
   stage: normalize(stage),
   summary: normalize(summary),
   source: normalize(source),
   tags: tags.split(SPLIT_CHARACTER).map((t) => normalize(t)),
   type: normalize(type),
  };

  candidates.push(candidate);
 }
 console.debug(`Preprocessed ${candidates.length} records.`);

 const deduped = deduplicate(candidates);
 console.debug(`Deduplicated ${candidates.length - deduped.length} records.`);
 return deduped;
};

// == Util ========================================================================
const normalizeArr = (arr: any[]) => [...arr].sort().map((x) => JSON.stringify(x));

const getCandidateKey = (candidate: FullCandidate) => {
 const key = `${candidate.job_id}-${candidate.job.department}-${candidate.job.location}`;
 const qaKey = normalizeArr(candidate.qa.map(q => `${q.question}:${q.answer}`)).join('|');
 const eduKey = normalizeArr(candidate.educations).join('|');
 const expKey = normalizeArr(candidate.experiences).join('|');
 const skillKey = normalizeArr(candidate.skills).join('|');

 return `${key}|${qaKey}|${eduKey}|${expKey}|${skillKey}`;
};

const deduplicate = (candidates: FullCandidate[]): FullCandidate[] => {
 const seen = new Set<string>();
 const unique: FullCandidate[] = [];

 for (const candidate of candidates) {
  const key = getCandidateKey(candidate);
  if (!seen.has(key)) {
   seen.add(key);
   unique.push(candidate);
  } /* else -- already seen */
 }

 return unique;
};

const normalize = (str: string) => {
 const normalized = str
  .toLowerCase()
  .trim()
  .replace(CLEANUP_HTML_REGEX, '')
  .replace(CLEANUP_SPECIAL_CHARACTERS_REGEX, '')
  .replace(REMOVE_COMMAS_REGEX, '');

 return normalized;
};
