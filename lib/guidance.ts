import type { Key } from './questions';

export type Scores = Record<Key, number>;

const tips: Record<Key, string[]> = {
  V: [
    'Use diagrams, examples, and visual structure when introducing ideas.',
    'Highlight patterns, key points, and relationships visually.',
    'Let the student see a worked example before practising independently.'
  ],
  A: [
    'Talk through important ideas and give the student time to discuss them.',
    'Ask the student to explain their thinking aloud when appropriate.',
    'Use short verbal explanations and check understanding through discussion.'
  ],
  R: [
    'Give clear written steps, keywords, and short summaries.',
    'Let the student use notes, lists, and written examples to organise ideas.',
    'Encourage the student to write or rewrite key ideas in their own words.'
  ],
  K: [
    'Include practice, interaction, or a chance to apply the idea.',
    'Move from an example to doing: let the student try the process themselves.',
    'Use practical or problem-solving tasks where they fit naturally.'
  ]
};

const avoid: Record<Key, string[]> = {
  V: ['Avoid relying only on long verbal explanations.', 'Avoid presenting new ideas without examples or structure.'],
  A: ['Avoid relying only on silent reading or written instructions.', 'Avoid giving lengthy explanations without checking understanding.'],
  R: ['Avoid giving important instructions only verbally.', 'Avoid presenting too much information without clear written structure.'],
  K: ['Avoid keeping learning entirely passive for long periods.', 'Avoid giving a process without allowing time to practise it.']
};

const names: Record<Key, string> = { V: 'Visual', A: 'Aural', R: 'Read / Write', K: 'Kinesthetic' };

export function getStudentGuidance(scores: Scores) {
  const ranked = (Object.keys(scores) as Key[]).sort((a, b) => scores[b] - scores[a]);
  const top = ranked[0];
  const second = ranked[1];
  const gap = scores[top] - scores[second];
  const selected = gap >= 20 ? [top] : [top, second];
  const recommendations = selected.flatMap(k => tips[k]).slice(0, 3);
  const thingsToAvoid = selected.flatMap(k => avoid[k]).slice(0, 2);
  return { top: names[top], recommendations, thingsToAvoid };
}

export function getClassGuidance(scores: Scores) {
  const ranked = (Object.keys(scores) as Key[]).sort((a, b) => scores[b] - scores[a]);
  const top = ranked.slice(0, 2);
  const recommendations = top.flatMap(k => tips[k]).slice(0, 3);
  return { preferences: top.map(k => `${names[k]} ${scores[k]}%`), recommendations };
}
