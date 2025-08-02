import React from 'react'

export function CustomCallout({ block, children }) {
  const icon = block.value?.format?.page_icon

  const emojiToIconMap = {
    '📧': 'gmail',
    '💼': 'linkedin',
    '🐙': 'github',
    '🎨': 'behance',
    '🐦': 'twitter',
    '✍️': 'medium',
  }

  const keyword = emojiToIconMap[icon]

  if (keyword) {
    return (
      <div className="notion-callout">
        <img
          src={`/icons/${keyword}.png`}
          alt={keyword}
          style={{ width: 24, height: 24, marginRight: 8 }}
          loading="lazy"
          decoding="async"
        />
        <div>{children}</div>
      </div>
    )
  }

  return <div>{children}</div>
}

