import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { getOngs, postOng } from '../../services/api'
import { ongs as mockOngs } from '../../data/mockData'
import lupaImg from '../../assets/lupa.png'
import telefoneImg from '../../assets/telefone.png'
import emailImg from '../../assets/email.png'
import webIconImg from '../../assets/web-icon.png'

const LIMITE = 4
const ESTADOS = ['SP', 'RJ', 'MG', 'RS', 'PR']
const CONDICOES = ['TEA/Autismo', 'TDAH', 'Dislexia', 'TOC', 'Múltiplas']
const FORM_ONG_INICIAL = { nome: '', estado: 'SP', condicao: 'TEA/Autismo', descricao: '', servicos: '', telefone: '', email: '', site: '', img: '' }

export default function ONGs() {
  const [lista, setLista] = useState([])
  const [filtrados, setFiltrados] = useState([])
  const [busca, setBusca] = useState('')
  const [estado, setEstado] = useState('')
  const [cond, setCond] = useState('')
  const [modalOng, setModalOng] = useState(false)
  const [formOng, setFormOng] = useState(FORM_ONG_INICIAL)
  const [viu, setViu] = useState(false)
  const [loading, setLoading] = useState(true)
  const { isAdmin } = useAuth()

  const carregar = () => {
    const removidas = JSON.parse(localStorage.getItem('inclure_ongs_removidas') || '[]')
    getOngs().then(res => {
      const todas = res.data.filter(o => !removidas.includes(o.id))
      setLista(todas); setFiltrados(todas); setLoading(false)
    }).catch(() => {
      const extra = JSON.parse(localStorage.getItem('inclure_ongs_extra') || '[]')
      const todas = [...mockOngs, ...extra].filter(o => !removidas.includes(o.id))
      setLista(todas); setFiltrados(todas); setLoading(false)
    })
  }

  useEffect(() => { carregar() }, [])

  const filtrar = () => {
    const b = busca.toLowerCase()
    setFiltrados(lista.filter(o =>
      o.nome.toLowerCase().includes(b) &&
      (!estado || o.estado === estado) &&
      (!cond || o.condicao.includes(cond))
    ))
    setViu(false)
  }

  const limpar = () => { setBusca(''); setEstado(''); setCond(''); setFiltrados(lista); setViu(false) }

  const handleFotoOng = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setFormOng(f => ({ ...f, img: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleAddOng = (e) => {
    e.preventDefault()
    const payload = {
      ...formOng,
      servicos: formOng.servicos.split(',').map(s => s.trim()).filter(s => s)
    }
    if (!payload.img) payload.img = 'https://placehold.co/800x200/cccccc/ffffff?text=Capa'
    postOng(payload).then(() => {
      alert('ONG adicionada com sucesso!')
      setModalOng(false)
      setFormOng(FORM_ONG_INICIAL)
      carregar()
    })
  }

  const handleDelete = (id) => {
    if (!window.confirm('Excluir esta ONG?')) return
    const rem = JSON.parse(localStorage.getItem('inclure_ongs_removidas') || '[]')
    rem.push(id)
    localStorage.setItem('inclure_ongs_removidas', JSON.stringify(rem))
    const extra = JSON.parse(localStorage.getItem('inclure_ongs_extra') || '[]')
    localStorage.setItem('inclure_ongs_extra', JSON.stringify(extra.filter(o => o.id !== id)))
    const nova = lista.filter(o => o.id !== id)
    setLista(nova); setFiltrados(nova)
  }

  const visiveis = viu ? filtrados : filtrados.slice(0, LIMITE)

  return (
    <div className="principal">
      <div className="topo">
        <h1 className="titulo-sec">ONGs e Recursos</h1>
        <p className="subtitulo">Encontre organizações e instituições que oferecem suporte para pessoas neurodivergentes e suas famílias</p>
      </div>

      <div className="aviso">
        <img src="https://placehold.co/26x26/2e7d32/white?text=?" alt="Dúvida" />
        Muitas dessas ONGs oferecem serviços gratuitos para famílias de baixa renda. Entre em contato para saber sobre os requisitos de acesso.
      </div>

      <div className="filtro">
        <div className="busca">
          <input type="text" placeholder="Buscar ONGs..." value={busca} onChange={e => setBusca(e.target.value)} />
          <img src={lupaImg} alt="Buscar" />
        </div>
        <select className="seletor" value={estado} onChange={e => setEstado(e.target.value)}>
          <option value="">Estado</option>
          {ESTADOS.map(e => <option key={e}>{e}</option>)}
        </select>
        <select className="seletor" value={cond} onChange={e => setCond(e.target.value)}>
          <option value="">Condições</option>
          {CONDICOES.map(c => <option key={c}>{c}</option>)}
        </select>
        <button className="btn-filtrar" onClick={filtrar}>Filtrar</button>
        <button className="btn-limpar" onClick={limpar}>Limpar</button>
      </div>

      {isAdmin && (
        <div className="topo-admin-acao">
          <button className="btn btn-verde" onClick={() => setModalOng(true)}>Adicionar ONG</button>
        </div>
      )}

      {loading ? <p className="texto-carregando">Carregando...</p> : (
        <>
          <div className="ong-grade" id="listaOngs">
            {visiveis.map(o => (
              <div className="ong-card" key={o.id}>
                <div className="ong-banner"><img src={o.img} alt={o.nome} /></div>
                <div className="ong-dados">
                  <div className="ong-nome">{o.nome}</div>
                  <div className="ong-meta">
                    <span className="tag">{o.condicao}</span>
                    <span className="ong-estado">{o.estado}</span>
                  </div>
                  <div className="ong-desc">{o.descricao}</div>
                  <div className="ong-servicos">
                    <strong>Serviços:</strong>
                    <div className="ong-tags">{o.servicos.map((s, i) => <span className="ong-tag" key={i}>{s}</span>)}</div>
                  </div>
                  <div className="ong-barra">
                    <span><img src={telefoneImg} alt="Tel" />{o.telefone}</span>
                    <span><img src={emailImg} alt="Email" />{o.email}</span>
                    <span><img src={webIconImg} alt="Site" />{o.site}</span>
                  </div>
                  {isAdmin && (
                    <div className="admin-btns admin-btns-topo">
                      <button className="btn-admin-del" onClick={() => handleDelete(o.id)}>Excluir</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {!viu && filtrados.length > LIMITE && (
            <div className="ver-mais"><button className="btn btn-teal" onClick={() => setViu(true)}>Ver Mais</button></div>
          )}
          {filtrados.length === 0 && <p className="texto-vazio">Nenhuma ONG encontrada.</p>}
        </>
      )}

      {modalOng && (
        <div className="admin-modal-overlay" onClick={e => e.target.className.includes('overlay') && setModalOng(false)}>
          <div className="admin-modal">
            <h3>Adicionar Nova ONG</h3>
            <form onSubmit={handleAddOng} className="campos">
              <input className="campo-input" type="text" placeholder="Nome da ONG" value={formOng.nome} onChange={e => setFormOng(f => ({ ...f, nome: e.target.value }))} required />
              <div className="grupo-campos">
                <select className="campo-input seletor" value={formOng.estado} onChange={e => setFormOng(f => ({ ...f, estado: e.target.value }))} required>
                  {ESTADOS.map(e => <option key={e}>{e}</option>)}
                </select>
                <select className="campo-input seletor" value={formOng.condicao} onChange={e => setFormOng(f => ({ ...f, condicao: e.target.value }))} required>
                  {CONDICOES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <textarea className="campo-input area-txt" placeholder="Descrição" value={formOng.descricao} onChange={e => setFormOng(f => ({ ...f, descricao: e.target.value }))} required />
              <input className="campo-input" type="text" placeholder="Serviços (separados por vírgula)" value={formOng.servicos} onChange={e => setFormOng(f => ({ ...f, servicos: e.target.value }))} required />
              <div className="grupo-campos">
                <input className="campo-input" type="tel" placeholder="Telefone" value={formOng.telefone} onChange={e => setFormOng(f => ({ ...f, telefone: e.target.value }))} required />
                <input className="campo-input" type="email" placeholder="Email" value={formOng.email} onChange={e => setFormOng(f => ({ ...f, email: e.target.value }))} required />
              </div>
              <input className="campo-input" type="text" placeholder="Site (opcional)" value={formOng.site} onChange={e => setFormOng(f => ({ ...f, site: e.target.value }))} />
              
              <div className="grupo-campos-coluna">
                <label className="label-upload">Imagem de Capa</label>
                <input type="file" accept="image/*" onChange={handleFotoOng} className="campo-input input-arquivo" />
                {formOng.img && <img src={formOng.img} alt="Preview" className="preview-banner" />}
              </div>

              <div className="admin-modal-btns">
                <button type="button" className="btn btn-cinza" onClick={() => setModalOng(false)}>Cancelar</button>
                <button type="submit" className="btn btn-verde">Adicionar ONG</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
