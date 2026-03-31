import type { ComponentProps, ReactElement } from 'react'
import { GridListItem, type GridListItemProps } from 'react-aria-components'

import { Tile } from './Tile'

type TileItemProps = Omit<
  ComponentProps<typeof Tile>,
  'selected' | 'focused' | 'disabled'
> &
  Pick<
    GridListItemProps,
    'id' | 'isDisabled' | 'onAction' | 'href' | 'target' | 'rel' | 'download'
  > & {
    textValue?: string
  }

const TileItem = ({
  id,
  textValue,
  title,
  overline,
  isDisabled,
  onAction,
  href,
  target,
  rel,
  ...tileProps
}: TileItemProps): ReactElement => (
  <GridListItem
    id={id}
    textValue={textValue ?? title}
    isDisabled={isDisabled}
    onAction={onAction}
    href={href}
    target={target}
    rel={rel}
  >
    {({ isSelected, isFocused, isDisabled: itemDisabled }) => (
      <Tile
        {...tileProps}
        title={title}
        overline={overline}
        selected={isSelected}
        focused={isFocused}
        disabled={itemDisabled}
      />
    )}
  </GridListItem>
)

export { TileItem }
