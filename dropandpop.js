//https://codepen.io/gnjo/pen/JVadma.js?doropandpop=3
/*history
 v1.0 writed
 v1.0 document.body=>document.documentElement
*/
;(function(root){ 
 var imageReader=root.imageReader||{}
 ,imgc=root.imgc
 ,fn=root.fn||{}
 ,sp=root.sp||void 0
 ;
 let sign='dropandpop'
 //dropsetting
 if(document.body.dataset[sign]) return console.log('double load block',sign)
 ;
 imageReader(/*document.body*/document.documentElement,(d,file)=>{
  let style=`
position: fixed;
width: 200px;
height: 100px;
outline: none;
object-fit: cover;
z-index:1000;
top: 50%;
right: 0%;
transform: translateY(-50%);
`.replace(/\n/g,' ');
  let frame=(url)=>{
   return`
<img class="pop" src="${url}" onclick="fn.copy('${url}');this.remove();" tabindex="-1" style="${style}">
`
  }
  if(sp) sp.run();
  let o=imgc(d).fit({w:300})
 .filter('blue')
  .then(fn.upi).then(d=>{
   let url=d.data.link
   ,html=frame(url)
   ,img=fn.i3(html).a2(document.body)
   ;
   if(sp) sp.run(-1)
  })
  //f.name f.size ...
  //d is base64 ...
 })
 document.body.dataset[sign]=true

})(this);
