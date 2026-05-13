import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

const api = axios.create({ baseURL: BASE_URL })

api.interceptors.request.use(config => {
  const user = localStorage.getItem('inclure_user')
  if (user) {
    const { token } = JSON.parse(user)
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Mock fallback - retorna dados do localStorage quando API não está disponível
const mockResponse = (data) => Promise.resolve({ data })

// Auth
export const authLogin = (email, senha) => {
  if (USE_MOCK) return mockResponse({ token: 'mock-token', user: { email } })
  return api.post('/auth/login', { email, senha })
}

export const authCadastro = (dados) => {
  if (USE_MOCK) return mockResponse({ ok: true })
  return api.post('/auth/register', dados)
}

// Usuário
export const getMe = () => {
  if (USE_MOCK) return mockResponse(JSON.parse(localStorage.getItem('inclure_user') || '{}'))
  return api.get('/usuarios/me')
}

export const updateMe = (dados) => {
  if (USE_MOCK) return mockResponse({ ok: true })
  return api.put('/usuarios/me', dados)
}

// Profissionais
export const getProfissionais = () => {
  if (USE_MOCK) {
    const extra = JSON.parse(localStorage.getItem('inclure_profissionais_extra') || '[]')
    return import('../data/mockData.js').then(m => mockResponse([...m.profissionais, ...extra]))
  }
  return api.get('/profissionais')
}

export const postProfissional = (dados) => {
  if (USE_MOCK) {
    const extra = JSON.parse(localStorage.getItem('inclure_profissionais_extra') || '[]')
    const novo = { ...dados, id: Date.now(), validado: false }
    extra.push(novo)
    localStorage.setItem('inclure_profissionais_extra', JSON.stringify(extra))
    return mockResponse(novo)
  }
  return api.post('/profissionais', dados)
}

export const putProfissional = (id, dados) => {
  if (USE_MOCK) {
    const extra = JSON.parse(localStorage.getItem('inclure_profissionais_extra') || '[]')
    const idx = extra.findIndex(p => p.id === id)
    if (idx !== -1) { extra[idx] = { ...extra[idx], ...dados }; localStorage.setItem('inclure_profissionais_extra', JSON.stringify(extra)) }
    return mockResponse({ ok: true })
  }
  return api.put(`/profissionais/${id}`, dados)
}

export const deleteProfissional = (id) => {
  if (USE_MOCK) {
    const extra = JSON.parse(localStorage.getItem('inclure_profissionais_extra') || '[]')
    localStorage.setItem('inclure_profissionais_extra', JSON.stringify(extra.filter(p => p.id !== id)))
    return mockResponse({ ok: true })
  }
  return api.delete(`/profissionais/${id}`)
}

export const validarProfissional = (id, validado) => {
  if (USE_MOCK) {
    const key = 'inclure_validacoes'
    const val = JSON.parse(localStorage.getItem(key) || '{}')
    val[id] = validado
    localStorage.setItem(key, JSON.stringify(val))
    return mockResponse({ ok: true })
  }
  return api.put(`/profissionais/${id}/validar`, { validado })
}

// ONGs
export const getOngs = () => {
  if (USE_MOCK) {
    const extra = JSON.parse(localStorage.getItem('inclure_ongs_extra') || '[]')
    return import('../data/mockData.js').then(m => mockResponse([...m.ongs, ...extra]))
  }
  return api.get('/ongs')
}

export const postOng = (dados) => {
  if (USE_MOCK) {
    const extra = JSON.parse(localStorage.getItem('inclure_ongs_extra') || '[]')
    const nova = { ...dados, id: Date.now() }
    extra.push(nova)
    localStorage.setItem('inclure_ongs_extra', JSON.stringify(extra))
    return mockResponse(nova)
  }
  return api.post('/ongs', dados)
}

export const deleteOng = (id) => {
  if (USE_MOCK) {
    const base = JSON.parse(localStorage.getItem('inclure_ongs_removidas') || '[]')
    base.push(id)
    localStorage.setItem('inclure_ongs_removidas', JSON.stringify(base))
    const extra = JSON.parse(localStorage.getItem('inclure_ongs_extra') || '[]')
    localStorage.setItem('inclure_ongs_extra', JSON.stringify(extra.filter(o => o.id !== id)))
    return mockResponse({ ok: true })
  }
  return api.delete(`/ongs/${id}`)
}

// Artigos
export const getArtigos = () => {
  if (USE_MOCK) {
    const extra = JSON.parse(localStorage.getItem('inclure_artigos_extra') || '[]')
    return import('../data/mockData.js').then(m => mockResponse([...m.artigos, ...extra]))
  }
  return api.get('/artigos')
}

export const postArtigo = (dados) => {
  if (USE_MOCK) {
    const extra = JSON.parse(localStorage.getItem('inclure_artigos_extra') || '[]')
    const novo = { ...dados, id: Date.now() }
    extra.push(novo)
    localStorage.setItem('inclure_artigos_extra', JSON.stringify(extra))
    return mockResponse(novo)
  }
  return api.post('/artigos', dados)
}

export const deleteArtigo = (id) => {
  if (USE_MOCK) {
    const base = JSON.parse(localStorage.getItem('inclure_artigos_removidos') || '[]')
    base.push(id)
    localStorage.setItem('inclure_artigos_removidos', JSON.stringify(base))
    const extra = JSON.parse(localStorage.getItem('inclure_artigos_extra') || '[]')
    localStorage.setItem('inclure_artigos_extra', JSON.stringify(extra.filter(a => a.id !== id)))
    return mockResponse({ ok: true })
  }
  return api.delete(`/artigos/${id}`)
}

// Dashboard
export const getDashboard = () => {
  if (USE_MOCK) {
    const users = JSON.parse(localStorage.getItem('inclure_users') || '[]')
    const extraProf = JSON.parse(localStorage.getItem('inclure_profissionais_extra') || '[]')
    const extraOngs = JSON.parse(localStorage.getItem('inclure_ongs_extra') || '[]')
    const extraArtigos = JSON.parse(localStorage.getItem('inclure_artigos_extra') || '[]')
    return import('../data/mockData.js').then(m => mockResponse({
      totalUsuarios: users.length,
      porTipo: {
        neurodivergente: users.filter(u => u.tipo === 'neurodivergente').length,
        responsavel: users.filter(u => u.tipo === 'responsavel').length,
        profissional: users.filter(u => u.tipo === 'profissional').length,
      },
      totalProfissionais: m.profissionais.length + extraProf.length,
      profissionaisValidados: m.profissionais.filter(p => p.validado).length,
      totalOngs: m.ongs.length + extraOngs.length,
      totalArtigos: m.artigos.length + extraArtigos.length,
    }))
  }
  return api.get('/admin/dashboard')
}

export default api
