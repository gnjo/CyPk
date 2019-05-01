//firstcall the frame
;(function(root){ 
 function frame(){
 if(document.body.dataset.frame)return;
 document.body.dataset.frame=true;
 let html=`
<div class="flex" id="app">
  <div class="l">
    <div class="wrap" data-gistid=""></div>
  </div>
  <div class="r split">
    <div class="wrap"></div>
  </div>
</div>
<div id="template" style="display:none;">
  <div class="frame" data-stat="coding" data-num="" data-title="＃新規ストーリ" data-line="1">
    <div class="info"><img class="cyber" src="https://i.imgur.com/um2rZGb.png" onclick="fn.scv(this.parentElement)"/>
      <h1 data-num="001"></h1>
      <div class="word2" contenteditable="plaintext-only" data-type="note" onkeydown="this.dataset.length=this.textContent.length">＃新規ノート</div><a class="stt" onclick="cmdMap['[STT]'].call(this,event)"></a>
    </div>
    <div class="main">
      <div class="word1" contenteditable="plaintext-only" data-type="story" onkeydown="this.dataset.length=this.textContent.length">＃新規ストーリ</div>
    </div>
  </div>
</div>
<div class="side none" id="gist"></div>
<div id="spinner" style="position:fixed;top:0.5rem;right:0.5rem;z-index:1000;"></div>
<div class="total" id="total"></div>
`.trim()
 ;
 document.body.innerHTML+=html; 
}
 frame();
})(this);

//main
;(function(root){
//
var fn=root.fn||{}
,is=root.is||{}
,togist=root.togist
;
function framectrl(e){
 if(!(e.target.nodeName.toLowerCase()==='a')) return;
 let cmd=e.target.textContent
 ;
 if(cmdMap[cmd]) cmdMap[cmd].call(this,e) 
}
root.framectrl=framectrl
function gfn(frame){
 let num=fn.menum(frame,'.l .frame')
 return fn.pad(num,3)
}
root.gfn=gfn
function edUpdate(e,num){
 //e.target.dataset.num , title , line
 let d=fn.lex(e.target.textContent)
 ,isNote=(e.target.dataset.type==='note')
 ,frame=e.target.parentElement.parentElement
 ,img=frame.q('.info img')
 ,h1=frame.q('.info h1')
 ,sa=()=>{
  let wrap=fn.q('#app .l>.wrap')
  let html=wrap.innerHTML;
  let gistid=wrap.dataset.gistid
  if(gistid) saveDe(html,gistid)
 }
 ;
 if(isNote){
  if(!num) sa();
  return (d.u)?img.src=d.u:''
 }
 ;
 //e.target.dataset.num=
 frame.dataset.title=d.t
 frame.dataset.line=d.l
 frame.dataset.num=h1.dataset.num=(num)?num:gfn(frame)
 if(!num){
  let list=fn.q(`.r .wrap [data-id="${frame.dataset.id}"]`)
  //console.log(list,frame.dataset)
  if(list) Object.assign(list.dataset,frame.dataset);
  sa();
 }
}
fn.ua(fn.q('#app .l>.wrap'),'data-length',edUpdate,200,true)
root.edUpdate=edUpdate
;
function totalUpdate(){
 //totalupdate
 let total=0 ,lv=0
 fn.qa('#app .r>.wrap .titlelist').map( (d,i)=>{
   total+=parseInt(d.dataset.line)
   lv=i;
 }) 
 ;
 let t=fn.q('#total.total');
 t.dataset.lv=lv
 t.dataset.total=total
 t.textContent=`Lv${fn.pad(lv,3)}/100[${fn.pad(total,4)}/3000]`
}
fn.ua(fn.q('#app .r>.wrap'),'data-line',totalUpdate,70,true)
root.totalUpdate=totalUpdate
;
function listUpdate(d){
 if(d.target.childElementCount===0)return;
 let fra=document.createDocumentFragment()
 ,total=0
 ,tar=fn.q('#app .r .wrap')
 ,ary=fn.qa('#app .l>.wrap .frame')
  .map(d=>{
  let el=d.cloneNode()
  el.classList.remove('frame')
  el.classList.add('titlelist')
  el.onclick=()=>{ fn.scv(d) }
  fra.appendChild(el)
  return el
 })
 //tar.innerHTML=''
 fn.empty(tar)
 tar.appendChild(fra)
 //console.log('update list') 
  totalUpdate();  

}
fn.ud(fn.q('#app .l>.wrap'),listUpdate,500)
root.listUpdate=listUpdate
;
function newId(ev){
 let id=ev.newValue
 load(id).then(draw)
}
fn.ua(fn.q('#app .l>.wrap'),'data-gistid',newId,70)
root.newId=newId
;
function savenote(_text,_id){
 //title is not update
 let file="note.txt"
 ,text=_text
 ,id=_id
  return togist(text,id,file/*,title*/)
}
root.savenote=savenote
;
function savestory(_text,_id,_notetext){
 let title= fn.q('.l .wrap .frame').dataset.title 
 ,file="story.txt"
 ,text=_text
 ,notetext=_notetext
 ,id=_id
  sp.run();
  togist(text,id,file,title)
   .then(d=>{return savenote(notetext,id)})
   .then(d=>sp.run(-1))  
}
root.savestoryDe=_.debounce(savestory,300)

function save(_html,_id){
 let title= fn.q('.l .wrap .frame').dataset.title
 ,file="cyberpunk.txt"
 ,html=_html
 ,id=_id
 ;
  sp.run();
  togist(html,id,file,title).then(d=>sp.run(-1))
 ;
}
root.saveDe=_.debounce(save,2000/*3000*/)

async function load(id){
 let datatext='cyberpunk.txt'
 try{
  let raw_url=await togistsearch(id,datatext)
  ,html=await fetch(raw_url).then(d=>d.text())
  return {html:html,gistid:id}
  //console.log(g)
 }catch(e){
  //old root
  let raw_url=await togistsearch(id,'story.txt')
  ,raw_url2=await togistsearch(id,'note.txt')
  ,story=await fetch(raw_url).then(d=>d.text())
  ,note=await fetch(raw_url2).then(d=>d.text())
  return {note:note,story:story,gistid:id}
 }
} 
root.load=load
 
function draw(data){
 //{html} //new
 let wrap=fn.q('#app .l .wrap');
 //wrap.dataset.gistid=data.gistid||''
 //wrap.innerHTML=''
 fn.empty(wrap)
 if(data.html){
  let el=document.createElement('div');
  el.innerHTML=data.html;
  let fra=document.createDocumentFragment();
  el.qa('.frame').map(d=>fra.appendChild(d))
  //return wrap.innerHTML=data.html
  wrap.appendChild(fra);
  el=void 0;
  return;
 }
 //{note,story} //old

 //console.log(data.story);
 let _s=fn.lex('＃新ストーリ\n新\n')
 ,_n=fn.lex('＃新ノート\n＠https://i.imgur.com/CcKioLq.jpg\n新\n')
 ,ss=fn.biglex(data.story).map(d=>fn.lex(d))
 ,nn=fn.biglex(data.note).map(d=>fn.lex(d))
 ,max=Math.max(ss.length,nn.length)
 ,mapping=(d,i)=>{ return {note:nn[i]||_n,story:ss[i]||_s,i:i} }
 ,frag=document.createDocumentFragment()
 ,template=fn.q('#template .frame')
 ;
 fn.range(max).map(mapping).map( (d,i)=>{
  //console.log(d)
  let el=template.cloneNode(true);
  let note=el.q('[data-type="note"]')
  ,story=el.q('[data-type="story"]')
  ,num=fn.pad(i,3)
  ,id=fn.rkana()
  el.dataset.id=id;
  note.textContent=d.note.s
  story.textContent=d.story.s
  edUpdate({target:note},num)
  edUpdate({target:story},num)  
  return el
 }).map(el=>{
  //console.log(frag,el)
  frag.appendChild(el)///
 })
 fn.q('#app .l .wrap').appendChild(frag);
 return;
 // var o={title,url,number,time,line,notestr,storystr}=obj;
}
root.draw=draw;

})(this); 

//cmdMap
;(function(root){ 
 ;var fn=root.fn||{}
 ,gfn=root.gfn
 ;
 var cmdMap={}
 //nav

 cmdMap['[DEL]']=(e)=>{  
  let frame=e.target.parentElement.parentElement
  frame=(frame.classList.contains('frame'))?frame:frame.parentElement
  
  let str=frame.q('[data-type="story"]').textContent.trim()
  ,flg=str.length===0
  ,flg2=gfn(frame)>0
  ;
  if(flg&&flg2){
   frame.remove();
   fn.qa('.l .wrap .frame').map((d,i)=>{
    let num=fn.pad(i,3)
    edUpdate({target:d.q('[data-type="story"]')},num)
   })

  }
 }
 cmdMap['[ADD]']=(e)=>{
  let frame=e.target.parentElement.parentElement
  frame=(frame.classList.contains('frame'))?frame:frame.parentElement  
  
  let el=fn.q('#template .frame').cloneNode(true)
  ,id=fn.rkana()
  el.dataset.id=id
  //data-id add
  ;
  let f=function(me,p){p.parentNode.insertBefore(me,p.nextElementSibling);return me}
  //f(el,frame)
  el.as2(frame)
  el=frame.nextElementSibling
  fn.scv(el)
  el.q('[data-type="story"]').focus();
  //numUpdate();
  fn.qa('.l .wrap .frame').map((d,i)=>{
   let num=fn.pad(i,3)
   edUpdate({target:d.q('[data-type="story"]')},num)
  })

 }
 cmdMap['[STT]']=(e)=>{
  //stt coding fixed
  let frame=e.target.parentElement.parentElement
  frame=(frame.classList.contains('frame'))?frame:frame.parentElement
  
  let now =fn.jpTime()
  frame.dataset.stat=(frame.dataset.stat==='coding')?`${now} fixed`:'coding' 
  frame.qa('[data-type]').map(el=>{
   if(frame.dataset.stat==='coding') el.setAttribute('contenteditable',"plaintext-only")
   else el.removeAttribute('contenteditable')
  })
  ;
  edUpdate({target:frame.q('[data-type="story"]')})
 }

 root.cmdMap=cmdMap;
})(this);

//gst
;(function(root){
 let el=document.body
 ,idLists=document.querySelector('#gist')
 ;
 let list=document.createElement('div')
 mo(37,list)
 /*main ctrl*/
 planeList(list,(e)=>{
  let id=e.target.id;
  fn.q('.l .wrap').dataset.gistid=id//'47af658b44b8ab126a1b0bd4b065ac34'  
  fn.copy(id) 
 }) 

})(this);

//spinner
;(function(root){
 root.sp=spinner(fn.q('#spinner'))
 root.sp.run(-1)
})(this);

//keyCmd
;(function(root){
 var keyCmd=root.keyCmd
 ,cmdMap=root.cmdMap
 ,fn=root.fn||{}
 ,savestoryDe=root.savestoryDe
let calc=(e)=>{
 e.preventDefault();
 if(e.which===83){
  let wrap=fn.q('#app .l>.wrap')
  let text=wrap.qa('[data-type="story"]').map(d=>d.textContent.trim()).join('\n')
  let notetext=wrap.qa('[data-type="note"]').map(d=>d.textContent.trim()).join('\n')
  let gistid=wrap.dataset.gistid
  return savestoryDe(text,gistid,notetext)
 }

 if(e.which===68) return fn.pnt(fn.jpTime())
 
 if(e.target.dataset.type==="story"||e.target.dataset.type==="note"){
   if(e.which===13)return cmdMap['[ADD]'](e)
 }
 if(e.target.dataset.type==="story")
    if(e.which===8)return cmdMap['[DEL]'](e)
}
keyCmd(document.body)
 .ctrl({/*s*/ 83:calc})
 .ctrl({/*d*/ 68:calc})
 .ctrl({/*enter*/ 13:calc})
 .ctrl({/*backspace*/ 8:calc})
 .end()

})(this);

//list dinamic change
;(function(root){
 let keyCmd=root.keyCmd
 ,fn=root.fn||{}
 ;
 let calc=(e)=>{
  e.preventDefault();
  fn.q('.l .wrap').classList.toggle('mini');
  console.log('mini')
 }
 keyCmd(document.body).ctrl({38:calc}).end();
})(this);
//this.togistdebug=true;
