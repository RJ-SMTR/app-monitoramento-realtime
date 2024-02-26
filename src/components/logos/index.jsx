import { format } from "date-fns"
import logo from "../../assets/logo.png"
import Image from "next/image"
function Logos() {
    const time = new Date()
    const formattedHora = format(time, "yyyy-MM-dd HH:mm:ss")
  return (
    <div className="logos">
         
        <div>
            <Image width={150} src={logo}/>
        </div>
          <div className="info">
              <h2>Painel de Últimas Posições dos Veículos - SPPO e BRT</h2>
              Dados atualizados a cada 1 minuto. Última atualização: {formattedHora}
          </div>
      
    </div>
  )
}

export default Logos