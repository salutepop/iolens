import './App.css';
import MainView from './components/MainView'
//import data
import fio_calc from "./data/fio_calc.json";
import fio_throughput from "./data/fio_throughput.json";
import fio_resource from "./data/fio_resource.json";
import heatmap_count from "./data/heatmap_count.json";
  
function App() {
  
  // console.log(fio_calc);
  return (
    <div className="App">
      <MainView
        calc={fio_calc}
        throughput={fio_throughput}
        resource={fio_resource}
        heatmap_count={heatmap_count}
      />
    </div>

  );
}

export default App;

