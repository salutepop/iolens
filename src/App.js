import './App.css';
import MainView from './components/MainView'
//import data
import fio_calc from "./data/fio_calc.json";
import fio_throughput from "./data/fio_throughput.json";
import fio_resource from "./data/fio_resource.json";
import top from "./data/top.json";
import heatmap_lba from "./data/heatmap_lba.json";
import heatmap_latency from "./data/heatmap_latency.json";
import heatmap_queue from "./data/heatmap_queue.json";
  
function App() {
  
  // console.log(fio_calc);
  return (
    <div className="App">
      <MainView
        calc={fio_calc}
        throughput={fio_throughput}
        resource={fio_resource}
        top={top}
        heatmap_lba={heatmap_lba}
        heatmap_latency={heatmap_latency}
        heatmap_queue={heatmap_queue}
      />
    </div>

  );
}

export default App;

