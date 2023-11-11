import React, { useState, useCallback } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import debounce from 'lodash.debounce'
import { searchWord } from '../Redux/Word/actions'
import conjugateTranslation from '../utils/getVerbLabel'

function WordPicker(props) {
  const [isLoading, setIsLoading] = useState(false)
  const [queryOptions, setQueryOptions] = useState({})
  const [query, setQuery] = useState('')

  const onChange = (event, value, reason) => {
    if (reason === 'selectOption') {
      props.onSelectOption(value, props.textTranslationId)
    }
  }

  const onKeyUp = async (event) => {
    const search = event.target.value
    setQuery(search)
    if (search.length > 0) {
      setIsLoading(true)
      const words = await searchWord({ search, language: props.language })

      setQueryOptions({ ...queryOptions, [search]: words })
      setIsLoading(false)
    }
  }

  const debouncedChangeHandler = useCallback(debounce(onKeyUp, 400), [])

  return (
    <div>
      <Autocomplete
        sx={{ width: 300 }}
        options={(queryOptions[query] || [])
          .map((word) => ({
            ...word,
            label: `${word.lemma} - ${conjugateTranslation(word)}`,
          }))
          .sort((a, b) => a.lemma.length - b.lemma.length)}
        loading={isLoading}
        onChange={onChange}
        onKeyUp={debouncedChangeHandler}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Type a word:"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </div>
  )
}

export default WordPicker
