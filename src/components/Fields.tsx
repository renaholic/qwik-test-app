import { QwikIntrinsicElements } from '@builder.io/qwik'
import { twMerge } from 'tailwind-merge'

export const formClasses =
  'block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm'

export const Label = ({ children }: any) => {
  return (
    <label class="mb-3 block text-sm font-medium text-gray-700">
      {children}
    </label>
  )
}

export function TextField({
  id,
  label,
  type = 'text',
  className = '',
  ...props
}: any) {
  return (
    <div class={className}>
      {label && <Label>{label}</Label>}
      <input id={id} type={type} class={formClasses} {...props} />
    </div>
  )
}

export const SelectField = ({
  label,
  className = '',
  ...props
}: QwikIntrinsicElements['select'] & { label?: string }) => {
  return (
    <div class={twMerge('form-control', className)}>
      {label && <Label>{label}</Label>}
      <select
        class={twMerge('select w-full max-w-xs', formClasses, 'pr-8')}
        {...props}
      />
    </div>
  )
}
