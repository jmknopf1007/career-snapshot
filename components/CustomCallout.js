import React from 'react'

export function CustomCallout({ block, children, ...rest }) {
  const icon = block?.format?.page_icon || block?.icon

  // Match by emoji
  const emojiToImage = {
    '📧': 'gmail',
    '🔗': 'linkedin',
    '✍️': 'medium'
  }

  const keyword = emojiToImage[icon]

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '12px',
        backgroundColor: '#f0f0f0',
        borderRadius: '8px',
        marginBottom: '1em',
      }}
      {...rest}
    >
      {keyword ? (
        <img
          src={`/icons/${keyword}.png`}
          alt={keyword}
          style={{ width: 24, height: 24, marginRight: 12 }}
        />
      ) : icon ? (
        <span
          style={{ fontSize: '1.5em', marginRight: 12 }}
          role="img"
          aria-label="icon"
        >
          {icon}
        </span>
      ) : null}
      <div>{children}</div>
    </div>
  )
}

