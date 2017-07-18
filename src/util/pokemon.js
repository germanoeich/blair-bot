export function reorderArgs (args) {
  if (args.length === 1) {
    return args
  }

  if (args[0].toLowerCase() === 'mega') {
    const name = args[1]
    args[0] = name
    args[1] = 'mega'

    return [...args]
  }
}

export function capitalizeName (name) {
  let ret = ''
  for (let i = 0; i < name.length; i++) {
    if (i === 0) {
      ret += name[i].toUpperCase()
      continue
    }

    if (name[i] === '-' || name[i] === ' ') {
      ret += name[i]
      ret += name[i + 1].toUpperCase()
      i++
      continue
    }

    ret += name[i]
  }

  return ret
}
