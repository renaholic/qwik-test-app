import { component$, Slot, useErrorBoundary } from '@builder.io/qwik'
import { LinkProps, RequestHandler, useNavigate } from '@builder.io/qwik-city'
import { ChangeLocale } from '../components/header/change-locale'
import { ThemeSelector } from '../components/ThemeSelector'
import { config } from '../speak-config'
import { useOnline } from './useOnline'

export const menu = [
  { name: 'Home', href: '/' },
  { name: 'Flower', href: '/flower/' },
  { name: 'Youtube Player', href: '/yt-playback/' },
  { name: 'Swipe', href: '/swipe/' },
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
  // const isProfileDropdown = useSignal(false)
  // const isMobileMenu = useSignal(false)

  // const { pathname } = useLocation()
  // const isCurrent = (href: string) => pathname === href

  // const pageState = useContext<PageState>(pageContext)

  useOnline()

  return (
    <div class="min-h-full w-full overflow-hidden">
      <div class="drawer">
        <input id="my-drawer" type="checkbox" class="drawer-toggle" />
        <div class="drawer-content">
          {/* <!-- Page content here --> */}
          <div class="navbar bg-base-100" id="nav">
            <div class="navbar-start">
              <label
                tabIndex={0}
                for="my-drawer"
                class="btn btn-ghost drawer-button lg:hidden"
                // class="btn btn-ghost lg:hidden"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </label>
              <a class="btn btn-ghost text-xl normal-case">daisyUI</a>
            </div>
            <div class="navbar-center hidden lg:flex">
              <ul class="menu menu-horizontal px-1">
                {menu.map(({ name, href }) => (
                  <li key={href}>
                    <Link
                      // class={twMerge(
                      //   'rounded-md px-3 py-2 text-sm font-medium',
                      //   ['transition-colors ease-linear'],
                      //   isCurrent(href)
                      //     ? 'bg-gray-900 text-white'
                      //     : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      // )}
                      href={href}
                    >
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div class="navbar-end gap-2 pr-2">
              <ChangeLocale />
              <ThemeSelector class="relative z-10 h-6 w-6" />
            </div>
          </div>
          <main>
            <div class="container max-w-7xl px-6 pb-16 lg:px-8">
              <Slot />
            </div>
          </main>
        </div>
        <div class="drawer-side">
          <label for="my-drawer" class="drawer-overlay"></label>
          <ul class="menu w-80 bg-base-100 p-4 text-base-content">
            {/* <!-- Sidebar content here --> */}
            {menu.map(({ name, href }) => (
              <li key={href}>
                <a
                  // class={twMerge(
                  //   'rounded-md px-3 py-2 text-sm font-medium',
                  //   ['transition-colors ease-linear'],
                  //   isCurrent(href)
                  //     ? 'bg-gray-900 text-white'
                  //     : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  // )}
                  href={href}
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>
        </div>
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
