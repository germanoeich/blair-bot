const activePrompts = {}

export function canPrompt (user) {
  return activePrompts[user.id] === undefined
}

export function startPrompt (user) {
  // value doesn't really matter here
  activePrompts[user.id] = true
}

export function endPrompt (user) {
  activePrompts[user.id] = undefined
}

export default {
  canPrompt,
  startPrompt,
  endPrompt
}
