export const verbTypes = {
  ER: 'er',
  RE: 're',
  IR: 'ir',
}

const conjugationRules = {
  gerund: {
    type: 'ROOT',
    [verbTypes.ER]: {
      all: { ending: 'ant' },
    },
    [verbTypes.RE]: {
      all: { ending: 'ant' },
    },
    [verbTypes.IR]: {
      all: { ending: 'ant' },
    },
  },
  'past participle': {
    type: 'ROOT',
    [verbTypes.ER]: {
      all: { ending: 'é' },
    },
    [verbTypes.RE]: {
      all: { ending: 'u' },
    },
    [verbTypes.IR]: {
      all: { ending: 'i' },
    },
  },
  'indicative|present': {
    type: 'ROOT',
    [verbTypes.ER]: {
      1: { ending: 'e' },
      2: { ending: 'es' },
      3: { ending: 'e' },
      4: { ending: 'ons' },
      5: { ending: 'ez' },
      6: { ending: 'ent' },
    },
    [verbTypes.RE]: {
      1: { ending: 's' },
      2: { ending: 's' },
      3: { ending: '' },
      4: { ending: 'ons' },
      5: { ending: 'ez' },
      6: { ending: 'ent' },
    },
    [verbTypes.IR]: {
      1: { ending: 'is' },
      2: { ending: 'is' },
      3: { ending: 'it' },
      4: { ending: 'issons' },
      5: { ending: 'issez' },
      6: { ending: 'issent' },
    },
  },
  'indicative|imperfect': {
    type: 'ROOT',
    [verbTypes.ER]: {
      1: { ending: 'ais' },
      2: { ending: 'ais' },
      3: { ending: 'ait' },
      4: { ending: 'ions' },
      5: { ending: 'iez' },
      6: { ending: 'aient' },
    },
    [verbTypes.RE]: {
      1: { ending: 'ais' },
      2: { ending: 'ais' },
      3: { ending: 'ait' },
      4: { ending: 'ions' },
      5: { ending: 'iez' },
      6: { ending: 'aient' },
    },
    [verbTypes.IR]: {
      1: { ending: 'issais' },
      2: { ending: 'issais' },
      3: { ending: 'issait' },
      4: { ending: 'issions' },
      5: { ending: 'issiez' },
      6: { ending: 'issaient' },
    },
  },
  'indicative|future': {
    type: 'ROOT',
    [verbTypes.ER]: {
      1: { ending: 'erai' },
      2: { ending: 'eras' },
      3: { ending: 'era' },
      4: { ending: 'erons' },
      5: { ending: 'erez' },
      6: { ending: 'eront' },
    },
    [verbTypes.RE]: {
      1: { ending: 'rai' },
      2: { ending: 'ras' },
      3: { ending: 'ra' },
      4: { ending: 'rons' },
      5: { ending: 'rez' },
      6: { ending: 'ront' },
    },
    [verbTypes.IR]: {
      1: { ending: 'irai' },
      2: { ending: 'iras' },
      3: { ending: 'ira' },
      4: { ending: 'irons' },
      5: { ending: 'irez' },
      6: { ending: 'iront' },
    },
  },
  'indicative|conditional': {
    type: 'ROOT',
    [verbTypes.ER]: {
      1: { ending: 'erais' },
      2: { ending: 'erais' },
      3: { ending: 'erait' },
      4: { ending: 'erions' },
      5: { ending: 'eriez' },
      6: { ending: 'eraient' },
    },
    [verbTypes.RE]: {
      1: { ending: 'rais' },
      2: { ending: 'rais' },
      3: { ending: 'rait' },
      4: { ending: 'rions' },
      5: { ending: 'riez' },
      6: { ending: 'raient' },
    },
    [verbTypes.IR]: {
      1: { ending: 'irais' },
      2: { ending: 'irais' },
      3: { ending: 'irait' },
      4: { ending: 'irions' },
      5: { ending: 'iriez' },
      6: { ending: 'iraient' },
    },
  },
  'subjunctive|present': {
    type: 'ROOT',
    [verbTypes.ER]: {
      1: { ending: 'e' },
      2: { ending: 'es' },
      3: { ending: 'e' },
      4: { ending: 'ions' },
      5: { ending: 'iez' },
      6: { ending: 'ent' },
    },
    [verbTypes.RE]: {
      1: { ending: 'e' },
      2: { ending: 'es' },
      3: { ending: 'e' },
      4: { ending: 'ions' },
      5: { ending: 'iez' },
      6: { ending: 'ent' },
    },
    [verbTypes.IR]: {
      1: { ending: 'isse' },
      2: { ending: 'isses' },
      3: { ending: 'isse' },
      4: { ending: 'issions' },
      5: { ending: 'issiez' },
      6: { ending: 'issent' },
    },
  },
  imperative: {
    type: 'ROOT',
    [verbTypes.ER]: {
      1: { ending: 'TO_BE_FIXED' },
      2: { ending: 'e' },
      3: { ending: 'TO_BE_FIXED' },
      4: { ending: 'ons' },
      5: { ending: 'ez' },
      6: { ending: 'TO_BE_FIXED' },
    },
    [verbTypes.RE]: {
      1: { ending: 'TO_BE_FIXED' },
      2: { ending: 's' },
      3: { ending: 'TO_BE_FIXED' },
      4: { ending: 'ons' },
      5: { ending: 'ez' },
      6: { ending: 'TO_BE_FIXED' },
    },
    [verbTypes.IR]: {
      1: { ending: 'TO_BE_FIXED' },
      2: { ending: 'is' },
      4: { ending: 'issons' },
      3: { ending: 'TO_BE_FIXED' },
      5: { ending: 'issez' },
      6: { ending: 'TO_BE_FIXED' },
    },
  },
}

export default conjugationRules
