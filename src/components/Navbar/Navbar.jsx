import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useTheme } from '../../contexts/ThemeContext'
import usuarioImg from '../../assets/usuario.png'
import simboloImg from '../../assets/simbolo.png'
import logotipoImg from '../../assets/logotipo.png'

export default function Navbar() {
  const { isLoggedIn, isAdmin, user, logout } = useAuth()
  const { darkMode, alternarTema } = useTheme()
  const [menuAberto, setMenuAberto] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => { setMenuAberto(false) }, [location])

  const handleLogout = () => { logout(); navigate('/') }

  const links = [
    { to: '/sobre', label: 'Sobre' },
    { to: '/neurodivergencias', label: 'Neurodivergências' },
    { to: '/profissionais', label: 'Profissionais' },
    { to: '/ongs', label: 'ONGs' },
    { to: '/blog', label: 'Blog' },
    { to: '/download', label: 'Download' },
  ]

  const TemaBtn = () => (
    <button className="tema-btn" onClick={alternarTema} aria-label="Alternar tema">
      <span className="icone-sol">☀️</span>
      <div className="thumb">{darkMode ? '🌙' : '☀️'}</div>
      <span className="icone-lua">🌙</span>
    </button>
  )

  return (
    <>
      <div className="nav-topo" id="navTopo">
        <div className="bloco-nav">
          <Link to="/" className="logo-site">
            <img src={simboloImg} alt="Logo Inclure" />
            <img src={logotipoImg} alt="Inclure" />
          </Link>
          <div className="links-nav">
            <ul className="lista-nav">
              {links.map(l => (
                <li key={l.to}>
                  <Link to={l.to} className={`link-nav${location.pathname === l.to ? ' ativo' : ''}`}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="area-tema"><TemaBtn /></div>
          <button
            className={`btn-menu${menuAberto ? ' aberto' : ''}`}
            id="btnMenu"
            onClick={() => setMenuAberto(v => !v)}
            aria-label="Menu"
          >
            <span /><span /><span />
          </button>
        </div>

        <div className="bloco-user">
          {isLoggedIn ? (
            <div className="area-login">
              <Link to={isAdmin ? '/admin' : '/perfil'} className="link-entrar nav-nome-user">
                {user?.nome?.split(' ')[0] || 'Perfil'}
              </Link>
              <Link to={isAdmin ? '/admin' : '/perfil'} className="link-avatar">
                <div className="avatar-usuario">
                  {user?.foto
                    ? <img src={user.foto} alt="Avatar" />
                    : <img src="/src/assets/usuario.png" alt="Avatar" />
                  }
                </div>
              </Link>
            </div>
          ) : (
            <div className="area-login">
              <Link to="/login" className="link-entrar">Acessar conta</Link>
              <Link to="/perfil" className="link-avatar">
                <div className="avatar-usuario">
                  <img src="/src/assets/usuario.png" alt="Avatar" />
                </div>
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className={`menu-mob${menuAberto ? ' aberto' : ''}`} id="menuMob">
        {links.map(l => (
          <Link key={l.to} to={l.to} className="link-nav">{l.label}</Link>
        ))}
        <div className="tema-mob">
          <span>Alternar tema</span>
          <TemaBtn />
        </div>
        {isLoggedIn ? (
          <>
            <Link to={isAdmin ? '/admin' : '/perfil'} className="btn-entrar-mob btn-entrar-mob-perfil">
              <div className="avatar-mini-menu">
                <img src={user?.foto || "/usuario.png"} className="avatar-mini-img" alt="Avatar" />
              </div>
              {user?.nome?.split(' ')[0] || 'Perfil'}
            </Link>
            <button onClick={handleLogout} className="btn-entrar-mob btn-entrar-mob-sair">
              Sair
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-entrar-mob">Entrar</Link>
            <Link to="/cadastro" className="btn-entrar-mob btn-entrar-mob-cadastrar">Cadastrar</Link>
          </>
        )}
      </div>
    </>
  )
}
