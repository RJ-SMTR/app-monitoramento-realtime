import { useContext, useState } from "react"
import { MovingMarkerContext } from "../../hooks/getMovingMarkers"
import Select from 'react-select';

function Tables() {
    const {tracked, trackedSPPO, selectedLinhas, setSelectedLinhas, setShowSPPO, setShowBRT, showBRT, showSPPO, enabledColors, setEnabledColors, colors } = useContext(MovingMarkerContext)
    const [allColors, setAllColors] = useState(true)
    const toggleColor = (color) => {
        setEnabledColors((prev) =>(
            {
            ...prev,
            [color]: !prev[color],
            })
        );
    };

    const toggleAllColors = () => {
        setAllColors((prevAllColors) => {

            setEnabledColors(prev =>
                Object.fromEntries(
                    Object.entries(prev).map(([color, value]) => [
                    color,
                    !prevAllColors,
                    ])
                )
                );

            return !prevAllColors
        }
        )
    }

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
    <div >
        
          <table className=" border-separate border-spacing-1 ">
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
                <tr>
                      <td>  <input
                          type="checkbox"
                          checked={showBRT}
                          onChange={() => setShowBRT(!showBRT)}
                      /></td>
                      
                      <td>
                          <input
                              type="checkbox"
                              checked={showSPPO}
                              onChange={() => setShowSPPO(!showSPPO)}
                          />
                      </td>
                </tr>

                
            </tbody>
        </table >
          <div className="my-10">
             <div className="my-10">
             <label  >Selecionar Linha SPPO: </label>
                <Select
                    value={selectedLinhas}
                    onChange={handleChange}
                    options={options}
                    isMulti
                    isSearchable
                    placeholder="Ex.: 101"
                    className="select"
                />
         </div>
         </div>
          <table className=" border-separate border-spacing-1 ">
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

          <table className="my-10 text-left">
            <thead>
                <th className="p-1">
                    Nova Pintura
                </th>
            </thead>
            <tbody>
                  <tr>
                    <td className="p-2">
                    <div className="flex items-center gap-2">
                        <input
                        type="checkbox"
                        checked={allColors}
                        onChange={toggleAllColors}
                        />
                        <span>
                        <b>Todos</b>
                        </span>
                    </div>
                    </td>
                  </tr>
                {
                    Object.entries(colors).map(([area, color], index) => (
                        <tr key={index}>
                            <td className="p-2">
                            <div className="flex items-center gap-2">
                                <input
                                type="checkbox"
                                checked={enabledColors[color]}
                                onChange={() => toggleColor(color)}
                                />

                                <div
                                className="w-4 h-4 rounded-sm border border-black"
                                style={{ backgroundColor: color }}
                                ></div>

                                <span>
                                {area}
                                </span>
                            </div>
                            </td>
                        </tr>
                        ))
                }

            </tbody>
        </table >
          
    </div>
  )
}

export default Tables