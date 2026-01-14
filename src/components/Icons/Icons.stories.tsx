import { useState, type ComponentType, type SVGProps } from 'react'

import preview from '@/storybook/preview'

type IconProps = SVGProps<SVGSVGElement> & { size?: number | string }

const iconModules = import.meta.glob<{ default: ComponentType<IconProps> }>(
  ['./*.tsx', '!./Icons.stories.tsx'],
  { eager: true },
)

const icons = Object.entries(iconModules).map(([path, module]) => {
  const name = path.split('/').pop()?.replace('.tsx', '') ?? ''
  return { name, Icon: module.default }
})

const styles = `
  .icons {
    max-width: 1000px;
    margin: 0 auto;
    padding: 48px;
  }
  .icons-title {
    margin: 0 0 32px;
    font-size: 32px;
    font-weight: 600;
    color: #333;
  }
  .icons-search {
    width: 100%;
    padding: 12px 16px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    outline: none;
    transition: border-color 0.2s;
  }
  .icons-search:focus {
    border-color: #666;
  }
  .icons-search::placeholder {
    color: #999;
  }
  .icons-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 20px 16px;
    margin: 30px 0;
  }
  .icons-item {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .icons-item-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border: 1px solid #444;
    border-radius: 8px;
    flex-shrink: 0;
  }
  .icons-name {
    font-size: 14px;
    color: #444;
  }
  .icons-empty {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px;
    color: #666;
  }
  .icons-usage {
    margin-top: 48px;
    padding: 24px;
    background: #f5f5f5;
    border-radius: 12px;
  }
  .icons-usage-title {
    margin: 0 0 16px;
    font-size: 20px;
    font-weight: 600;
    color: #333;
  }
  .icons-usage-text {
    margin: 0 0 16px;
    font-size: 14px;
    color: #555;
    line-height: 1.6;
  }
  .icons-usage-code {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 16px;
    border-radius: 8px;
    font-family: 'Fira Code', 'Consolas', monospace;
    font-size: 13px;
    overflow-x: auto;
    line-height: 1.6;
    margin: 0;
  }
  .dark .icons-title,
  .dark .icons-name {
    color: #fff;
  }
  .dark .icons-description {
    color: rgba(255, 255, 255, 0.7);
  }
  .dark .icons-search {
    background: #1a1a1a;
    border-color: rgba(255, 255, 255, 0.3);
    color: #fff;
  }
  .dark .icons-search::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
  .dark .icons-search:focus {
    border-color: rgba(255, 255, 255, 0.6);
  }
  .dark .icons-item-wrapper {
    border-color: rgba(255, 255, 255, 0.4);
  }
  .dark .icons-item-wrapper svg {
    fill: #fff;
  }
  .dark .icons-empty {
    color: rgba(255, 255, 255, 0.6);
  }
  .dark .icons-usage {
    background: #2a2a2a;
  }
  .dark .icons-usage-title {
    color: #fff;
  }
  .dark .icons-usage-text {
    color: rgba(255, 255, 255, 0.7);
  }
`

const IconsGallery = () => {
  const [search, setSearch] = useState('')

  const filteredIcons = icons.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
      <style>{styles}</style>
      <div className="icons">
        <h1 className="icons-title">Icons</h1>
        <p className="icons-description">
          These are the icons being used in our design system. They are
          available as React components.
        </p>
        <input
          type="text"
          className="icons-search"
          placeholder="Search icons..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
          }}
        />
        <div className="icons-grid">
          {filteredIcons.length > 0 ? (
            filteredIcons.map(({ name, Icon }) => (
              <div key={name} className="icons-item">
                <div className="icons-item-wrapper">
                  <Icon size={48} />
                </div>
                <span className="icons-name">{name}</span>
              </div>
            ))
          ) : (
            <div className="icons-empty">No icons found for "{search}"</div>
          )}
        </div>
        <div className="icons-usage">
          <h2 className="icons-usage-title">Usage</h2>
          <p className="icons-usage-text">
            Import the icon component and use it in your React components.
          </p>
          <pre className="icons-usage-code">
            <code>{`
import { XxxxxIcon } from from '@.........'
<XxxxxIcon size={24} /> 
            `}</code>
          </pre>
        </div>
      </div>
    </>
  )
}

const meta = preview.meta({
  title: 'Icons',
  component: IconsGallery,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['!autodocs'],
})

export const Icons = meta.story()
