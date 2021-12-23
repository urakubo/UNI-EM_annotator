# UNI-EM_annotator
UNI-EM annotator のページ。開発用。しばらく日本語のみで提供。

# 起動方法
Windows版の場合、

  - pip install -r requirements-win.txt

で必要moduleをインストールできる。
  - python runServer [annotator folder]

として起動。ChromeのURL欄に
  - http://localhost:3000/index.html
  
等と入力してWebアプリの起動を確認する。

# 課題

1. WebSocketによるクライアント間のデータ共有、サーバ本体への保存
    1. 表面オブジェクトの色と名前情報の共有・保存。
    2. 点オブジェクトの共有・保存。
    3. サーバ側で（Pythonを用いて）計算した体積・セグメント長などの情報を（ペイントオブジェクトの隠し属性として）共有・保存・出力。
        - 一応動作するが、"Calc Volumes"をクリックして表面積、体積などを計算した後、値がすぐにTabulator表／CSVファイルに反映されない。別の操作に同期して反映されるように見える。
        - _web_annotator\js\SyncPaint.js のL86より annotator\Annotator\sio.py のL35"update_paint_volumes"を呼び出している。これは成功していて、'area_reserv', 'length', ..., 'volume' の値を計算している。
        - その後、 data["sid"] = 0 としてsocket.idを意図的に未アップデートにして、await sio.emit('update')を発行して、Webアプリの表を更新しようとしている。ここがおかしい様だ。

1. View modeにおいて表面オブジェクトの>ペイント部分をクリックした場合にペイントIDが表示されるようにしたい。
    - 成功

1. 随時計算されるペイント面積とまとめて計算したペイント面積の値が食い違っている。原因究明。
    - 未成功

