import Typography from '@mui/material/Typography'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import React, { useState } from 'react'

const tenses = [
  'Infinitivo',
  'Imperativo',
  'Gerundio',
  'Presente Indicativo',
  'Futuro Indicativo',
  'Pretérito imperfecto Indicativo',
  'Past Participle',
  'Condicional Indicativo',
  'Pretérito perfecto simple Indicativo',
  'Presente Subjuntivo',
  'Futuro Subjuntivo',
  'Pretérito imperfecto Subjuntivo'
]

const persons = {
  1: 'I',
  2: 'you',
  3: 'he/she/it',
  4: 'we',
  5: 'you (plural)',
  6: 'they'
}

function AddConjugation (props) {
  const [tense, setTense] = useState(null)
  const [person, setPerson] = useState(null)

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Typography id="modal-modal-title" variant="h6" component="h2">
        Add conjugation:
      </Typography>
      <Select
        value={tense}
        label="Tense"
        onChange={(event) => setTense(event.target.value)}
      >
        {tenses.map(id => <MenuItem value={id} key={id}>{id}</MenuItem>)}
      </Select>
      <Select
        value={person}
        label="Person"
        onChange={(event) => setPerson(event.target.value)}
      >
        {Object.keys(persons).map(id => <MenuItem value={id} key={id}>{persons[id]}</MenuItem>)}
      </Select>
    </div>
  )
}

export default AddConjugation
