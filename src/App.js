import './App.css';
import MainView from './components/MainView'
//import data
import fio_calc from "./data/fio_calc.json";
import fio_throughput from "./data/fio_throughput.json";
  
function App() {
  
  console.log(fio_calc);
  return (
    <div className="App">
      <MainView
        calc = {fio_calc}
        throughput = {fio_throughput}
      />
    </div>

  );
}

export default App;

