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


- （１）WebSocketによるクライアント間のデータ共有、サーバ本体への保存
（a）表面オブジェクトの色と名前情報の共有・保存。
（b）点オブジェクトの共有・保存。
（c）サーバ側で（Pythonを用いて）計算した体積・セグメント長などの情報を（ペイントオブジェクトの隠し属性として）共有・保存・出力。

- （２）View modeにおいて表面オブジェクトの>ペイント部分をクリックした場合にペイントIDが表示されるようにしたい。
  -- 成功

- （３）随時計算されるペイント面積とまとめて計算したペイント面積の値が食い違っている。原因究明。
  -- 不明

●（２）は自力でできた。
●（１）をどうするか。

