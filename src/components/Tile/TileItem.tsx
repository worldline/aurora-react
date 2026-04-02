import { GridListItem, type GridListItemProps } from 'react-aria-components'

import { Tile, type TileContentProps } from './Tile'

interface TileItemProps extends TileContentProps {
  id?: GridListItemProps['id']
  textValue?: GridListItemProps['textValue']
  isDisabled?: GridListItemProps['isDisabled']
  onAction?: GridListItemProps['onAction']
}

const TileItem = ({
  id,
  textValue,
  isDisabled,
  onAction,
  ...tileProps
}: TileItemProps) => (
  <GridListItem
    id={id}
    textValue={textValue}
    isDisabled={isDisabled}
    onAction={onAction}
  >
    {(states) => (
      <Tile
        {...tileProps}
        selected={states.isSelected}
        focusVisible={states.isFocusVisible}
        hovered={states.isHovered}
        disabled={states.isDisabled}
      />
    )}
  </GridListItem>
)

export { TileItem }
