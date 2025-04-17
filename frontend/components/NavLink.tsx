'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

export default function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={clsx('group p-2 flex items-center justify-center h-full', {
        'text-yellow-500': isActive,
        'text-gray-500': !isActive,
      })}
    >
      {children}
    </Link>
  )
}
