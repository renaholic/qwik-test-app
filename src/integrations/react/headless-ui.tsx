/** @jsxImportSource react */

import { qwikify$ } from '@builder.io/qwik-react'
import { Menu } from '@headlessui/react'

export const MUIButton = qwikify$(Button)
export const MUIAlert = qwikify$(Alert)
export const MUISlider = qwikify$(Slider, { eagerness: 'hover' })
