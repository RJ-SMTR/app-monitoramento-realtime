import { format } from "date-fns"
import logo from "../../assets/logo.png"
function Logos() {
    const time = new Date()
    const formattedHora = format(time, "yyyy-MM-dd HH:mm:ss")
  return (
<>
      <div className="logos">
          <div>
          <img className="max-w-[100px] md:max-w-[150px]"  src={logo}/>
          </div>
            <div className="info hidden sm:block">
                <h2>Painel de Últimas Posições dos Veículos - SPPO e BRT</h2>
                Dados atualizados a cada 1 minuto. Última atualização: {formattedHora}
            </div>
        
      </div>
      <div className="absolute info  block z-[10000] sm:hidden w-full bottom-0">
        <h2>Painel de Últimas Posições dos Veículos - SPPO e BRT</h2>
        Dados atualizados a cada 1 minuto. Última atualização: {formattedHora}
      </div>
      
</>
  )
}

export default Logos