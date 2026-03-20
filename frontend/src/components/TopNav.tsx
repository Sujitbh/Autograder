import { ChevronRight, ChevronDown, LogOut, User, MessageSquare, BookOpen, Moon, Sun, StickyNote, CalendarDays, ArrowLeftRight } from 'lucide-react';
import { LiveClock } from './LiveClock';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { useNotesPanel } from './PageLayout';
import { useTAStatus } from '@/hooks/queries/useTADashboard';
import { useAuth } from '@/utils/AuthContext';
import { useUnreadMessageCount } from '@/hooks/queries/useMessages';
import { useAllAssignments } from '@/hooks/queries';

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
 * - App Name: "Axiom" — Inter Bold 18px, white, letter-spacing 0.5px
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
}: Readonly<TopNavProps>) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { notesPanelOpen, toggleNotesPanel } = useNotesPanel();
  const { user: authUser, logout } = useAuth();

  // Use AuthContext user (reactive) instead of reading localStorage directly
  const currentUser = authUser as any;

  const isStudent = currentUser?.role === 'student';
  const { data: taStatus } = useTAStatus();
  const isTA = isStudent && taStatus?.is_ta;
  const isInTAView = pathname?.startsWith('/ta');

  const { data: unreadCount = 0 } = useUnreadMessageCount();
  const { data: apiAssignments = [] } = useAllAssignments();

  // Highlight assignments due today
  const dueTodayCount = apiAssignments.filter(a => {
    if (!a.dueDate) return false;
    const isIsoString = a.dueDate.includes('T');
    const d = isIsoString ? new Date(a.dueDate) : new Date(a.dueDate + 'T00:00:00');
    const today = new Date();
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    );
  }).length;


  const navFg = 'var(--color-nav-fg)';
  const navFgMuted = 'var(--color-nav-fg-muted)';
  const navFgSubtle = 'var(--color-nav-fg-subtle)';

  const handleSwitchView = () => {
    if (isInTAView) {
      router.push('/student');
    } else {
      router.push('/ta');
    }
  };

  const userFullName = userNameProp ?? (
    currentUser
      ? `${currentUser.firstName} ${currentUser.lastName}`.trim()
      : 'User'
  );
  const userFirstName = currentUser?.firstName || userFullName.split(' ')[0];
  const userName = userFullName;
  const userEmail = userEmailProp ?? (currentUser?.email || '');

  // Get initials from user name (first + last)
  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts.at(-1)![0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleSignOut = () => {
    // Use AuthContext logout which clears localStorage + React Query cache
    logout();
    // Navigate to login
    router.push('/login');
  };

  const getHomeRoute = () => {
    if (currentUser?.role === 'admin') return '/admin';
    if (isInTAView) return '/ta';
    if (currentUser?.role === 'student') return '/student';
    return '/courses';
  };

  const getSettingsRoute = () => {
    if (currentUser?.role === 'admin') return '/admin/account';
    if (currentUser?.role === 'student' || isInTAView) return '/student/settings';
    return '/faculty/settings';
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
      <button
        className="flex items-center cursor-pointer"
        onClick={() => router.push(getHomeRoute())}
        type="button"
        aria-label="Go to courses"
        style={{ background: 'none', border: 'none', padding: 0 }}
      >
        <img
          src="/images/axiom-logo.png"
          alt="Axiom"
          style={{
            width: '32px',
            height: '32px',
          }}
        />
      </button>

      {/* Center Zone: Breadcrumb Trail (hidden on top-level pages) */}
      {breadcrumbs.length > 0 && (
        <div className="flex items-center gap-2">
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.label} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight
                  className="text-white"
                  style={{
                    width: '12px',
                    height: '12px',
                    color: navFgSubtle,
                  }}
                />
              )}
              {crumb.href ? (
                <button
                  onClick={() => router.push(crumb.href!)}
                  className="hover:opacity-100 transition-opacity"
                  style={{
                    fontSize: '13px',
                    color: navFgMuted,
                  }}
                >
                  {crumb.label}
                </button>
              ) : (
                <span
                  style={{
                    fontSize: '13px',
                    color: navFgMuted,
                  }}
                >
                  {crumb.label}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Right Zone: Role Switcher + Theme Toggle + Notification Bell + Divider + Profile */}
      <div className="flex items-center gap-4">
        {/* TA ↔ Student Role Switcher */}
        {isTA && (
          <button
            onClick={handleSwitchView}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all hover:opacity-90"
            style={{
              backgroundColor: isInTAView ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.25)',
              fontSize: '12px',
              fontWeight: 600,
              color: navFg,
            }}
            title={isInTAView ? 'Switch to Student view' : 'Switch to TA view'}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            {isInTAView ? 'Student View' : 'TA View'}
          </button>
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="relative hover:opacity-80 transition-opacity"
          aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun className="text-white" style={{ width: '22px', height: '22px', color: navFg }} />
          ) : (
            <Moon className="text-white" style={{ width: '22px', height: '22px', color: navFg }} />
          )}
        </button>

        {/* Messaging Icon with Red Dot Badge (hidden for admin) */}
        {currentUser?.role !== 'admin' && (
          <button
            className="relative hover:opacity-80 transition-opacity"
            aria-label="Messages"
            onClick={() => router.push(currentUser?.role === 'student' ? '/student/messages' : '/faculty/messages')}
          >
            <MessageSquare
              className="text-white"
              style={{ width: '22px', height: '22px', color: navFg }}
            />
            {unreadCount > 0 && (
              <div
                className="absolute rounded-full flex items-center justify-center font-bold"
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#FACC15', // yellow-400
                  top: '-6px',
                  right: '-6px',
                  fontSize: '10px',
                  color: '#6B0000',
                  border: '2px solid var(--color-nav-bg)'
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </div>
            )}
          </button>
        )}

        {/* Notes & Todos Toggle (hidden for admin) */}
        {currentUser?.role !== 'admin' && (
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
              style={{ width: '22px', height: '22px', color: navFg }}
            />
          </button>
        )}

        {/* Calendar Page (hidden for admin) */}
        {currentUser?.role !== 'admin' && (
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
              style={{ width: '22px', height: '22px', color: navFg }}
            />
            {dueTodayCount > 0 && (
              <div
                className="absolute rounded-full flex items-center justify-center font-bold"
                style={{
                  width: '16px',
                  height: '16px',
                  backgroundColor: '#FACC15', // yellow-400
                  top: '-2px',
                  right: '-2px',
                  fontSize: '10px',
                  color: '#6B0000',
                  border: '2px solid var(--color-nav-bg)'
                }}
              >
                {dueTodayCount > 9 ? '9+' : dueTodayCount}
              </div>
            )}
          </button>
        )}

        {/* Live Date & Time */}
        <LiveClock variant="light" />

        {/* Divider */}
        <div
          style={{
            width: '1px',
            height: '24px',
            backgroundColor: navFgSubtle,
          }}
        />

        {/* Profile Dropdown Trigger */}
        <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            {/* Avatar — photo or initials */}
            {currentUser?.profilePhoto ? (
              <img
                src={currentUser.profilePhoto}
                alt=""
                className="rounded-full object-cover"
                style={{ width: '32px', height: '32px' }}
              />
            ) : (
              <div
                className="rounded-full flex items-center justify-center text-white"
                style={{
                  width: '32px',
                  height: '32px',
                  backgroundColor: 'var(--color-gold-accent)',
                  fontSize: '13px',
                  fontWeight: 700
                }}
              >
                {getInitials(userName)}
              </div>
            )}

            {/* First Name Only */}
            <span
              className="text-white truncate"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                maxWidth: '160px',
                color: navFg,
              }}
            >
              {userFirstName}
            </span>

            {/* Down Chevron */}
            <ChevronDown
              className="text-white"
              style={{
                width: '16px',
                height: '16px',
                color: navFgSubtle,
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
              {currentUser?.profilePhoto ? (
                <img
                  src={currentUser.profilePhoto}
                  alt=""
                  className="rounded-full object-cover flex-shrink-0"
                  style={{ width: '40px', height: '40px' }}
                />
              ) : (
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
              )}
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
              onClick={() => router.push(getSettingsRoute())}
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