import React from 'react'

export function CustomCallout({ block, children, ...rest }) {
  const icon = block?.format?.page_icon || block?.icon
  let keyword = ''

  if (icon && typeof icon === 'string') {
    // Match a keyword in the image URL if it's a Notion-hosted image
    if (icon.startsWith('https://')) {
      if (icon.includes('gmail')) keyword = 'gmail'
      else if (icon.includes('linkedin')) keyword = 'linkedin'
      else if (icon.includes('medium')) keyword = 'medium'
    } else {
      // Fallback if emoji (we could use this later)
      keyword = null
    }
  }

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
      ) : (
        <span
          style={{ fontSize: '1.5em', marginRight: 12 }}
          role="img"
          aria-label="icon"
        >
          🧱
        </span>
      )}
      <div>{children}</div>
    </div>
  )
}

