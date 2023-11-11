function combineMaps(map1, map2) {
  const map2Keys = Object.keys(map2)

  const result = { ...map1 }
  map2Keys.forEach((key) => {
    result[key] = [...new Set([...(result[key] || []), ...map2[key]])]
  })

  return result
}

export default combineMaps
