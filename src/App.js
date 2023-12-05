import './App.css';
import MainView from './components/MainView'
//import data
import * as d3 from "d3";

import top from "./data/top.json";
import func_top3 from "./data/func_top3.json"
import f2fs_status from "./data/f2fs_status.json"
import lba from "./data/heatmap_lba.json";
import latency from "./data/heatmap_latency.json";
import queue from "./data/heatmap_queue.json";
import throughput from "./data/throughput.json"
import performance from "./data/performance.json"

function App() {
  const gColor = ["#e15759", "#a6cee3","#1f78b4","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]
  
  // ["#4e79a7","#f28e2c","#e15759","#76b7b2","#59a14f","#edc949","#af7aa1","#ff9da7","#9c755f","#bab0ab"]
    // [
    //   'rgb(43, 42, 76)',
    //   'rgb(179, 19, 18)',
    //   'rgb(234, 144, 108)',
    //   'rgb(238, 226, 222)',
    // ]

    // [
    //   'rgb(13, 18, 130)',
    //   'rgb(238, 237, 237)',
    //   'rgb(240, 222, 54)',
    //   'rgb(215, 19, 19)',
    // ]

    // [
    //   'rgb(166, 208, 221)',
    //   'rgb(255, 105, 105)',
    //   'rgb(255, 211, 176)',
    //   'rgb(255, 249, 222)',
    // ]

  function parseData(data) {
    data.forEach(element => {
      Object.keys(element).forEach((key, i) => {
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
  parseData(performance)

  const data = {
    lba: lba,
    latency: latency,
    queue: queue,
    top: top,
    func_top3: func_top3,
    f2fs_status: f2fs_status,
    throughput: throughput,
    performance, performance,
  }


  // console.log(data)

  // console.log(fio_calc);
  return (
    <div className="App">
      <MainView
        data={data}
        gColor = {gColor}
      />
    </div>

  );
}

export default App;

