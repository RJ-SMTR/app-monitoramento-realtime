import { useContext} from "react"
import { MovingMarkerContext } from "../../hooks/getMovingMarkers"
import Select from 'react-select';

function Tables() {
    const {tracked, trackedSPPO, selectedLinhas, setSelectedLinhas} = useContext(MovingMarkerContext)
    function countLinhas(data) {
        const linhaCounts = {};
        data.forEach(item => {
            const linha = item.linha;
            if (linhaCounts[linha]) {
                linhaCounts[linha] += 1;
            } else {
                linhaCounts[linha] = 1;
            }
        });
        return linhaCounts;
    }
    const linhaCounts = countLinhas(trackedSPPO);

    const options = Object.keys(linhaCounts).map(linha => ({
        value: linha,
        label: linha,
    }));

    const handleChange = selectedOptions => {
        setSelectedLinhas(selectedOptions);
    };

  return (
    <div className="tables">
        <table>
            <thead>
                <th>
                    BRT
                </th>
                <th>
                  SPPO
                </th>
            </thead>
            <tbody>
                <tr>
                      <td> {tracked.length}</td>
                      
                      <td>
                          {trackedSPPO.length}
                      </td>
                </tr>
                
            </tbody>
        </table>
          <label>Selecionar Linha SPPO: </label>
          <Select
              value={selectedLinhas}
              onChange={handleChange}
              options={options}
              isMulti
              isSearchable
              placeholder="Select Linhas"
              className="select"
          />
          <table className="flex">
              <thead>
                <tr>SPPO</tr>
                  <tr>
                      <th>Linha</th>
                      <th>Contagem</th>
                  </tr>
              </thead>
              <tbody>
                  {selectedLinhas
                      && selectedLinhas.map(selectedLinha => (
                          <tr key={selectedLinha.value}>
                              <td>{selectedLinha.value}</td>
                              <td>{linhaCounts[selectedLinha.value]}</td>
                          </tr>
                      ))
                     
                  }
              </tbody>
          </table>
    </div>
  )
}

export default Tables