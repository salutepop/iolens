import './App.css';
import MainView from './components/MainView'
//import data

import top from "./data/top.json";
import func_top3 from "./data/func_top3.json"
import f2fs_status from "./data/f2fs_status.json"
import lba from "./data/heatmap_lba.json";
import latency from "./data/heatmap_latency.json";
import queue from "./data/heatmap_queue.json";
  
function App() {
  let data = {
    lba: lba,
    latency: latency,
    queue: queue,
    top : top,
    func_top3 : func_top3,
    f2fs_status : f2fs_status,
  }
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

