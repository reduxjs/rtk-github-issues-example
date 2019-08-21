export function insertMentionLinks(markdown: string) {
  return markdown.replace(
    /\B(@([a-zA-Z0-9](-?[a-zA-Z0-9_])+))/g,
    `**[$1](https://github.com/$2)**`
  )
}

export function shorten(text = '', maxLength = 140) {
  // Normalize newlines
  let cleanText = text.replace(/\\r\\n/g, '\n')

  // Return if short enough already
  if (cleanText.length <= maxLength) {
    return cleanText
  }

  const ellip = ' ...'

  // Return the 140 chars as-is if they end in a non-word char
  const oneTooLarge = cleanText.substr(0, 141)
  if (/\W$/.test(oneTooLarge)) {
    return oneTooLarge.substr(0, 140) + ellip
  }

  // Walk backwards to the nearest non-word character
  let i = oneTooLarge.length
  while (--i) {
    if (/\W/.test(oneTooLarge[i])) {
      return oneTooLarge.substr(0, i) + ellip
    }
  }

  return oneTooLarge.substr(0, 140) + ellip
}
