import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export function Navbar() {
  const user = useAppStore((state) => state.user)
  const logout = useAppStore((state) => state.logout)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
    navigate('/')
  }

  const initial = (user?.name || user?.userId || 'A')[0]

  return (
    <header className="topbar">
      <div />
      <div className="topbar-actions">
        <button className="icon-button notifications" title="Notifications" type="button">
          <span className="bell" aria-hidden>🔔</span>
          <span className="notif-dot" aria-hidden />
        </button>

        <div className="profile-shell" tabIndex={0} onBlur={() => setMenuOpen(false)}>
          <div className="avatar" aria-hidden onClick={() => setMenuOpen((v) => !v)}>
            {initial}
          </div>

          <div className="user-menu" onClick={() => setMenuOpen((v) => !v)}>
            <strong>{user?.name || user?.userId || 'Alex Wando'}</strong>
            <span>{user?.role || 'Admin'}</span>
          </div>

          {menuOpen && (
            <div className="user-dropdown" role="menu">
              <button className="link-button" type="button" onClick={handleLogout} role="menuitem">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
