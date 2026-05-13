import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function TrocarSenha() {
  const [form, setForm] = useState({ senhaAtual: '', novaSenha: '', confirmar: '' })
  const [erro, setErro] = useState('')
  const [ok, setOk] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setErro('')
    const users = JSON.parse(localStorage.getItem('inclure_users') || '[]')
    const found = users.find(u => u.email === user.email && u.senha === form.senhaAtual)
    if (!found) { setErro('Senha atual incorreta.'); return }
    if (form.novaSenha.length < 6) { setErro('A nova senha deve ter pelo menos 6 caracteres.'); return }
    if (form.novaSenha !== form.confirmar) { setErro('As senhas não coincidem.'); return }
    const atualizados = users.map(u => u.email === user.email ? { ...u, senha: form.novaSenha } : u)
    localStorage.setItem('inclure_users', JSON.stringify(atualizados))
    setOk(true)
  }

  if (ok) return (
    <div className="auth">
      <div className="acesso-box acesso-box-central">
        <div className="icone-confirmacao"><img src="https://placehold.co/64x64/4caf50/white?text=OK" alt="Sucesso" /></div>
        <h2>Senha alterada!</h2>
        <p className="mensagem-sucesso">Sua senha foi alterada com sucesso.</p>
        <button className="btn btn-verde btn-largura-total" onClick={() => navigate('/perfil')}>Voltar ao perfil</button>
      </div>
    </div>
  )

  return (
    <div className="auth">
      <div className="acesso-box">
        <h2>Alterar senha</h2>
        <form className="campos" onSubmit={handleSubmit}>
          <input className="campo-input" type="password" placeholder="Senha atual" value={form.senhaAtual} onChange={e => setForm(f => ({ ...f, senhaAtual: e.target.value }))} required />
          <input className="campo-input" type="password" placeholder="Nova senha (mínimo 6 caracteres)" value={form.novaSenha} onChange={e => setForm(f => ({ ...f, novaSenha: e.target.value }))} required />
          <input className="campo-input" type="password" placeholder="Confirmar nova senha" value={form.confirmar} onChange={e => setForm(f => ({ ...f, confirmar: e.target.value }))} required />
          {erro && <div className="caixa-erro">{erro}</div>}
          <button type="submit" className="btn btn-azul btn-submit-full">Alterar senha</button>
          <div className="acesso-link"><span onClick={() => navigate('/perfil')} className="link-voltar">Voltar ao perfil</span></div>
        </form>
      </div>
    </div>
  )
}
