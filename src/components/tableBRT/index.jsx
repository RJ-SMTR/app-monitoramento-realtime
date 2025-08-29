import { useContext } from "react"
import { MovingMarkerContext } from "../../hooks/getMovingMarkers"
import Select from 'react-select';

function TablesBRT() {
    const { tracked,  selectedBRT, setSelectedBRT } = useContext(MovingMarkerContext)
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
    const linhaCounts = countLinhas(tracked);

    const options = Object.keys(linhaCounts).map(linha => ({
        value: linha,
        label: linha,
    }));

    const handleChange = selectedOptions => {
        setSelectedBRT(selectedOptions);
    };

    return (
        <div>
            <div className="my-10">
                <label className="w-full" >Selecionar Linha BRT: </label>
                <Select
                    value={selectedBRT}
                    onChange={handleChange}
                    options={options}
                    isMulti
                    isSearchable
                    placeholder="Ex.: 11"
                    className="select"
                />
            </div>
            <table className=" border-separate border-spacing-1 ">
                <thead>
                    <tr>BRT</tr>
                    <tr>
                        <th>Linha</th>
                        <th>Contagem</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedBRT
                        && selectedBRT.map(selectedLinha => (
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

export default TablesBRT