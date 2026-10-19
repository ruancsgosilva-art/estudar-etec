// Uso: node validar-banco.js index.html   (valida o banco de questões do site)
const fs=require('fs'),f=process.argv[2]||'index.html',h=fs.readFileSync(f,'utf8');
const js=h.slice(h.indexOf('<script>')+8,h.indexOf('</script>'));
const cut=js.indexOf('const SUBS=');const ctx={};
new Function('o',js.slice(0,cut).replace(/const (Q|AS|DF|FX|GD)=/g,'o.$1=')+';')(ctx);
const {Q,AS,DF,FX}=ctx;let err=[];const e=m=>err.push(m);
if(![Q.length,AS.length,DF.length,FX.length].every(n=>n==Q.length))e(`tamanhos diferentes Q=${Q.length} AS=${AS.length} DF=${DF.length} FX=${FX.length}`);
const seen=new Set();
Q.forEach((q,i)=>{const o=q[2].split('|').filter(x=>x),id='Q'+(i+1);
 if(q.length!=6)e(id+': campos != 6');
 if(o.length!=5)e(id+': não tem 5 alternativas');
 if(new Set(o.map(x=>x.trim().toLowerCase())).size!=o.length)e(id+': alternativas repetidas');
 if(!Number.isInteger(q[3])||q[3]<0||q[3]>=o.length)e(id+': gabarito inválido');
 if(!q[4]||!q[5])e(id+': sem explicação ou pegadinha');
 if(seen.has(q[1]))e(id+': enunciado duplicado');seen.add(q[1]);
 if(!['1','2','3'].includes(DF[i]))e(id+': dificuldade inválida');
 const p=FX[i].split('|');if(!(p[0]=='F'&&p.length==7||p[0]=='E'&&p.length==3))e(id+': FX com formato inválido');
 if(p[0]=='F'){const r=p[5].match(/[\d,\/]+/)[0];if(!o[q[3]].replace(/\./g,'').includes(r))e(id+': resultado da fórmula ('+p[5]+') difere do gabarito ('+o[q[3]]+')')}
});
console.log(err.length?'FALHAS:\n'+err.join('\n'):`OK: ${Q.length} questões válidas (alternativas, gabaritos, explicações, fórmulas e metadados consistentes)`);
process.exit(err.length?1:0);
