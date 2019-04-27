//https://codepen.io/gnjo/pen/mgpPEB.js?plainList=8
;(function(root){
 `use strict`;
 var fn=root.fn||{}
 fn.empty=(el)=>{
  while( el.firstChild ){el.removeChild( el.firstChild )}
  return el
 }
 fn.escape=(str)=>{
  return str
   .replace(/\\/g, '\\\\')
   .replace(/'/g, "\\'")
   .replace(/"/g, '\\"')
   .replace(/\//g, '\\/');
 };
 /*
 async function optimize(){
  //緊急時用
  let max=50,ary=[]
  for(let i=1;i<max;i++){
   let a =await togistpage(i);
   if(a.length===0) break;
   ary.push(a);
  }
  let mar=ary.reduce((a,b)=>{return a.concat(b)},[])
  mar=mar.filter(d=>d.files['story.txt'])
  for(let j=0;j<mar.length;j++){
   let obj=mar[j]
   let el=fn.i3(lay(obj))
   el.a2( fn.q('.index') )
   let raw=obj.files['story.txt'].raw_url
   let text=await fetch(raw).then(d=>d.text())
   obj.text=text;
   obj.desc=text.slice(0,32)
   el.q('.desc').textContent=text.slice(0,32);
   //await togist('data optimize',obj.id,'optimize.txt',obj.desc)
   if(j%10===0){ await new Promise(r => setTimeout(r, 1000)) }
  }

 }
*/
 //
 //await new Promise(r => setTimeout(r, 1000));
 function lay(obj){
  let fu=Date.now() + 25*3600
  let order =fu - new Date(obj.updated_at).getTime()
  ,size=fn.pad(obj.files['story.txt'].size,7)
  ,line=fn.pad(Math.ceil(parseInt(size)/(3*42*0.5)),4)
  ,title=fn.lex(obj.description).t
  ,updated=fn.jpTime( new Date(obj.updated_at).getTime() )
  ,id=obj.id
  ;
  return`
<li style="order:${order}" class="gistid" id="${id}" line="${line}" updated="${updated}" >
${title}</li>
`.trim()
 }
 function entry(plane,caller){
  let board=fn.i3('<ol class="index"></ol>')
  ,n=fn.i3(`<li style="order:1" ><label class="new">NEW </label><label class="upd">UPDATE</label></li>`)
  ,ne=async()=>{
   let str='＃＊新規ストーリー',nos='＃＊新規ノート'
   let a=await togist(str,void 0,'story.txt',str)
   let b=await togist(str,a.id,'note.txt',nos)
   let c=await togistsearch(a.id)
   let el=fn.i3(lay(c))
   el.a2(board)
   ;a=b=c=void 0;
  }
  ,upd=async()=>{
   init();//
   let max=50,ary=[]
   for(let i=1;i<max;i++){
    let a =await togistpage(i);
    if(a.length===0) break;
    let mar =a
    mar=mar.filter(d=>d.files['story.txt'])
    for(let j=0;j<mar.length;j++){
     let obj=mar[j]
     ,el=fn.i3(lay(obj))
     ,raw=obj.files['story.txt'].raw_url
     ;el.onclick=caller
     el.a2( board )
     //el.q('.desc').textContent=obj.description
     //if(j%10===0){ await new Promise(r => setTimeout(r, 1000)) }   
    }
   }
   ;ary=void 0;
  }
  ,init=()=>{
   //board.innerHTML=''
   fn.empty(board)
   n.q('.new').onclick=ne;
   n.q('.upd').onclick=upd;
   n.a2(board)   
  }
  init();
  board.a2(plane)
 }

 root.planeList=entry
})(this);

/*
planeList(document.body,(e)=>{
 console.log(e.target.parentElement.id) 
})
;
*/
