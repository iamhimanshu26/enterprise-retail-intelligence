import { Menu } from 'lucide-react'
import { GlobalSearch } from './GlobalSearch'
import { NotificationCenter } from './NotificationCenter'
import { UserProfileMenu } from './UserProfileMenu'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'
import { ThemeToggle } from './ThemeToggle'

interface TopNavProps {
  onMenuClick?: () => void
  onSearchClick?: () => void
}

export function TopNav({ onMenuClick, onSearchClick }: TopNavProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
      >
        <Menu className="h-5 w-5" />
      </button>

      <WorkspaceSwitcher />

      <div className="hidden flex-1 md:block">
        <GlobalSearch onClick={onSearchClick} />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ThemeToggle />
        <NotificationCenter />
        <UserProfileMenu />
      </div>
    </header>
  )
}
