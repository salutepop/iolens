import './App.css';
import MainView from './components/MainView'
//import data
import queue from "./data/queue.json";
import latency from "./data/latency.json";
import lba from "./data/LBA.json";
import throughput from "./data/throughput.json";

function App() {

  console.log(queue)
  return (
    <div className="App">
      <MainView
        queue = {queue}
        latency = {latency}
        lba = {lba}
        throughput = {throughput}
      />
    </div>

  );
}

export default App;

