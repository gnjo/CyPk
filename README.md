# CyPk
cyberpunk.cssはここで管理する。最重要のテーマで、肥大化しない様に心がける。

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
https://gnjo.github.io/CyPk/cyberpunk.css?v=1&g=0
https://gnjo.github.io/spinner.js?v=2
https://codepen.io/gnjo/pen/OGEQWy.css?CyPk=1
 
https://gnjo.github.io/e.js?v=1
https://gnjo.github.io/use.js?v=3
https://gnjo.github.io/togist.js?v=1
https://gnjo.github.io/keyCmd.js
https://gnjo.github.io/mo.js
https://gnjo.github.io/CyPk/plainList.js?v=8
https://gnjo.github.io/filter.js?v=2
https://gnjo.github.io/imgc.js
https://gnjo.github.io/imageReader.js
https://codepen.io/gnjo/pen/JVadma.js?doropandpop=3
https://codepen.io/gnjo/pen/OGEQWy.js?CyPk=1

https://gnjo.github.io/loader.js?v=1&g=0
```

### loader.js
ファイルの一覧を列挙して、スクリプトとスタイルシートを完全に記述順で読み込む。内部的にはonloadをpromise化している。
```chunk:true``` でファイルの末尾に適当な文字列を添付しキャッシュを無効化する。documentの生成もjsに巻けば、html部にはローダーの記述だけで済む。スクリプトか、スタイルシートかの判断はファイルの拡張子で行っている為、その判断が不明な場合は特別に```css("https://...")```,```js("https://...")```を加えると判別出来る。
```
<!--html usage-->

<script type="text/plain" data-loader>
https://gnjo.github.io/CyPk/cyberpunk.css?v=1&g=0
https://gnjo.github.io/spinner.js?v=2
https://codepen.io/gnjo/pen/OGEQWy.css?CyPk=1
 
https://gnjo.github.io/e.js?v=1
https://gnjo.github.io/use.js?v=3
https://gnjo.github.io/togist.js?v=1
https://gnjo.github.io/keyCmd.js
https://gnjo.github.io/mo.js
https://gnjo.github.io/CyPk/plainList.js?v=8
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
   ,onStart:(ret)=>{/**/}
   ,onEnd:(ret)=>{/**/}
   ,onLoading:(ret)=>{/**/}
  })
```
任意のタイミングでローダーを起動するには、```auto:false```にして```loader(....).done()```をコールする。

### 二重ロードの阻止。
複数のファイルが有る為、呼び出しが錯綜しがちである。その為に二重ロードの阻止をファイルに仕込む。
具体的には```document.body.dataset.XXX```にフラグを建てる。
```js
;(function(root){
if(document.body.dataset.moduleX) return console.log('double load block',moduleX)
document.body.dataset.moduleX=true
;

...

})(this);
```

