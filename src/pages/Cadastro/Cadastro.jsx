import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

const TIPOS = [
  { value: 'neurodivergente', label: 'Neurodivergente', desc: 'Pessoa com TEA, TDAH, Dislexia, TOC ou outra neurodivergência.' },
  { value: 'responsavel', label: 'Responsável/Familiar', desc: 'Pai, mãe, tutor ou cuidador de pessoa neurodivergente.' },
  { value: 'profissional', label: 'Profissional', desc: 'Psicólogo, terapeuta, médico ou outro profissional da saúde.' },
]

const NEUROS = ['Autismo (TEA)', 'TOC', 'TDAH', 'Dislexia', 'Síndrome de Asperger', 'Discalculia', 'Prefiro não informar']

export default function Cadastro() {
  const [form, setForm] = useState({
    nome: '', dataNascimento: '', sexo: 'Homem',
    tipo: '', isNeurodivergente: false, neurodivergencia: '',
    email: '', senha: '', confirmarSenha: '',
  })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)
  const { cadastro, isLoggedIn } = useAuth()
  const navigate = useNavigate()

  if (isLoggedIn) { navigate('/', { replace: true }); return null }

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    setErro('')
    if (!form.tipo) { setErro('Selecione seu tipo de usuário.'); return }
    if (form.senha !== form.confirmarSenha) { setErro('As senhas não coincidem.'); return }
    if (form.senha.length < 6) { setErro('A senha deve ter pelo menos 6 caracteres.'); return }
    setLoading(true)
    setTimeout(() => {
      const res = cadastro({
        nome: form.nome, dataNascimento: form.dataNascimento, sexo: form.sexo,
        tipo: form.tipo, isNeurodivergente: form.isNeurodivergente,
        neurodivergencia: form.isNeurodivergente ? form.neurodivergencia : '',
        email: form.email, senha: form.senha,
      })
      if (res.ok) { navigate('/', { replace: true }) }
      else { setErro(res.msg) }
      setLoading(false)
    }, 500)
  }

  return (
    <div className="auth auth-wide">
      <div className="acesso-box">
        <h2>Cadastre-se</h2>
        <form className="campos" onSubmit={handleSubmit}>
          <div className="acesso-linha">
          <input className="campo-input input-flex" type="text" placeholder="Nome completo" value={form.nome} onChange={e => set('nome', e.target.value)} required />
            <input className="campo-input input-data" type="date" value={form.dataNascimento} onChange={e => set('dataNascimento', e.target.value)} required />
          </div>

          <div>
            <div className="label-sexo">Sexo</div>
            <div className="sexo">
              {['Homem', 'Mulher'].map(s => (
                <button type="button" key={s} className={`btn-sexo${form.sexo === s ? ' ativo' : ''}`} onClick={() => set('sexo', s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="def">
            <h3>Tipo de usuário</h3>
            <div className="texto-tipos">
              <strong>Quem pode usar o Inclure?</strong>
              <ul>
                {TIPOS.map(t => <li key={t.value}><strong>{t.label}:</strong> {t.desc}</li>)}
              </ul>
            </div>
            <select className="campo-input seletor seletor-full" value={form.tipo} onChange={e => set('tipo', e.target.value)} required>
              <option value="">Selecione seu perfil</option>
              {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>

          <div>
            <label className="toggle-neuro">
              <input type="checkbox" checked={form.isNeurodivergente} onChange={e => set('isNeurodivergente', e.target.checked)} />
              <label className="link-cursor">Sou uma pessoa neurodivergente</label>
            </label>
          </div>

          <div className={`${!form.isNeurodivergente ? 'campo-bloqueado' : ''} campo-relativo`}>
            <div className="label-sexo">
              Qual a sua neurodivergência?
            </div>
            <select className="campo-input seletor seletor-full" value={form.neurodivergencia} onChange={e => set('neurodivergencia', e.target.value)} disabled={!form.isNeurodivergente}>
              <option value="">Selecione (opcional)</option>
              {NEUROS.map(n => <option key={n}>{n}</option>)}
            </select>
            {!form.isNeurodivergente && (
              <div className="aviso-campo">
                Marque "Sou neurodivergente" para habilitar este campo.
              </div>
            )}
          </div>

          <input className="campo-input" type="email" placeholder="Email" value={form.email} onChange={e => set('email', e.target.value)} required />
          <input className="campo-input" type="password" placeholder="Senha (mínimo 6 caracteres)" value={form.senha} onChange={e => set('senha', e.target.value)} required />
          <input className="campo-input" type="password" placeholder="Confirmar senha" value={form.confirmarSenha} onChange={e => set('confirmarSenha', e.target.value)} required />

          {erro && <div className="caixa-erro">{erro}</div>}

          <button type="submit" className="btn btn-verm btn-submit-full" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
          <div className="acesso-link">Já tenho conta? <Link to="/login">Entrar</Link></div>
        </form>
      </div>
    </div>
  )
}
