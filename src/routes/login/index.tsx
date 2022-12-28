import { component$ } from '@builder.io/qwik'
import { TextField } from '~/components/Fields'
import { AuthLayout } from '../../components/AuthLayout'
import { Button } from '../../components/Button'
import { Logo } from '../../components/Logo'

export default component$(() => {
  return (
    <AuthLayout>
      <div>
        <div class="flex flex-col">
          <a href="/" aria-label="Home">
            <Logo class="h-10 w-auto" />
          </a>
          <div class="mt-20">
            <h2 class="text-lg font-semibold text-gray-900">
              Sign in to your account
            </h2>
            <p class="mt-2 text-sm text-gray-700">
              Don’t have an account?{' '}
              <a
                href="/register"
                class="font-medium text-blue-600 hover:underline"
              >
                Sign up
              </a>{' '}
              for a free trial.
            </p>
          </div>
        </div>
        <form action="#" class="mt-10 grid grid-cols-1 gap-y-8">
          <TextField
            label="Email address"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
          <TextField
            label="Password"
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
          <div>
            <Button type="submit" variant="solid" color="blue" class="w-full">
              <span>
                Sign in <span aria-hidden="true">&rarr;</span>
              </span>
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  )
})
