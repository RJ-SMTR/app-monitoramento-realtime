import { format } from "date-fns"
import logo from "../../assets/logo.png"
function Logos() {
    const time = new Date()
    const formattedHora = format(time, "yyyy-MM-dd HH:mm:ss")
  return (
    <div className="logos">
        <div>
            <img width={150} src={logo}/>
        </div>
        <div className="info">
              Dados atualizados a cada 1 minuto. Última atualização: {formattedHora}
        </div>
    </div>
  )
}

export default Logos