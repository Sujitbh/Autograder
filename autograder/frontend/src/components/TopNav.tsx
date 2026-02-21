import { ChevronRight, ChevronDown, GraduationCap, LogOut, Settings, User, Bell, BookOpen, Moon, Sun, StickyNote, CalendarDays } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { useNotesPanel } from './PageLayout';

interface TopNavProps {
  breadcrumbs?: { label: string; href?: string }[];
  userName?: string;
  userEmail?: string;
  hasUnreadNotifications?: boolean;
}

/**
 * Section 3.1 - Top Navigation Bar
 * 
 * Specifications:
 * - Position: Fixed to top of viewport, z-index 1000
 * - Dimensions: Full viewport width, height 64px
 * - Background: #6B0000 (--color-primary)
 * - Horizontal padding: 24px
 * - Layout: Flexbox with space-between, align-items center
 * 
 * Left Zone:
 * - ULM Shield Logo: 32×32px SVG, white fill, margin-right 12px
 * - App Name: "Autograder" — Inter Bold 18px, white, letter-spacing 0.5px
 * 
 * Center Zone:
 * - Breadcrumb trail: "Courses > CSCI 3020 > Assignments" (dynamic based on current route)
 * - Font: Inter Regular 13px, rgba(255,255,255,0.75)
 * - Separator: ">" (chevron-right icon 12px, white 50% opacity)
 * - Hidden on top-level pages (My Courses landing)
 * 
 * Right Zone (left to right):
 * - Notification bell icon: 24px, white, with red dot badge (8px, #FF4444) if unread notifications exist
 * - Divider: 1px vertical line, rgba(255,255,255,0.25), height 24px
 * - Faculty avatar: 32×32px circle, background --color-gold-accent, white initials (first + last), Inter Bold 13px
 * - Faculty name: Inter Medium 14px, white, max-width 160px, truncate with ellipsis
 * - Down chevron icon: 16px, white 75% opacity, triggers profile dropdown on click
 * 
 * Profile Dropdown Menu:
 * - Position: Absolute, top 68px, right 24px
 * - Dimensions: 220px wide, auto height
 * - Background: white, border-radius 12px, box-shadow elevation-2, border 1px solid var(--color-border)
 * - Row 1 (header): Avatar 40px + Name + Email, padding 16px, border-bottom 1px solid var(--color-border), non-clickable
 * - Row 2: Icon (User) + 'Account Settings' — navigates to /faculty/settings
 * - Row 3: Icon (BookOpen) + 'Help & Support' — opens in-app help modal or external docs
 * - Row 4: Icon (LogOut) + 'Sign Out' — navigates to /login after clearing session storage
 */
export function TopNav({
  breadcrumbs = [],
  userName: userNameProp,
  userEmail: userEmailProp,
  hasUnreadNotifications = false
}: TopNavProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { notesPanelOpen, toggleNotesPanel } = useNotesPanel();

  // Read current user from localStorage, fall back to props or defaults
  const currentUser = (() => {
    try {
      const stored = localStorage.getItem('autograde_current_user');
      if (stored) return JSON.parse(stored);
    } catch { }
    return null;
  })();

  const userName = userNameProp ?? (
    currentUser
      ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
      : 'Dr. Sarah Johnson'
  );
  const userEmail = userEmailProp ?? (currentUser?.email || 'sjohnson@ulm.edu');

  // Get initials from user name (first + last)
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleSignOut = () => {
    // Clear session storage
    localStorage.removeItem('autograde_auth');
    localStorage.removeItem('autograde_current_user');
    // Navigate to login
    router.push('/login');
    window.location.reload();
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 flex items-center justify-between"
      style={{
        height: '64px',
        backgroundColor: 'var(--color-nav-bg)',
        borderBottom: '1px solid var(--color-border)',
        paddingLeft: '24px',
        paddingRight: '24px',
        zIndex: 1000
      }}
    >
      {/* Left Zone: Logo + App Name */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => router.push('/courses')}
        role="button"
        aria-label="Go to courses"
      >
        <GraduationCap
          className="text-white"
          style={{
            width: '32px',
            height: '32px',
            marginRight: '12px'
          }}
        />
        <span
          className="text-white"
          style={{
            fontSize: '18px',
            fontWeight: 700,
            letterSpacing: '0.5px'
          }}
        >
          Autograder
        </span>
      </div>

      {/* Center Zone: Breadcrumb Trail (hidden on top-level pages) */}
      {breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2">
          {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight
                  className="text-white"
                  style={{
                    width: '12px',
                    height: '12px',
                    opacity: 0.5
                  }}
                />
              )}
              {crumb.href ? (
                <button
                  onClick={() => router.push(crumb.href!)}
                  className="hover:opacity-100 transition-opacity"
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.75)'
                  }}
                >
                  {crumb.label}
                </button>
              ) : (
                <span
                  style={{
                    fontSize: '13px',
                    color: 'rgba(255, 255, 255, 0.75)'
                  }}
                >
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Right Zone: Theme Toggle + Notification Bell + Divider + Profile */}
      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="relative hover:opacity-80 transition-opacity"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun className="text-white" style={{ width: '22px', height: '22px' }} />
          ) : (
            <Moon className="text-white" style={{ width: '22px', height: '22px' }} />
          )}
        </button>

        {/* Notification Bell with Red Dot Badge */}
        <button
          className="relative hover:opacity-80 transition-opacity"
          aria-label="Notifications"
        >
          <Bell
            className="text-white"
            style={{ width: '24px', height: '24px' }}
          />
          {hasUnreadNotifications && (
            <div
              className="absolute rounded-full"
              style={{
                width: '8px',
                height: '8px',
                backgroundColor: 'var(--color-error)',
                top: '0',
                right: '0'
              }}
            />
          )}
        </button>

        {/* Notes & Todos Toggle */}
        <button
          onClick={toggleNotesPanel}
          className="relative hover:opacity-80 transition-opacity"
          aria-label="Toggle notes panel"
          style={{
            background: notesPanelOpen ? 'rgba(255,255,255,0.15)' : 'none',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '6px',
            padding: '4px',
          }}
        >
          <StickyNote
            className="text-white"
            style={{ width: '22px', height: '22px' }}
          />
        </button>

        {/* Calendar Page */}
        <button
          onClick={() => router.push('/faculty/calendar')}
          className="relative hover:opacity-80 transition-opacity"
          aria-label="Assignment Calendar"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            borderRadius: '6px',
            padding: '4px',
          }}
        >
          <CalendarDays
            className="text-white"
            style={{ width: '22px', height: '22px' }}
          />
        </button>

        {/* Divider */}
        <div
          style={{
            width: '1px',
            height: '24px',
            backgroundColor: 'rgba(255, 255, 255, 0.25)'
          }}
        />

        {/* Profile Dropdown Trigger */}
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            {/* Faculty Avatar with Initials */}
            <div
              className="rounded-full flex items-center justify-center text-white"
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: 'var(--color-gold-accent)', // --color-gold-accent
                fontSize: '13px',
                fontWeight: 700
              }}
            >
              {getInitials(userName)}
            </div>

            {/* Faculty Name */}
            <span
              className="text-white truncate"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                maxWidth: '160px'
              }}
            >
              {userName}
            </span>

            {/* Down Chevron */}
            <ChevronDown
              className="text-white"
              style={{
                width: '16px',
                height: '16px',
                opacity: 0.75
              }}
            />
          </DropdownMenuTrigger>

          {/* Profile Dropdown Menu */}
          <DropdownMenuContent
            align="end"
            style={{
              position: 'absolute',
              top: '68px',
              right: '24px',
              width: '220px',
              backgroundColor: 'var(--color-surface)',
              borderRadius: '12px',
              boxShadow: 'var(--shadow-dropdown)',
              border: '1px solid var(--color-border)'
            }}
          >
            {/* Row 1: Header (Avatar + Name + Email) - Non-clickable */}
            <div
              className="flex items-center gap-3"
              style={{
                padding: '16px',
                borderBottom: '1px solid var(--color-border)'
              }}
            >
              <div
                className="rounded-full flex items-center justify-center text-white flex-shrink-0"
                style={{
                  width: '40px',
                  height: '40px',
                  backgroundColor: 'var(--color-gold-accent)',
                  fontSize: '14px',
                  fontWeight: 700
                }}
              >
                {getInitials(userName)}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className="truncate"
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--color-text-dark)',
                    marginBottom: '2px'
                  }}
                >
                  {userName}
                </p>
                <p
                  className="truncate"
                  style={{
                    fontSize: '12px',
                    color: 'var(--color-text-light)'
                  }}
                >
                  {userEmail}
                </p>
              </div>
            </div>

            {/* Row 2: Account Settings */}
            <DropdownMenuItem
              onClick={() => router.push('/faculty/settings')}
              className="cursor-pointer"
              style={{ padding: '12px 16px' }}
            >
              <User
                className="mr-3"
                style={{ width: '16px', height: '16px', color: 'var(--color-text-mid)' }}
              />
              <span style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>
                Account Settings
              </span>
            </DropdownMenuItem>

            {/* Row 3: Help & Support */}
            <DropdownMenuItem
              onClick={() => window.open('/help', '_blank')}
              className="cursor-pointer"
              style={{ padding: '12px 16px' }}
            >
              <BookOpen
                className="mr-3"
                style={{ width: '16px', height: '16px', color: 'var(--color-text-mid)' }}
              />
              <span style={{ fontSize: '14px', color: 'var(--color-text-dark)' }}>
                Help & Support
              </span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* Row 4: Sign Out */}
            <DropdownMenuItem
              onClick={handleSignOut}
              className="cursor-pointer"
              style={{ padding: '12px 16px' }}
            >
              <LogOut
                className="mr-3"
                style={{ width: '16px', height: '16px', color: 'var(--color-error)' }}
              />
              <span style={{ fontSize: '14px', color: 'var(--color-error)' }}>
                Sign Out
              </span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}