### Graph
- LBA Heatmap
  - 5,000,000 Points rendering 불가 (약 450초 data)
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