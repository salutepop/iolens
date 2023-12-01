import './App.css';
import MainView from './components/MainView'
//import data

import top from "./data/top.json";
import func_top3 from "./data/func_top3.json"
import f2fs_status from "./data/f2fs_status.json"
import lba from "./data/heatmap_lba.json";
import latency from "./data/heatmap_latency.json";
import queue from "./data/heatmap_queue.json";
import throughput from "./data/throughput.json"

function App() {

  function parseData(data) {
    data.forEach(element=>{
      Object.keys(element).forEach((key)=>{
        element[key] = parseFloat(element[key])
      })
    })
  }

  // 일괄적으로 parseFloat, func_top3는 string으로 사용
  parseData(lba)
  parseData(latency)
  parseData(queue)
  parseData(top)
  parseData(f2fs_status)
  parseData(throughput)

  const data = {
    lba: lba,
    latency: latency,
    queue: queue,
    top: top,
    func_top3: func_top3,
    f2fs_status: f2fs_status,
    throughput: throughput,
  }


  // console.log(data)

  // console.log(fio_calc);
  return (
    <div className="App">
      <MainView
        data = {data}
      />
    </div>

  );
}

export default App;

