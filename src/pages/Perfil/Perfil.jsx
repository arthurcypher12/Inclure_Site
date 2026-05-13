import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import usuarioImg from "../../assets/usuario.png";

const NEUROS = ['Autismo (TEA)', 'TOC', 'TDAH', 'Dislexia', 'Síndrome de Asperger', 'Discalculia', 'Prefiro não informar']
const TIPOS = [{ value: 'neurodivergente', label: 'Neurodivergente' }, { value: 'responsavel', label: 'Responsável/Familiar' }, { value: 'profissional', label: 'Profissional' }]

export default function Perfil() {
  const { user, updateUser, updateFoto, logout } = useAuth()
  const navigate = useNavigate()
  const inputFotoRef = useRef()
  const [form, setForm] = useState({
    nome: user?.nome || '',
    email: user?.email || '',
    telefone: user?.telefone || '',
    dataNascimento: user?.dataNascimento || '',
    tipo: user?.tipo || '',
    sexo: user?.sexo || 'Homem',
    isNeurodivergente: user?.isNeurodivergente || false,
    neurodivergencia: user?.neurodivergencia || '',
  })
  const [toast, setToast] = useState(null)

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 3000) }

  const handleFoto = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      updateFoto(ev.target.result)
      showToast('✅ Foto atualizada!')
    }
    reader.readAsDataURL(file)
  }

  const handleSalvar = (e) => {
    e.preventDefault()
    updateUser(form)
    showToast('✅ Perfil salvo com sucesso!')
  }

  const handleLogout = () => { logout(); navigate('/') }

  const tipoBadge = {
    neurodivergente: { label: 'Neurodivergente', bg: '#e3f2fd', color: '#1565c0' },
    responsavel: { label: 'Responsável', bg: '#fce4ec', color: '#c2185b' },
    profissional: { label: 'Profissional', bg: '#e8f5e9', color: '#2e7d32' },
    admin: { label: 'Administrador', bg: '#e8eaf6', color: '#3f51b5' },
  }
  const badge = tipoBadge[user?.tipo] || tipoBadge.neurodivergente

  return (
    <div className="perfil">
      {toast && <div className="toast">{toast}</div>}
      <div className="topo">
        <h1 className="titulo-sec">Meu Perfil</h1>
        <p className="subtitulo">Gerencie suas informações pessoais e preferências da conta</p>
      </div>

      <div className="perfil-card">
        <div className="perfil-avatar">
          <div className="perfil-avatar-img">
            <img src={user?.foto || '/src/assets/usuario.png'} alt="Avatar" id="avatarPerfilImg" />
          </div>
          <button className="btn-foto" onClick={() => inputFotoRef.current.click()}>Editar foto</button>
          <input type="file" ref={inputFotoRef} accept="image/*" className="input-oculto" onChange={handleFoto} />
        </div>
        <div className="perfil-info">
          <h2>{user?.nome || 'Nome do Usuário'}</h2>
          <div className="perfil-cargo">Usuário Inclure</div>
          <span className="perfil-badge" style={{ background: badge.bg, color: badge.color }}>{badge.label}</span>
        </div>
      </div>

      <form onSubmit={handleSalvar}>
        <div className="perfil-secao">
          <h3>Informações pessoais</h3>
          <div className="perfil-campos">
            <div className="campo">
              <label>Nome completo</label>
              <input className="campo-input" type="text" value={form.nome} onChange={e => set('nome', e.target.value)} placeholder="Seu nome completo" />
            </div>
            <div className="campo">
              <label>E-mail</label>
              <input className="campo-input" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="seu@email.com" />
            </div>
            <div className="campo">
              <label>Telefone</label>
              <input className="campo-input" type="tel" value={form.telefone} onChange={e => set('telefone', e.target.value)} placeholder="(11) 99999-9999" />
            </div>
            <div className="campo">
              <label>Data de nascimento</label>
              <input className="campo-input" type="date" value={form.dataNascimento} onChange={e => set('dataNascimento', e.target.value)} />
            </div>
            <div className="campo">
              <label>Tipo de usuário</label>
              <select className="campo-input seletor" value={form.tipo} onChange={e => set('tipo', e.target.value)}>
                <option value="">Selecione seu perfil</option>
                {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="campo">
              <label>Sexo</label>
              <div className="sexo">
                {['Homem', 'Mulher'].map(s => (
                  <button type="button" key={s} className={`btn-sexo${form.sexo === s ? ' ativo' : ''}`} onClick={() => set('sexo', s)}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="campo full">
              <label className="toggle-neuro toggle-neuro-campo">
                <input type="checkbox" checked={form.isNeurodivergente} onChange={e => set('isNeurodivergente', e.target.checked)} />
                <span className="toggle-texto">Sou uma pessoa neurodivergente</span>
              </label>
              <div className={!form.isNeurodivergente ? 'campo-bloqueado' : ''}>
                <label className="label-neuro">
                  Neurodivergência
                </label>
                <select className="campo-input seletor seletor-full" value={form.neurodivergencia} onChange={e => set('neurodivergencia', e.target.value)} disabled={!form.isNeurodivergente}>
                  <option value="">Selecione (opcional)</option>
                  {NEUROS.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="perfil-acoes">
            <button type="button" className="btn-sair" onClick={handleLogout}>Sair da conta</button>
            <button type="button" className="btn-senha" onClick={() => navigate('/trocar-senha')}>Alterar senha</button>
            <button type="submit" className="btn-salvar">Salvar alterações</button>
          </div>
        </div>
      </form>
    </div>
  )
}
