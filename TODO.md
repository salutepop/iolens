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

(1) https://colorhunt.co/palette/2b2a4cb31312ea906ceee2de
(2) https://colorhunt.co/palette/0d1282eeededf0de36d71313

### 전처리
- (완료) f2fs_status
- (완료) top
- (완료) trace_scsi **[points]**
- trace_func
- trace_scsi **[points -> heatmap]**



### Throughput graph 추가
- [X] (창민) latency 혹은 cpu util.과 함께 throughput line graph 추가?
- [X] (창민) Latency (line or area) / Throughput (Line)
### Stack Area chart (필수) (https://d3-graph-gallery.com/stackedarea.html)
- [x] Memory
- [x] 같이 디버깅하기
- [X] (지원) Legend 추가 (Legend는 모든 차트가 통일성을 갖춰야함) - width 150
- [X] F2FS Status 항목 중 Segment 정보 출력
- [X] (지원) F2FS Status 항목 중 GC / Check point event 추가 표현
  - [X] (지원) Background로 빠져있는 것 해결필요
- [X] (지원) Y축 잘리는 문제 수정 (단위 및 tick 조절), 단위는 y title에 추가 하는 것도 방법일 듯
### Heatmap + Line chart => Scatter (필수) (https://d3-graph-gallery.com/graph/heatmap_basic.html)
- [x] Y축 Align 수정
- [x] 모듈형태로 바꿔서 latency, qd 그리기
- [X] (효림) Legend 추가 (Legend는 모든 차트가 통일성을 갖춰야함) - width 150
  - [X] (효림) Legend 위아래 뒤집기기
- [x] histogram -> line plot으로
- [x] 기존 brushedData 형식 유지해서 brush 구현 (데이터 머지)
- [x] BrushedTime만 공통적으로 사용하도록 수정. 지금 localtime / setTime 이런거 다 없애기
- [x] BrushedTime 중복값 제거하기
- [x] BrushedTime은 Dictionary가 아니라, 문자열 Array로 변경하기 (Dict는 가져다 쓸 때 불편함)
- [X] (효림) Y축 잘리는 문제 수정 (단위 및 tick 조절), 단위는 y title에 추가 하는 것도 방법일 듯
### Correlation chart (필수) (https://d3-graph-gallery.com/graph/density2d_shading.html)
- [x] User가 X/Y 선택 할 수 있는 View
- [x] 히스토그램 그리기
### Func Top 10 data
- [x] 데이터 파싱
- [x] (창민) Hovering - 메모리 차트에 mouseover event
### F2FS Status 표현
### UI 꾸미기 / Color 배색
- [ ] UI 고민
  - [ ] 배치 (화요일) 
  - [X] (창민) Color 연동 작업 (app.js 부터 color로 내리기)
  - [X] (지원) Font 통일
### Heat map for CPU
- [X] (효림) cpu graph 필요.
  - [ ] (효림) 조금더 다듬어보기
### Spider/Star chart (후순위) (https://d3-graph-gallery.com/spider.html)
- [X] (창민) Summary data에 전체 / 브러싱
- [X] (창민) Spider chart
  - [x] (지원) Toggle 혹은, 축에 데이터 합치기, 혹은 병렬 배열
  - [x] (지원) Legend 추가 (Total / Brushed)
### 나머지 차트에도 
(효림) Brush 적용
### Data import 정보
```javascript
  let data = {
    lba: lba,
    latency: latency,
    queue: queue,
    top : top,
    func_top3 : func_top3,
    f2fs_status : f2fs_status,
  }
```

 ### csv -> json
 - https://tableconvert.com/ko/csv-to-json
 

###
- [x] CPU Chart stack으로변경 (usr /sys)
- [x] Check box 연동 및 이동
- [x] 보조 Title로 단위 표현 (L:, R: ~_)
- [ ] UI 배치
- [ ] Color 선택
- [x] Heatmap legend 수정 (max / 단위 까지 나오게)
- [x] brush - Performance /hover - CPU chart  분리
- [ ] CP/GC 점선 legend 추가




<왼쪽>
Introduction (Background)
Domain situation + Requirement
System description

Visualization 종류
 1. Heatmap + Histogram
 2. Stacked Area
 3. Line + Area
 4. Radar
 5. Scatter + Contour

<전체화면>

Interaction
 1. Checkbox : Chart visible
 2. Hovering : Top3 function
 3. Brush
    1. Time축 align
    2. Summary
    3. Correlation

<오른쪽>
System description 이어서
Evalution
Conclusion


- [x] stack chart line (100%표현) // 창민
- [x] correlation chart x축 열리는 방향 전환 // 창민
- color : performance , memory그래프에서 빨/파 제외한 색 사용 (throughput -> grey, brown, orange, 보라색) // 효림 

- CPU 코어별 정렬해서 표현 //효림
- [x] tooltip (Hovering) // 설명-창민 event-창민
- [x] Radar chart에서 마우스 오버로 숫자 데이터 표현 // 창민
- [ ] Radar chart hovering 넣은 후 중첩되는 문제 발생함.
------------------------------------------------
- zoom in 



