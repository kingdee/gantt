import React from 'react'
import usePopper from '../../helpers/usePopper'

export type RenderFunction = () => React.ReactNode

export interface DropDownPanelProps {
  children?: React.ReactNode
  tip?: React.ReactNode | RenderFunction
  [propName: string]: any
}

const DropDownPanel = React.forwardRef((props: DropDownPanelProps, ref) => {
  const { content, children, prefixCls, ...others } = props

  const tiplocator = React.cloneElement(
    // @ts-ignore
    React.Children.count(children) === 1 && children.type ? children : <span>{children}</span>,
    { ref }
  )

  const popperProps = {
    ...others,
    prefixCls
  }

  const tipPopper = typeof content === 'function' ? content() : content

  return usePopper(tiplocator, tipPopper, popperProps)
})

export default DropDownPanel