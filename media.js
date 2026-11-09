/* Local review copies: originals on the user's device are never overwritten. */
window.StudioMedia=(()=>{
 const bytes=n=>n<1024*1024?(n/1024).toFixed(0)+' KB':(n/1024/1024).toFixed(1)+' MB';
 const fit=(w,h,max)=>{const scale=Math.min(1,max/Math.max(w,h));return {width:Math.max(2,Math.round(w*scale/2)*2),height:Math.max(2,Math.round(h*scale/2)*2)}};
 const blobURL=b=>URL.createObjectURL(b);
 const result=(file,blob,note='')=>({blob,originalBytes:file.size,bytes:blob.size,saved:Math.max(0,Math.round((1-blob.size/file.size)*100)),note});
 const abortError=()=>new DOMException('Cancelado','AbortError');
 function waitMedia(video,event,signal){return new Promise((resolve,reject)=>{let timer;const clean=()=>{clearTimeout(timer);video.removeEventListener(event,ok);video.removeEventListener('error',fail);signal?.removeEventListener('abort',abort)};const ok=()=>{clean();resolve()},fail=()=>{clean();reject(Error('No se pudo leer este video. Prueba con MP4 (H.264).'))},abort=()=>{clean();reject(abortError())};video.addEventListener(event,ok,{once:true});video.addEventListener('error',fail,{once:true});signal?.addEventListener('abort',abort,{once:true});timer=setTimeout(fail,20000);if(signal?.aborted)abort()})}
 async function compressImage(file){if(!['image/jpeg','image/png','image/webp'].includes(file.type))throw Error('Usa una foto JPG, PNG o WebP');if(file.size>30*1024*1024)throw Error('La foto debe pesar menos de 30 MB');const bitmap=await createImageBitmap(file);try{if(bitmap.width*bitmap.height>60000000)throw Error('La foto es demasiado grande; exporta una versión de hasta 60 megapíxeles');const canvas=document.createElement('canvas'),size=fit(bitmap.width,bitmap.height,1920);Object.assign(canvas,size);canvas.getContext('2d').drawImage(bitmap,0,0,size.width,size.height);const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/webp',.82));if(!blob)throw Error('No se pudo comprimir la foto');return result(file,blob.size<file.size?blob:file,blob.size<file.size?'Foto optimizada':'La foto ya era ligera; se conserva su tamaño')}finally{bitmap.close()}}
 async function compressVideo(file,{signal,onProgress=()=>{}}={}){
  if(!file.type.startsWith('video/'))throw Error('Selecciona un video MP4, MOV o WebM');if(file.size>250*1024*1024)throw Error('El video debe pesar menos de 250 MB');
  const video=document.createElement('video'),sourceURL=blobURL(file);video.playsInline=true;video.preload='auto';let context,stream,recorder,drawTimer,watchdog,destination,mediaSource;
  // Resume Web Audio during the original Save click, before awaiting metadata.
  const Audio=window.AudioContext||window.webkitAudioContext;
  if(Audio){try{context=new Audio();await context.resume()}catch{context?.close();context=null}}
  try{
   const ready=waitMedia(video,'loadeddata',signal);video.src=sourceURL;video.load();await ready;if(signal?.aborted)throw abortError();
   if(!Number.isFinite(video.duration)||video.duration<=0)throw Error('El video no tiene una duración válida');if(video.duration>300)throw Error('Para revisión sube videos de hasta 5 minutos');
   const size=fit(video.videoWidth,video.videoHeight,1280),canvas=document.createElement('canvas');Object.assign(canvas,size);const ctx=canvas.getContext('2d');ctx.drawImage(video,0,0,size.width,size.height);const poster=canvas.toDataURL('image/webp',.8);
   const mime=window.MediaRecorder&&['video/mp4;codecs=avc1.42E01E,mp4a.40.2','video/mp4','video/webm;codecs=vp8,opus','video/webm'].find(t=>MediaRecorder.isTypeSupported(t));
   if(!mime||!canvas.captureStream||!context||context.state!=='running')return {...result(file,file,'Este navegador no puede comprimir el video de forma segura; se conserva el original'),poster,duration:video.duration};
   stream=canvas.captureStream(30);destination=context.createMediaStreamDestination();mediaSource=context.createMediaElementSource(video);mediaSource.connect(destination);destination.stream.getAudioTracks().forEach(track=>stream.addTrack(track));
   recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:1800000,audioBitsPerSecond:128000});const chunks=[];
   const blob=await new Promise((resolve,reject)=>{
    let settled=false;const finish=(error)=>{if(settled)return;settled=true;clearTimeout(watchdog);signal?.removeEventListener('abort',cancel);video.onended=null;video.onerror=null;if(error){if(recorder.state!=='inactive')recorder.stop();reject(error)}else resolve(new Blob(chunks,{type:recorder.mimeType}))};
    const cancel=()=>finish(abortError());signal?.addEventListener('abort',cancel,{once:true});recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};recorder.onerror=()=>finish(Error('No se pudo comprimir el video; vuelve a intentar'));recorder.onstop=()=>finish();video.onended=()=>{if(recorder.state!=='inactive')recorder.stop()};video.onerror=()=>finish(Error('No se pudo reproducir el video completo'));
    drawTimer=setInterval(()=>{if(signal?.aborted)return;ctx.drawImage(video,0,0,size.width,size.height);onProgress(Math.min(99,Math.round(video.currentTime/video.duration*100)))},1000/30);
    watchdog=setTimeout(()=>finish(Error('La compresión se interrumpió. Mantén esta pestaña abierta e inténtalo otra vez.')),Math.max(30000,video.duration*2000+15000));
    recorder.start(500);video.play().catch(()=>finish(Error('No se pudo iniciar la compresión. Guarda otra vez con esta pestaña abierta.')));
   });
   if(signal?.aborted)throw abortError();if(!blob.size)throw Error('El video comprimido está vacío');onProgress(100);const chosen=blob.size<file.size?blob:file;return {...result(file,chosen,chosen===file?'El original ya era más ligero; se conserva sin aumentar su peso':'Video optimizado con audio'),poster,duration:video.duration};
  }finally{clearInterval(drawTimer);clearTimeout(watchdog);video.pause();if(recorder&&recorder.state!=='inactive')recorder.stop();stream?.getTracks().forEach(t=>t.stop());destination?.stream.getTracks().forEach(t=>t.stop());mediaSource?.disconnect();if(context&&context.state!=='closed')await context.close();video.removeAttribute('src');video.load();URL.revokeObjectURL(sourceURL)}
 }
 const dataURL=blob=>new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(Error('No se pudo leer la imagen'));reader.readAsDataURL(blob)});
 return {bytes,fit,compressImage,compressVideo,dataURL};
})();
