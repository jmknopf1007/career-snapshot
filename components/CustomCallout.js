import React from 'react'

const imageMatchMap = {
  gmail: 'gmail',
  linkedin: 'linkedin',
  medium: 'medium',
}

export function CustomCallout({ block, children, ...rest }) {
  const icon = block?.format?.page_icon || block?.icon || ''
  let keyword = ''

  if (typeof icon === 'string') {
    const matched = Object.keys(imageMatchMap).find(key =>
      icon.toLowerCase().includes(key)
    )
    if (matched) {
      keyword = imageMatchMap[matched]
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
          loading="lazy"
        />
      ) : (
        <span
          style={{ fontSize: '1.5em', marginRight: 12 }}
          role="img"
          aria-label="icon"
        >
          📄
        </span>
      )}
      <div>{children}</div>
    </div>
  )
}
