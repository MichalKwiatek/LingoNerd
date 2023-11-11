const imports = "import { Autocomplete, TextField } from '@mui/material'"

const newImports = imports
  .split(' { ')[1]
  .split(' } ')[0]
  .split(', ')
  .map((imp) => `import ${imp} from '@mui/material/${imp}'`)
  .join('\n')

console.log(newImports)
