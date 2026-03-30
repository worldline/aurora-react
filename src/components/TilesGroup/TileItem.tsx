import type { ComponentProps } from 'react'
import { GridListItem, type GridListItemProps } from 'react-aria-components'

import { Tile } from './Tile'

type TileItemProps = Omit<
  ComponentProps<typeof Tile>,
  'selected' | 'focused' | 'disabled'
> &
  Pick<
    GridListItemProps,
    | 'id'
    | 'textValue'
    | 'isDisabled'
    | 'onAction'
    | 'href'
    | 'target'
    | 'rel'
    | 'download'
  >

const TileItem = ({
  id,
  textValue,
  isDisabled,
  onAction,
  href,
  target,
  rel,
  download,
  ...tileProps
}: TileItemProps) => (
  <GridListItem
    id={id}
    textValue={textValue}
    isDisabled={isDisabled}
    onAction={onAction}
    href={href}
    target={target}
    rel={rel}
    download={download}
  >
    {({ isSelected, isFocused, isDisabled: itemDisabled }) => (
      <Tile
        {...tileProps}
        selected={isSelected}
        focused={isFocused}
        disabled={itemDisabled}
      />
    )}
  </GridListItem>
)

export { TileItem }
