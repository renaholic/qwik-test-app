import {
  component$,
  Signal,
  Slot,
  useClientEffect$,
  useSignal,
} from '@builder.io/qwik'
import { RequestHandler } from '@builder.io/qwik-city'
import { twMerge } from 'tailwind-merge'
import { config } from '../speak-config'

// export const menuContext = createContext<Signal<boolean>>('menu')

export const MenuItem = component$(
  (item: { name: string; href: string; current: boolean }) => {
    return (
      <a
        href={item.href}
        class={twMerge(
          item.current
            ? 'bg-gray-900 text-white'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
          'group flex items-center rounded-md px-2 py-2 text-base font-medium'
        )}
      >
        <Slot name="icon" />
        {item.name}
      </a>
    )
  }
)
export const MobileMenu = component$(
  ({ sidebar }: { sidebar: Signal<boolean> }) => {
    // if (!sidebar.value) return <></>
    // else
    return (
      <div class="relative z-40 md:hidden">
        {/* <Transition.Child
   as={Fragment}
   enter="transition-opacity ease-linear duration-300"
   enterFrom="opacity-0"
   enterTo="opacity-100"
   leave="transition-opacity ease-linear duration-300"
   leaveFrom="opacity-100"
   leaveTo="opacity-0"
 > */}
        <div class="fixed inset-0 bg-gray-600 bg-opacity-75" />
        {/* </Transition.Child> */}

        <div class="fixed inset-0 z-40 flex">
          {/* <Transition.Child
     as={Fragment}
     enter="transition ease-in-out duration-300 transform"
     enterFrom="-translate-x-full"
     enterTo="translate-x-0"
     leave="transition ease-in-out duration-300 transform"
     leaveFrom="translate-x-0"
     leaveTo="-translate-x-full"
   > */}
          <div class="relative flex w-full max-w-xs flex-1 flex-col bg-gray-800">
            {/* <Transition.Child
         as={Fragment}
         enter="ease-in-out duration-300"
         enterFrom="opacity-0"
         enterTo="opacity-100"
         leave="ease-in-out duration-300"
         leaveFrom="opacity-100"
         leaveTo="opacity-0"
       > */}
            <div class="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                class="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick$={() => (sidebar.value = false)}
              >
                <span class="sr-only">Close sidebar</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  class="h-6 w-6 text-white"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            {/* </Transition.Child> */}
            <div class="h-0 flex-1 overflow-y-auto pt-5 pb-4">
              <div class="flex flex-shrink-0 items-center px-4">
                <img
                  class="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                />
              </div>
              <nav class="mt-5 space-y-1 px-2">
                {navigation.map(({ name, href, current, ...item }) => (
                  <MenuItem {...{ name, href, current }} key={name}>
                    <item.icon
                      q:slot="icon"
                      class={twMerge(
                        current
                          ? 'text-gray-300'
                          : 'text-gray-400 group-hover:text-gray-300',
                        'mr-3 h-6 w-6 flex-shrink-0'
                      )}
                      aria-hidden="true"
                    />
                  </MenuItem>
                ))}
              </nav>
            </div>
            <div class="flex flex-shrink-0 bg-gray-700 p-4">
              <a href="/" class="group block flex-shrink-0">
                <div class="flex items-center">
                  <div>
                    <img
                      class="inline-block h-10 w-10 rounded-full"
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                      alt=""
                    />
                  </div>
                  <div class="ml-3">
                    <p class="text-base font-medium text-white">Tom Cook</p>
                    <p class="text-sm font-medium text-gray-400 group-hover:text-gray-300">
                      View profile
                    </p>
                  </div>
                </div>
              </a>
            </div>
          </div>
          {/* </Transition.Child> */}
          <div class="w-14 flex-shrink-0">
            {/* Force sidebar to shrink to fit close icon */}
          </div>
        </div>
      </div>
    )
  }
)

export const navigation = [
  {
    name: 'Home',
    href: '/',
    icon: ({ ...props }: any) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        class="h-6 w-6"
        {...props}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
        />
      </svg>
    ),
    current: false,
  },
]

export const onRequest: RequestHandler = ({ request, response }) => {
  const acceptLanguage = request.headers?.get('accept-language')

  let lang: string | null = null
  // Try to use user language
  if (acceptLanguage) {
    lang = acceptLanguage.split(';')[0]?.split(',')[0]
  }

  // Set locale in response
  response.locale = lang || config.defaultLocale.lang
}

export const DesktopMenu = component$(() => {
  return (
    <div class="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col">
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div class="flex min-h-0 flex-1 flex-col bg-gray-800">
        <div class="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
          <div class="flex flex-shrink-0 items-center px-4">
            <img
              class="h-8 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
              alt="Your Company"
            />
          </div>
          <nav class="mt-5 flex-1 space-y-1 px-2">
            {navigation.map(({ name, href, current, ...item }) => (
              <MenuItem {...{ name, href, current }} key={name}>
                <item.icon
                  q:slot="icon"
                  class={twMerge(
                    current
                      ? 'text-gray-300'
                      : 'text-gray-400 group-hover:text-gray-300',
                    'mr-3 h-6 w-6 flex-shrink-0'
                  )}
                  aria-hidden="true"
                />
              </MenuItem>
            ))}
          </nav>
        </div>
        <div class="flex flex-shrink-0 bg-gray-700 p-4">
          <a href="#" class="group block w-full flex-shrink-0">
            <div class="flex items-center">
              <div>
                <img
                  class="inline-block h-9 w-9 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
              <div class="ml-3">
                <p class="text-sm font-medium text-white">Tom Cook</p>
                <p class="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                  View profile
                </p>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
})

export default component$(() => {
  useClientEffect$(() => {
    window.onpopstate = (event) => {
      if (event) window.location.reload() // reload the page on back or forward
    }
  })

  const sidebar = useSignal(false)

  return (
    <div class="flex h-full">
      <MobileMenu sidebar={sidebar} />
      {/* Static sidebar for desktop */}
      <DesktopMenu />
      <div class="flex flex-1 flex-col md:pl-64">
        <div class="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
          <button
            type="button"
            class="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick$={() => (sidebar.value = true)}
          >
            <span class="sr-only">Open sidebar</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              class="h-6 w-6"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
          </button>
        </div>
        <main class="flex-1">
          <div class="py-6">
            <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 class="text-2xl font-semibold text-gray-900">Home</h1>
            </div>
            <div class="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
              <div class="py-4">
                <Slot />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
})
