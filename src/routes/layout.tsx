import { component$, Slot, useContext, useSignal } from '@builder.io/qwik'
import {
  LinkProps,
  RequestHandler,
  useLocation,
  useNavigate,
} from '@builder.io/qwik-city'
import { twMerge } from 'tailwind-merge'
import { ChangeLocale } from '../components/header/change-locale'
import { pageContext, PageState } from '../root'
import { config } from '../speak-config'

export const menu = [
  { name: 'Home', href: '/' },
  { name: 'Flower', href: '/flower/' },
  { name: 'Youtube Player', href: '/yt-playback/' },
]
export const Link = component$<LinkProps>(({ href, ...props }) => {
  const nav = useNavigate()

  return (
    <a
      preventdefault:click
      onClick$={() => {
        if (!href) return
        // @ts-ignore 2339
        if (document.startViewTransition)
          // @ts-ignore 2339
          document.startViewTransition(() => (nav.path = href))
        else {
          nav.path = href
        }
      }}
      {...props}
    >
      <Slot />
    </a>
  )
})

export default component$(() => {
  const isProfileDropdown = useSignal(false)
  const isMobileMenu = useSignal(false)

  const { pathname } = useLocation()
  const isCurrent = (href: string) => pathname === href

  const pageState = useContext<PageState>(pageContext)

  return (
    <div class="min-h-full w-full overflow-hidden">
      <nav class="bg-gray-800" id="main-header">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div class="flex h-16 items-center justify-between">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <img
                  class="h-8 w-8"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                />
              </div>
              <div class="hidden md:block">
                <div class="ml-10 flex items-baseline space-x-4">
                  {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                  {menu.map(({ name, href }) => (
                    <Link
                      class={twMerge(
                        'rounded-md px-3 py-2 text-sm font-medium',
                        ['transition-colors ease-linear'],
                        isCurrent(href)
                          ? 'bg-gray-900 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      )}
                      href={href}
                      key={href}
                    >
                      {name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
            <div class="hidden md:block">
              <div class="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  class="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span class="sr-only">View notifications</span>
                  {/* <!-- Heroicon name: outline/bell --> */}
                  <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                    />
                  </svg>
                </button>

                {/* <!-- Profile dropdown --> */}
                <div class="relative ml-3">
                  <div>
                    <button
                      type="button"
                      class="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                      onClick$={() => {
                        isProfileDropdown.value = !isProfileDropdown.value
                      }}
                    >
                      <span class="sr-only">Open user menu</span>
                      <img
                        class="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </button>
                  </div>

                  {/* <!--
                Dropdown menu, show/hide based on menu state.

                Entering: "transition ease-out duration-100"
                  From: "transform opacity-0 scale-95"
                  To: "transform opacity-100 scale-100"
                Leaving: "transition ease-in duration-75"
                  From: "transform opacity-100 scale-100"
                  To: "transform opacity-0 scale-95"
              --> */}
                  <div
                    class={twMerge(
                      'absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition-none focus:outline-none',
                      isProfileDropdown.value
                        ? [
                            'transition-[scale, opacity] duration-100 ease-out',
                            'scale-100 transform opacity-100',
                          ]
                        : [
                            'transition-[scale, opacity] duration-75 ease-in',
                            'hidden scale-95 transform opacity-0',
                          ]
                    )}
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex={-1}
                  >
                    {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
                    <div
                      class={twMerge(
                        'block px-4 py-2 text-sm text-gray-700',
                        pathname === '/profile' ? 'bg-gray-100' : ''
                      )}
                      tabIndex={-1}
                    >
                      <ChangeLocale />
                    </div>
                    <Link
                      href="#"
                      class={twMerge(
                        'block px-4 py-2 text-sm text-gray-700',
                        pathname === '/profile' ? 'bg-gray-100' : ''
                      )}
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-0"
                    >
                      Your Profile
                    </Link>

                    <Link
                      href="#"
                      class={twMerge(
                        'block px-4 py-2 text-sm text-gray-700',
                        pathname === '/profile' ? 'bg-gray-100' : ''
                      )}
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-1"
                    >
                      Settings
                    </Link>

                    <Link
                      href="#"
                      class={twMerge(
                        'block px-4 py-2 text-sm text-gray-700',
                        pathname === '/profile' ? 'bg-gray-100' : ''
                      )}
                      role="menuitem"
                      tabIndex={-1}
                      id="user-menu-item-2"
                    >
                      Sign out
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div class="-mr-2 flex md:hidden">
              {/* <!-- Mobile menu button --> */}
              <button
                type="button"
                class="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                aria-controls="mobile-menu"
                aria-expanded="false"
                onClick$={() => (isMobileMenu.value = !isMobileMenu.value)}
              >
                <span class="sr-only">Open main menu</span>
                {/* <!--
              Heroicon name: outline/bars-3

              Menu open: "hidden", Menu closed: "block"
            --> */}
                <svg
                  class={twMerge(
                    'h-6 w-6',
                    isMobileMenu.value ? 'hidden' : 'block'
                  )}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
                {/* <!--
              Heroicon name: outline/x-mark

              Menu open: "block", Menu closed: "hidden"
            --> */}
                <svg
                  class={twMerge(
                    'h-6 w-6',
                    isMobileMenu.value ? 'block' : 'hidden'
                  )}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* <!-- Mobile menu, show/hide based on menu state. --> */}
        <div
          class={twMerge('md:hidden', isMobileMenu.value ? 'block' : 'hidden')}
          id="mobile-menu"
        >
          <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
            {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
            {menu.map(({ name, href }) => (
              <Link
                class={twMerge(
                  'block rounded-md px-3 py-2 text-base font-medium',
                  isCurrent(href)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                )}
                aria-current="page"
                href={href}
                key={href}
                // onClick$={() => toPage(nav, href)}
              >
                {name}
              </Link>
            ))}
          </div>
          <div class="border-t border-gray-700 pt-4 pb-3">
            <div class="flex items-center px-5">
              <div class="flex-shrink-0">
                <img
                  class="h-10 w-10 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </div>
              <div class="ml-3">
                <div class="text-base font-medium leading-none text-white">
                  Tom Cook
                </div>
                <div class="text-sm font-medium leading-none text-gray-400">
                  tom@example.com
                </div>
              </div>
              <button
                type="button"
                class="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                <span class="sr-only">View notifications</span>
                {/* <!-- Heroicon name: outline/bell --> */}
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
                  />
                </svg>
              </button>
            </div>
            <div class="mt-3 space-y-1 px-2">
              <ChangeLocale />
              <a
                href="#"
                class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                Your Profile
              </a>

              <a
                href="#"
                class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                Settings
              </a>

              <a
                href="#"
                class="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div class="py-10">
        <header>
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">
              {pageState.pageName}
            </h1>
          </div>
        </header>
        <main>
          <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
            {/* <!-- Replace with your content --> */}
            <div class="px-4 py-8 sm:px-0">
              <Slot />
            </div>
            {/* <!-- /End replace --> */}
          </div>
        </main>
      </div>
    </div>
  )
})

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
