### Graph
- LBA Heatmap
  - 5,000,000 Points rendering 불가 (전체 450초, 실질적으로 300초 data)
  - x 축은 1초 단위로 분할
  - y 축은 실험해보고 결정 (20~30개 수준?)
  - cell value는 points 수 (point = i/o request)
  - 200MB 수준의 데이터이긴한데, 필요하면 데이터 전처리해서 진행

- CPU Heatmap **[top]**
  - x 축은 1초 단위로 분할
  - y 축은 Core Number (8 core system)
  - cell value는 Core 사용률 표현 (usr / sys / idle 를 어떻게 표현 할지는 고민)

- Memory Stacked Line **[top]**
  - total 기준, 3개 항목을 쌓아서 표현; used / free / buffer(cache)

  
### Data 추가 [표현 방식 결정]
- Function trace (F2FS) **[Hover / Graph / ...]**
  - 매 초 마다 CPU 연산량이 높은 function Top 10을 제공
  
- F2FS Status : **[Graph / ...]**
  - 매 초 마다 File system status 제공
    ```python
    class STATUS:
        time        :int    # sec
        util        :int    # %
        seg_valid   :int   # # of segments
        seg_dirty   :int
        seg_prefree :int
        seg_free    :int
        cp_calls    :int    # counts
        cp_fg_calls :int    # counts
        cp_bg_calls :int    # counts
        gc_calls    :int    # counts
        memory      :int  # kB
    ```

### UI
- material UI(react) : https://mui.com/
- Graph 배색(고대비 위주로 찾아보기) : https://colorhunt.co/


### 전처리
- (완료) f2fs_status
- (완료) top
- (완료) trace_scsi **[points]**
- trace_func
- trace_scsi **[points -> heatmap]**




### Stack Area chart (필수) (https://d3-graph-gallery.com/stackedarea.html)
 - Memory
 - 같이 디버깅하기
### Heatmap + Line chart => Scatter (필수) (https://d3-graph-gallery.com/graph/heatmap_basic.html)
 - Y축 Align 수정 v
 - 모듈형태로 바꿔서 latency, qd 그리기 v
 - legend
 - histogram -> line plot으로
 - 기존 brushedData 형식 유지해서 brush 구현 (데이터 머지)
### Correlation chart (필수) (https://d3-graph-gallery.com/graph/density2d_shading.html)
 - User가 X/Y 선택 할 수 있는 View
 - 히스토그램 그리기
### Func Top 10 data
 - Hovering
### F2FS Status 표현
### UI 꾸미기 / Color 배색
### Spider/Star chart (후순위) (https://d3-graph-gallery.com/spider.html)
 - Summary data에 전체 / 브러싱

 ### csv -> json
 - https://tableconvert.com/ko/csv-to-json
 