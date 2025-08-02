import React from 'react'
import { getTextContent } from 'notion-utils'

const emojiToIconMap = {
  '📧': 'gmail',
  '🔗': 'linkedin',
  '✍️': 'medium'
}

export const CustomCallout = ({ block, children }) => {
  const icon = block?.format?.page_icon || block?.format?.callout_icon
  const keyword = emojiToIconMap[icon]
  const iconSrc = keyword ? `/icons/${keyword}.png` : null
  const color = block?.format?.block_color || 'gray_background'

  return (
    <div className={`notion-callout notion-${color}`}>
      <div className="notion-callout-icon">
        {iconSrc ? (
          <img
            src={iconSrc}
            alt={keyword}
            className="custom-callout-icon"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <span>{icon}</span>
        )}
      </div>
      <div className="notion-callout-text">{children}</div>
    </div>
  )
}

