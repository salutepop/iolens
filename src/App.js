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
  const gColor = [
    "#1f78b4",  // blue
    "#e31a1c",  // red
    "#33a02c",  // green
    "#ffffff",  // white
    "#666666",  // gray
    "#a6cee3",  // light blue
    "#fb9a99",  // light red
    "#000000",  // black
  ]
  const gColorRGBA = [
    "rgba(31, 120, 180,   0.3)",  // blue 0
    "rgba(227, 26, 28 ,   0.3)",  // red 1
    "rgb(51, 160, 44  ,   0.3)",  // green 2
    "rgba(255, 255, 255,  0.3)",  // white 3
    "rgba(102, 102, 102,  0.3)",  // gray 4
    "rgba(166, 206, 227,  0.3)",  // light blue 5
    "rgba(251, 154, 153,  0.3)",  // light red 6
    "rgba(0, 0, 0,        0.3)",  // black 7

  ]
  //["#7fc97f","#beaed4","#fdc086","#ffff99","#386cb0","#f0027f","#bf5b17","#666666"]
    // ["#a6cee3","#1f78b4","#b2df8a","#33a02c","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]
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
        gColorRGBA = {gColorRGBA}
      />
    </div>

  );
}

export default App;

