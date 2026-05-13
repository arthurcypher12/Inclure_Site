import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isLoggedIn, isAdmin } = useAuth()
  const navigate = useNavigate()

  if (isLoggedIn) {
    navigate(isAdmin ? '/admin' : '/perfil', { replace: true })
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setErro('')
    setLoading(true)
    setTimeout(() => {
      const res = login(email, senha)
      if (res.ok) {
        navigate(email === 'admin@inclure.com.br' ? '/admin' : '/', { replace: true })
      } else {
        setErro(res.msg)
      }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="auth">
      <div className="acesso-box">
        <h2>Entrar</h2>
        <form className="campos" onSubmit={handleSubmit}>
          <input className="campo-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="campo-input" type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} required />
          {erro && <div className="caixa-erro">{erro}</div>}
          <button type="submit" className="btn btn-verm btn-submit-full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          <div className="acesso-link">Não tem conta? <Link to="/cadastro">Cadastre-se</Link></div>
          <div className="acesso-link"><Link to="/esqueci-senha">Esqueci minha senha</Link></div>
        </form>
      </div>
    </div>
  )
}
