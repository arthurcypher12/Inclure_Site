import { useNavigate } from 'react-router-dom'
import { detalheNeuro } from '../../data/mockData'

export default function Neurodivergencias() {
  const navigate = useNavigate()
  const itens = Object.entries(detalheNeuro)

  return (
    <div className="principal">
      <div className="topo">
        <h1 className="titulo-sec">Neurodivergências</h1>
        <p className="subtitulo">Conheça as principais neurodivergências, suas características e formas de apoio</p>
      </div>
      <div className="neuro-grade">
        {itens.map(([slug, d]) => (
          <div className="neuro-card" key={slug}>
            <div className="neuro-banner"><img src={d.img} alt={d.titulo} /></div>
            <div className="neuro-dados">
              <h3>{d.titulo}</h3>
              <p>{d.descricao.substring(0, 120)}...</p>
              <button className="btn-detalhe" onClick={() => navigate(`/neurodivergencias/${slug}`)}>
                Mais detalhes
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
