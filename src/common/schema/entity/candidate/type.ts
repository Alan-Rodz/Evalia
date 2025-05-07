import { Disqualification } from "../disqualification/type";
import { Job } from "../job/type";

// ********************************************************************************
export type QuestionAnswer = {
 answer: string;
 question: string;
};


export type Candidate = {
 created_at: string;
 educations: string[];
 experiences: string[];
 id: string;
 job_id: string;
 name: string;
 qa: QuestionAnswer[];
 skills: string[];
 source: string;
 stage: string;
 summary: string;
 tags: string[];
 type: string;
}

export type CandidateWithDisqualification = Candidate & {
 disqualification: Disqualification | null;
};

export type CandidateWithJob = Candidate & {
 job: Omit<Job, 'description'>;
};

export type FullCandidate = Candidate & CandidateWithDisqualification & CandidateWithJob;

export type ScoredCandidate = {
 highlights: string[];
 id: string;
 name: string;
 score: number;
}
