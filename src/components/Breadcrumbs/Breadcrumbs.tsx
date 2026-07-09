'use client'

import cn from 'classnames'
import {
  Breadcrumb as AriaBreadcrumb,
  Breadcrumbs as AriaBreadcrumbs,
  Link as AriaLink,
  type LinkProps as AriaLinkProps,
} from 'react-aria-components'

import { ChevronForwardIcon, HomeIcon } from '../icons'
import { Typography } from '../Typography'
import styles from './Breadcrumbs.module.css'

interface BreadcrumbItemData {
  id: string
  label: string
  href: string
}

/**
 * Replaces the default `<a>` element with a custom renderer — typically a router Link.
 * Receives all DOM props (including href, className, aria-*) and must return a ReactElement.
 * @example (props) => <RouterLink {...props} to={props.href} />
 */
type RenderLink = NonNullable<AriaLinkProps['render']>

interface BreadcrumbsProps {
  /** Labels the navigation landmark — required when the page has more than one nav element */
  'aria-label'?: string
  /** Additional CSS class applied to the wrapper element */
  className?: string
  /**
   * Breadcrumb trail from root to current page.
   * The first item is always home (rendered as a home icon).
   * The last item is the current page (rendered as non-interactive text).
   */
  items: ReadonlyArray<BreadcrumbItemData>
  /**
   * Replaces the default `<a>` element for navigable items.
   * Use this to integrate with your router's Link component.
   * Receives all DOM props and must spread them on the rendered element.
   * @example renderLink={(props) => 'href' in props ? <RouterLink {...props} to={props.href} /> : <span {...props} />}
   */
  renderLink?: RenderLink
}

interface HomeLinkProps {
  item: BreadcrumbItemData
  renderLink?: RenderLink
}

const HomeLink = ({ item, renderLink }: HomeLinkProps) => (
  <AriaLink
    href={item.href}
    className={styles['home-link']}
    render={renderLink}
  >
    <HomeIcon size={24} aria-hidden className={styles['home-icon']} />
    <span className={styles.accessibility}>{item.label}</span>
  </AriaLink>
)

interface IntermediateLinkProps {
  item: BreadcrumbItemData
  renderLink?: RenderLink
}

const IntermediateLink = ({ item, renderLink }: IntermediateLinkProps) => (
  <AriaLink href={item.href} className={styles.link} render={renderLink}>
    <Typography element="span" textStyle="labelSm" textColor="contentPrimary">
      {item.label}
    </Typography>
  </AriaLink>
)

interface CurrentItemProps {
  item: BreadcrumbItemData
  isHome: boolean
}

const CurrentItem = ({ item, isHome }: CurrentItemProps) => {
  if (isHome) {
    return (
      <span aria-current="page">
        <HomeIcon
          size={24}
          aria-label={item.label}
          className={styles['home-icon']}
        />
      </span>
    )
  }

  return (
    <span aria-current="page">
      <Typography
        element="span"
        textStyle="labelSm"
        textColor="contentTertiary"
      >
        {item.label}
      </Typography>
    </span>
  )
}

interface ItemContentProps {
  item: BreadcrumbItemData
  isFirst: boolean
  isLast: boolean
  renderLink?: RenderLink
}

const ItemContent = ({
  item,
  isFirst,
  isLast,
  renderLink,
}: ItemContentProps) => {
  if (isLast) {
    return <CurrentItem item={item} isHome={isFirst} />
  }
  if (isFirst) {
    return <HomeLink item={item} renderLink={renderLink} />
  }
  return <IntermediateLink item={item} renderLink={renderLink} />
}

const Breadcrumbs = ({
  'aria-label': ariaLabel = 'Breadcrumbs',
  className,
  items,
  renderLink,
}: BreadcrumbsProps) => {
  if (items.length === 0) {
    return null
  }

  return (
    <AriaBreadcrumbs
      aria-label={ariaLabel}
      className={cn(styles.breadcrumbs, className)}
    >
      {items.map((item, index) => {
        const isFirst = index === 0
        const isLast = index === items.length - 1

        return (
          <AriaBreadcrumb key={item.id} id={item.id} className={styles.item}>
            <ItemContent
              item={item}
              isFirst={isFirst}
              isLast={isLast}
              renderLink={renderLink}
            />
            {!isLast && (
              <ChevronForwardIcon
                size={24}
                aria-hidden
                className={styles.separator}
              />
            )}
          </AriaBreadcrumb>
        )
      })}
    </AriaBreadcrumbs>
  )
}

export {
  Breadcrumbs,
  type BreadcrumbItemData,
  type BreadcrumbsProps,
  type RenderLink,
}
