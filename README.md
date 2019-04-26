# CyPk
cyber punk 
### 基本方針。
use.jsは常に最新を使うが、稼動済みのuse.jsはここに退避する。
それ以外は、ここ。
### スタンドアローンとしての管理。
　スタンドアローンの考え方は、一つのファイルはコア関数群とそのファイルの依存のみで成立する事である。フロント部のみ、複数のファイルを受け入れて良い。また、スタンドアローンの強度を示す為に、レベルを設定する。 
- G0：完全なスタンドアローン。一つのファイルのみで稼動する。
- G1：コア関数群のファイル一つと依存する。
- G2：複数のファイルの複雑な依存がある。
- 数字が若い程、スタンドアローンである。

 ＊コア関数群とは、この場合use.jsを指す。また、cssとの依存もカウントする。あるjsがcssを必要とするのであればG1以上である。
### ファイル
```
https://codepen.io/gnjo/pen/MRXOEx.css?cyberpunk=4&g=0
https://gnjo.github.io/spinner.js?v=2&g=0
https://codepen.io/gnjo/pen/OGEQWy.css?CyPk=1&g=2
 
https://gnjo.github.io/e3.js?v=2&g=0
https://gnjo.github.io/use.js?v=3&g=0
https://gnjo.github.io/togist.js?v=1?&g=0
https://gnjo.github.io/keyCmd.js?v=0&g=0
https://gnjo.github.io/mo.js?v=0&g=2
https://codepen.io/gnjo/pen/mgpPEB.js?plainList=8&g=2
https://gnjo.github.io/filter.js?v=2&g=0
https://gnjo.github.io/imgc.js?v=1&g=2
https://gnjo.github.io/imageReader.js?v=1&g=0
https://codepen.io/gnjo/pen/JVadma.js?doropandpop=3&g=2
https://codepen.io/gnjo/pen/OGEQWy.js?CyPk=1&g=2

https://gnjo.github.io/loader.js?v=1&g=0
```

### loader.js
ファイルの一覧を列挙して、スクリプトとスタイルシートを完全に記述順で読み込む。内部的にはonloadをpromise化している。
```chunk:true``` でファイルの末尾に適当な文字列を添付しキャッシュを無効化する。documentの生成もjsに巻けば、html部にはローダーの記述だけで済む。スクリプトか、スタイルシートかの判断はファイルの拡張子で行っている為、その判断が不明な場合は特別に```css("https://...")```,```js("https://...")```を加えると判別出来る。
```
<!--html usage-->

<script type="text/plain" data-loader>
https://codepen.io/gnjo/pen/MRXOEx.css?cyberpunk=4
https://gnjo.github.io/spinner.js?v=2
https://codepen.io/gnjo/pen/OGEQWy.css?CyPk=1
 
https://gnjo.github.io/e3.js?v=2
https://gnjo.github.io/use.js?v=3
https://gnjo.github.io/togist.js?v=1
https://gnjo.github.io/keyCmd.js
https://gnjo.github.io/mo.js
https://codepen.io/gnjo/pen/mgpPEB.js?plainList=8
https://gnjo.github.io/filter.js?v=2
https://gnjo.github.io/imgc.js
https://gnjo.github.io/imageReader.js
https://codepen.io/gnjo/pen/JVadma.js?doropandpop=3
https://codepen.io/gnjo/pen/OGEQWy.js?CyPk=1
</script>
<script src="https://gnjo.github.io/loader.js" onload="loader({chunk:true})"></script>

```
一つのファイルの読み込みをレポートする為に幾つかコールバックが用意されている。
```
loader({
   auto:true
   ,target:document.querySelector('script[data-loader]')
   ,sleep:0
   ,chunk:true
   ,text:false
   ,onStart:(ret)=>{/**/}
   ,onEnd:(ret)=>{/**/}
   ,onLoading:(ret)=>{/**/}
  })
```
任意のタイミングでローダーを起動するには、```auto:false```にして```loader(....).done()```をコールする。

文書の見込み：スクリプトやスタイルシートではなく、文書を一括して読み込む場合は```text:true```とする。この場合、fetch(...).then(d=>text())を使った結果がコールバックに帰ってくる。読み込む順序は同じく、記述順である。
