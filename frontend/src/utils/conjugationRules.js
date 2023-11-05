export const partsOfSpeech = {
  intj: 'interjection',
  pron: 'pronoun',
  adv: 'adverb',
  noun: 'noun',
  verb: 'verb',
  adj: 'adjective',
  num: 'number',
  prep: 'preposition',
  conj: 'conjunction',
  article: 'article',
  other: 'other',
  NOT_A_WORD: '',
  det: 'determiner'
}

export const verbTypes = {
  IR: 'ir',
  AR: 'ar',
  ER: 'er'
}

export const genders = {
  masculine: 'masculine',
  feminine: 'feminine'
}

export const tenseLabels = {
  'indicative future': 'future indicative',
  'subjunctive imperfect': 'imperfect subjunctive',
  'indicative present': 'present indicative',
  conditional: 'conditional',
  imperative: 'imperative',
  'subjunctive present': 'present subjunctive',
  'indicative preterite': 'preterite',
  'past participle': 'past participle',
  'indicative imperfect': 'imperfect',
  gerund: 'gerund'
}

export const personLabels = {
  1: 'I',
  2: 'you',
  3: 'he/she/it',
  4: 'we',
  5: 'you (plural)',
  6: 'they',
  7: 'usted',
  '1,3': 'I/he/she/it'
}

const conjugationRules = {
  Imperativo: {
    type: 'ROOT',
    [verbTypes.AR]: {
      2: { ending: 'a' },
      3: { ending: 'e' },
      4: { ending: 'emos' },
      5: { ending: 'ad' },
      6: { ending: 'en' }
    },
    [verbTypes.ER]: {
      2: { ending: 'e' },
      3: { ending: 'a' },
      4: { ending: 'amos' },
      5: { ending: 'ed' },
      6: { ending: 'an' }
    },
    [verbTypes.IR]: {
      2: { ending: 'e' },
      3: { ending: 'a' },
      4: { ending: 'amos' },
      5: { ending: 'id' },
      6: { ending: 'an' }
    }
  },
  PresenteIndicativo: {
    type: 'ROOT',
    [verbTypes.AR]: {
      1: { ending: 'o' },
      2: { ending: 'as' },
      3: { ending: 'a' },
      4: { ending: 'amos' },
      5: { ending: 'áis' },
      6: { ending: 'an' }
    },
    [verbTypes.ER]: {
      1: { ending: 'o' },
      2: { ending: 'es' },
      3: { ending: 'e' },
      4: { ending: 'emos' },
      5: { ending: 'éis' },
      6: { ending: 'en' }
    },
    [verbTypes.IR]: {
      1: { ending: 'o' },
      2: { ending: 'es' },
      3: { ending: 'e' },
      4: { ending: 'emos' },
      5: { ending: 'éis' },
      6: { ending: 'en' }
    }
  },
  FuturoIndicativo: {
    type: 'WHOLE_WORD',
    all: {
      1: { ending: 'é' },
      2: { ending: 'ás' },
      3: { ending: 'á' },
      4: { ending: 'emos' },
      5: { ending: 'éis' },
      6: { ending: 'án' }
    }
  },
  PastParticiple: {
    type: 'ROOT',
    [verbTypes.AR]: {
      all: { ending: 'ado' }
    },
    [verbTypes.ER]: {
      all: { ending: 'ido' }
    },
    [verbTypes.IR]: {
      all: { ending: 'ido' }
    }
  },
  CondicionalIndicativo: {
    type: 'WHOLE_WORD',
    all: {
      1: { ending: 'ía' },
      2: { ending: 'ías' },
      3: { ending: 'ía' },
      4: { ending: 'íamos' },
      5: { ending: 'íais' },
      6: { ending: 'ían' }
    }
  },
  Gerundio: {
    type: 'ROOT',
    [verbTypes.AR]: {
      all: { ending: 'ando' }
    },
    [verbTypes.ER]: {
      all: { ending: 'iendo' }
    },
    [verbTypes.IR]: {
      all: { ending: 'iendo' }
    }
  },
  PresenteSubjuntivo: {
    type: 'ROOT',
    [verbTypes.AR]: {
      1: { ending: 'e' },
      2: { ending: 'es' },
      3: { ending: 'e' },
      4: { ending: 'emos' },
      5: { ending: 'éis' },
      6: { ending: 'en' }
    },
    [verbTypes.ER]: {
      1: { ending: 'a' },
      2: { ending: 'as' },
      3: { ending: 'a' },
      4: { ending: 'amos' },
      5: { ending: 'áis' },
      6: { ending: 'an' }
    },
    [verbTypes.IR]: {
      1: { ending: 'a' },
      2: { ending: 'as' },
      3: { ending: 'a' },
      4: { ending: 'amos' },
      5: { ending: 'áis' },
      6: { ending: 'an' }
    }
  },
  PretéritoImperfectoIndicativo: {
    type: 'ROOT',
    [verbTypes.AR]: {
      1: { ending: 'aba' },
      2: { ending: 'abas' },
      3: { ending: 'aba' },
      4: { ending: 'ábamos' },
      5: { ending: 'abais' },
      6: { ending: 'aban' }
    },
    [verbTypes.ER]: {
      1: { ending: 'ía' },
      2: { ending: 'ías' },
      3: { ending: 'ía' },
      4: { ending: 'íamos' },
      5: { ending: 'íais' },
      6: { ending: 'ían' }
    },
    [verbTypes.IR]: {
      1: { ending: 'ía' },
      2: { ending: 'ías' },
      3: { ending: 'ía' },
      4: { ending: 'íamos' },
      5: { ending: 'íais' },
      6: { ending: 'ían' }
    }
  },
  PretéritoPerfectoSimpleIndicativo: {
    type: 'ROOT',
    [verbTypes.AR]: {
      1: { ending: 'é' },
      2: { ending: 'aste' },
      3: { ending: 'ó' },
      4: { ending: 'amos' },
      5: { ending: 'asteis' },
      6: { ending: 'aron' }
    },
    [verbTypes.ER]: {
      1: { ending: 'í' },
      2: { ending: 'iste' },
      3: { ending: 'ió' },
      4: { ending: 'imos' },
      5: { ending: 'isteis' },
      6: { ending: 'ieron' }
    },
    [verbTypes.IR]: {
      1: { ending: 'í' },
      2: { ending: 'iste' },
      3: { ending: 'ió' },
      4: { ending: 'imos' },
      5: { ending: 'isteis' },
      6: { ending: 'ieron' }
    }
  },
  PretéritoImperfectoSubjuntivo1: {
    type: 'ROOT',
    [verbTypes.AR]: {
      1: { ending: 'ara' },
      2: { ending: 'aras' },
      3: { ending: 'ara' },
      4: { ending: 'áramos' },
      5: { ending: 'arais' },
      6: { ending: 'aran' }
    },
    [verbTypes.ER]: {
      1: { ending: 'iera' },
      2: { ending: 'ieras' },
      3: { ending: 'iera' },
      4: { ending: 'iéramos' },
      5: { ending: 'ierais' },
      6: { ending: 'ieran' }
    },
    [verbTypes.IR]: {
      1: { ending: 'iera' },
      2: { ending: 'ieras' },
      3: { ending: 'iera' },
      4: { ending: 'iéramos' },
      5: { ending: 'ierais' },
      6: { ending: 'ieran' }
    }
  },
  PretéritoImperfectoSubjuntivo2: {
    type: 'ROOT',
    [verbTypes.AR]: {
      1: { ending: 'ase' },
      2: { ending: 'ases' },
      3: { ending: 'ase' },
      4: { ending: 'ásemos' },
      5: { ending: 'aseis' },
      6: { ending: 'asen' }
    },
    [verbTypes.ER]: {
      1: { ending: 'iese' },
      2: { ending: 'ieses' },
      3: { ending: 'iese' },
      4: { ending: 'iésemos' },
      5: { ending: 'ieseis' },
      6: { ending: 'iesen' }
    },
    [verbTypes.IR]: {
      1: { ending: 'iese' },
      2: { ending: 'ieses' },
      3: { ending: 'iese' },
      4: { ending: 'iésemos' },
      5: { ending: 'ieseis' },
      6: { ending: 'iesen' }
    }
  }
}

export default conjugationRules
