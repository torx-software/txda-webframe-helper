var o=i=>new Promise((s,n)=>{i.includes("*")&&n("Specific target origins must be specified to connect to TXDA installs"),window.addEventListener("message",e=>{if(i.includes(e.origin)||n("Attempted TXDA connection event from unauthorized origin"),e.data?.messageType==="txdaMessagePortTransfer"){let t=e.ports[0];s(t)}}),window.parent.postMessage({messageType:"txdaConnectionRequest",windowName:window.name},origin)});export{o as initialize};
//# sourceMappingURL=index.js.map
