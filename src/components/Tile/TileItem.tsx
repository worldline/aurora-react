import { GridListItem, type GridListItemProps } from 'react-aria-components'

import { Tile, type TileContentProps } from './Tile'

interface TileItemProps extends TileContentProps {
  id: GridListItemProps['id']
  /**
   * Plain-text label used by screen readers to announce the item.
   * Defaults to `title` when not provided.
   */
  textValue?: GridListItemProps['textValue']
  isDisabled?: GridListItemProps['isDisabled']
  onAction?: GridListItemProps['onAction']
}

const TileItem = ({
  id,
  textValue,
  isDisabled,
  onAction,
  title,
  ...tileProps
}: TileItemProps) => (
  <GridListItem
    id={id}
    textValue={textValue ?? title}
    isDisabled={isDisabled}
    onAction={onAction}
  >
    {(states) => (
      <Tile
        {...tileProps}
        title={title}
        selected={states.isSelected}
        focusVisible={states.isFocusVisible}
        hovered={states.isHovered}
        disabled={states.isDisabled}
      />
    )}
  </GridListItem>
)

export { TileItem, type TileItemProps }
