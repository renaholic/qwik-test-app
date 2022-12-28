import clsx from 'clsx'
import { Slot } from '@builder.io/qwik'

const formClasses =
  'block w-full appearance-none rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-blue-500 sm:text-sm'

function Label({ id }: { id: string }) {
  return (
    <label for={id} class="mb-3 block text-sm font-medium text-gray-700">
      <Slot />
    </label>
  )
}

// JSX.InputHTMLAttributes<HTMLInputElement>
export function TextField({
  id,
  label,
  type = 'text',
  className = '',
  // ...props
}:any) {
  return (
    <div class={className}>
      {/* {label && <Label id={id}>{label}</Label>} */}
      <input id={id} type={type}  class={formClasses} />
    </div>
  )
}

export function SelectField({ id, label, className = '', ...props }: any) {
  return (
    <div class={className}>
      {/* {label && <Label id={id}>{label}</Label>} */}
      <select id={id}  class={clsx(formClasses, 'pr-8')} />
    </div>
  )
}