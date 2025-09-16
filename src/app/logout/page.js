// src/app/logout/page.js
'use client'

import { logout } from './action'

export default function LogoutPage() {
  return (
    <form action={logout}>
      <button type="submit">Confirm Logout</button>
    </form>
  )
}
