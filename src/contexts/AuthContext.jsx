import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

const ADMIN_EMAIL = 'admin@inclure.com.br'
const ADMIN_SENHA = 'inclure@admin2025'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('inclure_user')
    return saved ? JSON.parse(saved) : null
  })

  const isLoggedIn = !!user
  const isAdmin = user?.email === ADMIN_EMAIL
  const isProfissional = user?.tipo === 'profissional'

  const login = (email, senha) => {
    if (email === ADMIN_EMAIL && senha === ADMIN_SENHA) {
      const adminUser = {
        id: 0, nome: 'Administrador', email: ADMIN_EMAIL,
        tipo: 'admin', foto: null, isAdmin: true,
        neurodivergencia: null, isNeurodivergente: false, sexo: 'Homem'
      }
      setUser(adminUser)
      localStorage.setItem('inclure_user', JSON.stringify(adminUser))
      return { ok: true }
    }
    const users = JSON.parse(localStorage.getItem('inclure_users') || '[]')
    const found = users.find(u => u.email === email && u.senha === senha)
    if (!found) return { ok: false, msg: 'Email ou senha incorretos.' }
    const { senha: _, ...safe } = found
    setUser(safe)
    localStorage.setItem('inclure_user', JSON.stringify(safe))
    return { ok: true }
  }

  const cadastro = (dados) => {
    const users = JSON.parse(localStorage.getItem('inclure_users') || '[]')
    if (users.find(u => u.email === dados.email)) {
      return { ok: false, msg: 'Este email já está cadastrado.' }
    }
    const newUser = { ...dados, id: Date.now(), foto: null }
    users.push(newUser)
    localStorage.setItem('inclure_users', JSON.stringify(users))
    const { senha: _, ...safe } = newUser
    setUser(safe)
    localStorage.setItem('inclure_user', JSON.stringify(safe))
    return { ok: true }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('inclure_user')
  }

  const updateUser = (dados) => {
    const updated = { ...user, ...dados }
    setUser(updated)
    localStorage.setItem('inclure_user', JSON.stringify(updated))
    const users = JSON.parse(localStorage.getItem('inclure_users') || '[]')
    const idx = users.findIndex(u => u.id === user.id)
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...dados }
      localStorage.setItem('inclure_users', JSON.stringify(users))
    }
  }

  const updateFoto = (fotoBase64) => {
    updateUser({ foto: fotoBase64 })
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, isProfissional, login, cadastro, logout, updateUser, updateFoto }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
