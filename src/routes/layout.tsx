import { component$, Slot } from '@builder.io/qwik'
import { LinkProps, RequestHandler, useNavigate } from '@builder.io/qwik-city'
import { ChangeLocale } from '../components/header/change-locale'
import { ThemeSelector } from '../components/ThemeSelector'
import { config } from '../speak-config'

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

  return (
    <div class="min-h-full w-full overflow-hidden">
      <div class="navbar bg-base-100">
        <div class="navbar-start">
          <div class="dropdown">
            <label tabIndex={0} class="btn btn-ghost lg:hidden">
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
            <ul
              tabIndex={0}
              class="dropdown-content menu rounded-box menu-compact mt-3 w-52 bg-base-100 p-2 shadow"
            >
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
        <div class="navbar-end gap-2">
          <ThemeSelector class="relative z-10" />
          <ChangeLocale />
        </div>
      </div>
      <main>
        <div class="container max-w-7xl lg:px-8 px-6 pb-16">
          <Slot />
        </div>
      </main>
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
