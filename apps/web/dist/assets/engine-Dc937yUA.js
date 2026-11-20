/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ye="srgb",En="srgb-linear",ms="display-p3",Sr="display-p3-linear",_r="linear",ue="srgb",vr="rec709";const Cs="300 es";class _i{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const r=this._listeners[t];if(r!==void 0){const s=r.indexOf(e);s!==-1&&r.splice(s,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const r=n.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,t);t.target=null}}}const Ie=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Rr=Math.PI/180,os=180/Math.PI;function vi(){const i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ie[i&255]+Ie[i>>8&255]+Ie[i>>16&255]+Ie[i>>24&255]+"-"+Ie[t&255]+Ie[t>>8&255]+"-"+Ie[t>>16&15|64]+Ie[t>>24&255]+"-"+Ie[e&63|128]+Ie[e>>8&255]+"-"+Ie[e>>16&255]+Ie[e>>24&255]+Ie[n&255]+Ie[n>>8&255]+Ie[n>>16&255]+Ie[n>>24&255]).toLowerCase()}function Le(i,t,e){return Math.max(t,Math.min(e,i))}function ra(i,t){return(i%t+t)%t}function Cr(i,t,e){return(1-e)*i+e*t}function Ps(i){return(i&i-1)===0&&i!==0}function as(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Ei(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function We(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class gt{constructor(t=0,e=0){gt.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6],this.y=r[1]*e+r[4]*n+r[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),r=Math.sin(e),s=this.x-t.x,a=this.y-t.y;return this.x=s*n-a*r+t.x,this.y=s*r+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class te{constructor(t,e,n,r,s,a,o,c,l){te.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l)}set(t,e,n,r,s,a,o,c,l){const u=this.elements;return u[0]=t,u[1]=r,u[2]=o,u[3]=e,u[4]=s,u[5]=c,u[6]=n,u[7]=a,u[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[3],c=n[6],l=n[1],u=n[4],f=n[7],h=n[2],m=n[5],v=n[8],x=r[0],p=r[3],d=r[6],E=r[1],M=r[4],b=r[7],U=r[2],L=r[5],D=r[8];return s[0]=a*x+o*E+c*U,s[3]=a*p+o*M+c*L,s[6]=a*d+o*b+c*D,s[1]=l*x+u*E+f*U,s[4]=l*p+u*M+f*L,s[7]=l*d+u*b+f*D,s[2]=h*x+m*E+v*U,s[5]=h*p+m*M+v*L,s[8]=h*d+m*b+v*D,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8];return e*a*u-e*o*l-n*s*u+n*o*c+r*s*l-r*a*c}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8],f=u*a-o*l,h=o*c-u*s,m=l*s-a*c,v=e*f+n*h+r*m;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/v;return t[0]=f*x,t[1]=(r*l-u*n)*x,t[2]=(o*n-r*a)*x,t[3]=h*x,t[4]=(u*e-r*c)*x,t[5]=(r*s-o*e)*x,t[6]=m*x,t[7]=(n*c-l*e)*x,t[8]=(a*e-n*s)*x,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,r,s,a,o){const c=Math.cos(s),l=Math.sin(s);return this.set(n*c,n*l,-n*(c*a+l*o)+a+t,-r*l,r*c,-r*(-l*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Pr.makeScale(t,e)),this}rotate(t){return this.premultiply(Pr.makeRotation(-t)),this}translate(t,e){return this.premultiply(Pr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<9;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Pr=new te;function Eo(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function xr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function sa(){const i=xr("canvas");return i.style.display="block",i}const Ls={};function Pi(i){i in Ls||(Ls[i]=!0,console.warn(i))}const Ds=new te().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Us=new te().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Wi={[En]:{transfer:_r,primaries:vr,toReference:i=>i,fromReference:i=>i},[ye]:{transfer:ue,primaries:vr,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Sr]:{transfer:_r,primaries:"p3",toReference:i=>i.applyMatrix3(Us),fromReference:i=>i.applyMatrix3(Ds)},[ms]:{transfer:ue,primaries:"p3",toReference:i=>i.convertSRGBToLinear().applyMatrix3(Us),fromReference:i=>i.applyMatrix3(Ds).convertLinearToSRGB()}},oa=new Set([En,Sr]),ae={enabled:!0,_workingColorSpace:En,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!oa.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;const n=Wi[t].toReference,r=Wi[e].fromReference;return r(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return Wi[i].primaries},getTransfer:function(i){return i===""?_r:Wi[i].transfer}};function mi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Lr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let jn;class To{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{jn===void 0&&(jn=xr("canvas")),jn.width=t.width,jn.height=t.height;const n=jn.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=jn}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=xr("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const r=n.getImageData(0,0,t.width,t.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=mi(s[a]/255)*255;return n.putImageData(r,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(mi(e[n]/255)*255):e[n]=mi(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let aa=0;class bo{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:aa++}),this.uuid=vi(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Dr(r[a].image)):s.push(Dr(r[a]))}else s=Dr(r);n.url=s}return e||(t.images[this.uuid]=n),n}}function Dr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?To.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let ca=0;class qe extends _i{constructor(t=qe.DEFAULT_IMAGE,e=qe.DEFAULT_MAPPING,n=1001,r=1001,s=1006,a=1008,o=1023,c=1009,l=qe.DEFAULT_ANISOTROPY,u=""){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ca++}),this.uuid=vi(),this.name="",this.source=new bo(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=l,this.format=o,this.internalFormat=null,this.type=c,this.offset=new gt(0,0),this.repeat=new gt(1,1),this.center=new gt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new te,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(Pi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===3001?ye:""),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==300)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case 1e3:t.x=t.x-Math.floor(t.x);break;case 1001:t.x=t.x<0?0:1;break;case 1002:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case 1e3:t.y=t.y-Math.floor(t.y);break;case 1001:t.y=t.y<0?0:1;break;case 1002:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return Pi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===ye?3001:3e3}set encoding(t){Pi("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===3001?ye:""}}qe.DEFAULT_IMAGE=null;qe.DEFAULT_MAPPING=300;qe.DEFAULT_ANISOTROPY=1;class Ae{constructor(t=0,e=0,n=0,r=1){Ae.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=r}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,r){return this.x=t,this.y=e,this.z=n,this.w=r,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*r+a[12]*s,this.y=a[1]*e+a[5]*n+a[9]*r+a[13]*s,this.z=a[2]*e+a[6]*n+a[10]*r+a[14]*s,this.w=a[3]*e+a[7]*n+a[11]*r+a[15]*s,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,r,s;const c=t.elements,l=c[0],u=c[4],f=c[8],h=c[1],m=c[5],v=c[9],x=c[2],p=c[6],d=c[10];if(Math.abs(u-h)<.01&&Math.abs(f-x)<.01&&Math.abs(v-p)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+x)<.1&&Math.abs(v+p)<.1&&Math.abs(l+m+d-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(l+1)/2,b=(m+1)/2,U=(d+1)/2,L=(u+h)/4,D=(f+x)/4,q=(v+p)/4;return M>b&&M>U?M<.01?(n=0,r=.707106781,s=.707106781):(n=Math.sqrt(M),r=L/n,s=D/n):b>U?b<.01?(n=.707106781,r=0,s=.707106781):(r=Math.sqrt(b),n=L/r,s=q/r):U<.01?(n=.707106781,r=.707106781,s=0):(s=Math.sqrt(U),n=D/s,r=q/s),this.set(n,r,s,e),this}let E=Math.sqrt((p-v)*(p-v)+(f-x)*(f-x)+(h-u)*(h-u));return Math.abs(E)<.001&&(E=1),this.x=(p-v)/E,this.y=(f-x)/E,this.z=(h-u)/E,this.w=Math.acos((l+m+d-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class la extends _i{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Ae(0,0,t,e),this.scissorTest=!1,this.viewport=new Ae(0,0,t,e);const r={width:t,height:e,depth:1};n.encoding!==void 0&&(Pi("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===3001?ye:""),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:1006,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new qe(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new bo(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Vn extends la{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Ao extends qe{constructor(t=null,e=1,n=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ua extends qe{constructor(t=null,e=1,n=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:r},this.magFilter=1003,this.minFilter=1003,this.wrapR=1001,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Oi{constructor(t=0,e=0,n=0,r=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=r}static slerpFlat(t,e,n,r,s,a,o){let c=n[r+0],l=n[r+1],u=n[r+2],f=n[r+3];const h=s[a+0],m=s[a+1],v=s[a+2],x=s[a+3];if(o===0){t[e+0]=c,t[e+1]=l,t[e+2]=u,t[e+3]=f;return}if(o===1){t[e+0]=h,t[e+1]=m,t[e+2]=v,t[e+3]=x;return}if(f!==x||c!==h||l!==m||u!==v){let p=1-o;const d=c*h+l*m+u*v+f*x,E=d>=0?1:-1,M=1-d*d;if(M>Number.EPSILON){const U=Math.sqrt(M),L=Math.atan2(U,d*E);p=Math.sin(p*L)/U,o=Math.sin(o*L)/U}const b=o*E;if(c=c*p+h*b,l=l*p+m*b,u=u*p+v*b,f=f*p+x*b,p===1-o){const U=1/Math.sqrt(c*c+l*l+u*u+f*f);c*=U,l*=U,u*=U,f*=U}}t[e]=c,t[e+1]=l,t[e+2]=u,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,r,s,a){const o=n[r],c=n[r+1],l=n[r+2],u=n[r+3],f=s[a],h=s[a+1],m=s[a+2],v=s[a+3];return t[e]=o*v+u*f+c*m-l*h,t[e+1]=c*v+u*h+l*f-o*m,t[e+2]=l*v+u*m+o*h-c*f,t[e+3]=u*v-o*f-c*h-l*m,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,r){return this._x=t,this._y=e,this._z=n,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,r=t._y,s=t._z,a=t._order,o=Math.cos,c=Math.sin,l=o(n/2),u=o(r/2),f=o(s/2),h=c(n/2),m=c(r/2),v=c(s/2);switch(a){case"XYZ":this._x=h*u*f+l*m*v,this._y=l*m*f-h*u*v,this._z=l*u*v+h*m*f,this._w=l*u*f-h*m*v;break;case"YXZ":this._x=h*u*f+l*m*v,this._y=l*m*f-h*u*v,this._z=l*u*v-h*m*f,this._w=l*u*f+h*m*v;break;case"ZXY":this._x=h*u*f-l*m*v,this._y=l*m*f+h*u*v,this._z=l*u*v+h*m*f,this._w=l*u*f-h*m*v;break;case"ZYX":this._x=h*u*f-l*m*v,this._y=l*m*f+h*u*v,this._z=l*u*v-h*m*f,this._w=l*u*f+h*m*v;break;case"YZX":this._x=h*u*f+l*m*v,this._y=l*m*f+h*u*v,this._z=l*u*v-h*m*f,this._w=l*u*f-h*m*v;break;case"XZY":this._x=h*u*f-l*m*v,this._y=l*m*f-h*u*v,this._z=l*u*v+h*m*f,this._w=l*u*f+h*m*v;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,r=Math.sin(n);return this._x=t.x*r,this._y=t.y*r,this._z=t.z*r,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],r=e[4],s=e[8],a=e[1],o=e[5],c=e[9],l=e[2],u=e[6],f=e[10],h=n+o+f;if(h>0){const m=.5/Math.sqrt(h+1);this._w=.25/m,this._x=(u-c)*m,this._y=(s-l)*m,this._z=(a-r)*m}else if(n>o&&n>f){const m=2*Math.sqrt(1+n-o-f);this._w=(u-c)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+l)/m}else if(o>f){const m=2*Math.sqrt(1+o-n-f);this._w=(s-l)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(c+u)/m}else{const m=2*Math.sqrt(1+f-n-o);this._w=(a-r)/m,this._x=(s+l)/m,this._y=(c+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Le(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const r=Math.min(1,e/n);return this.slerp(t,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,r=t._y,s=t._z,a=t._w,o=e._x,c=e._y,l=e._z,u=e._w;return this._x=n*u+a*o+r*l-s*c,this._y=r*u+a*c+s*o-n*l,this._z=s*u+a*l+n*c-r*o,this._w=a*u-n*o-r*c-s*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,r=this._y,s=this._z,a=this._w;let o=a*t._w+n*t._x+r*t._y+s*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=r,this._z=s,this;const c=1-o*o;if(c<=Number.EPSILON){const m=1-e;return this._w=m*a+e*this._w,this._x=m*n+e*this._x,this._y=m*r+e*this._y,this._z=m*s+e*this._z,this.normalize(),this}const l=Math.sqrt(c),u=Math.atan2(l,o),f=Math.sin((1-e)*u)/l,h=Math.sin(e*u)/l;return this._w=a*f+this._w*h,this._x=n*f+this._x*h,this._y=r*f+this._y*h,this._z=s*f+this._z*h,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),r=2*Math.PI*Math.random(),s=2*Math.PI*Math.random();return this.set(e*Math.cos(r),n*Math.sin(s),n*Math.cos(s),e*Math.sin(r))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class F{constructor(t=0,e=0,n=0){F.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ns.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ns.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*r,this.y=s[1]*e+s[4]*n+s[7]*r,this.z=s[2]*e+s[5]*n+s[8]*r,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,r=this.z,s=t.elements,a=1/(s[3]*e+s[7]*n+s[11]*r+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*r+s[12])*a,this.y=(s[1]*e+s[5]*n+s[9]*r+s[13])*a,this.z=(s[2]*e+s[6]*n+s[10]*r+s[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,r=this.z,s=t.x,a=t.y,o=t.z,c=t.w,l=2*(a*r-o*n),u=2*(o*e-s*r),f=2*(s*n-a*e);return this.x=e+c*l+a*f-o*u,this.y=n+c*u+o*l-s*f,this.z=r+c*f+s*u-a*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,r=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*r,this.y=s[1]*e+s[5]*n+s[9]*r,this.z=s[2]*e+s[6]*n+s[10]*r,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,r=t.y,s=t.z,a=e.x,o=e.y,c=e.z;return this.x=r*c-s*o,this.y=s*a-n*c,this.z=n*o-r*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ur.copy(this).projectOnVector(t),this.sub(Ur)}reflect(t){return this.sub(Ur.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(Le(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,r=this.z-t.z;return e*e+n*n+r*r}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const r=Math.sin(e)*t;return this.x=r*Math.sin(n),this.y=Math.cos(e)*t,this.z=r*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),r=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=r,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Ur=new F,Ns=new Oi;class Bi{constructor(t=new F(1/0,1/0,1/0),e=new F(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Qe.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Qe.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Qe.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Qe):Qe.fromBufferAttribute(s,a),Qe.applyMatrix4(t.matrixWorld),this.expandByPoint(Qe);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Xi.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Xi.copy(n.boundingBox)),Xi.applyMatrix4(t.matrixWorld),this.union(Xi)}const r=t.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Qe),Qe.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Ti),qi.subVectors(this.max,Ti),$n.subVectors(t.a,Ti),Qn.subVectors(t.b,Ti),ti.subVectors(t.c,Ti),Tn.subVectors(Qn,$n),bn.subVectors(ti,Qn),Nn.subVectors($n,ti);let e=[0,-Tn.z,Tn.y,0,-bn.z,bn.y,0,-Nn.z,Nn.y,Tn.z,0,-Tn.x,bn.z,0,-bn.x,Nn.z,0,-Nn.x,-Tn.y,Tn.x,0,-bn.y,bn.x,0,-Nn.y,Nn.x,0];return!Nr(e,$n,Qn,ti,qi)||(e=[1,0,0,0,1,0,0,0,1],!Nr(e,$n,Qn,ti,qi))?!1:(Yi.crossVectors(Tn,bn),e=[Yi.x,Yi.y,Yi.z],Nr(e,$n,Qn,ti,qi))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Qe).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Qe).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(vn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),vn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),vn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),vn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),vn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),vn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),vn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),vn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(vn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const vn=[new F,new F,new F,new F,new F,new F,new F,new F],Qe=new F,Xi=new Bi,$n=new F,Qn=new F,ti=new F,Tn=new F,bn=new F,Nn=new F,Ti=new F,qi=new F,Yi=new F,In=new F;function Nr(i,t,e,n,r){for(let s=0,a=i.length-3;s<=a;s+=3){In.fromArray(i,s);const o=r.x*Math.abs(In.x)+r.y*Math.abs(In.y)+r.z*Math.abs(In.z),c=t.dot(In),l=e.dot(In),u=n.dot(In);if(Math.max(-Math.max(c,l,u),Math.min(c,l,u))>o)return!1}return!0}const ha=new Bi,bi=new F,Ir=new F;class gs{constructor(t=new F,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):ha.setFromPoints(t).getCenter(n);let r=0;for(let s=0,a=t.length;s<a;s++)r=Math.max(r,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(r),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;bi.subVectors(t,this.center);const e=bi.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),r=(n-this.radius)*.5;this.center.addScaledVector(bi,r/n),this.radius+=r}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Ir.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(bi.copy(t.center).add(Ir)),this.expandByPoint(bi.copy(t.center).sub(Ir))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const xn=new F,Fr=new F,Zi=new F,An=new F,Or=new F,Ji=new F,Br=new F;class fa{constructor(t=new F,e=new F(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,xn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=xn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(xn.copy(this.origin).addScaledVector(this.direction,e),xn.distanceToSquared(t))}distanceSqToSegment(t,e,n,r){Fr.copy(t).add(e).multiplyScalar(.5),Zi.copy(e).sub(t).normalize(),An.copy(this.origin).sub(Fr);const s=t.distanceTo(e)*.5,a=-this.direction.dot(Zi),o=An.dot(this.direction),c=-An.dot(Zi),l=An.lengthSq(),u=Math.abs(1-a*a);let f,h,m,v;if(u>0)if(f=a*c-o,h=a*o-c,v=s*u,f>=0)if(h>=-v)if(h<=v){const x=1/u;f*=x,h*=x,m=f*(f+a*h+2*o)+h*(a*f+h+2*c)+l}else h=s,f=Math.max(0,-(a*h+o)),m=-f*f+h*(h+2*c)+l;else h=-s,f=Math.max(0,-(a*h+o)),m=-f*f+h*(h+2*c)+l;else h<=-v?(f=Math.max(0,-(-a*s+o)),h=f>0?-s:Math.min(Math.max(-s,-c),s),m=-f*f+h*(h+2*c)+l):h<=v?(f=0,h=Math.min(Math.max(-s,-c),s),m=h*(h+2*c)+l):(f=Math.max(0,-(a*s+o)),h=f>0?s:Math.min(Math.max(-s,-c),s),m=-f*f+h*(h+2*c)+l);else h=a>0?-s:s,f=Math.max(0,-(a*h+o)),m=-f*f+h*(h+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(Fr).addScaledVector(Zi,h),m}intersectSphere(t,e){xn.subVectors(t.center,this.origin);const n=xn.dot(this.direction),r=xn.dot(xn)-n*n,s=t.radius*t.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,r,s,a,o,c;const l=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return l>=0?(n=(t.min.x-h.x)*l,r=(t.max.x-h.x)*l):(n=(t.max.x-h.x)*l,r=(t.min.x-h.x)*l),u>=0?(s=(t.min.y-h.y)*u,a=(t.max.y-h.y)*u):(s=(t.max.y-h.y)*u,a=(t.min.y-h.y)*u),n>a||s>r||((s>n||isNaN(n))&&(n=s),(a<r||isNaN(r))&&(r=a),f>=0?(o=(t.min.z-h.z)*f,c=(t.max.z-h.z)*f):(o=(t.max.z-h.z)*f,c=(t.min.z-h.z)*f),n>c||o>r)||((o>n||n!==n)&&(n=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(n>=0?n:r,e)}intersectsBox(t){return this.intersectBox(t,xn)!==null}intersectTriangle(t,e,n,r,s){Or.subVectors(e,t),Ji.subVectors(n,t),Br.crossVectors(Or,Ji);let a=this.direction.dot(Br),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;An.subVectors(this.origin,t);const c=o*this.direction.dot(Ji.crossVectors(An,Ji));if(c<0)return null;const l=o*this.direction.dot(Or.cross(An));if(l<0||c+l>a)return null;const u=-o*An.dot(Br);return u<0?null:this.at(u/a,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class xe{constructor(t,e,n,r,s,a,o,c,l,u,f,h,m,v,x,p){xe.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,r,s,a,o,c,l,u,f,h,m,v,x,p)}set(t,e,n,r,s,a,o,c,l,u,f,h,m,v,x,p){const d=this.elements;return d[0]=t,d[4]=e,d[8]=n,d[12]=r,d[1]=s,d[5]=a,d[9]=o,d[13]=c,d[2]=l,d[6]=u,d[10]=f,d[14]=h,d[3]=m,d[7]=v,d[11]=x,d[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new xe().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,r=1/ei.setFromMatrixColumn(t,0).length(),s=1/ei.setFromMatrixColumn(t,1).length(),a=1/ei.setFromMatrixColumn(t,2).length();return e[0]=n[0]*r,e[1]=n[1]*r,e[2]=n[2]*r,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,r=t.y,s=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(r),l=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(t.order==="XYZ"){const h=a*u,m=a*f,v=o*u,x=o*f;e[0]=c*u,e[4]=-c*f,e[8]=l,e[1]=m+v*l,e[5]=h-x*l,e[9]=-o*c,e[2]=x-h*l,e[6]=v+m*l,e[10]=a*c}else if(t.order==="YXZ"){const h=c*u,m=c*f,v=l*u,x=l*f;e[0]=h+x*o,e[4]=v*o-m,e[8]=a*l,e[1]=a*f,e[5]=a*u,e[9]=-o,e[2]=m*o-v,e[6]=x+h*o,e[10]=a*c}else if(t.order==="ZXY"){const h=c*u,m=c*f,v=l*u,x=l*f;e[0]=h-x*o,e[4]=-a*f,e[8]=v+m*o,e[1]=m+v*o,e[5]=a*u,e[9]=x-h*o,e[2]=-a*l,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){const h=a*u,m=a*f,v=o*u,x=o*f;e[0]=c*u,e[4]=v*l-m,e[8]=h*l+x,e[1]=c*f,e[5]=x*l+h,e[9]=m*l-v,e[2]=-l,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){const h=a*c,m=a*l,v=o*c,x=o*l;e[0]=c*u,e[4]=x-h*f,e[8]=v*f+m,e[1]=f,e[5]=a*u,e[9]=-o*u,e[2]=-l*u,e[6]=m*f+v,e[10]=h-x*f}else if(t.order==="XZY"){const h=a*c,m=a*l,v=o*c,x=o*l;e[0]=c*u,e[4]=-f,e[8]=l*u,e[1]=h*f+x,e[5]=a*u,e[9]=m*f-v,e[2]=v*f-m,e[6]=o*u,e[10]=x*f+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(da,t,pa)}lookAt(t,e,n){const r=this.elements;return Ye.subVectors(t,e),Ye.lengthSq()===0&&(Ye.z=1),Ye.normalize(),wn.crossVectors(n,Ye),wn.lengthSq()===0&&(Math.abs(n.z)===1?Ye.x+=1e-4:Ye.z+=1e-4,Ye.normalize(),wn.crossVectors(n,Ye)),wn.normalize(),Ki.crossVectors(Ye,wn),r[0]=wn.x,r[4]=Ki.x,r[8]=Ye.x,r[1]=wn.y,r[5]=Ki.y,r[9]=Ye.y,r[2]=wn.z,r[6]=Ki.z,r[10]=Ye.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,r=e.elements,s=this.elements,a=n[0],o=n[4],c=n[8],l=n[12],u=n[1],f=n[5],h=n[9],m=n[13],v=n[2],x=n[6],p=n[10],d=n[14],E=n[3],M=n[7],b=n[11],U=n[15],L=r[0],D=r[4],q=r[8],T=r[12],C=r[1],G=r[5],j=r[9],tt=r[13],N=r[2],V=r[6],J=r[10],et=r[14],it=r[3],$=r[7],rt=r[11],lt=r[15];return s[0]=a*L+o*C+c*N+l*it,s[4]=a*D+o*G+c*V+l*$,s[8]=a*q+o*j+c*J+l*rt,s[12]=a*T+o*tt+c*et+l*lt,s[1]=u*L+f*C+h*N+m*it,s[5]=u*D+f*G+h*V+m*$,s[9]=u*q+f*j+h*J+m*rt,s[13]=u*T+f*tt+h*et+m*lt,s[2]=v*L+x*C+p*N+d*it,s[6]=v*D+x*G+p*V+d*$,s[10]=v*q+x*j+p*J+d*rt,s[14]=v*T+x*tt+p*et+d*lt,s[3]=E*L+M*C+b*N+U*it,s[7]=E*D+M*G+b*V+U*$,s[11]=E*q+M*j+b*J+U*rt,s[15]=E*T+M*tt+b*et+U*lt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],r=t[8],s=t[12],a=t[1],o=t[5],c=t[9],l=t[13],u=t[2],f=t[6],h=t[10],m=t[14],v=t[3],x=t[7],p=t[11],d=t[15];return v*(+s*c*f-r*l*f-s*o*h+n*l*h+r*o*m-n*c*m)+x*(+e*c*m-e*l*h+s*a*h-r*a*m+r*l*u-s*c*u)+p*(+e*l*f-e*o*m-s*a*f+n*a*m+s*o*u-n*l*u)+d*(-r*o*u-e*c*f+e*o*h+r*a*f-n*a*h+n*c*u)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const r=this.elements;return t.isVector3?(r[12]=t.x,r[13]=t.y,r[14]=t.z):(r[12]=t,r[13]=e,r[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],r=t[2],s=t[3],a=t[4],o=t[5],c=t[6],l=t[7],u=t[8],f=t[9],h=t[10],m=t[11],v=t[12],x=t[13],p=t[14],d=t[15],E=f*p*l-x*h*l+x*c*m-o*p*m-f*c*d+o*h*d,M=v*h*l-u*p*l-v*c*m+a*p*m+u*c*d-a*h*d,b=u*x*l-v*f*l+v*o*m-a*x*m-u*o*d+a*f*d,U=v*f*c-u*x*c-v*o*h+a*x*h+u*o*p-a*f*p,L=e*E+n*M+r*b+s*U;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const D=1/L;return t[0]=E*D,t[1]=(x*h*s-f*p*s-x*r*m+n*p*m+f*r*d-n*h*d)*D,t[2]=(o*p*s-x*c*s+x*r*l-n*p*l-o*r*d+n*c*d)*D,t[3]=(f*c*s-o*h*s-f*r*l+n*h*l+o*r*m-n*c*m)*D,t[4]=M*D,t[5]=(u*p*s-v*h*s+v*r*m-e*p*m-u*r*d+e*h*d)*D,t[6]=(v*c*s-a*p*s-v*r*l+e*p*l+a*r*d-e*c*d)*D,t[7]=(a*h*s-u*c*s+u*r*l-e*h*l-a*r*m+e*c*m)*D,t[8]=b*D,t[9]=(v*f*s-u*x*s-v*n*m+e*x*m+u*n*d-e*f*d)*D,t[10]=(a*x*s-v*o*s+v*n*l-e*x*l-a*n*d+e*o*d)*D,t[11]=(u*o*s-a*f*s-u*n*l+e*f*l+a*n*m-e*o*m)*D,t[12]=U*D,t[13]=(u*x*r-v*f*r+v*n*h-e*x*h-u*n*p+e*f*p)*D,t[14]=(v*o*r-a*x*r-v*n*c+e*x*c+a*n*p-e*o*p)*D,t[15]=(a*f*r-u*o*r+u*n*c-e*f*c-a*n*h+e*o*h)*D,this}scale(t){const e=this.elements,n=t.x,r=t.y,s=t.z;return e[0]*=n,e[4]*=r,e[8]*=s,e[1]*=n,e[5]*=r,e[9]*=s,e[2]*=n,e[6]*=r,e[10]*=s,e[3]*=n,e[7]*=r,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],r=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,r))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),r=Math.sin(e),s=1-n,a=t.x,o=t.y,c=t.z,l=s*a,u=s*o;return this.set(l*a+n,l*o-r*c,l*c+r*o,0,l*o+r*c,u*o+n,u*c-r*a,0,l*c-r*o,u*c+r*a,s*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,r,s,a){return this.set(1,n,s,0,t,1,a,0,e,r,1,0,0,0,0,1),this}compose(t,e,n){const r=this.elements,s=e._x,a=e._y,o=e._z,c=e._w,l=s+s,u=a+a,f=o+o,h=s*l,m=s*u,v=s*f,x=a*u,p=a*f,d=o*f,E=c*l,M=c*u,b=c*f,U=n.x,L=n.y,D=n.z;return r[0]=(1-(x+d))*U,r[1]=(m+b)*U,r[2]=(v-M)*U,r[3]=0,r[4]=(m-b)*L,r[5]=(1-(h+d))*L,r[6]=(p+E)*L,r[7]=0,r[8]=(v+M)*D,r[9]=(p-E)*D,r[10]=(1-(h+x))*D,r[11]=0,r[12]=t.x,r[13]=t.y,r[14]=t.z,r[15]=1,this}decompose(t,e,n){const r=this.elements;let s=ei.set(r[0],r[1],r[2]).length();const a=ei.set(r[4],r[5],r[6]).length(),o=ei.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),t.x=r[12],t.y=r[13],t.z=r[14],tn.copy(this);const l=1/s,u=1/a,f=1/o;return tn.elements[0]*=l,tn.elements[1]*=l,tn.elements[2]*=l,tn.elements[4]*=u,tn.elements[5]*=u,tn.elements[6]*=u,tn.elements[8]*=f,tn.elements[9]*=f,tn.elements[10]*=f,e.setFromRotationMatrix(tn),n.x=s,n.y=a,n.z=o,this}makePerspective(t,e,n,r,s,a,o=2e3){const c=this.elements,l=2*s/(e-t),u=2*s/(n-r),f=(e+t)/(e-t),h=(n+r)/(n-r);let m,v;if(o===2e3)m=-(a+s)/(a-s),v=-2*a*s/(a-s);else if(o===2001)m=-a/(a-s),v=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=l,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=h,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=v,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,r,s,a,o=2e3){const c=this.elements,l=1/(e-t),u=1/(n-r),f=1/(a-s),h=(e+t)*l,m=(n+r)*u;let v,x;if(o===2e3)v=(a+s)*f,x=-2*f;else if(o===2001)v=s*f,x=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-h,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=x,c[14]=-v,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let r=0;r<16;r++)if(e[r]!==n[r])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const ei=new F,tn=new xe,da=new F(0,0,0),pa=new F(1,1,1),wn=new F,Ki=new F,Ye=new F,Is=new xe,Fs=new Oi;class yr{constructor(t=0,e=0,n=0,r=yr.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,r=this._order){return this._x=t,this._y=e,this._z=n,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const r=t.elements,s=r[0],a=r[4],o=r[8],c=r[1],l=r[5],u=r[9],f=r[2],h=r[6],m=r[10];switch(e){case"XYZ":this._y=Math.asin(Le(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(h,l),this._z=0);break;case"YXZ":this._x=Math.asin(-Le(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(Le(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-a,l)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-Le(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,m),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,l));break;case"YZX":this._z=Math.asin(Le(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,l),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-Le(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,l),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Is.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Is,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Fs.setFromEuler(this),this.setFromQuaternion(Fs,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yr.DEFAULT_ORDER="XYZ";class wo{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let ma=0;const Os=new F,ni=new Oi,Mn=new xe,ji=new F,Ai=new F,ga=new F,_a=new Oi,Bs=new F(1,0,0),zs=new F(0,1,0),Gs=new F(0,0,1),va={type:"added"},xa={type:"removed"};class De extends _i{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ma++}),this.uuid=vi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=De.DEFAULT_UP.clone();const t=new F,e=new yr,n=new Oi,r=new F(1,1,1);function s(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new xe},normalMatrix:{value:new te}}),this.matrix=new xe,this.matrixWorld=new xe,this.matrixAutoUpdate=De.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=De.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new wo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ni.setFromAxisAngle(t,e),this.quaternion.multiply(ni),this}rotateOnWorldAxis(t,e){return ni.setFromAxisAngle(t,e),this.quaternion.premultiply(ni),this}rotateX(t){return this.rotateOnAxis(Bs,t)}rotateY(t){return this.rotateOnAxis(zs,t)}rotateZ(t){return this.rotateOnAxis(Gs,t)}translateOnAxis(t,e){return Os.copy(t).applyQuaternion(this.quaternion),this.position.add(Os.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Bs,t)}translateY(t){return this.translateOnAxis(zs,t)}translateZ(t){return this.translateOnAxis(Gs,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Mn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ji.copy(t):ji.set(t,e,n);const r=this.parent;this.updateWorldMatrix(!0,!1),Ai.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Mn.lookAt(Ai,ji,this.up):Mn.lookAt(ji,Ai,this.up),this.quaternion.setFromRotationMatrix(Mn),r&&(Mn.extractRotation(r.matrixWorld),ni.setFromRotationMatrix(Mn),this.quaternion.premultiply(ni.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(va)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(xa)),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Mn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Mn.multiply(t.parent.matrixWorld)),t.applyMatrix4(Mn),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,r=this.children.length;n<r;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ai,t,ga),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Ai,_a,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,r=e.length;n<r;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,r=e.length;n<r;n++){const s=e[n];(s.matrixWorldAutoUpdate===!0||t===!0)&&s.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++){const o=r[s];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxGeometryCount=this._maxGeometryCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let l=0,u=c.length;l<u;l++){const f=c[l];s(t.shapes,f)}else s(t.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,l=this.material.length;c<l;c++)o.push(s(t.materials,this.material[c]));r.material=o}else r.material=s(t.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(t.animations,c))}}if(e){const o=a(t.geometries),c=a(t.materials),l=a(t.textures),u=a(t.images),f=a(t.shapes),h=a(t.skeletons),m=a(t.animations),v=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),h.length>0&&(n.skeletons=h),m.length>0&&(n.animations=m),v.length>0&&(n.nodes=v)}return n.object=r,n;function a(o){const c=[];for(const l in o){const u=o[l];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const r=t.children[n];this.add(r.clone())}return this}}De.DEFAULT_UP=new F(0,1,0);De.DEFAULT_MATRIX_AUTO_UPDATE=!0;De.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const en=new F,Sn=new F,zr=new F,yn=new F,ii=new F,ri=new F,Hs=new F,Gr=new F,Hr=new F,Vr=new F;let $i=!1;class nn{constructor(t=new F,e=new F,n=new F){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,r){r.subVectors(n,e),en.subVectors(t,e),r.cross(en);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(t,e,n,r,s){en.subVectors(r,e),Sn.subVectors(n,e),zr.subVectors(t,e);const a=en.dot(en),o=en.dot(Sn),c=en.dot(zr),l=Sn.dot(Sn),u=Sn.dot(zr),f=a*l-o*o;if(f===0)return s.set(0,0,0),null;const h=1/f,m=(l*c-o*u)*h,v=(a*u-o*c)*h;return s.set(1-m-v,v,m)}static containsPoint(t,e,n,r){return this.getBarycoord(t,e,n,r,yn)===null?!1:yn.x>=0&&yn.y>=0&&yn.x+yn.y<=1}static getUV(t,e,n,r,s,a,o,c){return $i===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),$i=!0),this.getInterpolation(t,e,n,r,s,a,o,c)}static getInterpolation(t,e,n,r,s,a,o,c){return this.getBarycoord(t,e,n,r,yn)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,yn.x),c.addScaledVector(a,yn.y),c.addScaledVector(o,yn.z),c)}static isFrontFacing(t,e,n,r){return en.subVectors(n,e),Sn.subVectors(t,e),en.cross(Sn).dot(r)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,r){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[r]),this}setFromAttributeAndIndices(t,e,n,r){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,r),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return en.subVectors(this.c,this.b),Sn.subVectors(this.a,this.b),en.cross(Sn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return nn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return nn.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,r,s){return $i===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),$i=!0),nn.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}getInterpolation(t,e,n,r,s){return nn.getInterpolation(t,this.a,this.b,this.c,e,n,r,s)}containsPoint(t){return nn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return nn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,r=this.b,s=this.c;let a,o;ii.subVectors(r,n),ri.subVectors(s,n),Gr.subVectors(t,n);const c=ii.dot(Gr),l=ri.dot(Gr);if(c<=0&&l<=0)return e.copy(n);Hr.subVectors(t,r);const u=ii.dot(Hr),f=ri.dot(Hr);if(u>=0&&f<=u)return e.copy(r);const h=c*f-u*l;if(h<=0&&c>=0&&u<=0)return a=c/(c-u),e.copy(n).addScaledVector(ii,a);Vr.subVectors(t,s);const m=ii.dot(Vr),v=ri.dot(Vr);if(v>=0&&m<=v)return e.copy(s);const x=m*l-c*v;if(x<=0&&l>=0&&v<=0)return o=l/(l-v),e.copy(n).addScaledVector(ri,o);const p=u*v-m*f;if(p<=0&&f-u>=0&&m-v>=0)return Hs.subVectors(s,r),o=(f-u)/(f-u+(m-v)),e.copy(r).addScaledVector(Hs,o);const d=1/(p+x+h);return a=x*d,o=h*d,e.copy(n).addScaledVector(ii,a).addScaledVector(ri,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Ro={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Rn={h:0,s:0,l:0},Qi={h:0,s:0,l:0};function kr(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}class Vt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const r=t;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=ye){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,ae.toWorkingColorSpace(this,e),this}setRGB(t,e,n,r=ae.workingColorSpace){return this.r=t,this.g=e,this.b=n,ae.toWorkingColorSpace(this,r),this}setHSL(t,e,n,r=ae.workingColorSpace){if(t=ra(t,1),e=Le(e,0,1),n=Le(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,a=2*n-s;this.r=kr(a,s,t+1/3),this.g=kr(a,s,t),this.b=kr(a,s,t-1/3)}return ae.toWorkingColorSpace(this,r),this}setStyle(t,e=ye){function n(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(s,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=ye){const n=Ro[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=mi(t.r),this.g=mi(t.g),this.b=mi(t.b),this}copyLinearToSRGB(t){return this.r=Lr(t.r),this.g=Lr(t.g),this.b=Lr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=ye){return ae.fromWorkingColorSpace(Fe.copy(this),t),Math.round(Le(Fe.r*255,0,255))*65536+Math.round(Le(Fe.g*255,0,255))*256+Math.round(Le(Fe.b*255,0,255))}getHexString(t=ye){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=ae.workingColorSpace){ae.fromWorkingColorSpace(Fe.copy(this),e);const n=Fe.r,r=Fe.g,s=Fe.b,a=Math.max(n,r,s),o=Math.min(n,r,s);let c,l;const u=(o+a)/2;if(o===a)c=0,l=0;else{const f=a-o;switch(l=u<=.5?f/(a+o):f/(2-a-o),a){case n:c=(r-s)/f+(r<s?6:0);break;case r:c=(s-n)/f+2;break;case s:c=(n-r)/f+4;break}c/=6}return t.h=c,t.s=l,t.l=u,t}getRGB(t,e=ae.workingColorSpace){return ae.fromWorkingColorSpace(Fe.copy(this),e),t.r=Fe.r,t.g=Fe.g,t.b=Fe.b,t}getStyle(t=ye){ae.fromWorkingColorSpace(Fe.copy(this),t);const e=Fe.r,n=Fe.g,r=Fe.b;return t!==ye?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(r*255)})`}offsetHSL(t,e,n){return this.getHSL(Rn),this.setHSL(Rn.h+t,Rn.s+e,Rn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Rn),t.getHSL(Qi);const n=Cr(Rn.h,Qi.h,e),r=Cr(Rn.s,Qi.s,e),s=Cr(Rn.l,Qi.l,e);return this.setHSL(n,r,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,r=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*r,this.g=s[1]*e+s[4]*n+s[7]*r,this.b=s[2]*e+s[5]*n+s[8]*r,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Fe=new Vt;Vt.NAMES=Ro;let Ma=0;class zi extends _i{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Ma++}),this.uuid=vi(),this.name="",this.type="Material",this.blending=1,this.side=0,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=204,this.blendDst=205,this.blendEquation=100,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Vt(0,0,0),this.blendAlpha=0,this.depthFunc=3,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=519,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=7680,this.stencilZFail=7680,this.stencilZPass=7680,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const r=this[e];if(r===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(n):r&&r.isVector3&&n&&n.isVector3?r.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==1&&(n.blending=this.blending),this.side!==0&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==204&&(n.blendSrc=this.blendSrc),this.blendDst!==205&&(n.blendDst=this.blendDst),this.blendEquation!==100&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==3&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==519&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==7680&&(n.stencilFail=this.stencilFail),this.stencilZFail!==7680&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==7680&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(e){const s=r(t.textures),a=r(t.images);s.length>0&&(n.textures=s),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const r=e.length;n=new Array(r);for(let s=0;s!==r;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class _s extends zi{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Vt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=0,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Se=new F,tr=new gt;class dn{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=35044,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=1015,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[t+r]=e.array[n+r];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)tr.fromBufferAttribute(this,e),tr.applyMatrix3(t),this.setXY(e,tr.x,tr.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix3(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyMatrix4(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.applyNormalMatrix(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Se.fromBufferAttribute(this,e),Se.transformDirection(t),this.setXYZ(e,Se.x,Se.y,Se.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ei(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=We(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ei(e,this.array)),e}setX(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ei(e,this.array)),e}setY(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ei(e,this.array)),e}setZ(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ei(e,this.array)),e}setW(t,e){return this.normalized&&(e=We(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,r){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array),r=We(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this}setXYZW(t,e,n,r,s){return t*=this.itemSize,this.normalized&&(e=We(e,this.array),n=We(n,this.array),r=We(r,this.array),s=We(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=r,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==35044&&(t.usage=this.usage),t}}class Co extends dn{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Po extends dn{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class ie extends dn{constructor(t,e,n){super(new Float32Array(t),e,n)}}let Sa=0;const Ke=new xe,Wr=new De,si=new F,Ze=new Bi,wi=new Bi,be=new F;class he extends _i{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Sa++}),this.uuid=vi(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Eo(t)?Po:Co)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new te().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(t),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Ke.makeRotationFromQuaternion(t),this.applyMatrix4(Ke),this}rotateX(t){return Ke.makeRotationX(t),this.applyMatrix4(Ke),this}rotateY(t){return Ke.makeRotationY(t),this.applyMatrix4(Ke),this}rotateZ(t){return Ke.makeRotationZ(t),this.applyMatrix4(Ke),this}translate(t,e,n){return Ke.makeTranslation(t,e,n),this.applyMatrix4(Ke),this}scale(t,e,n){return Ke.makeScale(t,e,n),this.applyMatrix4(Ke),this}lookAt(t){return Wr.lookAt(t),Wr.updateMatrix(),this.applyMatrix4(Wr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(si).negate(),this.translate(si.x,si.y,si.z),this}setFromPoints(t){const e=[];for(let n=0,r=t.length;n<r;n++){const s=t[n];e.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new ie(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Bi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new F(-1/0,-1/0,-1/0),new F(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,r=e.length;n<r;n++){const s=e[n];Ze.setFromBufferAttribute(s),this.morphTargetsRelative?(be.addVectors(this.boundingBox.min,Ze.min),this.boundingBox.expandByPoint(be),be.addVectors(this.boundingBox.max,Ze.max),this.boundingBox.expandByPoint(be)):(this.boundingBox.expandByPoint(Ze.min),this.boundingBox.expandByPoint(Ze.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new gs);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new F,1/0);return}if(t){const n=this.boundingSphere.center;if(Ze.setFromBufferAttribute(t),e)for(let s=0,a=e.length;s<a;s++){const o=e[s];wi.setFromBufferAttribute(o),this.morphTargetsRelative?(be.addVectors(Ze.min,wi.min),Ze.expandByPoint(be),be.addVectors(Ze.max,wi.max),Ze.expandByPoint(be)):(Ze.expandByPoint(wi.min),Ze.expandByPoint(wi.max))}Ze.getCenter(n);let r=0;for(let s=0,a=t.count;s<a;s++)be.fromBufferAttribute(t,s),r=Math.max(r,n.distanceToSquared(be));if(e)for(let s=0,a=e.length;s<a;s++){const o=e[s],c=this.morphTargetsRelative;for(let l=0,u=o.count;l<u;l++)be.fromBufferAttribute(o,l),c&&(si.fromBufferAttribute(t,l),be.add(si)),r=Math.max(r,n.distanceToSquared(be))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.array,r=e.position.array,s=e.normal.array,a=e.uv.array,o=r.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new dn(new Float32Array(4*o),4));const c=this.getAttribute("tangent").array,l=[],u=[];for(let C=0;C<o;C++)l[C]=new F,u[C]=new F;const f=new F,h=new F,m=new F,v=new gt,x=new gt,p=new gt,d=new F,E=new F;function M(C,G,j){f.fromArray(r,C*3),h.fromArray(r,G*3),m.fromArray(r,j*3),v.fromArray(a,C*2),x.fromArray(a,G*2),p.fromArray(a,j*2),h.sub(f),m.sub(f),x.sub(v),p.sub(v);const tt=1/(x.x*p.y-p.x*x.y);isFinite(tt)&&(d.copy(h).multiplyScalar(p.y).addScaledVector(m,-x.y).multiplyScalar(tt),E.copy(m).multiplyScalar(x.x).addScaledVector(h,-p.x).multiplyScalar(tt),l[C].add(d),l[G].add(d),l[j].add(d),u[C].add(E),u[G].add(E),u[j].add(E))}let b=this.groups;b.length===0&&(b=[{start:0,count:n.length}]);for(let C=0,G=b.length;C<G;++C){const j=b[C],tt=j.start,N=j.count;for(let V=tt,J=tt+N;V<J;V+=3)M(n[V+0],n[V+1],n[V+2])}const U=new F,L=new F,D=new F,q=new F;function T(C){D.fromArray(s,C*3),q.copy(D);const G=l[C];U.copy(G),U.sub(D.multiplyScalar(D.dot(G))).normalize(),L.crossVectors(q,G);const tt=L.dot(u[C])<0?-1:1;c[C*4]=U.x,c[C*4+1]=U.y,c[C*4+2]=U.z,c[C*4+3]=tt}for(let C=0,G=b.length;C<G;++C){const j=b[C],tt=j.start,N=j.count;for(let V=tt,J=tt+N;V<J;V+=3)T(n[V+0]),T(n[V+1]),T(n[V+2])}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new dn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let h=0,m=n.count;h<m;h++)n.setXYZ(h,0,0,0);const r=new F,s=new F,a=new F,o=new F,c=new F,l=new F,u=new F,f=new F;if(t)for(let h=0,m=t.count;h<m;h+=3){const v=t.getX(h+0),x=t.getX(h+1),p=t.getX(h+2);r.fromBufferAttribute(e,v),s.fromBufferAttribute(e,x),a.fromBufferAttribute(e,p),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),o.fromBufferAttribute(n,v),c.fromBufferAttribute(n,x),l.fromBufferAttribute(n,p),o.add(u),c.add(u),l.add(u),n.setXYZ(v,o.x,o.y,o.z),n.setXYZ(x,c.x,c.y,c.z),n.setXYZ(p,l.x,l.y,l.z)}else for(let h=0,m=e.count;h<m;h+=3)r.fromBufferAttribute(e,h+0),s.fromBufferAttribute(e,h+1),a.fromBufferAttribute(e,h+2),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)be.fromBufferAttribute(t,e),be.normalize(),t.setXYZ(e,be.x,be.y,be.z)}toNonIndexed(){function t(o,c){const l=o.array,u=o.itemSize,f=o.normalized,h=new l.constructor(c.length*u);let m=0,v=0;for(let x=0,p=c.length;x<p;x++){o.isInterleavedBufferAttribute?m=c[x]*o.data.stride+o.offset:m=c[x]*u;for(let d=0;d<u;d++)h[v++]=l[m++]}return new dn(h,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new he,n=this.index.array,r=this.attributes;for(const o in r){const c=r[o],l=t(c,n);e.setAttribute(o,l)}const s=this.morphAttributes;for(const o in s){const c=[],l=s[o];for(let u=0,f=l.length;u<f;u++){const h=l[u],m=t(h,n);c.push(m)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const l=a[o];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const r={};let s=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],u=[];for(let f=0,h=l.length;f<h;f++){const m=l[f];u.push(m.toJSON(t.data))}u.length>0&&(r[c]=u,s=!0)}s&&(t.data.morphAttributes=r,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const r=t.attributes;for(const l in r){const u=r[l];this.setAttribute(l,u.clone(e))}const s=t.morphAttributes;for(const l in s){const u=[],f=s[l];for(let h=0,m=f.length;h<m;h++)u.push(f[h].clone(e));this.morphAttributes[l]=u}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let l=0,u=a.length;l<u;l++){const f=a[l];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Vs=new xe,Fn=new fa,er=new gs,ks=new F,oi=new F,ai=new F,ci=new F,Xr=new F,nr=new F,ir=new gt,rr=new gt,sr=new gt,Ws=new F,Xs=new F,qs=new F,or=new F,ar=new F;class Lt extends De{constructor(t=new he,e=new _s){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const r=e[n[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(t,e){const n=this.geometry,r=n.attributes.position,s=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(r,t);const o=this.morphTargetInfluences;if(s&&o){nr.set(0,0,0);for(let c=0,l=s.length;c<l;c++){const u=o[c],f=s[c];u!==0&&(Xr.fromBufferAttribute(f,t),a?nr.addScaledVector(Xr,u):nr.addScaledVector(Xr.sub(e),u))}e.add(nr)}return e}raycast(t,e){const n=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),er.copy(n.boundingSphere),er.applyMatrix4(s),Fn.copy(t.ray).recast(t.near),!(er.containsPoint(Fn.origin)===!1&&(Fn.intersectSphere(er,ks)===null||Fn.origin.distanceToSquared(ks)>(t.far-t.near)**2))&&(Vs.copy(s).invert(),Fn.copy(t.ray).applyMatrix4(Vs),!(n.boundingBox!==null&&Fn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Fn)))}_computeIntersections(t,e,n){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,l=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,h=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let v=0,x=h.length;v<x;v++){const p=h[v],d=a[p.materialIndex],E=Math.max(p.start,m.start),M=Math.min(o.count,Math.min(p.start+p.count,m.start+m.count));for(let b=E,U=M;b<U;b+=3){const L=o.getX(b),D=o.getX(b+1),q=o.getX(b+2);r=cr(this,d,t,n,l,u,f,L,D,q),r&&(r.faceIndex=Math.floor(b/3),r.face.materialIndex=p.materialIndex,e.push(r))}}else{const v=Math.max(0,m.start),x=Math.min(o.count,m.start+m.count);for(let p=v,d=x;p<d;p+=3){const E=o.getX(p),M=o.getX(p+1),b=o.getX(p+2);r=cr(this,a,t,n,l,u,f,E,M,b),r&&(r.faceIndex=Math.floor(p/3),e.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let v=0,x=h.length;v<x;v++){const p=h[v],d=a[p.materialIndex],E=Math.max(p.start,m.start),M=Math.min(c.count,Math.min(p.start+p.count,m.start+m.count));for(let b=E,U=M;b<U;b+=3){const L=b,D=b+1,q=b+2;r=cr(this,d,t,n,l,u,f,L,D,q),r&&(r.faceIndex=Math.floor(b/3),r.face.materialIndex=p.materialIndex,e.push(r))}}else{const v=Math.max(0,m.start),x=Math.min(c.count,m.start+m.count);for(let p=v,d=x;p<d;p+=3){const E=p,M=p+1,b=p+2;r=cr(this,a,t,n,l,u,f,E,M,b),r&&(r.faceIndex=Math.floor(p/3),e.push(r))}}}}function ya(i,t,e,n,r,s,a,o){let c;if(t.side===1?c=n.intersectTriangle(a,s,r,!0,o):c=n.intersectTriangle(r,s,a,t.side===0,o),c===null)return null;ar.copy(o),ar.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(ar);return l<e.near||l>e.far?null:{distance:l,point:ar.clone(),object:i}}function cr(i,t,e,n,r,s,a,o,c,l){i.getVertexPosition(o,oi),i.getVertexPosition(c,ai),i.getVertexPosition(l,ci);const u=ya(i,t,e,n,oi,ai,ci,or);if(u){r&&(ir.fromBufferAttribute(r,o),rr.fromBufferAttribute(r,c),sr.fromBufferAttribute(r,l),u.uv=nn.getInterpolation(or,oi,ai,ci,ir,rr,sr,new gt)),s&&(ir.fromBufferAttribute(s,o),rr.fromBufferAttribute(s,c),sr.fromBufferAttribute(s,l),u.uv1=nn.getInterpolation(or,oi,ai,ci,ir,rr,sr,new gt),u.uv2=u.uv1),a&&(Ws.fromBufferAttribute(a,o),Xs.fromBufferAttribute(a,c),qs.fromBufferAttribute(a,l),u.normal=nn.getInterpolation(or,oi,ai,ci,Ws,Xs,qs,new F),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const f={a:o,b:c,c:l,normal:new F,materialIndex:0};nn.getNormal(oi,ai,ci,f.normal),u.face=f}return u}class fn extends he{constructor(t=1,e=1,n=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],l=[],u=[],f=[];let h=0,m=0;v("z","y","x",-1,-1,n,e,t,a,s,0),v("z","y","x",1,-1,n,e,-t,a,s,1),v("x","z","y",1,1,t,n,e,r,a,2),v("x","z","y",1,-1,t,n,-e,r,a,3),v("x","y","z",1,-1,t,e,n,r,s,4),v("x","y","z",-1,-1,t,e,-n,r,s,5),this.setIndex(c),this.setAttribute("position",new ie(l,3)),this.setAttribute("normal",new ie(u,3)),this.setAttribute("uv",new ie(f,2));function v(x,p,d,E,M,b,U,L,D,q,T){const C=b/D,G=U/q,j=b/2,tt=U/2,N=L/2,V=D+1,J=q+1;let et=0,it=0;const $=new F;for(let rt=0;rt<J;rt++){const lt=rt*G-tt;for(let st=0;st<V;st++){const X=st*C-j;$[x]=X*E,$[p]=lt*M,$[d]=N,l.push($.x,$.y,$.z),$[x]=0,$[p]=0,$[d]=L>0?1:-1,u.push($.x,$.y,$.z),f.push(st/D),f.push(1-rt/q),et+=1}}for(let rt=0;rt<q;rt++)for(let lt=0;lt<D;lt++){const st=h+lt+V*rt,X=h+lt+V*(rt+1),at=h+(lt+1)+V*(rt+1),_t=h+(lt+1)+V*rt;c.push(st,X,_t),c.push(X,at,_t),it+=6}o.addGroup(m,it,T),m+=it,h+=et}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new fn(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function gi(i){const t={};for(const e in i){t[e]={};for(const n in i[e]){const r=i[e][n];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=r.clone():Array.isArray(r)?t[e][n]=r.slice():t[e][n]=r}}return t}function He(i){const t={};for(let e=0;e<i.length;e++){const n=gi(i[e]);for(const r in n)t[r]=n[r]}return t}function Ea(i){const t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Lo(i){return i.getRenderTarget()===null?i.outputColorSpace:ae.workingColorSpace}const Ta={clone:gi,merge:He};var ba=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Aa=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class kn extends zi{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=ba,this.fragmentShader=Aa,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=gi(t.uniforms),this.uniformsGroups=Ea(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?e.uniforms[r]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[r]={type:"m4",value:a.toArray()}:e.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const r in this.extensions)this.extensions[r]===!0&&(n[r]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Do extends De{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new xe,this.projectionMatrix=new xe,this.projectionMatrixInverse=new xe,this.coordinateSystem=2e3}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}class rn extends Do{constructor(t=50,e=1,n=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=r,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=os*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Rr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return os*2*Math.atan(Math.tan(Rr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,r,s,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Rr*.5*this.fov)/this.zoom,n=2*e,r=this.aspect*n,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,l=a.fullHeight;s+=a.offsetX*r/c,e-=a.offsetY*n/l,r*=a.width/c,n*=a.height/l}const o=this.filmOffset;o!==0&&(s+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const li=-90,ui=1;class wa extends De{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new rn(li,ui,t,e);r.layers=this.layers,this.add(r);const s=new rn(li,ui,t,e);s.layers=this.layers,this.add(s);const a=new rn(li,ui,t,e);a.layers=this.layers,this.add(a);const o=new rn(li,ui,t,e);o.layers=this.layers,this.add(o);const c=new rn(li,ui,t,e);c.layers=this.layers,this.add(c);const l=new rn(li,ui,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,r,s,a,o,c]=e;for(const l of e)this.remove(l);if(t===2e3)n.up.set(0,1,0),n.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===2001)n.up.set(0,-1,0),n.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:r}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,l,u]=this.children,f=t.getRenderTarget(),h=t.getActiveCubeFace(),m=t.getActiveMipmapLevel(),v=t.xr.enabled;t.xr.enabled=!1;const x=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,r),t.render(e,s),t.setRenderTarget(n,1,r),t.render(e,a),t.setRenderTarget(n,2,r),t.render(e,o),t.setRenderTarget(n,3,r),t.render(e,c),t.setRenderTarget(n,4,r),t.render(e,l),n.texture.generateMipmaps=x,t.setRenderTarget(n,5,r),t.render(e,u),t.setRenderTarget(f,h,m),t.xr.enabled=v,n.texture.needsPMREMUpdate=!0}}class Uo extends qe{constructor(t,e,n,r,s,a,o,c,l,u){t=t!==void 0?t:[],e=e!==void 0?e:301,super(t,e,n,r,s,a,o,c,l,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class Ra extends Vn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},r=[n,n,n,n,n,n];e.encoding!==void 0&&(Pi("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===3001?ye:""),this.texture=new Uo(r,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:1006}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new fn(5,5,5),s=new kn({name:"CubemapFromEquirect",uniforms:gi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:1,blending:0});s.uniforms.tEquirect.value=e;const a=new Lt(r,s),o=e.minFilter;return e.minFilter===1008&&(e.minFilter=1006),new wa(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,r){const s=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,r);t.setRenderTarget(s)}}const qr=new F,Ca=new F,Pa=new te;class Bn{constructor(t=new F(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,r){return this.normal.set(t,e,n),this.constant=r,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const r=qr.subVectors(n,e).cross(Ca.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(r,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(qr),r=this.normal.dot(n);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const s=-(t.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:e.copy(t.start).addScaledVector(n,s)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||Pa.getNormalMatrix(t),r=this.coplanarPoint(qr).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-r.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const On=new gs,lr=new F;class vs{constructor(t=new Bn,e=new Bn,n=new Bn,r=new Bn,s=new Bn,a=new Bn){this.planes=[t,e,n,r,s,a]}set(t,e,n,r,s,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=2e3){const n=this.planes,r=t.elements,s=r[0],a=r[1],o=r[2],c=r[3],l=r[4],u=r[5],f=r[6],h=r[7],m=r[8],v=r[9],x=r[10],p=r[11],d=r[12],E=r[13],M=r[14],b=r[15];if(n[0].setComponents(c-s,h-l,p-m,b-d).normalize(),n[1].setComponents(c+s,h+l,p+m,b+d).normalize(),n[2].setComponents(c+a,h+u,p+v,b+E).normalize(),n[3].setComponents(c-a,h-u,p-v,b-E).normalize(),n[4].setComponents(c-o,h-f,p-x,b-M).normalize(),e===2e3)n[5].setComponents(c+o,h+f,p+x,b+M).normalize();else if(e===2001)n[5].setComponents(o,f,x,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),On.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),On.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(On)}intersectsSprite(t){return On.center.set(0,0,0),On.radius=.7071067811865476,On.applyMatrix4(t.matrixWorld),this.intersectsSphere(On)}intersectsSphere(t){const e=this.planes,n=t.center,r=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<r)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const r=e[n];if(lr.x=r.normal.x>0?t.max.x:t.min.x,lr.y=r.normal.y>0?t.max.y:t.min.y,lr.z=r.normal.z>0?t.max.z:t.min.z,r.distanceToPoint(lr)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function No(){let i=null,t=!1,e=null,n=null;function r(s,a){e(s,a),n=i.requestAnimationFrame(r)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(r),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){i=s}}}function La(i,t){const e=t.isWebGL2,n=new WeakMap;function r(l,u){const f=l.array,h=l.usage,m=f.byteLength,v=i.createBuffer();i.bindBuffer(u,v),i.bufferData(u,f,h),l.onUploadCallback();let x;if(f instanceof Float32Array)x=i.FLOAT;else if(f instanceof Uint16Array)if(l.isFloat16BufferAttribute)if(e)x=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else x=i.UNSIGNED_SHORT;else if(f instanceof Int16Array)x=i.SHORT;else if(f instanceof Uint32Array)x=i.UNSIGNED_INT;else if(f instanceof Int32Array)x=i.INT;else if(f instanceof Int8Array)x=i.BYTE;else if(f instanceof Uint8Array)x=i.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)x=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:v,type:x,bytesPerElement:f.BYTES_PER_ELEMENT,version:l.version,size:m}}function s(l,u,f){const h=u.array,m=u._updateRange,v=u.updateRanges;if(i.bindBuffer(f,l),m.count===-1&&v.length===0&&i.bufferSubData(f,0,h),v.length!==0){for(let x=0,p=v.length;x<p;x++){const d=v[x];e?i.bufferSubData(f,d.start*h.BYTES_PER_ELEMENT,h,d.start,d.count):i.bufferSubData(f,d.start*h.BYTES_PER_ELEMENT,h.subarray(d.start,d.start+d.count))}u.clearUpdateRanges()}m.count!==-1&&(e?i.bufferSubData(f,m.offset*h.BYTES_PER_ELEMENT,h,m.offset,m.count):i.bufferSubData(f,m.offset*h.BYTES_PER_ELEMENT,h.subarray(m.offset,m.offset+m.count)),m.count=-1),u.onUploadCallback()}function a(l){return l.isInterleavedBufferAttribute&&(l=l.data),n.get(l)}function o(l){l.isInterleavedBufferAttribute&&(l=l.data);const u=n.get(l);u&&(i.deleteBuffer(u.buffer),n.delete(l))}function c(l,u){if(l.isGLBufferAttribute){const h=n.get(l);(!h||h.version<l.version)&&n.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}l.isInterleavedBufferAttribute&&(l=l.data);const f=n.get(l);if(f===void 0)n.set(l,r(l,u));else if(f.version<l.version){if(f.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");s(f.buffer,l,u),f.version=l.version}}return{get:a,remove:o,update:c}}class Er extends he{constructor(t=1,e=1,n=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:r};const s=t/2,a=e/2,o=Math.floor(n),c=Math.floor(r),l=o+1,u=c+1,f=t/o,h=e/c,m=[],v=[],x=[],p=[];for(let d=0;d<u;d++){const E=d*h-a;for(let M=0;M<l;M++){const b=M*f-s;v.push(b,-E,0),x.push(0,0,1),p.push(M/o),p.push(1-d/c)}}for(let d=0;d<c;d++)for(let E=0;E<o;E++){const M=E+l*d,b=E+l*(d+1),U=E+1+l*(d+1),L=E+1+l*d;m.push(M,b,L),m.push(b,U,L)}this.setIndex(m),this.setAttribute("position",new ie(v,3)),this.setAttribute("normal",new ie(x,3)),this.setAttribute("uv",new ie(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Er(t.width,t.height,t.widthSegments,t.heightSegments)}}var Da=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Ua=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Na=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ia=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Fa=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Oa=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ba=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,za=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ga=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ha=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Va=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ka=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Wa=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Xa=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,qa=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Ya=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,Za=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Ja=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ka=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ja=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,$a=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Qa=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,tc=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,ec=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,nc=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ic=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,rc=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,sc=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,oc=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,ac=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,cc="gl_FragColor = linearToOutputTexel( gl_FragColor );",lc=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,uc=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,hc=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,fc=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,dc=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,pc=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,mc=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,gc=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,_c=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,vc=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,xc=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Mc=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Sc=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,yc=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ec=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Tc=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,bc=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Ac=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,wc=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Rc=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Cc=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Pc=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Lc=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Dc=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Uc=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Nc=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ic=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Fc=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Oc=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Bc=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,zc=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Gc=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Hc=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Vc=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,kc=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Wc=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Xc=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,qc=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Yc=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,Zc=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Jc=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Kc=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,jc=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,$c=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Qc=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,tl=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,el=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,nl=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,il=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,rl=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,sl=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,ol=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,al=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,cl=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ll=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,ul=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,hl=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,fl=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,dl=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,pl=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,ml=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,gl=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,_l=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,vl=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,xl=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ml=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Sl=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,yl=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,El=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Tl=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,bl=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Al=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,wl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Rl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Cl=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Pl=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Ll=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Dl=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ul=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Nl=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Il=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Fl=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ol=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Bl=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,zl=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Gl=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Hl=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Vl=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,kl=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Wl=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Xl=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,ql=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Yl=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Zl=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Jl=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Kl=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jl=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,$l=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Ql=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,tu=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,eu=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,nu=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,iu=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ru=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,su=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,ou=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,au=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,cu=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,lu=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,uu=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,$t={alphahash_fragment:Da,alphahash_pars_fragment:Ua,alphamap_fragment:Na,alphamap_pars_fragment:Ia,alphatest_fragment:Fa,alphatest_pars_fragment:Oa,aomap_fragment:Ba,aomap_pars_fragment:za,batching_pars_vertex:Ga,batching_vertex:Ha,begin_vertex:Va,beginnormal_vertex:ka,bsdfs:Wa,iridescence_fragment:Xa,bumpmap_pars_fragment:qa,clipping_planes_fragment:Ya,clipping_planes_pars_fragment:Za,clipping_planes_pars_vertex:Ja,clipping_planes_vertex:Ka,color_fragment:ja,color_pars_fragment:$a,color_pars_vertex:Qa,color_vertex:tc,common:ec,cube_uv_reflection_fragment:nc,defaultnormal_vertex:ic,displacementmap_pars_vertex:rc,displacementmap_vertex:sc,emissivemap_fragment:oc,emissivemap_pars_fragment:ac,colorspace_fragment:cc,colorspace_pars_fragment:lc,envmap_fragment:uc,envmap_common_pars_fragment:hc,envmap_pars_fragment:fc,envmap_pars_vertex:dc,envmap_physical_pars_fragment:bc,envmap_vertex:pc,fog_vertex:mc,fog_pars_vertex:gc,fog_fragment:_c,fog_pars_fragment:vc,gradientmap_pars_fragment:xc,lightmap_fragment:Mc,lightmap_pars_fragment:Sc,lights_lambert_fragment:yc,lights_lambert_pars_fragment:Ec,lights_pars_begin:Tc,lights_toon_fragment:Ac,lights_toon_pars_fragment:wc,lights_phong_fragment:Rc,lights_phong_pars_fragment:Cc,lights_physical_fragment:Pc,lights_physical_pars_fragment:Lc,lights_fragment_begin:Dc,lights_fragment_maps:Uc,lights_fragment_end:Nc,logdepthbuf_fragment:Ic,logdepthbuf_pars_fragment:Fc,logdepthbuf_pars_vertex:Oc,logdepthbuf_vertex:Bc,map_fragment:zc,map_pars_fragment:Gc,map_particle_fragment:Hc,map_particle_pars_fragment:Vc,metalnessmap_fragment:kc,metalnessmap_pars_fragment:Wc,morphcolor_vertex:Xc,morphnormal_vertex:qc,morphtarget_pars_vertex:Yc,morphtarget_vertex:Zc,normal_fragment_begin:Jc,normal_fragment_maps:Kc,normal_pars_fragment:jc,normal_pars_vertex:$c,normal_vertex:Qc,normalmap_pars_fragment:tl,clearcoat_normal_fragment_begin:el,clearcoat_normal_fragment_maps:nl,clearcoat_pars_fragment:il,iridescence_pars_fragment:rl,opaque_fragment:sl,packing:ol,premultiplied_alpha_fragment:al,project_vertex:cl,dithering_fragment:ll,dithering_pars_fragment:ul,roughnessmap_fragment:hl,roughnessmap_pars_fragment:fl,shadowmap_pars_fragment:dl,shadowmap_pars_vertex:pl,shadowmap_vertex:ml,shadowmask_pars_fragment:gl,skinbase_vertex:_l,skinning_pars_vertex:vl,skinning_vertex:xl,skinnormal_vertex:Ml,specularmap_fragment:Sl,specularmap_pars_fragment:yl,tonemapping_fragment:El,tonemapping_pars_fragment:Tl,transmission_fragment:bl,transmission_pars_fragment:Al,uv_pars_fragment:wl,uv_pars_vertex:Rl,uv_vertex:Cl,worldpos_vertex:Pl,background_vert:Ll,background_frag:Dl,backgroundCube_vert:Ul,backgroundCube_frag:Nl,cube_vert:Il,cube_frag:Fl,depth_vert:Ol,depth_frag:Bl,distanceRGBA_vert:zl,distanceRGBA_frag:Gl,equirect_vert:Hl,equirect_frag:Vl,linedashed_vert:kl,linedashed_frag:Wl,meshbasic_vert:Xl,meshbasic_frag:ql,meshlambert_vert:Yl,meshlambert_frag:Zl,meshmatcap_vert:Jl,meshmatcap_frag:Kl,meshnormal_vert:jl,meshnormal_frag:$l,meshphong_vert:Ql,meshphong_frag:tu,meshphysical_vert:eu,meshphysical_frag:nu,meshtoon_vert:iu,meshtoon_frag:ru,points_vert:su,points_frag:ou,shadow_vert:au,shadow_frag:cu,sprite_vert:lu,sprite_frag:uu},Mt={common:{diffuse:{value:new Vt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new te}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new te}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new te}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new te},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new te},normalScale:{value:new gt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new te},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new te}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new te}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new te}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Vt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Vt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0},uvTransform:{value:new te}},sprite:{diffuse:{value:new Vt(16777215)},opacity:{value:1},center:{value:new gt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new te},alphaMap:{value:null},alphaMapTransform:{value:new te},alphaTest:{value:0}}},hn={basic:{uniforms:He([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.fog]),vertexShader:$t.meshbasic_vert,fragmentShader:$t.meshbasic_frag},lambert:{uniforms:He([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,Mt.lights,{emissive:{value:new Vt(0)}}]),vertexShader:$t.meshlambert_vert,fragmentShader:$t.meshlambert_frag},phong:{uniforms:He([Mt.common,Mt.specularmap,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,Mt.lights,{emissive:{value:new Vt(0)},specular:{value:new Vt(1118481)},shininess:{value:30}}]),vertexShader:$t.meshphong_vert,fragmentShader:$t.meshphong_frag},standard:{uniforms:He([Mt.common,Mt.envmap,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.roughnessmap,Mt.metalnessmap,Mt.fog,Mt.lights,{emissive:{value:new Vt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag},toon:{uniforms:He([Mt.common,Mt.aomap,Mt.lightmap,Mt.emissivemap,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.gradientmap,Mt.fog,Mt.lights,{emissive:{value:new Vt(0)}}]),vertexShader:$t.meshtoon_vert,fragmentShader:$t.meshtoon_frag},matcap:{uniforms:He([Mt.common,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,Mt.fog,{matcap:{value:null}}]),vertexShader:$t.meshmatcap_vert,fragmentShader:$t.meshmatcap_frag},points:{uniforms:He([Mt.points,Mt.fog]),vertexShader:$t.points_vert,fragmentShader:$t.points_frag},dashed:{uniforms:He([Mt.common,Mt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:$t.linedashed_vert,fragmentShader:$t.linedashed_frag},depth:{uniforms:He([Mt.common,Mt.displacementmap]),vertexShader:$t.depth_vert,fragmentShader:$t.depth_frag},normal:{uniforms:He([Mt.common,Mt.bumpmap,Mt.normalmap,Mt.displacementmap,{opacity:{value:1}}]),vertexShader:$t.meshnormal_vert,fragmentShader:$t.meshnormal_frag},sprite:{uniforms:He([Mt.sprite,Mt.fog]),vertexShader:$t.sprite_vert,fragmentShader:$t.sprite_frag},background:{uniforms:{uvTransform:{value:new te},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:$t.background_vert,fragmentShader:$t.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:$t.backgroundCube_vert,fragmentShader:$t.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:$t.cube_vert,fragmentShader:$t.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:$t.equirect_vert,fragmentShader:$t.equirect_frag},distanceRGBA:{uniforms:He([Mt.common,Mt.displacementmap,{referencePosition:{value:new F},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:$t.distanceRGBA_vert,fragmentShader:$t.distanceRGBA_frag},shadow:{uniforms:He([Mt.lights,Mt.fog,{color:{value:new Vt(0)},opacity:{value:1}}]),vertexShader:$t.shadow_vert,fragmentShader:$t.shadow_frag}};hn.physical={uniforms:He([hn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new te},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new te},clearcoatNormalScale:{value:new gt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new te},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new te},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new te},sheen:{value:0},sheenColor:{value:new Vt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new te},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new te},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new te},transmissionSamplerSize:{value:new gt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new te},attenuationDistance:{value:0},attenuationColor:{value:new Vt(0)},specularColor:{value:new Vt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new te},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new te},anisotropyVector:{value:new gt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new te}}]),vertexShader:$t.meshphysical_vert,fragmentShader:$t.meshphysical_frag};const ur={r:0,b:0,g:0};function hu(i,t,e,n,r,s,a){const o=new Vt(0);let c=s===!0?0:1,l,u,f=null,h=0,m=null;function v(p,d){let E=!1,M=d.isScene===!0?d.background:null;M&&M.isTexture&&(M=(d.backgroundBlurriness>0?e:t).get(M)),M===null?x(o,c):M&&M.isColor&&(x(M,1),E=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,a):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||E)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),M&&(M.isCubeTexture||M.mapping===306)?(u===void 0&&(u=new Lt(new fn(1,1,1),new kn({name:"BackgroundCubeMaterial",uniforms:gi(hn.backgroundCube.uniforms),vertexShader:hn.backgroundCube.vertexShader,fragmentShader:hn.backgroundCube.fragmentShader,side:1,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(U,L,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),u.material.uniforms.envMap.value=M,u.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=d.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,u.material.toneMapped=ae.getTransfer(M.colorSpace)!==ue,(f!==M||h!==M.version||m!==i.toneMapping)&&(u.material.needsUpdate=!0,f=M,h=M.version,m=i.toneMapping),u.layers.enableAll(),p.unshift(u,u.geometry,u.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new Lt(new Er(2,2),new kn({name:"BackgroundMaterial",uniforms:gi(hn.background.uniforms),vertexShader:hn.background.vertexShader,fragmentShader:hn.background.fragmentShader,side:0,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=d.backgroundIntensity,l.material.toneMapped=ae.getTransfer(M.colorSpace)!==ue,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(f!==M||h!==M.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,f=M,h=M.version,m=i.toneMapping),l.layers.enableAll(),p.unshift(l,l.geometry,l.material,0,0,null))}function x(p,d){p.getRGB(ur,Lo(i)),n.buffers.color.setClear(ur.r,ur.g,ur.b,d,a)}return{getClearColor:function(){return o},setClearColor:function(p,d=1){o.set(p),c=d,x(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(p){c=p,x(o,c)},render:v}}function fu(i,t,e,n){const r=i.getParameter(i.MAX_VERTEX_ATTRIBS),s=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||s!==null,o={},c=p(null);let l=c,u=!1;function f(N,V,J,et,it){let $=!1;if(a){const rt=x(et,J,V);l!==rt&&(l=rt,m(l.object)),$=d(N,et,J,it),$&&E(N,et,J,it)}else{const rt=V.wireframe===!0;(l.geometry!==et.id||l.program!==J.id||l.wireframe!==rt)&&(l.geometry=et.id,l.program=J.id,l.wireframe=rt,$=!0)}it!==null&&e.update(it,i.ELEMENT_ARRAY_BUFFER),($||u)&&(u=!1,q(N,V,J,et),it!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(it).buffer))}function h(){return n.isWebGL2?i.createVertexArray():s.createVertexArrayOES()}function m(N){return n.isWebGL2?i.bindVertexArray(N):s.bindVertexArrayOES(N)}function v(N){return n.isWebGL2?i.deleteVertexArray(N):s.deleteVertexArrayOES(N)}function x(N,V,J){const et=J.wireframe===!0;let it=o[N.id];it===void 0&&(it={},o[N.id]=it);let $=it[V.id];$===void 0&&($={},it[V.id]=$);let rt=$[et];return rt===void 0&&(rt=p(h()),$[et]=rt),rt}function p(N){const V=[],J=[],et=[];for(let it=0;it<r;it++)V[it]=0,J[it]=0,et[it]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:V,enabledAttributes:J,attributeDivisors:et,object:N,attributes:{},index:null}}function d(N,V,J,et){const it=l.attributes,$=V.attributes;let rt=0;const lt=J.getAttributes();for(const st in lt)if(lt[st].location>=0){const at=it[st];let _t=$[st];if(_t===void 0&&(st==="instanceMatrix"&&N.instanceMatrix&&(_t=N.instanceMatrix),st==="instanceColor"&&N.instanceColor&&(_t=N.instanceColor)),at===void 0||at.attribute!==_t||_t&&at.data!==_t.data)return!0;rt++}return l.attributesNum!==rt||l.index!==et}function E(N,V,J,et){const it={},$=V.attributes;let rt=0;const lt=J.getAttributes();for(const st in lt)if(lt[st].location>=0){let at=$[st];at===void 0&&(st==="instanceMatrix"&&N.instanceMatrix&&(at=N.instanceMatrix),st==="instanceColor"&&N.instanceColor&&(at=N.instanceColor));const _t={};_t.attribute=at,at&&at.data&&(_t.data=at.data),it[st]=_t,rt++}l.attributes=it,l.attributesNum=rt,l.index=et}function M(){const N=l.newAttributes;for(let V=0,J=N.length;V<J;V++)N[V]=0}function b(N){U(N,0)}function U(N,V){const J=l.newAttributes,et=l.enabledAttributes,it=l.attributeDivisors;J[N]=1,et[N]===0&&(i.enableVertexAttribArray(N),et[N]=1),it[N]!==V&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](N,V),it[N]=V)}function L(){const N=l.newAttributes,V=l.enabledAttributes;for(let J=0,et=V.length;J<et;J++)V[J]!==N[J]&&(i.disableVertexAttribArray(J),V[J]=0)}function D(N,V,J,et,it,$,rt){rt===!0?i.vertexAttribIPointer(N,V,J,it,$):i.vertexAttribPointer(N,V,J,et,it,$)}function q(N,V,J,et){if(n.isWebGL2===!1&&(N.isInstancedMesh||et.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;M();const it=et.attributes,$=J.getAttributes(),rt=V.defaultAttributeValues;for(const lt in $){const st=$[lt];if(st.location>=0){let X=it[lt];if(X===void 0&&(lt==="instanceMatrix"&&N.instanceMatrix&&(X=N.instanceMatrix),lt==="instanceColor"&&N.instanceColor&&(X=N.instanceColor)),X!==void 0){const at=X.normalized,_t=X.itemSize,wt=e.get(X);if(wt===void 0)continue;const Et=wt.buffer,Ut=wt.type,Zt=wt.bytesPerElement,Nt=n.isWebGL2===!0&&(Ut===i.INT||Ut===i.UNSIGNED_INT||X.gpuType===1013);if(X.isInterleavedBufferAttribute){const Xt=X.data,I=Xt.stride,vt=X.offset;if(Xt.isInstancedInterleavedBuffer){for(let nt=0;nt<st.locationSize;nt++)U(st.location+nt,Xt.meshPerAttribute);N.isInstancedMesh!==!0&&et._maxInstanceCount===void 0&&(et._maxInstanceCount=Xt.meshPerAttribute*Xt.count)}else for(let nt=0;nt<st.locationSize;nt++)b(st.location+nt);i.bindBuffer(i.ARRAY_BUFFER,Et);for(let nt=0;nt<st.locationSize;nt++)D(st.location+nt,_t/st.locationSize,Ut,at,I*Zt,(vt+_t/st.locationSize*nt)*Zt,Nt)}else{if(X.isInstancedBufferAttribute){for(let Xt=0;Xt<st.locationSize;Xt++)U(st.location+Xt,X.meshPerAttribute);N.isInstancedMesh!==!0&&et._maxInstanceCount===void 0&&(et._maxInstanceCount=X.meshPerAttribute*X.count)}else for(let Xt=0;Xt<st.locationSize;Xt++)b(st.location+Xt);i.bindBuffer(i.ARRAY_BUFFER,Et);for(let Xt=0;Xt<st.locationSize;Xt++)D(st.location+Xt,_t/st.locationSize,Ut,at,_t*Zt,_t/st.locationSize*Xt*Zt,Nt)}}else if(rt!==void 0){const at=rt[lt];if(at!==void 0)switch(at.length){case 2:i.vertexAttrib2fv(st.location,at);break;case 3:i.vertexAttrib3fv(st.location,at);break;case 4:i.vertexAttrib4fv(st.location,at);break;default:i.vertexAttrib1fv(st.location,at)}}}}L()}function T(){j();for(const N in o){const V=o[N];for(const J in V){const et=V[J];for(const it in et)v(et[it].object),delete et[it];delete V[J]}delete o[N]}}function C(N){if(o[N.id]===void 0)return;const V=o[N.id];for(const J in V){const et=V[J];for(const it in et)v(et[it].object),delete et[it];delete V[J]}delete o[N.id]}function G(N){for(const V in o){const J=o[V];if(J[N.id]===void 0)continue;const et=J[N.id];for(const it in et)v(et[it].object),delete et[it];delete J[N.id]}}function j(){tt(),u=!0,l!==c&&(l=c,m(l.object))}function tt(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:f,reset:j,resetDefaultState:tt,dispose:T,releaseStatesOfGeometry:C,releaseStatesOfProgram:G,initAttributes:M,enableAttribute:b,disableUnusedAttributes:L}}function du(i,t,e,n){const r=n.isWebGL2;let s;function a(u){s=u}function o(u,f){i.drawArrays(s,u,f),e.update(f,s,1)}function c(u,f,h){if(h===0)return;let m,v;if(r)m=i,v="drawArraysInstanced";else if(m=t.get("ANGLE_instanced_arrays"),v="drawArraysInstancedANGLE",m===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}m[v](s,u,f,h),e.update(f,s,h)}function l(u,f,h){if(h===0)return;const m=t.get("WEBGL_multi_draw");if(m===null)for(let v=0;v<h;v++)this.render(u[v],f[v]);else{m.multiDrawArraysWEBGL(s,u,0,f,0,h);let v=0;for(let x=0;x<h;x++)v+=f[x];e.update(v,s,1)}}this.setMode=a,this.render=o,this.renderInstances=c,this.renderMultiDraw=l}function pu(i,t,e){let n;function r(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){const D=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(D.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function s(D){if(D==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";D="mediump"}return D==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}const a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext";let o=e.precision!==void 0?e.precision:"highp";const c=s(o);c!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",c,"instead."),o=c);const l=a||t.has("WEBGL_draw_buffers"),u=e.logarithmicDepthBuffer===!0,f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),h=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_TEXTURE_SIZE),v=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),x=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),d=i.getParameter(i.MAX_VARYING_VECTORS),E=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),M=h>0,b=a||t.has("OES_texture_float"),U=M&&b,L=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:l,getMaxAnisotropy:r,getMaxPrecision:s,precision:o,logarithmicDepthBuffer:u,maxTextures:f,maxVertexTextures:h,maxTextureSize:m,maxCubemapSize:v,maxAttributes:x,maxVertexUniforms:p,maxVaryings:d,maxFragmentUniforms:E,vertexTextures:M,floatFragmentTextures:b,floatVertexTextures:U,maxSamples:L}}function mu(i){const t=this;let e=null,n=0,r=!1,s=!1;const a=new Bn,o=new te,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const m=f.length!==0||h||n!==0||r;return r=h,n=f.length,m},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,h){e=u(f,h,0)},this.setState=function(f,h,m){const v=f.clippingPlanes,x=f.clipIntersection,p=f.clipShadows,d=i.get(f);if(!r||v===null||v.length===0||s&&!p)s?u(null):l();else{const E=s?0:n,M=E*4;let b=d.clippingState||null;c.value=b,b=u(v,h,M,m);for(let U=0;U!==M;++U)b[U]=e[U];d.clippingState=b,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=E}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(f,h,m,v){const x=f!==null?f.length:0;let p=null;if(x!==0){if(p=c.value,v!==!0||p===null){const d=m+x*4,E=h.matrixWorldInverse;o.getNormalMatrix(E),(p===null||p.length<d)&&(p=new Float32Array(d));for(let M=0,b=m;M!==x;++M,b+=4)a.copy(f[M]).applyMatrix4(E,o),a.normal.toArray(p,b),p[b+3]=a.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,p}}function gu(i){let t=new WeakMap;function e(a,o){return o===303?a.mapping=301:o===304&&(a.mapping=302),a}function n(a){if(a&&a.isTexture){const o=a.mapping;if(o===303||o===304)if(t.has(a)){const c=t.get(a).texture;return e(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const l=new Ra(c.height/2);return l.fromEquirectangularTexture(i,a),t.set(a,l),a.addEventListener("dispose",r),e(l.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function s(){t=new WeakMap}return{get:n,dispose:s}}class xs extends Do{constructor(t=-1,e=1,n=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=n-t,a=n+t,o=r+e,c=r-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=l*this.view.offsetX,a=s+l*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const fi=4,Ys=[.125,.215,.35,.446,.526,.582],Gn=20,Yr=new xs,Zs=new Vt;let Zr=null,Jr=0,Kr=0;const zn=(1+Math.sqrt(5))/2,hi=1/zn,Js=[new F(1,1,1),new F(-1,1,1),new F(1,1,-1),new F(-1,1,-1),new F(0,zn,hi),new F(0,zn,-hi),new F(hi,0,zn),new F(-hi,0,zn),new F(zn,hi,0),new F(-zn,hi,0)];class Ks{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,r=100){Zr=this._renderer.getRenderTarget(),Jr=this._renderer.getActiveCubeFace(),Kr=this._renderer.getActiveMipmapLevel(),this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(t,n,r,s),e>0&&this._blur(s,0,0,e),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Qs(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=$s(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Zr,Jr,Kr),t.scissorTest=!1,hr(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===301||t.mapping===302?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Zr=this._renderer.getRenderTarget(),Jr=this._renderer.getActiveCubeFace(),Kr=this._renderer.getActiveMipmapLevel();const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:1006,minFilter:1006,generateMipmaps:!1,type:1016,format:1023,colorSpace:En,depthBuffer:!1},r=js(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=js(t,e,n);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=_u(s)),this._blurMaterial=vu(s,t,e)}return r}_compileMaterial(t){const e=new Lt(this._lodPlanes[0],t);this._renderer.compile(e,Yr)}_sceneToCubeUV(t,e,n,r){const o=new rn(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,h=u.toneMapping;u.getClearColor(Zs),u.toneMapping=0,u.autoClear=!1;const m=new _s({name:"PMREM.Background",side:1,depthWrite:!1,depthTest:!1}),v=new Lt(new fn,m);let x=!1;const p=t.background;p?p.isColor&&(m.color.copy(p),t.background=null,x=!0):(m.color.copy(Zs),x=!0);for(let d=0;d<6;d++){const E=d%3;E===0?(o.up.set(0,c[d],0),o.lookAt(l[d],0,0)):E===1?(o.up.set(0,0,c[d]),o.lookAt(0,l[d],0)):(o.up.set(0,c[d],0),o.lookAt(0,0,l[d]));const M=this._cubeSize;hr(r,E*M,d>2?M:0,M,M),u.setRenderTarget(r),x&&u.render(v,o),u.render(t,o)}v.geometry.dispose(),v.material.dispose(),u.toneMapping=h,u.autoClear=f,t.background=p}_textureToCubeUV(t,e){const n=this._renderer,r=t.mapping===301||t.mapping===302;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=Qs()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=$s());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Lt(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=t;const c=this._cubeSize;hr(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Yr)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let r=1;r<this._lodPlanes.length;r++){const s=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Js[(r-1)%Js.length];this._blur(t,r-1,r,s,a)}e.autoClear=n}_blur(t,e,n,r,s){const a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,r,"latitudinal",s),this._halfBlur(a,t,n,n,r,"longitudinal",s)}_halfBlur(t,e,n,r,s,a,o){const c=this._renderer,l=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new Lt(this._lodPlanes[r],l),h=l.uniforms,m=this._sizeLods[n]-1,v=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*Gn-1),x=s/v,p=isFinite(s)?1+Math.floor(u*x):Gn;p>Gn&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Gn}`);const d=[];let E=0;for(let D=0;D<Gn;++D){const q=D/x,T=Math.exp(-q*q/2);d.push(T),D===0?E+=T:D<p&&(E+=2*T)}for(let D=0;D<d.length;D++)d[D]=d[D]/E;h.envMap.value=t.texture,h.samples.value=p,h.weights.value=d,h.latitudinal.value=a==="latitudinal",o&&(h.poleAxis.value=o);const{_lodMax:M}=this;h.dTheta.value=v,h.mipInt.value=M-n;const b=this._sizeLods[r],U=3*b*(r>M-fi?r-M+fi:0),L=4*(this._cubeSize-b);hr(e,U,L,3*b,2*b),c.setRenderTarget(e),c.render(f,Yr)}}function _u(i){const t=[],e=[],n=[];let r=i;const s=i-fi+1+Ys.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let c=1/o;a>i-fi?c=Ys[a-i+fi-1]:a===0&&(c=0),n.push(c);const l=1/(o-2),u=-l,f=1+l,h=[u,u,f,u,f,f,u,u,f,f,u,f],m=6,v=6,x=3,p=2,d=1,E=new Float32Array(x*v*m),M=new Float32Array(p*v*m),b=new Float32Array(d*v*m);for(let L=0;L<m;L++){const D=L%3*2/3-1,q=L>2?0:-1,T=[D,q,0,D+2/3,q,0,D+2/3,q+1,0,D,q,0,D+2/3,q+1,0,D,q+1,0];E.set(T,x*v*L),M.set(h,p*v*L);const C=[L,L,L,L,L,L];b.set(C,d*v*L)}const U=new he;U.setAttribute("position",new dn(E,x)),U.setAttribute("uv",new dn(M,p)),U.setAttribute("faceIndex",new dn(b,d)),t.push(U),r>fi&&r--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function js(i,t,e){const n=new Vn(i,t,e);return n.texture.mapping=306,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function hr(i,t,e,n,r){i.viewport.set(t,e,n,r),i.scissor.set(t,e,n,r)}function vu(i,t,e){const n=new Float32Array(Gn),r=new F(0,1,0);return new kn({name:"SphericalGaussianBlur",defines:{n:Gn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:Ms(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function $s(){return new kn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Ms(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Qs(){return new kn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Ms(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:0,depthTest:!1,depthWrite:!1})}function Ms(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function xu(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){const c=o.mapping,l=c===303||c===304,u=c===301||c===302;if(l||u)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let f=t.get(o);return e===null&&(e=new Ks(i)),f=l?e.fromEquirectangular(o,f):e.fromCubemap(o,f),t.set(o,f),f.texture}else{if(t.has(o))return t.get(o).texture;{const f=o.image;if(l&&f&&f.height>0||u&&f&&r(f)){e===null&&(e=new Ks(i));const h=l?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,h),o.addEventListener("dispose",s),h.texture}else return null}}}return o}function r(o){let c=0;const l=6;for(let u=0;u<l;u++)o[u]!==void 0&&c++;return c===l}function s(o){const c=o.target;c.removeEventListener("dispose",s);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function Mu(i){const t={};function e(n){if(t[n]!==void 0)return t[n];let r;switch(n){case"WEBGL_depth_texture":r=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=i.getExtension(n)}return t[n]=r,r}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){const r=e(n);return r===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),r}}}function Su(i,t,e,n){const r={},s=new WeakMap;function a(f){const h=f.target;h.index!==null&&t.remove(h.index);for(const v in h.attributes)t.remove(h.attributes[v]);for(const v in h.morphAttributes){const x=h.morphAttributes[v];for(let p=0,d=x.length;p<d;p++)t.remove(x[p])}h.removeEventListener("dispose",a),delete r[h.id];const m=s.get(h);m&&(t.remove(m),s.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function o(f,h){return r[h.id]===!0||(h.addEventListener("dispose",a),r[h.id]=!0,e.memory.geometries++),h}function c(f){const h=f.attributes;for(const v in h)t.update(h[v],i.ARRAY_BUFFER);const m=f.morphAttributes;for(const v in m){const x=m[v];for(let p=0,d=x.length;p<d;p++)t.update(x[p],i.ARRAY_BUFFER)}}function l(f){const h=[],m=f.index,v=f.attributes.position;let x=0;if(m!==null){const E=m.array;x=m.version;for(let M=0,b=E.length;M<b;M+=3){const U=E[M+0],L=E[M+1],D=E[M+2];h.push(U,L,L,D,D,U)}}else if(v!==void 0){const E=v.array;x=v.version;for(let M=0,b=E.length/3-1;M<b;M+=3){const U=M+0,L=M+1,D=M+2;h.push(U,L,L,D,D,U)}}else return;const p=new(Eo(h)?Po:Co)(h,1);p.version=x;const d=s.get(f);d&&t.remove(d),s.set(f,p)}function u(f){const h=s.get(f);if(h){const m=f.index;m!==null&&h.version<m.version&&l(f)}else l(f);return s.get(f)}return{get:o,update:c,getWireframeAttribute:u}}function yu(i,t,e,n){const r=n.isWebGL2;let s;function a(m){s=m}let o,c;function l(m){o=m.type,c=m.bytesPerElement}function u(m,v){i.drawElements(s,v,o,m*c),e.update(v,s,1)}function f(m,v,x){if(x===0)return;let p,d;if(r)p=i,d="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),d="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[d](s,v,o,m*c,x),e.update(v,s,x)}function h(m,v,x){if(x===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let d=0;d<x;d++)this.render(m[d]/c,v[d]);else{p.multiDrawElementsWEBGL(s,v,0,o,m,0,x);let d=0;for(let E=0;E<x;E++)d+=v[E];e.update(d,s,1)}}this.setMode=a,this.setIndex=l,this.render=u,this.renderInstances=f,this.renderMultiDraw=h}function Eu(i){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(s/3);break;case i.LINES:e.lines+=o*(s/2);break;case i.LINE_STRIP:e.lines+=o*(s-1);break;case i.LINE_LOOP:e.lines+=o*s;break;case i.POINTS:e.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:r,update:n}}function Tu(i,t){return i[0]-t[0]}function bu(i,t){return Math.abs(t[1])-Math.abs(i[1])}function Au(i,t,e){const n={},r=new Float32Array(8),s=new WeakMap,a=new Ae,o=[];for(let l=0;l<8;l++)o[l]=[l,0];function c(l,u,f){const h=l.morphTargetInfluences;if(t.isWebGL2===!0){const m=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,v=m!==void 0?m.length:0;let x=s.get(u);if(x===void 0||x.count!==v){let N=function(){j.dispose(),s.delete(u),u.removeEventListener("dispose",N)};x!==void 0&&x.texture.dispose();const E=u.morphAttributes.position!==void 0,M=u.morphAttributes.normal!==void 0,b=u.morphAttributes.color!==void 0,U=u.morphAttributes.position||[],L=u.morphAttributes.normal||[],D=u.morphAttributes.color||[];let q=0;E===!0&&(q=1),M===!0&&(q=2),b===!0&&(q=3);let T=u.attributes.position.count*q,C=1;T>t.maxTextureSize&&(C=Math.ceil(T/t.maxTextureSize),T=t.maxTextureSize);const G=new Float32Array(T*C*4*v),j=new Ao(G,T,C,v);j.type=1015,j.needsUpdate=!0;const tt=q*4;for(let V=0;V<v;V++){const J=U[V],et=L[V],it=D[V],$=T*C*4*V;for(let rt=0;rt<J.count;rt++){const lt=rt*tt;E===!0&&(a.fromBufferAttribute(J,rt),G[$+lt+0]=a.x,G[$+lt+1]=a.y,G[$+lt+2]=a.z,G[$+lt+3]=0),M===!0&&(a.fromBufferAttribute(et,rt),G[$+lt+4]=a.x,G[$+lt+5]=a.y,G[$+lt+6]=a.z,G[$+lt+7]=0),b===!0&&(a.fromBufferAttribute(it,rt),G[$+lt+8]=a.x,G[$+lt+9]=a.y,G[$+lt+10]=a.z,G[$+lt+11]=it.itemSize===4?a.w:1)}}x={count:v,texture:j,size:new gt(T,C)},s.set(u,x),u.addEventListener("dispose",N)}let p=0;for(let E=0;E<h.length;E++)p+=h[E];const d=u.morphTargetsRelative?1:1-p;f.getUniforms().setValue(i,"morphTargetBaseInfluence",d),f.getUniforms().setValue(i,"morphTargetInfluences",h),f.getUniforms().setValue(i,"morphTargetsTexture",x.texture,e),f.getUniforms().setValue(i,"morphTargetsTextureSize",x.size)}else{const m=h===void 0?0:h.length;let v=n[u.id];if(v===void 0||v.length!==m){v=[];for(let M=0;M<m;M++)v[M]=[M,0];n[u.id]=v}for(let M=0;M<m;M++){const b=v[M];b[0]=M,b[1]=h[M]}v.sort(bu);for(let M=0;M<8;M++)M<m&&v[M][1]?(o[M][0]=v[M][0],o[M][1]=v[M][1]):(o[M][0]=Number.MAX_SAFE_INTEGER,o[M][1]=0);o.sort(Tu);const x=u.morphAttributes.position,p=u.morphAttributes.normal;let d=0;for(let M=0;M<8;M++){const b=o[M],U=b[0],L=b[1];U!==Number.MAX_SAFE_INTEGER&&L?(x&&u.getAttribute("morphTarget"+M)!==x[U]&&u.setAttribute("morphTarget"+M,x[U]),p&&u.getAttribute("morphNormal"+M)!==p[U]&&u.setAttribute("morphNormal"+M,p[U]),r[M]=L,d+=L):(x&&u.hasAttribute("morphTarget"+M)===!0&&u.deleteAttribute("morphTarget"+M),p&&u.hasAttribute("morphNormal"+M)===!0&&u.deleteAttribute("morphNormal"+M),r[M]=0)}const E=u.morphTargetsRelative?1:1-d;f.getUniforms().setValue(i,"morphTargetBaseInfluence",E),f.getUniforms().setValue(i,"morphTargetInfluences",r)}}return{update:c}}function wu(i,t,e,n){let r=new WeakMap;function s(c){const l=n.render.frame,u=c.geometry,f=t.get(c,u);if(r.get(f)!==l&&(t.update(f),r.set(f,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==l&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),r.set(c,l))),c.isSkinnedMesh){const h=c.skeleton;r.get(h)!==l&&(h.update(),r.set(h,l))}return f}function a(){r=new WeakMap}function o(c){const l=c.target;l.removeEventListener("dispose",o),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:s,dispose:a}}class Io extends qe{constructor(t,e,n,r,s,a,o,c,l,u){if(u=u!==void 0?u:1026,u!==1026&&u!==1027)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===1026&&(n=1014),n===void 0&&u===1027&&(n=1020),super(null,r,s,a,o,c,u,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:1003,this.minFilter=c!==void 0?c:1003,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const Fo=new qe,Oo=new Io(1,1);Oo.compareFunction=515;const Bo=new Ao,zo=new ua,Go=new Uo,to=[],eo=[],no=new Float32Array(16),io=new Float32Array(9),ro=new Float32Array(4);function xi(i,t,e){const n=i[0];if(n<=0||n>0)return i;const r=t*e;let s=to[r];if(s===void 0&&(s=new Float32Array(r),to[r]=s),t!==0){n.toArray(s,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(s,o)}return s}function Ee(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Te(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Tr(i,t){let e=eo[t];e===void 0&&(e=new Int32Array(t),eo[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function Ru(i,t){const e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function Cu(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2fv(this.addr,t),Te(e,t)}}function Pu(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ee(e,t))return;i.uniform3fv(this.addr,t),Te(e,t)}}function Lu(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4fv(this.addr,t),Te(e,t)}}function Du(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Te(e,t)}else{if(Ee(e,n))return;ro.set(n),i.uniformMatrix2fv(this.addr,!1,ro),Te(e,n)}}function Uu(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Te(e,t)}else{if(Ee(e,n))return;io.set(n),i.uniformMatrix3fv(this.addr,!1,io),Te(e,n)}}function Nu(i,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ee(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Te(e,t)}else{if(Ee(e,n))return;no.set(n),i.uniformMatrix4fv(this.addr,!1,no),Te(e,n)}}function Iu(i,t){const e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function Fu(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2iv(this.addr,t),Te(e,t)}}function Ou(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;i.uniform3iv(this.addr,t),Te(e,t)}}function Bu(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4iv(this.addr,t),Te(e,t)}}function zu(i,t){const e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function Gu(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ee(e,t))return;i.uniform2uiv(this.addr,t),Te(e,t)}}function Hu(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ee(e,t))return;i.uniform3uiv(this.addr,t),Te(e,t)}}function Vu(i,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ee(e,t))return;i.uniform4uiv(this.addr,t),Te(e,t)}}function ku(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r);const s=this.type===i.SAMPLER_2D_SHADOW?Oo:Fo;e.setTexture2D(t||s,r)}function Wu(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture3D(t||zo,r)}function Xu(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTextureCube(t||Go,r)}function qu(i,t,e){const n=this.cache,r=e.allocateTextureUnit();n[0]!==r&&(i.uniform1i(this.addr,r),n[0]=r),e.setTexture2DArray(t||Bo,r)}function Yu(i){switch(i){case 5126:return Ru;case 35664:return Cu;case 35665:return Pu;case 35666:return Lu;case 35674:return Du;case 35675:return Uu;case 35676:return Nu;case 5124:case 35670:return Iu;case 35667:case 35671:return Fu;case 35668:case 35672:return Ou;case 35669:case 35673:return Bu;case 5125:return zu;case 36294:return Gu;case 36295:return Hu;case 36296:return Vu;case 35678:case 36198:case 36298:case 36306:case 35682:return ku;case 35679:case 36299:case 36307:return Wu;case 35680:case 36300:case 36308:case 36293:return Xu;case 36289:case 36303:case 36311:case 36292:return qu}}function Zu(i,t){i.uniform1fv(this.addr,t)}function Ju(i,t){const e=xi(t,this.size,2);i.uniform2fv(this.addr,e)}function Ku(i,t){const e=xi(t,this.size,3);i.uniform3fv(this.addr,e)}function ju(i,t){const e=xi(t,this.size,4);i.uniform4fv(this.addr,e)}function $u(i,t){const e=xi(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Qu(i,t){const e=xi(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function th(i,t){const e=xi(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function eh(i,t){i.uniform1iv(this.addr,t)}function nh(i,t){i.uniform2iv(this.addr,t)}function ih(i,t){i.uniform3iv(this.addr,t)}function rh(i,t){i.uniform4iv(this.addr,t)}function sh(i,t){i.uniform1uiv(this.addr,t)}function oh(i,t){i.uniform2uiv(this.addr,t)}function ah(i,t){i.uniform3uiv(this.addr,t)}function ch(i,t){i.uniform4uiv(this.addr,t)}function lh(i,t,e){const n=this.cache,r=t.length,s=Tr(e,r);Ee(n,s)||(i.uniform1iv(this.addr,s),Te(n,s));for(let a=0;a!==r;++a)e.setTexture2D(t[a]||Fo,s[a])}function uh(i,t,e){const n=this.cache,r=t.length,s=Tr(e,r);Ee(n,s)||(i.uniform1iv(this.addr,s),Te(n,s));for(let a=0;a!==r;++a)e.setTexture3D(t[a]||zo,s[a])}function hh(i,t,e){const n=this.cache,r=t.length,s=Tr(e,r);Ee(n,s)||(i.uniform1iv(this.addr,s),Te(n,s));for(let a=0;a!==r;++a)e.setTextureCube(t[a]||Go,s[a])}function fh(i,t,e){const n=this.cache,r=t.length,s=Tr(e,r);Ee(n,s)||(i.uniform1iv(this.addr,s),Te(n,s));for(let a=0;a!==r;++a)e.setTexture2DArray(t[a]||Bo,s[a])}function dh(i){switch(i){case 5126:return Zu;case 35664:return Ju;case 35665:return Ku;case 35666:return ju;case 35674:return $u;case 35675:return Qu;case 35676:return th;case 5124:case 35670:return eh;case 35667:case 35671:return nh;case 35668:case 35672:return ih;case 35669:case 35673:return rh;case 5125:return sh;case 36294:return oh;case 36295:return ah;case 36296:return ch;case 35678:case 36198:case 36298:case 36306:case 35682:return lh;case 35679:case 36299:case 36307:return uh;case 35680:case 36300:case 36308:case 36293:return hh;case 36289:case 36303:case 36311:case 36292:return fh}}class ph{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Yu(e.type)}}class mh{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=dh(e.type)}}class gh{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(t,e[o.id],n)}}}const jr=/(\w+)(\])?(\[|\.)?/g;function so(i,t){i.seq.push(t),i.map[t.id]=t}function _h(i,t,e){const n=i.name,r=n.length;for(jr.lastIndex=0;;){const s=jr.exec(n),a=jr.lastIndex;let o=s[1];const c=s[2]==="]",l=s[3];if(c&&(o=o|0),l===void 0||l==="["&&a+2===r){so(e,l===void 0?new ph(o,i,t):new mh(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new gh(o),so(e,f)),e=f}}}class mr{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){const s=t.getActiveUniform(e,r),a=t.getUniformLocation(e,s.name);_h(s,a,this)}}setValue(t,e,n,r){const s=this.map[e];s!==void 0&&s.setValue(t,n,r)}setOptional(t,e,n){const r=e[n];r!==void 0&&this.setValue(t,n,r)}static upload(t,e,n,r){for(let s=0,a=e.length;s!==a;++s){const o=e[s],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,r)}}static seqWithValue(t,e){const n=[];for(let r=0,s=t.length;r!==s;++r){const a=t[r];a.id in e&&n.push(a)}return n}}function oo(i,t,e){const n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}const vh=37297;let xh=0;function Mh(i,t){const e=i.split(`
`),n=[],r=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let a=r;a<s;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}function Sh(i){const t=ae.getPrimaries(ae.workingColorSpace),e=ae.getPrimaries(i);let n;switch(t===e?n="":t==="p3"&&e===vr?n="LinearDisplayP3ToLinearSRGB":t===vr&&e==="p3"&&(n="LinearSRGBToLinearDisplayP3"),i){case En:case Sr:return[n,"LinearTransferOETF"];case ye:case ms:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function ao(i,t,e){const n=i.getShaderParameter(t,i.COMPILE_STATUS),r=i.getShaderInfoLog(t).trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return e.toUpperCase()+`

`+r+`

`+Mh(i.getShaderSource(t),a)}else return r}function yh(i,t){const e=Sh(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Eh(i,t){let e;switch(t){case 1:e="Linear";break;case 2:e="Reinhard";break;case 3:e="OptimizedCineon";break;case 4:e="ACESFilmic";break;case 6:e="AgX";break;case 5:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Th(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(di).join(`
`)}function bh(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(di).join(`
`)}function Ah(i){const t=[];for(const e in i){const n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function wh(i,t){const e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let r=0;r<n;r++){const s=i.getActiveAttrib(t,r),a=s.name;let o=1;s.type===i.FLOAT_MAT2&&(o=2),s.type===i.FLOAT_MAT3&&(o=3),s.type===i.FLOAT_MAT4&&(o=4),e[a]={type:s.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function di(i){return i!==""}function co(i,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function lo(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const Rh=/^[ \t]*#include +<([\w\d./]+)>/gm;function cs(i){return i.replace(Rh,Ph)}const Ch=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Ph(i,t){let e=$t[t];if(e===void 0){const n=Ch.get(t);if(n!==void 0)e=$t[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return cs(e)}const Lh=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function uo(i){return i.replace(Lh,Dh)}function Dh(i,t,e,n){let r="";for(let s=parseInt(t);s<parseInt(e);s++)r+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function ho(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Uh(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===1?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===2?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===3&&(t="SHADOWMAP_TYPE_VSM"),t}function Nh(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case 301:case 302:t="ENVMAP_TYPE_CUBE";break;case 306:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Ih(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case 302:t="ENVMAP_MODE_REFRACTION";break}return t}function Fh(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case 0:t="ENVMAP_BLENDING_MULTIPLY";break;case 1:t="ENVMAP_BLENDING_MIX";break;case 2:t="ENVMAP_BLENDING_ADD";break}return t}function Oh(i){const t=i.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Bh(i,t,e,n){const r=i.getContext(),s=e.defines;let a=e.vertexShader,o=e.fragmentShader;const c=Uh(e),l=Nh(e),u=Ih(e),f=Fh(e),h=Oh(e),m=e.isWebGL2?"":Th(e),v=bh(e),x=Ah(s),p=r.createProgram();let d,E,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(d=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(di).join(`
`),d.length>0&&(d+=`
`),E=[m,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x].filter(di).join(`
`),E.length>0&&(E+=`
`)):(d=[ho(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(di).join(`
`),E=[m,ho(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,x,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+u:"",e.envMap?"#define "+f:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==0?"#define TONE_MAPPING":"",e.toneMapping!==0?$t.tonemapping_pars_fragment:"",e.toneMapping!==0?Eh("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",$t.colorspace_pars_fragment,yh("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(di).join(`
`)),a=cs(a),a=co(a,e),a=lo(a,e),o=cs(o),o=co(o,e),o=lo(o,e),a=uo(a),o=uo(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,d=[v,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,E=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Cs?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Cs?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+E);const b=M+d+a,U=M+E+o,L=oo(r,r.VERTEX_SHADER,b),D=oo(r,r.FRAGMENT_SHADER,U);r.attachShader(p,L),r.attachShader(p,D),e.index0AttributeName!==void 0?r.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&r.bindAttribLocation(p,0,"position"),r.linkProgram(p);function q(j){if(i.debug.checkShaderErrors){const tt=r.getProgramInfoLog(p).trim(),N=r.getShaderInfoLog(L).trim(),V=r.getShaderInfoLog(D).trim();let J=!0,et=!0;if(r.getProgramParameter(p,r.LINK_STATUS)===!1)if(J=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(r,p,L,D);else{const it=ao(r,L,"vertex"),$=ao(r,D,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(p,r.VALIDATE_STATUS)+`

Program Info Log: `+tt+`
`+it+`
`+$)}else tt!==""?console.warn("THREE.WebGLProgram: Program Info Log:",tt):(N===""||V==="")&&(et=!1);et&&(j.diagnostics={runnable:J,programLog:tt,vertexShader:{log:N,prefix:d},fragmentShader:{log:V,prefix:E}})}r.deleteShader(L),r.deleteShader(D),T=new mr(r,p),C=wh(r,p)}let T;this.getUniforms=function(){return T===void 0&&q(this),T};let C;this.getAttributes=function(){return C===void 0&&q(this),C};let G=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return G===!1&&(G=r.getProgramParameter(p,vh)),G},this.destroy=function(){n.releaseStatesOfProgram(this),r.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=xh++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=L,this.fragmentShader=D,this}let zh=0;class Gh{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,r=this._getShaderStage(e),s=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Hh(t),e.set(t,n)),n}}class Hh{constructor(t){this.id=zh++,this.code=t,this.usedTimes=0}}function Vh(i,t,e,n,r,s,a){const o=new wo,c=new Gh,l=[],u=r.isWebGL2,f=r.logarithmicDepthBuffer,h=r.vertexTextures;let m=r.precision;const v={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function x(T){return T===0?"uv":`uv${T}`}function p(T,C,G,j,tt){const N=j.fog,V=tt.geometry,J=T.isMeshStandardMaterial?j.environment:null,et=(T.isMeshStandardMaterial?e:t).get(T.envMap||J),it=et&&et.mapping===306?et.image.height:null,$=v[T.type];T.precision!==null&&(m=r.getMaxPrecision(T.precision),m!==T.precision&&console.warn("THREE.WebGLProgram.getParameters:",T.precision,"not supported, using",m,"instead."));const rt=V.morphAttributes.position||V.morphAttributes.normal||V.morphAttributes.color,lt=rt!==void 0?rt.length:0;let st=0;V.morphAttributes.position!==void 0&&(st=1),V.morphAttributes.normal!==void 0&&(st=2),V.morphAttributes.color!==void 0&&(st=3);let X,at,_t,wt;if($){const ce=hn[$];X=ce.vertexShader,at=ce.fragmentShader}else X=T.vertexShader,at=T.fragmentShader,c.update(T),_t=c.getVertexShaderID(T),wt=c.getFragmentShaderID(T);const Et=i.getRenderTarget(),Ut=tt.isInstancedMesh===!0,Zt=tt.isBatchedMesh===!0,Nt=!!T.map,Xt=!!T.matcap,I=!!et,vt=!!T.aoMap,nt=!!T.lightMap,mt=!!T.bumpMap,Q=!!T.normalMap,It=!!T.displacementMap,St=!!T.emissiveMap,w=!!T.metalnessMap,y=!!T.roughnessMap,k=T.anisotropy>0,dt=T.clearcoat>0,ft=T.iridescence>0,ct=T.sheen>0,Dt=T.transmission>0,yt=k&&!!T.anisotropyMap,Pt=dt&&!!T.clearcoatMap,Gt=dt&&!!T.clearcoatNormalMap,Jt=dt&&!!T.clearcoatRoughnessMap,pt=ft&&!!T.iridescenceMap,re=ft&&!!T.iridescenceThicknessMap,Qt=ct&&!!T.sheenColorMap,Wt=ct&&!!T.sheenRoughnessMap,Ft=!!T.specularMap,Ct=!!T.specularColorMap,Ot=!!T.specularIntensityMap,Bt=Dt&&!!T.transmissionMap,se=Dt&&!!T.thicknessMap,jt=!!T.gradientMap,xt=!!T.alphaMap,B=T.alphaTest>0,Tt=!!T.alphaHash,bt=!!T.extensions,qt=!!V.attributes.uv1,zt=!!V.attributes.uv2,oe=!!V.attributes.uv3;let Ht=0;return T.toneMapped&&(Et===null||Et.isXRRenderTarget===!0)&&(Ht=i.toneMapping),{isWebGL2:u,shaderID:$,shaderType:T.type,shaderName:T.name,vertexShader:X,fragmentShader:at,defines:T.defines,customVertexShaderID:_t,customFragmentShaderID:wt,isRawShaderMaterial:T.isRawShaderMaterial===!0,glslVersion:T.glslVersion,precision:m,batching:Zt,instancing:Ut,instancingColor:Ut&&tt.instanceColor!==null,supportsVertexTextures:h,outputColorSpace:Et===null?i.outputColorSpace:Et.isXRRenderTarget===!0?Et.texture.colorSpace:En,map:Nt,matcap:Xt,envMap:I,envMapMode:I&&et.mapping,envMapCubeUVHeight:it,aoMap:vt,lightMap:nt,bumpMap:mt,normalMap:Q,displacementMap:h&&It,emissiveMap:St,normalMapObjectSpace:Q&&T.normalMapType===1,normalMapTangentSpace:Q&&T.normalMapType===0,metalnessMap:w,roughnessMap:y,anisotropy:k,anisotropyMap:yt,clearcoat:dt,clearcoatMap:Pt,clearcoatNormalMap:Gt,clearcoatRoughnessMap:Jt,iridescence:ft,iridescenceMap:pt,iridescenceThicknessMap:re,sheen:ct,sheenColorMap:Qt,sheenRoughnessMap:Wt,specularMap:Ft,specularColorMap:Ct,specularIntensityMap:Ot,transmission:Dt,transmissionMap:Bt,thicknessMap:se,gradientMap:jt,opaque:T.transparent===!1&&T.blending===1,alphaMap:xt,alphaTest:B,alphaHash:Tt,combine:T.combine,mapUv:Nt&&x(T.map.channel),aoMapUv:vt&&x(T.aoMap.channel),lightMapUv:nt&&x(T.lightMap.channel),bumpMapUv:mt&&x(T.bumpMap.channel),normalMapUv:Q&&x(T.normalMap.channel),displacementMapUv:It&&x(T.displacementMap.channel),emissiveMapUv:St&&x(T.emissiveMap.channel),metalnessMapUv:w&&x(T.metalnessMap.channel),roughnessMapUv:y&&x(T.roughnessMap.channel),anisotropyMapUv:yt&&x(T.anisotropyMap.channel),clearcoatMapUv:Pt&&x(T.clearcoatMap.channel),clearcoatNormalMapUv:Gt&&x(T.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Jt&&x(T.clearcoatRoughnessMap.channel),iridescenceMapUv:pt&&x(T.iridescenceMap.channel),iridescenceThicknessMapUv:re&&x(T.iridescenceThicknessMap.channel),sheenColorMapUv:Qt&&x(T.sheenColorMap.channel),sheenRoughnessMapUv:Wt&&x(T.sheenRoughnessMap.channel),specularMapUv:Ft&&x(T.specularMap.channel),specularColorMapUv:Ct&&x(T.specularColorMap.channel),specularIntensityMapUv:Ot&&x(T.specularIntensityMap.channel),transmissionMapUv:Bt&&x(T.transmissionMap.channel),thicknessMapUv:se&&x(T.thicknessMap.channel),alphaMapUv:xt&&x(T.alphaMap.channel),vertexTangents:!!V.attributes.tangent&&(Q||k),vertexColors:T.vertexColors,vertexAlphas:T.vertexColors===!0&&!!V.attributes.color&&V.attributes.color.itemSize===4,vertexUv1s:qt,vertexUv2s:zt,vertexUv3s:oe,pointsUvs:tt.isPoints===!0&&!!V.attributes.uv&&(Nt||xt),fog:!!N,useFog:T.fog===!0,fogExp2:N&&N.isFogExp2,flatShading:T.flatShading===!0,sizeAttenuation:T.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:tt.isSkinnedMesh===!0,morphTargets:V.morphAttributes.position!==void 0,morphNormals:V.morphAttributes.normal!==void 0,morphColors:V.morphAttributes.color!==void 0,morphTargetsCount:lt,morphTextureStride:st,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:T.dithering,shadowMapEnabled:i.shadowMap.enabled&&G.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ht,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Nt&&T.map.isVideoTexture===!0&&ae.getTransfer(T.map.colorSpace)===ue,premultipliedAlpha:T.premultipliedAlpha,doubleSided:T.side===2,flipSided:T.side===1,useDepthPacking:T.depthPacking>=0,depthPacking:T.depthPacking||0,index0AttributeName:T.index0AttributeName,extensionDerivatives:bt&&T.extensions.derivatives===!0,extensionFragDepth:bt&&T.extensions.fragDepth===!0,extensionDrawBuffers:bt&&T.extensions.drawBuffers===!0,extensionShaderTextureLOD:bt&&T.extensions.shaderTextureLOD===!0,extensionClipCullDistance:bt&&T.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:u||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:T.customProgramCacheKey()}}function d(T){const C=[];if(T.shaderID?C.push(T.shaderID):(C.push(T.customVertexShaderID),C.push(T.customFragmentShaderID)),T.defines!==void 0)for(const G in T.defines)C.push(G),C.push(T.defines[G]);return T.isRawShaderMaterial===!1&&(E(C,T),M(C,T),C.push(i.outputColorSpace)),C.push(T.customProgramCacheKey),C.join()}function E(T,C){T.push(C.precision),T.push(C.outputColorSpace),T.push(C.envMapMode),T.push(C.envMapCubeUVHeight),T.push(C.mapUv),T.push(C.alphaMapUv),T.push(C.lightMapUv),T.push(C.aoMapUv),T.push(C.bumpMapUv),T.push(C.normalMapUv),T.push(C.displacementMapUv),T.push(C.emissiveMapUv),T.push(C.metalnessMapUv),T.push(C.roughnessMapUv),T.push(C.anisotropyMapUv),T.push(C.clearcoatMapUv),T.push(C.clearcoatNormalMapUv),T.push(C.clearcoatRoughnessMapUv),T.push(C.iridescenceMapUv),T.push(C.iridescenceThicknessMapUv),T.push(C.sheenColorMapUv),T.push(C.sheenRoughnessMapUv),T.push(C.specularMapUv),T.push(C.specularColorMapUv),T.push(C.specularIntensityMapUv),T.push(C.transmissionMapUv),T.push(C.thicknessMapUv),T.push(C.combine),T.push(C.fogExp2),T.push(C.sizeAttenuation),T.push(C.morphTargetsCount),T.push(C.morphAttributeCount),T.push(C.numDirLights),T.push(C.numPointLights),T.push(C.numSpotLights),T.push(C.numSpotLightMaps),T.push(C.numHemiLights),T.push(C.numRectAreaLights),T.push(C.numDirLightShadows),T.push(C.numPointLightShadows),T.push(C.numSpotLightShadows),T.push(C.numSpotLightShadowsWithMaps),T.push(C.numLightProbes),T.push(C.shadowMapType),T.push(C.toneMapping),T.push(C.numClippingPlanes),T.push(C.numClipIntersection),T.push(C.depthPacking)}function M(T,C){o.disableAll(),C.isWebGL2&&o.enable(0),C.supportsVertexTextures&&o.enable(1),C.instancing&&o.enable(2),C.instancingColor&&o.enable(3),C.matcap&&o.enable(4),C.envMap&&o.enable(5),C.normalMapObjectSpace&&o.enable(6),C.normalMapTangentSpace&&o.enable(7),C.clearcoat&&o.enable(8),C.iridescence&&o.enable(9),C.alphaTest&&o.enable(10),C.vertexColors&&o.enable(11),C.vertexAlphas&&o.enable(12),C.vertexUv1s&&o.enable(13),C.vertexUv2s&&o.enable(14),C.vertexUv3s&&o.enable(15),C.vertexTangents&&o.enable(16),C.anisotropy&&o.enable(17),C.alphaHash&&o.enable(18),C.batching&&o.enable(19),T.push(o.mask),o.disableAll(),C.fog&&o.enable(0),C.useFog&&o.enable(1),C.flatShading&&o.enable(2),C.logarithmicDepthBuffer&&o.enable(3),C.skinning&&o.enable(4),C.morphTargets&&o.enable(5),C.morphNormals&&o.enable(6),C.morphColors&&o.enable(7),C.premultipliedAlpha&&o.enable(8),C.shadowMapEnabled&&o.enable(9),C.useLegacyLights&&o.enable(10),C.doubleSided&&o.enable(11),C.flipSided&&o.enable(12),C.useDepthPacking&&o.enable(13),C.dithering&&o.enable(14),C.transmission&&o.enable(15),C.sheen&&o.enable(16),C.opaque&&o.enable(17),C.pointsUvs&&o.enable(18),C.decodeVideoTexture&&o.enable(19),T.push(o.mask)}function b(T){const C=v[T.type];let G;if(C){const j=hn[C];G=Ta.clone(j.uniforms)}else G=T.uniforms;return G}function U(T,C){let G;for(let j=0,tt=l.length;j<tt;j++){const N=l[j];if(N.cacheKey===C){G=N,++G.usedTimes;break}}return G===void 0&&(G=new Bh(i,C,T,s),l.push(G)),G}function L(T){if(--T.usedTimes===0){const C=l.indexOf(T);l[C]=l[l.length-1],l.pop(),T.destroy()}}function D(T){c.remove(T)}function q(){c.dispose()}return{getParameters:p,getProgramCacheKey:d,getUniforms:b,acquireProgram:U,releaseProgram:L,releaseShaderCache:D,programs:l,dispose:q}}function kh(){let i=new WeakMap;function t(s){let a=i.get(s);return a===void 0&&(a={},i.set(s,a)),a}function e(s){i.delete(s)}function n(s,a,o){i.get(s)[a]=o}function r(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:r}}function Wh(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function fo(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function po(){const i=[];let t=0;const e=[],n=[],r=[];function s(){t=0,e.length=0,n.length=0,r.length=0}function a(f,h,m,v,x,p){let d=i[t];return d===void 0?(d={id:f.id,object:f,geometry:h,material:m,groupOrder:v,renderOrder:f.renderOrder,z:x,group:p},i[t]=d):(d.id=f.id,d.object=f,d.geometry=h,d.material=m,d.groupOrder=v,d.renderOrder=f.renderOrder,d.z=x,d.group=p),t++,d}function o(f,h,m,v,x,p){const d=a(f,h,m,v,x,p);m.transmission>0?n.push(d):m.transparent===!0?r.push(d):e.push(d)}function c(f,h,m,v,x,p){const d=a(f,h,m,v,x,p);m.transmission>0?n.unshift(d):m.transparent===!0?r.unshift(d):e.unshift(d)}function l(f,h){e.length>1&&e.sort(f||Wh),n.length>1&&n.sort(h||fo),r.length>1&&r.sort(h||fo)}function u(){for(let f=t,h=i.length;f<h;f++){const m=i[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:e,transmissive:n,transparent:r,init:s,push:o,unshift:c,finish:u,sort:l}}function Xh(){let i=new WeakMap;function t(n,r){const s=i.get(n);let a;return s===void 0?(a=new po,i.set(n,[a])):r>=s.length?(a=new po,s.push(a)):a=s[r],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function qh(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new F,color:new Vt};break;case"SpotLight":e={position:new F,direction:new F,color:new Vt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new F,color:new Vt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new F,skyColor:new Vt,groundColor:new Vt};break;case"RectAreaLight":e={color:new Vt,position:new F,halfWidth:new F,halfHeight:new F};break}return i[t.id]=e,e}}}function Yh(){const i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new gt};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new gt};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new gt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}let Zh=0;function Jh(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Kh(i,t){const e=new qh,n=Yh(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)r.probe.push(new F);const s=new F,a=new xe,o=new xe;function c(u,f){let h=0,m=0,v=0;for(let j=0;j<9;j++)r.probe[j].set(0,0,0);let x=0,p=0,d=0,E=0,M=0,b=0,U=0,L=0,D=0,q=0,T=0;u.sort(Jh);const C=f===!0?Math.PI:1;for(let j=0,tt=u.length;j<tt;j++){const N=u[j],V=N.color,J=N.intensity,et=N.distance,it=N.shadow&&N.shadow.map?N.shadow.map.texture:null;if(N.isAmbientLight)h+=V.r*J*C,m+=V.g*J*C,v+=V.b*J*C;else if(N.isLightProbe){for(let $=0;$<9;$++)r.probe[$].addScaledVector(N.sh.coefficients[$],J);T++}else if(N.isDirectionalLight){const $=e.get(N);if($.color.copy(N.color).multiplyScalar(N.intensity*C),N.castShadow){const rt=N.shadow,lt=n.get(N);lt.shadowBias=rt.bias,lt.shadowNormalBias=rt.normalBias,lt.shadowRadius=rt.radius,lt.shadowMapSize=rt.mapSize,r.directionalShadow[x]=lt,r.directionalShadowMap[x]=it,r.directionalShadowMatrix[x]=N.shadow.matrix,b++}r.directional[x]=$,x++}else if(N.isSpotLight){const $=e.get(N);$.position.setFromMatrixPosition(N.matrixWorld),$.color.copy(V).multiplyScalar(J*C),$.distance=et,$.coneCos=Math.cos(N.angle),$.penumbraCos=Math.cos(N.angle*(1-N.penumbra)),$.decay=N.decay,r.spot[d]=$;const rt=N.shadow;if(N.map&&(r.spotLightMap[D]=N.map,D++,rt.updateMatrices(N),N.castShadow&&q++),r.spotLightMatrix[d]=rt.matrix,N.castShadow){const lt=n.get(N);lt.shadowBias=rt.bias,lt.shadowNormalBias=rt.normalBias,lt.shadowRadius=rt.radius,lt.shadowMapSize=rt.mapSize,r.spotShadow[d]=lt,r.spotShadowMap[d]=it,L++}d++}else if(N.isRectAreaLight){const $=e.get(N);$.color.copy(V).multiplyScalar(J),$.halfWidth.set(N.width*.5,0,0),$.halfHeight.set(0,N.height*.5,0),r.rectArea[E]=$,E++}else if(N.isPointLight){const $=e.get(N);if($.color.copy(N.color).multiplyScalar(N.intensity*C),$.distance=N.distance,$.decay=N.decay,N.castShadow){const rt=N.shadow,lt=n.get(N);lt.shadowBias=rt.bias,lt.shadowNormalBias=rt.normalBias,lt.shadowRadius=rt.radius,lt.shadowMapSize=rt.mapSize,lt.shadowCameraNear=rt.camera.near,lt.shadowCameraFar=rt.camera.far,r.pointShadow[p]=lt,r.pointShadowMap[p]=it,r.pointShadowMatrix[p]=N.shadow.matrix,U++}r.point[p]=$,p++}else if(N.isHemisphereLight){const $=e.get(N);$.skyColor.copy(N.color).multiplyScalar(J*C),$.groundColor.copy(N.groundColor).multiplyScalar(J*C),r.hemi[M]=$,M++}}E>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=Mt.LTC_FLOAT_1,r.rectAreaLTC2=Mt.LTC_FLOAT_2):(r.rectAreaLTC1=Mt.LTC_HALF_1,r.rectAreaLTC2=Mt.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=Mt.LTC_FLOAT_1,r.rectAreaLTC2=Mt.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(r.rectAreaLTC1=Mt.LTC_HALF_1,r.rectAreaLTC2=Mt.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),r.ambient[0]=h,r.ambient[1]=m,r.ambient[2]=v;const G=r.hash;(G.directionalLength!==x||G.pointLength!==p||G.spotLength!==d||G.rectAreaLength!==E||G.hemiLength!==M||G.numDirectionalShadows!==b||G.numPointShadows!==U||G.numSpotShadows!==L||G.numSpotMaps!==D||G.numLightProbes!==T)&&(r.directional.length=x,r.spot.length=d,r.rectArea.length=E,r.point.length=p,r.hemi.length=M,r.directionalShadow.length=b,r.directionalShadowMap.length=b,r.pointShadow.length=U,r.pointShadowMap.length=U,r.spotShadow.length=L,r.spotShadowMap.length=L,r.directionalShadowMatrix.length=b,r.pointShadowMatrix.length=U,r.spotLightMatrix.length=L+D-q,r.spotLightMap.length=D,r.numSpotLightShadowsWithMaps=q,r.numLightProbes=T,G.directionalLength=x,G.pointLength=p,G.spotLength=d,G.rectAreaLength=E,G.hemiLength=M,G.numDirectionalShadows=b,G.numPointShadows=U,G.numSpotShadows=L,G.numSpotMaps=D,G.numLightProbes=T,r.version=Zh++)}function l(u,f){let h=0,m=0,v=0,x=0,p=0;const d=f.matrixWorldInverse;for(let E=0,M=u.length;E<M;E++){const b=u[E];if(b.isDirectionalLight){const U=r.directional[h];U.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),U.direction.sub(s),U.direction.transformDirection(d),h++}else if(b.isSpotLight){const U=r.spot[v];U.position.setFromMatrixPosition(b.matrixWorld),U.position.applyMatrix4(d),U.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),U.direction.sub(s),U.direction.transformDirection(d),v++}else if(b.isRectAreaLight){const U=r.rectArea[x];U.position.setFromMatrixPosition(b.matrixWorld),U.position.applyMatrix4(d),o.identity(),a.copy(b.matrixWorld),a.premultiply(d),o.extractRotation(a),U.halfWidth.set(b.width*.5,0,0),U.halfHeight.set(0,b.height*.5,0),U.halfWidth.applyMatrix4(o),U.halfHeight.applyMatrix4(o),x++}else if(b.isPointLight){const U=r.point[m];U.position.setFromMatrixPosition(b.matrixWorld),U.position.applyMatrix4(d),m++}else if(b.isHemisphereLight){const U=r.hemi[p];U.direction.setFromMatrixPosition(b.matrixWorld),U.direction.transformDirection(d),p++}}}return{setup:c,setupView:l,state:r}}function mo(i,t){const e=new Kh(i,t),n=[],r=[];function s(){n.length=0,r.length=0}function a(f){n.push(f)}function o(f){r.push(f)}function c(f){e.setup(n,f)}function l(f){e.setupView(n,f)}return{init:s,state:{lightsArray:n,shadowsArray:r,lights:e},setupLights:c,setupLightsView:l,pushLight:a,pushShadow:o}}function jh(i,t){let e=new WeakMap;function n(s,a=0){const o=e.get(s);let c;return o===void 0?(c=new mo(i,t),e.set(s,[c])):a>=o.length?(c=new mo(i,t),o.push(c)):c=o[a],c}function r(){e=new WeakMap}return{get:n,dispose:r}}class $h extends zi{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=3200,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Qh extends zi{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const tf=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ef=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function nf(i,t,e){let n=new vs;const r=new gt,s=new gt,a=new Ae,o=new $h({depthPacking:3201}),c=new Qh,l={},u=e.maxTextureSize,f={0:1,1:0,2:2},h=new kn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new gt},radius:{value:4}},vertexShader:tf,fragmentShader:ef}),m=h.clone();m.defines.HORIZONTAL_PASS=1;const v=new he;v.setAttribute("position",new dn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Lt(v,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=1;let d=this.type;this.render=function(L,D,q){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||L.length===0)return;const T=i.getRenderTarget(),C=i.getActiveCubeFace(),G=i.getActiveMipmapLevel(),j=i.state;j.setBlending(0),j.buffers.color.setClear(1,1,1,1),j.buffers.depth.setTest(!0),j.setScissorTest(!1);const tt=d!==3&&this.type===3,N=d===3&&this.type!==3;for(let V=0,J=L.length;V<J;V++){const et=L[V],it=et.shadow;if(it===void 0){console.warn("THREE.WebGLShadowMap:",et,"has no shadow.");continue}if(it.autoUpdate===!1&&it.needsUpdate===!1)continue;r.copy(it.mapSize);const $=it.getFrameExtents();if(r.multiply($),s.copy(it.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/$.x),r.x=s.x*$.x,it.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/$.y),r.y=s.y*$.y,it.mapSize.y=s.y)),it.map===null||tt===!0||N===!0){const lt=this.type!==3?{minFilter:1003,magFilter:1003}:{};it.map!==null&&it.map.dispose(),it.map=new Vn(r.x,r.y,lt),it.map.texture.name=et.name+".shadowMap",it.camera.updateProjectionMatrix()}i.setRenderTarget(it.map),i.clear();const rt=it.getViewportCount();for(let lt=0;lt<rt;lt++){const st=it.getViewport(lt);a.set(s.x*st.x,s.y*st.y,s.x*st.z,s.y*st.w),j.viewport(a),it.updateMatrices(et,lt),n=it.getFrustum(),b(D,q,it.camera,et,this.type)}it.isPointLightShadow!==!0&&this.type===3&&E(it,q),it.needsUpdate=!1}d=this.type,p.needsUpdate=!1,i.setRenderTarget(T,C,G)};function E(L,D){const q=t.update(x);h.defines.VSM_SAMPLES!==L.blurSamples&&(h.defines.VSM_SAMPLES=L.blurSamples,m.defines.VSM_SAMPLES=L.blurSamples,h.needsUpdate=!0,m.needsUpdate=!0),L.mapPass===null&&(L.mapPass=new Vn(r.x,r.y)),h.uniforms.shadow_pass.value=L.map.texture,h.uniforms.resolution.value=L.mapSize,h.uniforms.radius.value=L.radius,i.setRenderTarget(L.mapPass),i.clear(),i.renderBufferDirect(D,null,q,h,x,null),m.uniforms.shadow_pass.value=L.mapPass.texture,m.uniforms.resolution.value=L.mapSize,m.uniforms.radius.value=L.radius,i.setRenderTarget(L.map),i.clear(),i.renderBufferDirect(D,null,q,m,x,null)}function M(L,D,q,T){let C=null;const G=q.isPointLight===!0?L.customDistanceMaterial:L.customDepthMaterial;if(G!==void 0)C=G;else if(C=q.isPointLight===!0?c:o,i.localClippingEnabled&&D.clipShadows===!0&&Array.isArray(D.clippingPlanes)&&D.clippingPlanes.length!==0||D.displacementMap&&D.displacementScale!==0||D.alphaMap&&D.alphaTest>0||D.map&&D.alphaTest>0){const j=C.uuid,tt=D.uuid;let N=l[j];N===void 0&&(N={},l[j]=N);let V=N[tt];V===void 0&&(V=C.clone(),N[tt]=V,D.addEventListener("dispose",U)),C=V}if(C.visible=D.visible,C.wireframe=D.wireframe,T===3?C.side=D.shadowSide!==null?D.shadowSide:D.side:C.side=D.shadowSide!==null?D.shadowSide:f[D.side],C.alphaMap=D.alphaMap,C.alphaTest=D.alphaTest,C.map=D.map,C.clipShadows=D.clipShadows,C.clippingPlanes=D.clippingPlanes,C.clipIntersection=D.clipIntersection,C.displacementMap=D.displacementMap,C.displacementScale=D.displacementScale,C.displacementBias=D.displacementBias,C.wireframeLinewidth=D.wireframeLinewidth,C.linewidth=D.linewidth,q.isPointLight===!0&&C.isMeshDistanceMaterial===!0){const j=i.properties.get(C);j.light=q}return C}function b(L,D,q,T,C){if(L.visible===!1)return;if(L.layers.test(D.layers)&&(L.isMesh||L.isLine||L.isPoints)&&(L.castShadow||L.receiveShadow&&C===3)&&(!L.frustumCulled||n.intersectsObject(L))){L.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,L.matrixWorld);const tt=t.update(L),N=L.material;if(Array.isArray(N)){const V=tt.groups;for(let J=0,et=V.length;J<et;J++){const it=V[J],$=N[it.materialIndex];if($&&$.visible){const rt=M(L,$,T,C);L.onBeforeShadow(i,L,D,q,tt,rt,it),i.renderBufferDirect(q,null,tt,rt,L,it),L.onAfterShadow(i,L,D,q,tt,rt,it)}}}else if(N.visible){const V=M(L,N,T,C);L.onBeforeShadow(i,L,D,q,tt,V,null),i.renderBufferDirect(q,null,tt,V,L,null),L.onAfterShadow(i,L,D,q,tt,V,null)}}const j=L.children;for(let tt=0,N=j.length;tt<N;tt++)b(j[tt],D,q,T,C)}function U(L){L.target.removeEventListener("dispose",U);for(const q in l){const T=l[q],C=L.target.uuid;C in T&&(T[C].dispose(),delete T[C])}}}function rf(i,t,e){const n=e.isWebGL2;function r(){let B=!1;const Tt=new Ae;let bt=null;const qt=new Ae(0,0,0,0);return{setMask:function(zt){bt!==zt&&!B&&(i.colorMask(zt,zt,zt,zt),bt=zt)},setLocked:function(zt){B=zt},setClear:function(zt,oe,Ht,ge,ce){ce===!0&&(zt*=ge,oe*=ge,Ht*=ge),Tt.set(zt,oe,Ht,ge),qt.equals(Tt)===!1&&(i.clearColor(zt,oe,Ht,ge),qt.copy(Tt))},reset:function(){B=!1,bt=null,qt.set(-1,0,0,0)}}}function s(){let B=!1,Tt=null,bt=null,qt=null;return{setTest:function(zt){zt?Zt(i.DEPTH_TEST):Nt(i.DEPTH_TEST)},setMask:function(zt){Tt!==zt&&!B&&(i.depthMask(zt),Tt=zt)},setFunc:function(zt){if(bt!==zt){switch(zt){case 0:i.depthFunc(i.NEVER);break;case 1:i.depthFunc(i.ALWAYS);break;case 2:i.depthFunc(i.LESS);break;case 3:i.depthFunc(i.LEQUAL);break;case 4:i.depthFunc(i.EQUAL);break;case 5:i.depthFunc(i.GEQUAL);break;case 6:i.depthFunc(i.GREATER);break;case 7:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}bt=zt}},setLocked:function(zt){B=zt},setClear:function(zt){qt!==zt&&(i.clearDepth(zt),qt=zt)},reset:function(){B=!1,Tt=null,bt=null,qt=null}}}function a(){let B=!1,Tt=null,bt=null,qt=null,zt=null,oe=null,Ht=null,ge=null,ce=null;return{setTest:function(Kt){B||(Kt?Zt(i.STENCIL_TEST):Nt(i.STENCIL_TEST))},setMask:function(Kt){Tt!==Kt&&!B&&(i.stencilMask(Kt),Tt=Kt)},setFunc:function(Kt,we,Oe){(bt!==Kt||qt!==we||zt!==Oe)&&(i.stencilFunc(Kt,we,Oe),bt=Kt,qt=we,zt=Oe)},setOp:function(Kt,we,Oe){(oe!==Kt||Ht!==we||ge!==Oe)&&(i.stencilOp(Kt,we,Oe),oe=Kt,Ht=we,ge=Oe)},setLocked:function(Kt){B=Kt},setClear:function(Kt){ce!==Kt&&(i.clearStencil(Kt),ce=Kt)},reset:function(){B=!1,Tt=null,bt=null,qt=null,zt=null,oe=null,Ht=null,ge=null,ce=null}}}const o=new r,c=new s,l=new a,u=new WeakMap,f=new WeakMap;let h={},m={},v=new WeakMap,x=[],p=null,d=!1,E=null,M=null,b=null,U=null,L=null,D=null,q=null,T=new Vt(0,0,0),C=0,G=!1,j=null,tt=null,N=null,V=null,J=null;const et=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let it=!1,$=0;const rt=i.getParameter(i.VERSION);rt.indexOf("WebGL")!==-1?($=parseFloat(/^WebGL (\d)/.exec(rt)[1]),it=$>=1):rt.indexOf("OpenGL ES")!==-1&&($=parseFloat(/^OpenGL ES (\d)/.exec(rt)[1]),it=$>=2);let lt=null,st={};const X=i.getParameter(i.SCISSOR_BOX),at=i.getParameter(i.VIEWPORT),_t=new Ae().fromArray(X),wt=new Ae().fromArray(at);function Et(B,Tt,bt,qt){const zt=new Uint8Array(4),oe=i.createTexture();i.bindTexture(B,oe),i.texParameteri(B,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(B,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Ht=0;Ht<bt;Ht++)n&&(B===i.TEXTURE_3D||B===i.TEXTURE_2D_ARRAY)?i.texImage3D(Tt,0,i.RGBA,1,1,qt,0,i.RGBA,i.UNSIGNED_BYTE,zt):i.texImage2D(Tt+Ht,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,zt);return oe}const Ut={};Ut[i.TEXTURE_2D]=Et(i.TEXTURE_2D,i.TEXTURE_2D,1),Ut[i.TEXTURE_CUBE_MAP]=Et(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Ut[i.TEXTURE_2D_ARRAY]=Et(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ut[i.TEXTURE_3D]=Et(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),c.setClear(1),l.setClear(0),Zt(i.DEPTH_TEST),c.setFunc(3),St(!1),w(1),Zt(i.CULL_FACE),Q(0);function Zt(B){h[B]!==!0&&(i.enable(B),h[B]=!0)}function Nt(B){h[B]!==!1&&(i.disable(B),h[B]=!1)}function Xt(B,Tt){return m[B]!==Tt?(i.bindFramebuffer(B,Tt),m[B]=Tt,n&&(B===i.DRAW_FRAMEBUFFER&&(m[i.FRAMEBUFFER]=Tt),B===i.FRAMEBUFFER&&(m[i.DRAW_FRAMEBUFFER]=Tt)),!0):!1}function I(B,Tt){let bt=x,qt=!1;if(B)if(bt=v.get(Tt),bt===void 0&&(bt=[],v.set(Tt,bt)),B.isWebGLMultipleRenderTargets){const zt=B.texture;if(bt.length!==zt.length||bt[0]!==i.COLOR_ATTACHMENT0){for(let oe=0,Ht=zt.length;oe<Ht;oe++)bt[oe]=i.COLOR_ATTACHMENT0+oe;bt.length=zt.length,qt=!0}}else bt[0]!==i.COLOR_ATTACHMENT0&&(bt[0]=i.COLOR_ATTACHMENT0,qt=!0);else bt[0]!==i.BACK&&(bt[0]=i.BACK,qt=!0);qt&&(e.isWebGL2?i.drawBuffers(bt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(bt))}function vt(B){return p!==B?(i.useProgram(B),p=B,!0):!1}const nt={100:i.FUNC_ADD,101:i.FUNC_SUBTRACT,102:i.FUNC_REVERSE_SUBTRACT};if(n)nt[103]=i.MIN,nt[104]=i.MAX;else{const B=t.get("EXT_blend_minmax");B!==null&&(nt[103]=B.MIN_EXT,nt[104]=B.MAX_EXT)}const mt={200:i.ZERO,201:i.ONE,202:i.SRC_COLOR,204:i.SRC_ALPHA,210:i.SRC_ALPHA_SATURATE,208:i.DST_COLOR,206:i.DST_ALPHA,203:i.ONE_MINUS_SRC_COLOR,205:i.ONE_MINUS_SRC_ALPHA,209:i.ONE_MINUS_DST_COLOR,207:i.ONE_MINUS_DST_ALPHA,211:i.CONSTANT_COLOR,212:i.ONE_MINUS_CONSTANT_COLOR,213:i.CONSTANT_ALPHA,214:i.ONE_MINUS_CONSTANT_ALPHA};function Q(B,Tt,bt,qt,zt,oe,Ht,ge,ce,Kt){if(B===0){d===!0&&(Nt(i.BLEND),d=!1);return}if(d===!1&&(Zt(i.BLEND),d=!0),B!==5){if(B!==E||Kt!==G){if((M!==100||L!==100)&&(i.blendEquation(i.FUNC_ADD),M=100,L=100),Kt)switch(B){case 1:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.ONE,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}else switch(B){case 1:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case 2:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case 3:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case 4:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",B);break}b=null,U=null,D=null,q=null,T.set(0,0,0),C=0,E=B,G=Kt}return}zt=zt||Tt,oe=oe||bt,Ht=Ht||qt,(Tt!==M||zt!==L)&&(i.blendEquationSeparate(nt[Tt],nt[zt]),M=Tt,L=zt),(bt!==b||qt!==U||oe!==D||Ht!==q)&&(i.blendFuncSeparate(mt[bt],mt[qt],mt[oe],mt[Ht]),b=bt,U=qt,D=oe,q=Ht),(ge.equals(T)===!1||ce!==C)&&(i.blendColor(ge.r,ge.g,ge.b,ce),T.copy(ge),C=ce),E=B,G=!1}function It(B,Tt){B.side===2?Nt(i.CULL_FACE):Zt(i.CULL_FACE);let bt=B.side===1;Tt&&(bt=!bt),St(bt),B.blending===1&&B.transparent===!1?Q(0):Q(B.blending,B.blendEquation,B.blendSrc,B.blendDst,B.blendEquationAlpha,B.blendSrcAlpha,B.blendDstAlpha,B.blendColor,B.blendAlpha,B.premultipliedAlpha),c.setFunc(B.depthFunc),c.setTest(B.depthTest),c.setMask(B.depthWrite),o.setMask(B.colorWrite);const qt=B.stencilWrite;l.setTest(qt),qt&&(l.setMask(B.stencilWriteMask),l.setFunc(B.stencilFunc,B.stencilRef,B.stencilFuncMask),l.setOp(B.stencilFail,B.stencilZFail,B.stencilZPass)),k(B.polygonOffset,B.polygonOffsetFactor,B.polygonOffsetUnits),B.alphaToCoverage===!0?Zt(i.SAMPLE_ALPHA_TO_COVERAGE):Nt(i.SAMPLE_ALPHA_TO_COVERAGE)}function St(B){j!==B&&(B?i.frontFace(i.CW):i.frontFace(i.CCW),j=B)}function w(B){B!==0?(Zt(i.CULL_FACE),B!==tt&&(B===1?i.cullFace(i.BACK):B===2?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Nt(i.CULL_FACE),tt=B}function y(B){B!==N&&(it&&i.lineWidth(B),N=B)}function k(B,Tt,bt){B?(Zt(i.POLYGON_OFFSET_FILL),(V!==Tt||J!==bt)&&(i.polygonOffset(Tt,bt),V=Tt,J=bt)):Nt(i.POLYGON_OFFSET_FILL)}function dt(B){B?Zt(i.SCISSOR_TEST):Nt(i.SCISSOR_TEST)}function ft(B){B===void 0&&(B=i.TEXTURE0+et-1),lt!==B&&(i.activeTexture(B),lt=B)}function ct(B,Tt,bt){bt===void 0&&(lt===null?bt=i.TEXTURE0+et-1:bt=lt);let qt=st[bt];qt===void 0&&(qt={type:void 0,texture:void 0},st[bt]=qt),(qt.type!==B||qt.texture!==Tt)&&(lt!==bt&&(i.activeTexture(bt),lt=bt),i.bindTexture(B,Tt||Ut[B]),qt.type=B,qt.texture=Tt)}function Dt(){const B=st[lt];B!==void 0&&B.type!==void 0&&(i.bindTexture(B.type,null),B.type=void 0,B.texture=void 0)}function yt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Pt(){try{i.compressedTexImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Gt(){try{i.texSubImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Jt(){try{i.texSubImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function pt(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function re(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Qt(){try{i.texStorage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Wt(){try{i.texStorage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ft(){try{i.texImage2D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ct(){try{i.texImage3D.apply(i,arguments)}catch(B){console.error("THREE.WebGLState:",B)}}function Ot(B){_t.equals(B)===!1&&(i.scissor(B.x,B.y,B.z,B.w),_t.copy(B))}function Bt(B){wt.equals(B)===!1&&(i.viewport(B.x,B.y,B.z,B.w),wt.copy(B))}function se(B,Tt){let bt=f.get(Tt);bt===void 0&&(bt=new WeakMap,f.set(Tt,bt));let qt=bt.get(B);qt===void 0&&(qt=i.getUniformBlockIndex(Tt,B.name),bt.set(B,qt))}function jt(B,Tt){const qt=f.get(Tt).get(B);u.get(Tt)!==qt&&(i.uniformBlockBinding(Tt,qt,B.__bindingPointIndex),u.set(Tt,qt))}function xt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),h={},lt=null,st={},m={},v=new WeakMap,x=[],p=null,d=!1,E=null,M=null,b=null,U=null,L=null,D=null,q=null,T=new Vt(0,0,0),C=0,G=!1,j=null,tt=null,N=null,V=null,J=null,_t.set(0,0,i.canvas.width,i.canvas.height),wt.set(0,0,i.canvas.width,i.canvas.height),o.reset(),c.reset(),l.reset()}return{buffers:{color:o,depth:c,stencil:l},enable:Zt,disable:Nt,bindFramebuffer:Xt,drawBuffers:I,useProgram:vt,setBlending:Q,setMaterial:It,setFlipSided:St,setCullFace:w,setLineWidth:y,setPolygonOffset:k,setScissorTest:dt,activeTexture:ft,bindTexture:ct,unbindTexture:Dt,compressedTexImage2D:yt,compressedTexImage3D:Pt,texImage2D:Ft,texImage3D:Ct,updateUBOMapping:se,uniformBlockBinding:jt,texStorage2D:Qt,texStorage3D:Wt,texSubImage2D:Gt,texSubImage3D:Jt,compressedTexSubImage2D:pt,compressedTexSubImage3D:re,scissor:Ot,viewport:Bt,reset:xt}}function sf(i,t,e,n,r,s,a){const o=r.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap;let f;const h=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function v(w,y){return m?new OffscreenCanvas(w,y):xr("canvas")}function x(w,y,k,dt){let ft=1;if((w.width>dt||w.height>dt)&&(ft=dt/Math.max(w.width,w.height)),ft<1||y===!0)if(typeof HTMLImageElement<"u"&&w instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&w instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&w instanceof ImageBitmap){const ct=y?as:Math.floor,Dt=ct(ft*w.width),yt=ct(ft*w.height);f===void 0&&(f=v(Dt,yt));const Pt=k?v(Dt,yt):f;return Pt.width=Dt,Pt.height=yt,Pt.getContext("2d").drawImage(w,0,0,Dt,yt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+w.width+"x"+w.height+") to ("+Dt+"x"+yt+")."),Pt}else return"data"in w&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+w.width+"x"+w.height+")."),w;return w}function p(w){return Ps(w.width)&&Ps(w.height)}function d(w){return o?!1:w.wrapS!==1001||w.wrapT!==1001||w.minFilter!==1003&&w.minFilter!==1006}function E(w,y){return w.generateMipmaps&&y&&w.minFilter!==1003&&w.minFilter!==1006}function M(w){i.generateMipmap(w)}function b(w,y,k,dt,ft=!1){if(o===!1)return y;if(w!==null){if(i[w]!==void 0)return i[w];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+w+"'")}let ct=y;if(y===i.RED&&(k===i.FLOAT&&(ct=i.R32F),k===i.HALF_FLOAT&&(ct=i.R16F),k===i.UNSIGNED_BYTE&&(ct=i.R8)),y===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(ct=i.R8UI),k===i.UNSIGNED_SHORT&&(ct=i.R16UI),k===i.UNSIGNED_INT&&(ct=i.R32UI),k===i.BYTE&&(ct=i.R8I),k===i.SHORT&&(ct=i.R16I),k===i.INT&&(ct=i.R32I)),y===i.RG&&(k===i.FLOAT&&(ct=i.RG32F),k===i.HALF_FLOAT&&(ct=i.RG16F),k===i.UNSIGNED_BYTE&&(ct=i.RG8)),y===i.RGBA){const Dt=ft?_r:ae.getTransfer(dt);k===i.FLOAT&&(ct=i.RGBA32F),k===i.HALF_FLOAT&&(ct=i.RGBA16F),k===i.UNSIGNED_BYTE&&(ct=Dt===ue?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT_4_4_4_4&&(ct=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(ct=i.RGB5_A1)}return(ct===i.R16F||ct===i.R32F||ct===i.RG16F||ct===i.RG32F||ct===i.RGBA16F||ct===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ct}function U(w,y,k){return E(w,k)===!0||w.isFramebufferTexture&&w.minFilter!==1003&&w.minFilter!==1006?Math.log2(Math.max(y.width,y.height))+1:w.mipmaps!==void 0&&w.mipmaps.length>0?w.mipmaps.length:w.isCompressedTexture&&Array.isArray(w.image)?y.mipmaps.length:1}function L(w){return w===1003||w===1004||w===1005?i.NEAREST:i.LINEAR}function D(w){const y=w.target;y.removeEventListener("dispose",D),T(y),y.isVideoTexture&&u.delete(y)}function q(w){const y=w.target;y.removeEventListener("dispose",q),G(y)}function T(w){const y=n.get(w);if(y.__webglInit===void 0)return;const k=w.source,dt=h.get(k);if(dt){const ft=dt[y.__cacheKey];ft.usedTimes--,ft.usedTimes===0&&C(w),Object.keys(dt).length===0&&h.delete(k)}n.remove(w)}function C(w){const y=n.get(w);i.deleteTexture(y.__webglTexture);const k=w.source,dt=h.get(k);delete dt[y.__cacheKey],a.memory.textures--}function G(w){const y=w.texture,k=n.get(w),dt=n.get(y);if(dt.__webglTexture!==void 0&&(i.deleteTexture(dt.__webglTexture),a.memory.textures--),w.depthTexture&&w.depthTexture.dispose(),w.isWebGLCubeRenderTarget)for(let ft=0;ft<6;ft++){if(Array.isArray(k.__webglFramebuffer[ft]))for(let ct=0;ct<k.__webglFramebuffer[ft].length;ct++)i.deleteFramebuffer(k.__webglFramebuffer[ft][ct]);else i.deleteFramebuffer(k.__webglFramebuffer[ft]);k.__webglDepthbuffer&&i.deleteRenderbuffer(k.__webglDepthbuffer[ft])}else{if(Array.isArray(k.__webglFramebuffer))for(let ft=0;ft<k.__webglFramebuffer.length;ft++)i.deleteFramebuffer(k.__webglFramebuffer[ft]);else i.deleteFramebuffer(k.__webglFramebuffer);if(k.__webglDepthbuffer&&i.deleteRenderbuffer(k.__webglDepthbuffer),k.__webglMultisampledFramebuffer&&i.deleteFramebuffer(k.__webglMultisampledFramebuffer),k.__webglColorRenderbuffer)for(let ft=0;ft<k.__webglColorRenderbuffer.length;ft++)k.__webglColorRenderbuffer[ft]&&i.deleteRenderbuffer(k.__webglColorRenderbuffer[ft]);k.__webglDepthRenderbuffer&&i.deleteRenderbuffer(k.__webglDepthRenderbuffer)}if(w.isWebGLMultipleRenderTargets)for(let ft=0,ct=y.length;ft<ct;ft++){const Dt=n.get(y[ft]);Dt.__webglTexture&&(i.deleteTexture(Dt.__webglTexture),a.memory.textures--),n.remove(y[ft])}n.remove(y),n.remove(w)}let j=0;function tt(){j=0}function N(){const w=j;return w>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+w+" texture units while this GPU supports only "+r.maxTextures),j+=1,w}function V(w){const y=[];return y.push(w.wrapS),y.push(w.wrapT),y.push(w.wrapR||0),y.push(w.magFilter),y.push(w.minFilter),y.push(w.anisotropy),y.push(w.internalFormat),y.push(w.format),y.push(w.type),y.push(w.generateMipmaps),y.push(w.premultiplyAlpha),y.push(w.flipY),y.push(w.unpackAlignment),y.push(w.colorSpace),y.join()}function J(w,y){const k=n.get(w);if(w.isVideoTexture&&It(w),w.isRenderTargetTexture===!1&&w.version>0&&k.__version!==w.version){const dt=w.image;if(dt===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(dt.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{_t(k,w,y);return}}e.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+y)}function et(w,y){const k=n.get(w);if(w.version>0&&k.__version!==w.version){_t(k,w,y);return}e.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+y)}function it(w,y){const k=n.get(w);if(w.version>0&&k.__version!==w.version){_t(k,w,y);return}e.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+y)}function $(w,y){const k=n.get(w);if(w.version>0&&k.__version!==w.version){wt(k,w,y);return}e.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+y)}const rt={1e3:i.REPEAT,1001:i.CLAMP_TO_EDGE,1002:i.MIRRORED_REPEAT},lt={1003:i.NEAREST,1004:i.NEAREST_MIPMAP_NEAREST,1005:i.NEAREST_MIPMAP_LINEAR,1006:i.LINEAR,1007:i.LINEAR_MIPMAP_NEAREST,1008:i.LINEAR_MIPMAP_LINEAR},st={512:i.NEVER,519:i.ALWAYS,513:i.LESS,515:i.LEQUAL,514:i.EQUAL,518:i.GEQUAL,516:i.GREATER,517:i.NOTEQUAL};function X(w,y,k){if(k?(i.texParameteri(w,i.TEXTURE_WRAP_S,rt[y.wrapS]),i.texParameteri(w,i.TEXTURE_WRAP_T,rt[y.wrapT]),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,rt[y.wrapR]),i.texParameteri(w,i.TEXTURE_MAG_FILTER,lt[y.magFilter]),i.texParameteri(w,i.TEXTURE_MIN_FILTER,lt[y.minFilter])):(i.texParameteri(w,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(w,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(w===i.TEXTURE_3D||w===i.TEXTURE_2D_ARRAY)&&i.texParameteri(w,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(y.wrapS!==1001||y.wrapT!==1001)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(w,i.TEXTURE_MAG_FILTER,L(y.magFilter)),i.texParameteri(w,i.TEXTURE_MIN_FILTER,L(y.minFilter)),y.minFilter!==1003&&y.minFilter!==1006&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),y.compareFunction&&(i.texParameteri(w,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(w,i.TEXTURE_COMPARE_FUNC,st[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){const dt=t.get("EXT_texture_filter_anisotropic");if(y.magFilter===1003||y.minFilter!==1005&&y.minFilter!==1008||y.type===1015&&t.has("OES_texture_float_linear")===!1||o===!1&&y.type===1016&&t.has("OES_texture_half_float_linear")===!1)return;(y.anisotropy>1||n.get(y).__currentAnisotropy)&&(i.texParameterf(w,dt.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,r.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy)}}function at(w,y){let k=!1;w.__webglInit===void 0&&(w.__webglInit=!0,y.addEventListener("dispose",D));const dt=y.source;let ft=h.get(dt);ft===void 0&&(ft={},h.set(dt,ft));const ct=V(y);if(ct!==w.__cacheKey){ft[ct]===void 0&&(ft[ct]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,k=!0),ft[ct].usedTimes++;const Dt=ft[w.__cacheKey];Dt!==void 0&&(ft[w.__cacheKey].usedTimes--,Dt.usedTimes===0&&C(y)),w.__cacheKey=ct,w.__webglTexture=ft[ct].texture}return k}function _t(w,y,k){let dt=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(dt=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(dt=i.TEXTURE_3D);const ft=at(w,y),ct=y.source;e.bindTexture(dt,w.__webglTexture,i.TEXTURE0+k);const Dt=n.get(ct);if(ct.version!==Dt.__version||ft===!0){e.activeTexture(i.TEXTURE0+k);const yt=ae.getPrimaries(ae.workingColorSpace),Pt=y.colorSpace===""?null:ae.getPrimaries(y.colorSpace),Gt=y.colorSpace===""||yt===Pt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Gt);const Jt=d(y)&&p(y.image)===!1;let pt=x(y.image,Jt,!1,r.maxTextureSize);pt=St(y,pt);const re=p(pt)||o,Qt=s.convert(y.format,y.colorSpace);let Wt=s.convert(y.type),Ft=b(y.internalFormat,Qt,Wt,y.colorSpace,y.isVideoTexture);X(dt,y,re);let Ct;const Ot=y.mipmaps,Bt=o&&y.isVideoTexture!==!0&&Ft!==36196,se=Dt.__version===void 0||ft===!0,jt=U(y,pt,re);if(y.isDepthTexture)Ft=i.DEPTH_COMPONENT,o?y.type===1015?Ft=i.DEPTH_COMPONENT32F:y.type===1014?Ft=i.DEPTH_COMPONENT24:y.type===1020?Ft=i.DEPTH24_STENCIL8:Ft=i.DEPTH_COMPONENT16:y.type===1015&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),y.format===1026&&Ft===i.DEPTH_COMPONENT&&y.type!==1012&&y.type!==1014&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),y.type=1014,Wt=s.convert(y.type)),y.format===1027&&Ft===i.DEPTH_COMPONENT&&(Ft=i.DEPTH_STENCIL,y.type!==1020&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),y.type=1020,Wt=s.convert(y.type))),se&&(Bt?e.texStorage2D(i.TEXTURE_2D,1,Ft,pt.width,pt.height):e.texImage2D(i.TEXTURE_2D,0,Ft,pt.width,pt.height,0,Qt,Wt,null));else if(y.isDataTexture)if(Ot.length>0&&re){Bt&&se&&e.texStorage2D(i.TEXTURE_2D,jt,Ft,Ot[0].width,Ot[0].height);for(let xt=0,B=Ot.length;xt<B;xt++)Ct=Ot[xt],Bt?e.texSubImage2D(i.TEXTURE_2D,xt,0,0,Ct.width,Ct.height,Qt,Wt,Ct.data):e.texImage2D(i.TEXTURE_2D,xt,Ft,Ct.width,Ct.height,0,Qt,Wt,Ct.data);y.generateMipmaps=!1}else Bt?(se&&e.texStorage2D(i.TEXTURE_2D,jt,Ft,pt.width,pt.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,pt.width,pt.height,Qt,Wt,pt.data)):e.texImage2D(i.TEXTURE_2D,0,Ft,pt.width,pt.height,0,Qt,Wt,pt.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){Bt&&se&&e.texStorage3D(i.TEXTURE_2D_ARRAY,jt,Ft,Ot[0].width,Ot[0].height,pt.depth);for(let xt=0,B=Ot.length;xt<B;xt++)Ct=Ot[xt],y.format!==1023?Qt!==null?Bt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,xt,0,0,0,Ct.width,Ct.height,pt.depth,Qt,Ct.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,xt,Ft,Ct.width,Ct.height,pt.depth,0,Ct.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Bt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,xt,0,0,0,Ct.width,Ct.height,pt.depth,Qt,Wt,Ct.data):e.texImage3D(i.TEXTURE_2D_ARRAY,xt,Ft,Ct.width,Ct.height,pt.depth,0,Qt,Wt,Ct.data)}else{Bt&&se&&e.texStorage2D(i.TEXTURE_2D,jt,Ft,Ot[0].width,Ot[0].height);for(let xt=0,B=Ot.length;xt<B;xt++)Ct=Ot[xt],y.format!==1023?Qt!==null?Bt?e.compressedTexSubImage2D(i.TEXTURE_2D,xt,0,0,Ct.width,Ct.height,Qt,Ct.data):e.compressedTexImage2D(i.TEXTURE_2D,xt,Ft,Ct.width,Ct.height,0,Ct.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Bt?e.texSubImage2D(i.TEXTURE_2D,xt,0,0,Ct.width,Ct.height,Qt,Wt,Ct.data):e.texImage2D(i.TEXTURE_2D,xt,Ft,Ct.width,Ct.height,0,Qt,Wt,Ct.data)}else if(y.isDataArrayTexture)Bt?(se&&e.texStorage3D(i.TEXTURE_2D_ARRAY,jt,Ft,pt.width,pt.height,pt.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,pt.width,pt.height,pt.depth,Qt,Wt,pt.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,Ft,pt.width,pt.height,pt.depth,0,Qt,Wt,pt.data);else if(y.isData3DTexture)Bt?(se&&e.texStorage3D(i.TEXTURE_3D,jt,Ft,pt.width,pt.height,pt.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,pt.width,pt.height,pt.depth,Qt,Wt,pt.data)):e.texImage3D(i.TEXTURE_3D,0,Ft,pt.width,pt.height,pt.depth,0,Qt,Wt,pt.data);else if(y.isFramebufferTexture){if(se)if(Bt)e.texStorage2D(i.TEXTURE_2D,jt,Ft,pt.width,pt.height);else{let xt=pt.width,B=pt.height;for(let Tt=0;Tt<jt;Tt++)e.texImage2D(i.TEXTURE_2D,Tt,Ft,xt,B,0,Qt,Wt,null),xt>>=1,B>>=1}}else if(Ot.length>0&&re){Bt&&se&&e.texStorage2D(i.TEXTURE_2D,jt,Ft,Ot[0].width,Ot[0].height);for(let xt=0,B=Ot.length;xt<B;xt++)Ct=Ot[xt],Bt?e.texSubImage2D(i.TEXTURE_2D,xt,0,0,Qt,Wt,Ct):e.texImage2D(i.TEXTURE_2D,xt,Ft,Qt,Wt,Ct);y.generateMipmaps=!1}else Bt?(se&&e.texStorage2D(i.TEXTURE_2D,jt,Ft,pt.width,pt.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,Qt,Wt,pt)):e.texImage2D(i.TEXTURE_2D,0,Ft,Qt,Wt,pt);E(y,re)&&M(dt),Dt.__version=ct.version,y.onUpdate&&y.onUpdate(y)}w.__version=y.version}function wt(w,y,k){if(y.image.length!==6)return;const dt=at(w,y),ft=y.source;e.bindTexture(i.TEXTURE_CUBE_MAP,w.__webglTexture,i.TEXTURE0+k);const ct=n.get(ft);if(ft.version!==ct.__version||dt===!0){e.activeTexture(i.TEXTURE0+k);const Dt=ae.getPrimaries(ae.workingColorSpace),yt=y.colorSpace===""?null:ae.getPrimaries(y.colorSpace),Pt=y.colorSpace===""||Dt===yt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);const Gt=y.isCompressedTexture||y.image[0].isCompressedTexture,Jt=y.image[0]&&y.image[0].isDataTexture,pt=[];for(let xt=0;xt<6;xt++)!Gt&&!Jt?pt[xt]=x(y.image[xt],!1,!0,r.maxCubemapSize):pt[xt]=Jt?y.image[xt].image:y.image[xt],pt[xt]=St(y,pt[xt]);const re=pt[0],Qt=p(re)||o,Wt=s.convert(y.format,y.colorSpace),Ft=s.convert(y.type),Ct=b(y.internalFormat,Wt,Ft,y.colorSpace),Ot=o&&y.isVideoTexture!==!0,Bt=ct.__version===void 0||dt===!0;let se=U(y,re,Qt);X(i.TEXTURE_CUBE_MAP,y,Qt);let jt;if(Gt){Ot&&Bt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,se,Ct,re.width,re.height);for(let xt=0;xt<6;xt++){jt=pt[xt].mipmaps;for(let B=0;B<jt.length;B++){const Tt=jt[B];y.format!==1023?Wt!==null?Ot?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+xt,B,0,0,Tt.width,Tt.height,Wt,Tt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+xt,B,Ct,Tt.width,Tt.height,0,Tt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ot?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+xt,B,0,0,Tt.width,Tt.height,Wt,Ft,Tt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+xt,B,Ct,Tt.width,Tt.height,0,Wt,Ft,Tt.data)}}}else{jt=y.mipmaps,Ot&&Bt&&(jt.length>0&&se++,e.texStorage2D(i.TEXTURE_CUBE_MAP,se,Ct,pt[0].width,pt[0].height));for(let xt=0;xt<6;xt++)if(Jt){Ot?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,0,0,pt[xt].width,pt[xt].height,Wt,Ft,pt[xt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,Ct,pt[xt].width,pt[xt].height,0,Wt,Ft,pt[xt].data);for(let B=0;B<jt.length;B++){const bt=jt[B].image[xt].image;Ot?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+xt,B+1,0,0,bt.width,bt.height,Wt,Ft,bt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+xt,B+1,Ct,bt.width,bt.height,0,Wt,Ft,bt.data)}}else{Ot?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,0,0,Wt,Ft,pt[xt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+xt,0,Ct,Wt,Ft,pt[xt]);for(let B=0;B<jt.length;B++){const Tt=jt[B];Ot?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+xt,B+1,0,0,Wt,Ft,Tt.image[xt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+xt,B+1,Ct,Wt,Ft,Tt.image[xt])}}}E(y,Qt)&&M(i.TEXTURE_CUBE_MAP),ct.__version=ft.version,y.onUpdate&&y.onUpdate(y)}w.__version=y.version}function Et(w,y,k,dt,ft,ct){const Dt=s.convert(k.format,k.colorSpace),yt=s.convert(k.type),Pt=b(k.internalFormat,Dt,yt,k.colorSpace);if(!n.get(y).__hasExternalTextures){const Jt=Math.max(1,y.width>>ct),pt=Math.max(1,y.height>>ct);ft===i.TEXTURE_3D||ft===i.TEXTURE_2D_ARRAY?e.texImage3D(ft,ct,Pt,Jt,pt,y.depth,0,Dt,yt,null):e.texImage2D(ft,ct,Pt,Jt,pt,0,Dt,yt,null)}e.bindFramebuffer(i.FRAMEBUFFER,w),Q(y)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,dt,ft,n.get(k).__webglTexture,0,mt(y)):(ft===i.TEXTURE_2D||ft>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&ft<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,dt,ft,n.get(k).__webglTexture,ct),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Ut(w,y,k){if(i.bindRenderbuffer(i.RENDERBUFFER,w),y.depthBuffer&&!y.stencilBuffer){let dt=o===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(k||Q(y)){const ft=y.depthTexture;ft&&ft.isDepthTexture&&(ft.type===1015?dt=i.DEPTH_COMPONENT32F:ft.type===1014&&(dt=i.DEPTH_COMPONENT24));const ct=mt(y);Q(y)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ct,dt,y.width,y.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ct,dt,y.width,y.height)}else i.renderbufferStorage(i.RENDERBUFFER,dt,y.width,y.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,w)}else if(y.depthBuffer&&y.stencilBuffer){const dt=mt(y);k&&Q(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,dt,i.DEPTH24_STENCIL8,y.width,y.height):Q(y)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,dt,i.DEPTH24_STENCIL8,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,w)}else{const dt=y.isWebGLMultipleRenderTargets===!0?y.texture:[y.texture];for(let ft=0;ft<dt.length;ft++){const ct=dt[ft],Dt=s.convert(ct.format,ct.colorSpace),yt=s.convert(ct.type),Pt=b(ct.internalFormat,Dt,yt,ct.colorSpace),Gt=mt(y);k&&Q(y)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Gt,Pt,y.width,y.height):Q(y)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Gt,Pt,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,Pt,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Zt(w,y){if(y&&y.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,w),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(y.depthTexture).__webglTexture||y.depthTexture.image.width!==y.width||y.depthTexture.image.height!==y.height)&&(y.depthTexture.image.width=y.width,y.depthTexture.image.height=y.height,y.depthTexture.needsUpdate=!0),J(y.depthTexture,0);const dt=n.get(y.depthTexture).__webglTexture,ft=mt(y);if(y.depthTexture.format===1026)Q(y)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,dt,0,ft):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,dt,0);else if(y.depthTexture.format===1027)Q(y)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,dt,0,ft):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,dt,0);else throw new Error("Unknown depthTexture format")}function Nt(w){const y=n.get(w),k=w.isWebGLCubeRenderTarget===!0;if(w.depthTexture&&!y.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");Zt(y.__webglFramebuffer,w)}else if(k){y.__webglDepthbuffer=[];for(let dt=0;dt<6;dt++)e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[dt]),y.__webglDepthbuffer[dt]=i.createRenderbuffer(),Ut(y.__webglDepthbuffer[dt],w,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer=i.createRenderbuffer(),Ut(y.__webglDepthbuffer,w,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Xt(w,y,k){const dt=n.get(w);y!==void 0&&Et(dt.__webglFramebuffer,w,w.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&Nt(w)}function I(w){const y=w.texture,k=n.get(w),dt=n.get(y);w.addEventListener("dispose",q),w.isWebGLMultipleRenderTargets!==!0&&(dt.__webglTexture===void 0&&(dt.__webglTexture=i.createTexture()),dt.__version=y.version,a.memory.textures++);const ft=w.isWebGLCubeRenderTarget===!0,ct=w.isWebGLMultipleRenderTargets===!0,Dt=p(w)||o;if(ft){k.__webglFramebuffer=[];for(let yt=0;yt<6;yt++)if(o&&y.mipmaps&&y.mipmaps.length>0){k.__webglFramebuffer[yt]=[];for(let Pt=0;Pt<y.mipmaps.length;Pt++)k.__webglFramebuffer[yt][Pt]=i.createFramebuffer()}else k.__webglFramebuffer[yt]=i.createFramebuffer()}else{if(o&&y.mipmaps&&y.mipmaps.length>0){k.__webglFramebuffer=[];for(let yt=0;yt<y.mipmaps.length;yt++)k.__webglFramebuffer[yt]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(ct)if(r.drawBuffers){const yt=w.texture;for(let Pt=0,Gt=yt.length;Pt<Gt;Pt++){const Jt=n.get(yt[Pt]);Jt.__webglTexture===void 0&&(Jt.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&w.samples>0&&Q(w)===!1){const yt=ct?y:[y];k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let Pt=0;Pt<yt.length;Pt++){const Gt=yt[Pt];k.__webglColorRenderbuffer[Pt]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[Pt]);const Jt=s.convert(Gt.format,Gt.colorSpace),pt=s.convert(Gt.type),re=b(Gt.internalFormat,Jt,pt,Gt.colorSpace,w.isXRRenderTarget===!0),Qt=mt(w);i.renderbufferStorageMultisample(i.RENDERBUFFER,Qt,re,w.width,w.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Pt,i.RENDERBUFFER,k.__webglColorRenderbuffer[Pt])}i.bindRenderbuffer(i.RENDERBUFFER,null),w.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),Ut(k.__webglDepthRenderbuffer,w,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ft){e.bindTexture(i.TEXTURE_CUBE_MAP,dt.__webglTexture),X(i.TEXTURE_CUBE_MAP,y,Dt);for(let yt=0;yt<6;yt++)if(o&&y.mipmaps&&y.mipmaps.length>0)for(let Pt=0;Pt<y.mipmaps.length;Pt++)Et(k.__webglFramebuffer[yt][Pt],w,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Pt);else Et(k.__webglFramebuffer[yt],w,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0);E(y,Dt)&&M(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ct){const yt=w.texture;for(let Pt=0,Gt=yt.length;Pt<Gt;Pt++){const Jt=yt[Pt],pt=n.get(Jt);e.bindTexture(i.TEXTURE_2D,pt.__webglTexture),X(i.TEXTURE_2D,Jt,Dt),Et(k.__webglFramebuffer,w,Jt,i.COLOR_ATTACHMENT0+Pt,i.TEXTURE_2D,0),E(Jt,Dt)&&M(i.TEXTURE_2D)}e.unbindTexture()}else{let yt=i.TEXTURE_2D;if((w.isWebGL3DRenderTarget||w.isWebGLArrayRenderTarget)&&(o?yt=w.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(yt,dt.__webglTexture),X(yt,y,Dt),o&&y.mipmaps&&y.mipmaps.length>0)for(let Pt=0;Pt<y.mipmaps.length;Pt++)Et(k.__webglFramebuffer[Pt],w,y,i.COLOR_ATTACHMENT0,yt,Pt);else Et(k.__webglFramebuffer,w,y,i.COLOR_ATTACHMENT0,yt,0);E(y,Dt)&&M(yt),e.unbindTexture()}w.depthBuffer&&Nt(w)}function vt(w){const y=p(w)||o,k=w.isWebGLMultipleRenderTargets===!0?w.texture:[w.texture];for(let dt=0,ft=k.length;dt<ft;dt++){const ct=k[dt];if(E(ct,y)){const Dt=w.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,yt=n.get(ct).__webglTexture;e.bindTexture(Dt,yt),M(Dt),e.unbindTexture()}}}function nt(w){if(o&&w.samples>0&&Q(w)===!1){const y=w.isWebGLMultipleRenderTargets?w.texture:[w.texture],k=w.width,dt=w.height;let ft=i.COLOR_BUFFER_BIT;const ct=[],Dt=w.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,yt=n.get(w),Pt=w.isWebGLMultipleRenderTargets===!0;if(Pt)for(let Gt=0;Gt<y.length;Gt++)e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Gt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Gt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,yt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglFramebuffer);for(let Gt=0;Gt<y.length;Gt++){ct.push(i.COLOR_ATTACHMENT0+Gt),w.depthBuffer&&ct.push(Dt);const Jt=yt.__ignoreDepthValues!==void 0?yt.__ignoreDepthValues:!1;if(Jt===!1&&(w.depthBuffer&&(ft|=i.DEPTH_BUFFER_BIT),w.stencilBuffer&&(ft|=i.STENCIL_BUFFER_BIT)),Pt&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,yt.__webglColorRenderbuffer[Gt]),Jt===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Dt]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Dt])),Pt){const pt=n.get(y[Gt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,pt,0)}i.blitFramebuffer(0,0,k,dt,0,0,k,dt,ft,i.NEAREST),l&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ct)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Pt)for(let Gt=0;Gt<y.length;Gt++){e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Gt,i.RENDERBUFFER,yt.__webglColorRenderbuffer[Gt]);const Jt=n.get(y[Gt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Gt,i.TEXTURE_2D,Jt,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,yt.__webglMultisampledFramebuffer)}}function mt(w){return Math.min(r.maxSamples,w.samples)}function Q(w){const y=n.get(w);return o&&w.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function It(w){const y=a.render.frame;u.get(w)!==y&&(u.set(w,y),w.update())}function St(w,y){const k=w.colorSpace,dt=w.format,ft=w.type;return w.isCompressedTexture===!0||w.isVideoTexture===!0||w.format===1035||k!==En&&k!==""&&(ae.getTransfer(k)===ue?o===!1?t.has("EXT_sRGB")===!0&&dt===1023?(w.format=1035,w.minFilter=1006,w.generateMipmaps=!1):y=To.sRGBToLinear(y):(dt!==1023||ft!==1009)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),y}this.allocateTextureUnit=N,this.resetTextureUnits=tt,this.setTexture2D=J,this.setTexture2DArray=et,this.setTexture3D=it,this.setTextureCube=$,this.rebindTextures=Xt,this.setupRenderTarget=I,this.updateRenderTargetMipmap=vt,this.updateMultisampleRenderTarget=nt,this.setupDepthRenderbuffer=Nt,this.setupFrameBufferTexture=Et,this.useMultisampledRTT=Q}function of(i,t,e){const n=e.isWebGL2;function r(s,a=""){let o;const c=ae.getTransfer(a);if(s===1009)return i.UNSIGNED_BYTE;if(s===1017)return i.UNSIGNED_SHORT_4_4_4_4;if(s===1018)return i.UNSIGNED_SHORT_5_5_5_1;if(s===1010)return i.BYTE;if(s===1011)return i.SHORT;if(s===1012)return i.UNSIGNED_SHORT;if(s===1013)return i.INT;if(s===1014)return i.UNSIGNED_INT;if(s===1015)return i.FLOAT;if(s===1016)return n?i.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(s===1021)return i.ALPHA;if(s===1023)return i.RGBA;if(s===1024)return i.LUMINANCE;if(s===1025)return i.LUMINANCE_ALPHA;if(s===1026)return i.DEPTH_COMPONENT;if(s===1027)return i.DEPTH_STENCIL;if(s===1035)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(s===1028)return i.RED;if(s===1029)return i.RED_INTEGER;if(s===1030)return i.RG;if(s===1031)return i.RG_INTEGER;if(s===1033)return i.RGBA_INTEGER;if(s===33776||s===33777||s===33778||s===33779)if(c===ue)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(s===33776)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(s===33777)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(s===33778)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(s===33779)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(s===33776)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(s===33777)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(s===33778)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(s===33779)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(s===35840||s===35841||s===35842||s===35843)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(s===35840)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(s===35841)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(s===35842)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(s===35843)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(s===36196)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(s===37492||s===37496)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(s===37492)return c===ue?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(s===37496)return c===ue?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(s===37808||s===37809||s===37810||s===37811||s===37812||s===37813||s===37814||s===37815||s===37816||s===37817||s===37818||s===37819||s===37820||s===37821)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(s===37808)return c===ue?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(s===37809)return c===ue?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(s===37810)return c===ue?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(s===37811)return c===ue?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(s===37812)return c===ue?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(s===37813)return c===ue?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(s===37814)return c===ue?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(s===37815)return c===ue?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(s===37816)return c===ue?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(s===37817)return c===ue?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(s===37818)return c===ue?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(s===37819)return c===ue?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(s===37820)return c===ue?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(s===37821)return c===ue?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(s===36492||s===36494||s===36495)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(s===36492)return c===ue?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(s===36494)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(s===36495)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(s===36283||s===36284||s===36285||s===36286)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(s===36492)return o.COMPRESSED_RED_RGTC1_EXT;if(s===36284)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(s===36285)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(s===36286)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return s===1020?n?i.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[s]!==void 0?i[s]:null}return{convert:r}}class af extends rn{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class fe extends De{constructor(){super(),this.isGroup=!0,this.type="Group"}}const cf={type:"move"};class $r{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new fe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new fe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new F,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new F),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new fe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new F,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new F),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){a=!0;for(const x of t.hand.values()){const p=e.getJointPose(x,n),d=this._getHandJoint(l,x);p!==null&&(d.matrix.fromArray(p.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=p.radius),d.visible=p!==null}const u=l.joints["index-finger-tip"],f=l.joints["thumb-tip"],h=u.position.distanceTo(f.position),m=.02,v=.005;l.inputState.pinching&&h>m+v?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&h<=m-v&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=e.getPose(t.targetRaySpace,n),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(cf)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),l!==null&&(l.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new fe;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}class lf extends _i{constructor(t,e){super();const n=this;let r=null,s=1,a=null,o="local-floor",c=1,l=null,u=null,f=null,h=null,m=null,v=null;const x=e.getContextAttributes();let p=null,d=null;const E=[],M=[],b=new gt;let U=null;const L=new rn;L.layers.enable(1),L.viewport=new Ae;const D=new rn;D.layers.enable(2),D.viewport=new Ae;const q=[L,D],T=new af;T.layers.enable(1),T.layers.enable(2);let C=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let at=E[X];return at===void 0&&(at=new $r,E[X]=at),at.getTargetRaySpace()},this.getControllerGrip=function(X){let at=E[X];return at===void 0&&(at=new $r,E[X]=at),at.getGripSpace()},this.getHand=function(X){let at=E[X];return at===void 0&&(at=new $r,E[X]=at),at.getHandSpace()};function j(X){const at=M.indexOf(X.inputSource);if(at===-1)return;const _t=E[at];_t!==void 0&&(_t.update(X.inputSource,X.frame,l||a),_t.dispatchEvent({type:X.type,data:X.inputSource}))}function tt(){r.removeEventListener("select",j),r.removeEventListener("selectstart",j),r.removeEventListener("selectend",j),r.removeEventListener("squeeze",j),r.removeEventListener("squeezestart",j),r.removeEventListener("squeezeend",j),r.removeEventListener("end",tt),r.removeEventListener("inputsourceschange",N);for(let X=0;X<E.length;X++){const at=M[X];at!==null&&(M[X]=null,E[X].disconnect(at))}C=null,G=null,t.setRenderTarget(p),m=null,h=null,f=null,r=null,d=null,st.stop(),n.isPresenting=!1,t.setPixelRatio(U),t.setSize(b.width,b.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){s=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||a},this.setReferenceSpace=function(X){l=X},this.getBaseLayer=function(){return h!==null?h:m},this.getBinding=function(){return f},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=async function(X){if(r=X,r!==null){if(p=t.getRenderTarget(),r.addEventListener("select",j),r.addEventListener("selectstart",j),r.addEventListener("selectend",j),r.addEventListener("squeeze",j),r.addEventListener("squeezestart",j),r.addEventListener("squeezeend",j),r.addEventListener("end",tt),r.addEventListener("inputsourceschange",N),x.xrCompatible!==!0&&await e.makeXRCompatible(),U=t.getPixelRatio(),t.getSize(b),r.renderState.layers===void 0||t.capabilities.isWebGL2===!1){const at={antialias:r.renderState.layers===void 0?x.antialias:!0,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,e,at),r.updateRenderState({baseLayer:m}),t.setPixelRatio(1),t.setSize(m.framebufferWidth,m.framebufferHeight,!1),d=new Vn(m.framebufferWidth,m.framebufferHeight,{format:1023,type:1009,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil})}else{let at=null,_t=null,wt=null;x.depth&&(wt=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,at=x.stencil?1027:1026,_t=x.stencil?1020:1014);const Et={colorFormat:e.RGBA8,depthFormat:wt,scaleFactor:s};f=new XRWebGLBinding(r,e),h=f.createProjectionLayer(Et),r.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),d=new Vn(h.textureWidth,h.textureHeight,{format:1023,type:1009,depthTexture:new Io(h.textureWidth,h.textureHeight,_t,void 0,void 0,void 0,void 0,void 0,void 0,at),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0});const Ut=t.properties.get(d);Ut.__ignoreDepthValues=h.ignoreDepthValues}d.isXRRenderTarget=!0,this.setFoveation(c),l=null,a=await r.requestReferenceSpace(o),st.setContext(r),st.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode};function N(X){for(let at=0;at<X.removed.length;at++){const _t=X.removed[at],wt=M.indexOf(_t);wt>=0&&(M[wt]=null,E[wt].disconnect(_t))}for(let at=0;at<X.added.length;at++){const _t=X.added[at];let wt=M.indexOf(_t);if(wt===-1){for(let Ut=0;Ut<E.length;Ut++)if(Ut>=M.length){M.push(_t),wt=Ut;break}else if(M[Ut]===null){M[Ut]=_t,wt=Ut;break}if(wt===-1)break}const Et=E[wt];Et&&Et.connect(_t)}}const V=new F,J=new F;function et(X,at,_t){V.setFromMatrixPosition(at.matrixWorld),J.setFromMatrixPosition(_t.matrixWorld);const wt=V.distanceTo(J),Et=at.projectionMatrix.elements,Ut=_t.projectionMatrix.elements,Zt=Et[14]/(Et[10]-1),Nt=Et[14]/(Et[10]+1),Xt=(Et[9]+1)/Et[5],I=(Et[9]-1)/Et[5],vt=(Et[8]-1)/Et[0],nt=(Ut[8]+1)/Ut[0],mt=Zt*vt,Q=Zt*nt,It=wt/(-vt+nt),St=It*-vt;at.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(St),X.translateZ(It),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert();const w=Zt+It,y=Nt+It,k=mt-St,dt=Q+(wt-St),ft=Xt*Nt/y*w,ct=I*Nt/y*w;X.projectionMatrix.makePerspective(k,dt,ft,ct,w,y),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}function it(X,at){at===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(at.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(r===null)return;T.near=D.near=L.near=X.near,T.far=D.far=L.far=X.far,(C!==T.near||G!==T.far)&&(r.updateRenderState({depthNear:T.near,depthFar:T.far}),C=T.near,G=T.far);const at=X.parent,_t=T.cameras;it(T,at);for(let wt=0;wt<_t.length;wt++)it(_t[wt],at);_t.length===2?et(T,L,D):T.projectionMatrix.copy(L.projectionMatrix),$(X,T,at)};function $(X,at,_t){_t===null?X.matrix.copy(at.matrixWorld):(X.matrix.copy(_t.matrixWorld),X.matrix.invert(),X.matrix.multiply(at.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(at.projectionMatrix),X.projectionMatrixInverse.copy(at.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=os*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return T},this.getFoveation=function(){if(!(h===null&&m===null))return c},this.setFoveation=function(X){c=X,h!==null&&(h.fixedFoveation=X),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=X)};let rt=null;function lt(X,at){if(u=at.getViewerPose(l||a),v=at,u!==null){const _t=u.views;m!==null&&(t.setRenderTargetFramebuffer(d,m.framebuffer),t.setRenderTarget(d));let wt=!1;_t.length!==T.cameras.length&&(T.cameras.length=0,wt=!0);for(let Et=0;Et<_t.length;Et++){const Ut=_t[Et];let Zt=null;if(m!==null)Zt=m.getViewport(Ut);else{const Xt=f.getViewSubImage(h,Ut);Zt=Xt.viewport,Et===0&&(t.setRenderTargetTextures(d,Xt.colorTexture,h.ignoreDepthValues?void 0:Xt.depthStencilTexture),t.setRenderTarget(d))}let Nt=q[Et];Nt===void 0&&(Nt=new rn,Nt.layers.enable(Et),Nt.viewport=new Ae,q[Et]=Nt),Nt.matrix.fromArray(Ut.transform.matrix),Nt.matrix.decompose(Nt.position,Nt.quaternion,Nt.scale),Nt.projectionMatrix.fromArray(Ut.projectionMatrix),Nt.projectionMatrixInverse.copy(Nt.projectionMatrix).invert(),Nt.viewport.set(Zt.x,Zt.y,Zt.width,Zt.height),Et===0&&(T.matrix.copy(Nt.matrix),T.matrix.decompose(T.position,T.quaternion,T.scale)),wt===!0&&T.cameras.push(Nt)}}for(let _t=0;_t<E.length;_t++){const wt=M[_t],Et=E[_t];wt!==null&&Et!==void 0&&Et.update(wt,at,l||a)}rt&&rt(X,at),at.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:at}),v=null}const st=new No;st.setAnimationLoop(lt),this.setAnimationLoop=function(X){rt=X},this.dispose=function(){}}}function uf(i,t){function e(p,d){p.matrixAutoUpdate===!0&&p.updateMatrix(),d.value.copy(p.matrix)}function n(p,d){d.color.getRGB(p.fogColor.value,Lo(i)),d.isFog?(p.fogNear.value=d.near,p.fogFar.value=d.far):d.isFogExp2&&(p.fogDensity.value=d.density)}function r(p,d,E,M,b){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(p,d):d.isMeshToonMaterial?(s(p,d),f(p,d)):d.isMeshPhongMaterial?(s(p,d),u(p,d)):d.isMeshStandardMaterial?(s(p,d),h(p,d),d.isMeshPhysicalMaterial&&m(p,d,b)):d.isMeshMatcapMaterial?(s(p,d),v(p,d)):d.isMeshDepthMaterial?s(p,d):d.isMeshDistanceMaterial?(s(p,d),x(p,d)):d.isMeshNormalMaterial?s(p,d):d.isLineBasicMaterial?(a(p,d),d.isLineDashedMaterial&&o(p,d)):d.isPointsMaterial?c(p,d,E,M):d.isSpriteMaterial?l(p,d):d.isShadowMaterial?(p.color.value.copy(d.color),p.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(p,d){p.opacity.value=d.opacity,d.color&&p.diffuse.value.copy(d.color),d.emissive&&p.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(p.map.value=d.map,e(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.bumpMap&&(p.bumpMap.value=d.bumpMap,e(d.bumpMap,p.bumpMapTransform),p.bumpScale.value=d.bumpScale,d.side===1&&(p.bumpScale.value*=-1)),d.normalMap&&(p.normalMap.value=d.normalMap,e(d.normalMap,p.normalMapTransform),p.normalScale.value.copy(d.normalScale),d.side===1&&p.normalScale.value.negate()),d.displacementMap&&(p.displacementMap.value=d.displacementMap,e(d.displacementMap,p.displacementMapTransform),p.displacementScale.value=d.displacementScale,p.displacementBias.value=d.displacementBias),d.emissiveMap&&(p.emissiveMap.value=d.emissiveMap,e(d.emissiveMap,p.emissiveMapTransform)),d.specularMap&&(p.specularMap.value=d.specularMap,e(d.specularMap,p.specularMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest);const E=t.get(d).envMap;if(E&&(p.envMap.value=E,p.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=d.reflectivity,p.ior.value=d.ior,p.refractionRatio.value=d.refractionRatio),d.lightMap){p.lightMap.value=d.lightMap;const M=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=d.lightMapIntensity*M,e(d.lightMap,p.lightMapTransform)}d.aoMap&&(p.aoMap.value=d.aoMap,p.aoMapIntensity.value=d.aoMapIntensity,e(d.aoMap,p.aoMapTransform))}function a(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,d.map&&(p.map.value=d.map,e(d.map,p.mapTransform))}function o(p,d){p.dashSize.value=d.dashSize,p.totalSize.value=d.dashSize+d.gapSize,p.scale.value=d.scale}function c(p,d,E,M){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.size.value=d.size*E,p.scale.value=M*.5,d.map&&(p.map.value=d.map,e(d.map,p.uvTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function l(p,d){p.diffuse.value.copy(d.color),p.opacity.value=d.opacity,p.rotation.value=d.rotation,d.map&&(p.map.value=d.map,e(d.map,p.mapTransform)),d.alphaMap&&(p.alphaMap.value=d.alphaMap,e(d.alphaMap,p.alphaMapTransform)),d.alphaTest>0&&(p.alphaTest.value=d.alphaTest)}function u(p,d){p.specular.value.copy(d.specular),p.shininess.value=Math.max(d.shininess,1e-4)}function f(p,d){d.gradientMap&&(p.gradientMap.value=d.gradientMap)}function h(p,d){p.metalness.value=d.metalness,d.metalnessMap&&(p.metalnessMap.value=d.metalnessMap,e(d.metalnessMap,p.metalnessMapTransform)),p.roughness.value=d.roughness,d.roughnessMap&&(p.roughnessMap.value=d.roughnessMap,e(d.roughnessMap,p.roughnessMapTransform)),t.get(d).envMap&&(p.envMapIntensity.value=d.envMapIntensity)}function m(p,d,E){p.ior.value=d.ior,d.sheen>0&&(p.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),p.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(p.sheenColorMap.value=d.sheenColorMap,e(d.sheenColorMap,p.sheenColorMapTransform)),d.sheenRoughnessMap&&(p.sheenRoughnessMap.value=d.sheenRoughnessMap,e(d.sheenRoughnessMap,p.sheenRoughnessMapTransform))),d.clearcoat>0&&(p.clearcoat.value=d.clearcoat,p.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(p.clearcoatMap.value=d.clearcoatMap,e(d.clearcoatMap,p.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,e(d.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(p.clearcoatNormalMap.value=d.clearcoatNormalMap,e(d.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===1&&p.clearcoatNormalScale.value.negate())),d.iridescence>0&&(p.iridescence.value=d.iridescence,p.iridescenceIOR.value=d.iridescenceIOR,p.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(p.iridescenceMap.value=d.iridescenceMap,e(d.iridescenceMap,p.iridescenceMapTransform)),d.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=d.iridescenceThicknessMap,e(d.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),d.transmission>0&&(p.transmission.value=d.transmission,p.transmissionSamplerMap.value=E.texture,p.transmissionSamplerSize.value.set(E.width,E.height),d.transmissionMap&&(p.transmissionMap.value=d.transmissionMap,e(d.transmissionMap,p.transmissionMapTransform)),p.thickness.value=d.thickness,d.thicknessMap&&(p.thicknessMap.value=d.thicknessMap,e(d.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=d.attenuationDistance,p.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(p.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(p.anisotropyMap.value=d.anisotropyMap,e(d.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=d.specularIntensity,p.specularColor.value.copy(d.specularColor),d.specularColorMap&&(p.specularColorMap.value=d.specularColorMap,e(d.specularColorMap,p.specularColorMapTransform)),d.specularIntensityMap&&(p.specularIntensityMap.value=d.specularIntensityMap,e(d.specularIntensityMap,p.specularIntensityMapTransform))}function v(p,d){d.matcap&&(p.matcap.value=d.matcap)}function x(p,d){const E=t.get(d).light;p.referencePosition.value.setFromMatrixPosition(E.matrixWorld),p.nearDistance.value=E.shadow.camera.near,p.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:r}}function hf(i,t,e,n){let r={},s={},a=[];const o=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(E,M){const b=M.program;n.uniformBlockBinding(E,b)}function l(E,M){let b=r[E.id];b===void 0&&(v(E),b=u(E),r[E.id]=b,E.addEventListener("dispose",p));const U=M.program;n.updateUBOMapping(E,U);const L=t.render.frame;s[E.id]!==L&&(h(E),s[E.id]=L)}function u(E){const M=f();E.__bindingPointIndex=M;const b=i.createBuffer(),U=E.__size,L=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,b),i.bufferData(i.UNIFORM_BUFFER,U,L),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,b),b}function f(){for(let E=0;E<o;E++)if(a.indexOf(E)===-1)return a.push(E),E;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(E){const M=r[E.id],b=E.uniforms,U=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let L=0,D=b.length;L<D;L++){const q=Array.isArray(b[L])?b[L]:[b[L]];for(let T=0,C=q.length;T<C;T++){const G=q[T];if(m(G,L,T,U)===!0){const j=G.__offset,tt=Array.isArray(G.value)?G.value:[G.value];let N=0;for(let V=0;V<tt.length;V++){const J=tt[V],et=x(J);typeof J=="number"||typeof J=="boolean"?(G.__data[0]=J,i.bufferSubData(i.UNIFORM_BUFFER,j+N,G.__data)):J.isMatrix3?(G.__data[0]=J.elements[0],G.__data[1]=J.elements[1],G.__data[2]=J.elements[2],G.__data[3]=0,G.__data[4]=J.elements[3],G.__data[5]=J.elements[4],G.__data[6]=J.elements[5],G.__data[7]=0,G.__data[8]=J.elements[6],G.__data[9]=J.elements[7],G.__data[10]=J.elements[8],G.__data[11]=0):(J.toArray(G.__data,N),N+=et.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,j,G.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(E,M,b,U){const L=E.value,D=M+"_"+b;if(U[D]===void 0)return typeof L=="number"||typeof L=="boolean"?U[D]=L:U[D]=L.clone(),!0;{const q=U[D];if(typeof L=="number"||typeof L=="boolean"){if(q!==L)return U[D]=L,!0}else if(q.equals(L)===!1)return q.copy(L),!0}return!1}function v(E){const M=E.uniforms;let b=0;const U=16;for(let D=0,q=M.length;D<q;D++){const T=Array.isArray(M[D])?M[D]:[M[D]];for(let C=0,G=T.length;C<G;C++){const j=T[C],tt=Array.isArray(j.value)?j.value:[j.value];for(let N=0,V=tt.length;N<V;N++){const J=tt[N],et=x(J),it=b%U;it!==0&&U-it<et.boundary&&(b+=U-it),j.__data=new Float32Array(et.storage/Float32Array.BYTES_PER_ELEMENT),j.__offset=b,b+=et.storage}}}const L=b%U;return L>0&&(b+=U-L),E.__size=b,E.__cache={},this}function x(E){const M={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(M.boundary=4,M.storage=4):E.isVector2?(M.boundary=8,M.storage=8):E.isVector3||E.isColor?(M.boundary=16,M.storage=12):E.isVector4?(M.boundary=16,M.storage=16):E.isMatrix3?(M.boundary=48,M.storage=48):E.isMatrix4?(M.boundary=64,M.storage=64):E.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",E),M}function p(E){const M=E.target;M.removeEventListener("dispose",p);const b=a.indexOf(M.__bindingPointIndex);a.splice(b,1),i.deleteBuffer(r[M.id]),delete r[M.id],delete s[M.id]}function d(){for(const E in r)i.deleteBuffer(r[E]);a=[],r={},s={}}return{bind:c,update:l,dispose:d}}class Ho{constructor(t={}){const{canvas:e=sa(),context:n=null,depth:r=!0,stencil:s=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let h;n!==null?h=n.getContextAttributes().alpha:h=a;const m=new Uint32Array(4),v=new Int32Array(4);let x=null,p=null;const d=[],E=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ye,this._useLegacyLights=!1,this.toneMapping=0,this.toneMappingExposure=1;const M=this;let b=!1,U=0,L=0,D=null,q=-1,T=null;const C=new Ae,G=new Ae;let j=null;const tt=new Vt(0);let N=0,V=e.width,J=e.height,et=1,it=null,$=null;const rt=new Ae(0,0,V,J),lt=new Ae(0,0,V,J);let st=!1;const X=new vs;let at=!1,_t=!1,wt=null;const Et=new xe,Ut=new gt,Zt=new F,Nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Xt(){return D===null?et:1}let I=n;function vt(R,W){for(let Z=0;Z<R.length;Z++){const g=R[Z],_=e.getContext(g,W);if(_!==null)return _}return null}try{const R={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine","three.js r160"),e.addEventListener("webglcontextlost",xt,!1),e.addEventListener("webglcontextrestored",B,!1),e.addEventListener("webglcontextcreationerror",Tt,!1),I===null){const W=["webgl2","webgl","experimental-webgl"];if(M.isWebGL1Renderer===!0&&W.shift(),I=vt(W,R),I===null)throw vt(W)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&I instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),I.getShaderPrecisionFormat===void 0&&(I.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(R){throw console.error("THREE.WebGLRenderer: "+R.message),R}let nt,mt,Q,It,St,w,y,k,dt,ft,ct,Dt,yt,Pt,Gt,Jt,pt,re,Qt,Wt,Ft,Ct,Ot,Bt;function se(){nt=new Mu(I),mt=new pu(I,nt,t),nt.init(mt),Ct=new of(I,nt,mt),Q=new rf(I,nt,mt),It=new Eu(I),St=new kh,w=new sf(I,nt,Q,St,mt,Ct,It),y=new gu(M),k=new xu(M),dt=new La(I,mt),Ot=new fu(I,nt,dt,mt),ft=new Su(I,dt,It,Ot),ct=new wu(I,ft,dt,It),Qt=new Au(I,mt,w),Jt=new mu(St),Dt=new Vh(M,y,k,nt,mt,Ot,Jt),yt=new uf(M,St),Pt=new Xh,Gt=new jh(nt,mt),re=new hu(M,y,k,Q,ct,h,c),pt=new nf(M,ct,mt),Bt=new hf(I,It,mt,Q),Wt=new du(I,nt,It,mt),Ft=new yu(I,nt,It,mt),It.programs=Dt.programs,M.capabilities=mt,M.extensions=nt,M.properties=St,M.renderLists=Pt,M.shadowMap=pt,M.state=Q,M.info=It}se();const jt=new lf(M,I);this.xr=jt,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const R=nt.get("WEBGL_lose_context");R&&R.loseContext()},this.forceContextRestore=function(){const R=nt.get("WEBGL_lose_context");R&&R.restoreContext()},this.getPixelRatio=function(){return et},this.setPixelRatio=function(R){R!==void 0&&(et=R,this.setSize(V,J,!1))},this.getSize=function(R){return R.set(V,J)},this.setSize=function(R,W,Z=!0){if(jt.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}V=R,J=W,e.width=Math.floor(R*et),e.height=Math.floor(W*et),Z===!0&&(e.style.width=R+"px",e.style.height=W+"px"),this.setViewport(0,0,R,W)},this.getDrawingBufferSize=function(R){return R.set(V*et,J*et).floor()},this.setDrawingBufferSize=function(R,W,Z){V=R,J=W,et=Z,e.width=Math.floor(R*Z),e.height=Math.floor(W*Z),this.setViewport(0,0,R,W)},this.getCurrentViewport=function(R){return R.copy(C)},this.getViewport=function(R){return R.copy(rt)},this.setViewport=function(R,W,Z,g){R.isVector4?rt.set(R.x,R.y,R.z,R.w):rt.set(R,W,Z,g),Q.viewport(C.copy(rt).multiplyScalar(et).floor())},this.getScissor=function(R){return R.copy(lt)},this.setScissor=function(R,W,Z,g){R.isVector4?lt.set(R.x,R.y,R.z,R.w):lt.set(R,W,Z,g),Q.scissor(G.copy(lt).multiplyScalar(et).floor())},this.getScissorTest=function(){return st},this.setScissorTest=function(R){Q.setScissorTest(st=R)},this.setOpaqueSort=function(R){it=R},this.setTransparentSort=function(R){$=R},this.getClearColor=function(R){return R.copy(re.getClearColor())},this.setClearColor=function(){re.setClearColor.apply(re,arguments)},this.getClearAlpha=function(){return re.getClearAlpha()},this.setClearAlpha=function(){re.setClearAlpha.apply(re,arguments)},this.clear=function(R=!0,W=!0,Z=!0){let g=0;if(R){let _=!1;if(D!==null){const S=D.texture.format;_=S===1033||S===1031||S===1029}if(_){const S=D.texture.type,A=S===1009||S===1014||S===1012||S===1020||S===1017||S===1018,P=re.getClearColor(),O=re.getClearAlpha(),H=P.r,z=P.g,Y=P.b;A?(m[0]=H,m[1]=z,m[2]=Y,m[3]=O,I.clearBufferuiv(I.COLOR,0,m)):(v[0]=H,v[1]=z,v[2]=Y,v[3]=O,I.clearBufferiv(I.COLOR,0,v))}else g|=I.COLOR_BUFFER_BIT}W&&(g|=I.DEPTH_BUFFER_BIT),Z&&(g|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(g)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",xt,!1),e.removeEventListener("webglcontextrestored",B,!1),e.removeEventListener("webglcontextcreationerror",Tt,!1),Pt.dispose(),Gt.dispose(),St.dispose(),y.dispose(),k.dispose(),ct.dispose(),Ot.dispose(),Bt.dispose(),Dt.dispose(),jt.dispose(),jt.removeEventListener("sessionstart",ce),jt.removeEventListener("sessionend",Kt),wt&&(wt.dispose(),wt=null),we.stop()};function xt(R){R.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),b=!0}function B(){console.log("THREE.WebGLRenderer: Context Restored."),b=!1;const R=It.autoReset,W=pt.enabled,Z=pt.autoUpdate,g=pt.needsUpdate,_=pt.type;se(),It.autoReset=R,pt.enabled=W,pt.autoUpdate=Z,pt.needsUpdate=g,pt.type=_}function Tt(R){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",R.statusMessage)}function bt(R){const W=R.target;W.removeEventListener("dispose",bt),qt(W)}function qt(R){zt(R),St.remove(R)}function zt(R){const W=St.get(R).programs;W!==void 0&&(W.forEach(function(Z){Dt.releaseProgram(Z)}),R.isShaderMaterial&&Dt.releaseShaderCache(R))}this.renderBufferDirect=function(R,W,Z,g,_,S){W===null&&(W=Nt);const A=_.isMesh&&_.matrixWorld.determinant()<0,P=Zn(R,W,Z,g,_);Q.setMaterial(g,A);let O=Z.index,H=1;if(g.wireframe===!0){if(O=ft.getWireframeAttribute(Z),O===void 0)return;H=2}const z=Z.drawRange,Y=Z.attributes.position;let K=z.start*H,ut=(z.start+z.count)*H;S!==null&&(K=Math.max(K,S.start*H),ut=Math.min(ut,(S.start+S.count)*H)),O!==null?(K=Math.max(K,0),ut=Math.min(ut,O.count)):Y!=null&&(K=Math.max(K,0),ut=Math.min(ut,Y.count));const ot=ut-K;if(ot<0||ot===1/0)return;Ot.setup(_,g,P,Z,O);let ht,Rt=Wt;if(O!==null&&(ht=dt.get(O),Rt=Ft,Rt.setIndex(ht)),_.isMesh)g.wireframe===!0?(Q.setLineWidth(g.wireframeLinewidth*Xt()),Rt.setMode(I.LINES)):Rt.setMode(I.TRIANGLES);else if(_.isLine){let At=g.linewidth;At===void 0&&(At=1),Q.setLineWidth(At*Xt()),_.isLineSegments?Rt.setMode(I.LINES):_.isLineLoop?Rt.setMode(I.LINE_LOOP):Rt.setMode(I.LINE_STRIP)}else _.isPoints?Rt.setMode(I.POINTS):_.isSprite&&Rt.setMode(I.TRIANGLES);if(_.isBatchedMesh)Rt.renderMultiDraw(_._multiDrawStarts,_._multiDrawCounts,_._multiDrawCount);else if(_.isInstancedMesh)Rt.renderInstances(K,ot,_.count);else if(Z.isInstancedBufferGeometry){const At=Z._maxInstanceCount!==void 0?Z._maxInstanceCount:1/0,ne=Math.min(Z.instanceCount,At);Rt.renderInstances(K,ot,ne)}else Rt.render(K,ot)};function oe(R,W,Z){R.transparent===!0&&R.side===2&&R.forceSinglePass===!1?(R.side=1,R.needsUpdate=!0,qn(R,W,Z),R.side=0,R.needsUpdate=!0,qn(R,W,Z),R.side=2):qn(R,W,Z)}this.compile=function(R,W,Z=null){Z===null&&(Z=R),p=Gt.get(Z),p.init(),E.push(p),Z.traverseVisible(function(_){_.isLight&&_.layers.test(W.layers)&&(p.pushLight(_),_.castShadow&&p.pushShadow(_))}),R!==Z&&R.traverseVisible(function(_){_.isLight&&_.layers.test(W.layers)&&(p.pushLight(_),_.castShadow&&p.pushShadow(_))}),p.setupLights(M._useLegacyLights);const g=new Set;return R.traverse(function(_){const S=_.material;if(S)if(Array.isArray(S))for(let A=0;A<S.length;A++){const P=S[A];oe(P,Z,_),g.add(P)}else oe(S,Z,_),g.add(S)}),E.pop(),p=null,g},this.compileAsync=function(R,W,Z=null){const g=this.compile(R,W,Z);return new Promise(_=>{function S(){if(g.forEach(function(A){St.get(A).currentProgram.isReady()&&g.delete(A)}),g.size===0){_(R);return}setTimeout(S,10)}nt.get("KHR_parallel_shader_compile")!==null?S():setTimeout(S,10)})};let Ht=null;function ge(R){Ht&&Ht(R)}function ce(){we.stop()}function Kt(){we.start()}const we=new No;we.setAnimationLoop(ge),typeof self<"u"&&we.setContext(self),this.setAnimationLoop=function(R){Ht=R,jt.setAnimationLoop(R),R===null?we.stop():we.start()},jt.addEventListener("sessionstart",ce),jt.addEventListener("sessionend",Kt),this.render=function(R,W){if(W!==void 0&&W.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(b===!0)return;R.matrixWorldAutoUpdate===!0&&R.updateMatrixWorld(),W.parent===null&&W.matrixWorldAutoUpdate===!0&&W.updateMatrixWorld(),jt.enabled===!0&&jt.isPresenting===!0&&(jt.cameraAutoUpdate===!0&&jt.updateCamera(W),W=jt.getCamera()),R.isScene===!0&&R.onBeforeRender(M,R,W,D),p=Gt.get(R,E.length),p.init(),E.push(p),Et.multiplyMatrices(W.projectionMatrix,W.matrixWorldInverse),X.setFromProjectionMatrix(Et),_t=this.localClippingEnabled,at=Jt.init(this.clippingPlanes,_t),x=Pt.get(R,d.length),x.init(),d.push(x),Oe(R,W,0,M.sortObjects),x.finish(),M.sortObjects===!0&&x.sort(it,$),this.info.render.frame++,at===!0&&Jt.beginShadows();const Z=p.state.shadowsArray;if(pt.render(Z,R,W),at===!0&&Jt.endShadows(),this.info.autoReset===!0&&this.info.reset(),re.render(x,R),p.setupLights(M._useLegacyLights),W.isArrayCamera){const g=W.cameras;for(let _=0,S=g.length;_<S;_++){const A=g[_];Pn(x,R,A,A.viewport)}}else Pn(x,R,W);D!==null&&(w.updateMultisampleRenderTarget(D),w.updateRenderTargetMipmap(D)),R.isScene===!0&&R.onAfterRender(M,R,W),Ot.resetDefaultState(),q=-1,T=null,E.pop(),E.length>0?p=E[E.length-1]:p=null,d.pop(),d.length>0?x=d[d.length-1]:x=null};function Oe(R,W,Z,g){if(R.visible===!1)return;if(R.layers.test(W.layers)){if(R.isGroup)Z=R.renderOrder;else if(R.isLOD)R.autoUpdate===!0&&R.update(W);else if(R.isLight)p.pushLight(R),R.castShadow&&p.pushShadow(R);else if(R.isSprite){if(!R.frustumCulled||X.intersectsSprite(R)){g&&Zt.setFromMatrixPosition(R.matrixWorld).applyMatrix4(Et);const A=ct.update(R),P=R.material;P.visible&&x.push(R,A,P,Z,Zt.z,null)}}else if((R.isMesh||R.isLine||R.isPoints)&&(!R.frustumCulled||X.intersectsObject(R))){const A=ct.update(R),P=R.material;if(g&&(R.boundingSphere!==void 0?(R.boundingSphere===null&&R.computeBoundingSphere(),Zt.copy(R.boundingSphere.center)):(A.boundingSphere===null&&A.computeBoundingSphere(),Zt.copy(A.boundingSphere.center)),Zt.applyMatrix4(R.matrixWorld).applyMatrix4(Et)),Array.isArray(P)){const O=A.groups;for(let H=0,z=O.length;H<z;H++){const Y=O[H],K=P[Y.materialIndex];K&&K.visible&&x.push(R,A,K,Z,Zt.z,Y)}}else P.visible&&x.push(R,A,P,Z,Zt.z,null)}}const S=R.children;for(let A=0,P=S.length;A<P;A++)Oe(S[A],W,Z,g)}function Pn(R,W,Z,g){const _=R.opaque,S=R.transmissive,A=R.transparent;p.setupLightsView(Z),at===!0&&Jt.setGlobalState(M.clippingPlanes,Z),S.length>0&&ee(_,S,W,Z),g&&Q.viewport(C.copy(g)),_.length>0&&mn(_,W,Z),S.length>0&&mn(S,W,Z),A.length>0&&mn(A,W,Z),Q.buffers.depth.setTest(!0),Q.buffers.depth.setMask(!0),Q.buffers.color.setMask(!0),Q.setPolygonOffset(!1)}function ee(R,W,Z,g){if((Z.isScene===!0?Z.overrideMaterial:null)!==null)return;const S=mt.isWebGL2;wt===null&&(wt=new Vn(1,1,{generateMipmaps:!0,type:nt.has("EXT_color_buffer_half_float")?1016:1009,minFilter:1008,samples:S?4:0})),M.getDrawingBufferSize(Ut),S?wt.setSize(Ut.x,Ut.y):wt.setSize(as(Ut.x),as(Ut.y));const A=M.getRenderTarget();M.setRenderTarget(wt),M.getClearColor(tt),N=M.getClearAlpha(),N<1&&M.setClearColor(16777215,.5),M.clear();const P=M.toneMapping;M.toneMapping=0,mn(R,Z,g),w.updateMultisampleRenderTarget(wt),w.updateRenderTargetMipmap(wt);let O=!1;for(let H=0,z=W.length;H<z;H++){const Y=W[H],K=Y.object,ut=Y.geometry,ot=Y.material,ht=Y.group;if(ot.side===2&&K.layers.test(g.layers)){const Rt=ot.side;ot.side=1,ot.needsUpdate=!0,Xn(K,Z,g,ut,ot,ht),ot.side=Rt,ot.needsUpdate=!0,O=!0}}O===!0&&(w.updateMultisampleRenderTarget(wt),w.updateRenderTargetMipmap(wt)),M.setRenderTarget(A),M.setClearColor(tt,N),M.toneMapping=P}function mn(R,W,Z){const g=W.isScene===!0?W.overrideMaterial:null;for(let _=0,S=R.length;_<S;_++){const A=R[_],P=A.object,O=A.geometry,H=g===null?A.material:g,z=A.group;P.layers.test(Z.layers)&&Xn(P,W,Z,O,H,z)}}function Xn(R,W,Z,g,_,S){R.onBeforeRender(M,W,Z,g,_,S),R.modelViewMatrix.multiplyMatrices(Z.matrixWorldInverse,R.matrixWorld),R.normalMatrix.getNormalMatrix(R.modelViewMatrix),_.onBeforeRender(M,W,Z,g,R,S),_.transparent===!0&&_.side===2&&_.forceSinglePass===!1?(_.side=1,_.needsUpdate=!0,M.renderBufferDirect(Z,W,g,_,R,S),_.side=0,_.needsUpdate=!0,M.renderBufferDirect(Z,W,g,_,R,S),_.side=2):M.renderBufferDirect(Z,W,g,_,R,S),R.onAfterRender(M,W,Z,g,_,S)}function qn(R,W,Z){W.isScene!==!0&&(W=Nt);const g=St.get(R),_=p.state.lights,S=p.state.shadowsArray,A=_.state.version,P=Dt.getParameters(R,_.state,S,W,Z),O=Dt.getProgramCacheKey(P);let H=g.programs;g.environment=R.isMeshStandardMaterial?W.environment:null,g.fog=W.fog,g.envMap=(R.isMeshStandardMaterial?k:y).get(R.envMap||g.environment),H===void 0&&(R.addEventListener("dispose",bt),H=new Map,g.programs=H);let z=H.get(O);if(z!==void 0){if(g.currentProgram===z&&g.lightsStateVersion===A)return Yn(R,P),z}else P.uniforms=Dt.getUniforms(R),R.onBuild(Z,P,M),R.onBeforeCompile(P,M),z=Dt.acquireProgram(P,O),H.set(O,z),g.uniforms=P.uniforms;const Y=g.uniforms;return(!R.isShaderMaterial&&!R.isRawShaderMaterial||R.clipping===!0)&&(Y.clippingPlanes=Jt.uniform),Yn(R,P),g.needsLights=Si(R),g.lightsStateVersion=A,g.needsLights&&(Y.ambientLightColor.value=_.state.ambient,Y.lightProbe.value=_.state.probe,Y.directionalLights.value=_.state.directional,Y.directionalLightShadows.value=_.state.directionalShadow,Y.spotLights.value=_.state.spot,Y.spotLightShadows.value=_.state.spotShadow,Y.rectAreaLights.value=_.state.rectArea,Y.ltc_1.value=_.state.rectAreaLTC1,Y.ltc_2.value=_.state.rectAreaLTC2,Y.pointLights.value=_.state.point,Y.pointLightShadows.value=_.state.pointShadow,Y.hemisphereLights.value=_.state.hemi,Y.directionalShadowMap.value=_.state.directionalShadowMap,Y.directionalShadowMatrix.value=_.state.directionalShadowMatrix,Y.spotShadowMap.value=_.state.spotShadowMap,Y.spotLightMatrix.value=_.state.spotLightMatrix,Y.spotLightMap.value=_.state.spotLightMap,Y.pointShadowMap.value=_.state.pointShadowMap,Y.pointShadowMatrix.value=_.state.pointShadowMatrix),g.currentProgram=z,g.uniformsList=null,z}function Mi(R){if(R.uniformsList===null){const W=R.currentProgram.getUniforms();R.uniformsList=mr.seqWithValue(W.seq,R.uniforms)}return R.uniformsList}function Yn(R,W){const Z=St.get(R);Z.outputColorSpace=W.outputColorSpace,Z.batching=W.batching,Z.instancing=W.instancing,Z.instancingColor=W.instancingColor,Z.skinning=W.skinning,Z.morphTargets=W.morphTargets,Z.morphNormals=W.morphNormals,Z.morphColors=W.morphColors,Z.morphTargetsCount=W.morphTargetsCount,Z.numClippingPlanes=W.numClippingPlanes,Z.numIntersection=W.numClipIntersection,Z.vertexAlphas=W.vertexAlphas,Z.vertexTangents=W.vertexTangents,Z.toneMapping=W.toneMapping}function Zn(R,W,Z,g,_){W.isScene!==!0&&(W=Nt),w.resetTextureUnits();const S=W.fog,A=g.isMeshStandardMaterial?W.environment:null,P=D===null?M.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:En,O=(g.isMeshStandardMaterial?k:y).get(g.envMap||A),H=g.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,z=!!Z.attributes.tangent&&(!!g.normalMap||g.anisotropy>0),Y=!!Z.morphAttributes.position,K=!!Z.morphAttributes.normal,ut=!!Z.morphAttributes.color;let ot=0;g.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(ot=M.toneMapping);const ht=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,Rt=ht!==void 0?ht.length:0,At=St.get(g),ne=p.state.lights;if(at===!0&&(_t===!0||R!==T)){const Ue=R===T&&g.id===q;Jt.setState(g,R,Ue)}let Yt=!1;g.version===At.__version?(At.needsLights&&At.lightsStateVersion!==ne.state.version||At.outputColorSpace!==P||_.isBatchedMesh&&At.batching===!1||!_.isBatchedMesh&&At.batching===!0||_.isInstancedMesh&&At.instancing===!1||!_.isInstancedMesh&&At.instancing===!0||_.isSkinnedMesh&&At.skinning===!1||!_.isSkinnedMesh&&At.skinning===!0||_.isInstancedMesh&&At.instancingColor===!0&&_.instanceColor===null||_.isInstancedMesh&&At.instancingColor===!1&&_.instanceColor!==null||At.envMap!==O||g.fog===!0&&At.fog!==S||At.numClippingPlanes!==void 0&&(At.numClippingPlanes!==Jt.numPlanes||At.numIntersection!==Jt.numIntersection)||At.vertexAlphas!==H||At.vertexTangents!==z||At.morphTargets!==Y||At.morphNormals!==K||At.morphColors!==ut||At.toneMapping!==ot||mt.isWebGL2===!0&&At.morphTargetsCount!==Rt)&&(Yt=!0):(Yt=!0,At.__version=g.version);let le=At.currentProgram;Yt===!0&&(le=qn(g,W,_));let Be=!1,Ve=!1,gn=!1;const de=le.getUniforms(),ze=At.uniforms;if(Q.useProgram(le.program)&&(Be=!0,Ve=!0,gn=!0),g.id!==q&&(q=g.id,Ve=!0),Be||T!==R){de.setValue(I,"projectionMatrix",R.projectionMatrix),de.setValue(I,"viewMatrix",R.matrixWorldInverse);const Ue=de.map.cameraPosition;Ue!==void 0&&Ue.setValue(I,Zt.setFromMatrixPosition(R.matrixWorld)),mt.logarithmicDepthBuffer&&de.setValue(I,"logDepthBufFC",2/(Math.log(R.far+1)/Math.LN2)),(g.isMeshPhongMaterial||g.isMeshToonMaterial||g.isMeshLambertMaterial||g.isMeshBasicMaterial||g.isMeshStandardMaterial||g.isShaderMaterial)&&de.setValue(I,"isOrthographic",R.isOrthographicCamera===!0),T!==R&&(T=R,Ve=!0,gn=!0)}if(_.isSkinnedMesh){de.setOptional(I,_,"bindMatrix"),de.setOptional(I,_,"bindMatrixInverse");const Ue=_.skeleton;Ue&&(mt.floatVertexTextures?(Ue.boneTexture===null&&Ue.computeBoneTexture(),de.setValue(I,"boneTexture",Ue.boneTexture,w)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}_.isBatchedMesh&&(de.setOptional(I,_,"batchingTexture"),de.setValue(I,"batchingTexture",_._matricesTexture,w));const je=Z.morphAttributes;if((je.position!==void 0||je.normal!==void 0||je.color!==void 0&&mt.isWebGL2===!0)&&Qt.update(_,Z,le),(Ve||At.receiveShadow!==_.receiveShadow)&&(At.receiveShadow=_.receiveShadow,de.setValue(I,"receiveShadow",_.receiveShadow)),g.isMeshGouraudMaterial&&g.envMap!==null&&(ze.envMap.value=O,ze.flipEnvMap.value=O.isCubeTexture&&O.isRenderTargetTexture===!1?-1:1),Ve&&(de.setValue(I,"toneMappingExposure",M.toneMappingExposure),At.needsLights&&Gi(ze,gn),S&&g.fog===!0&&yt.refreshFogUniforms(ze,S),yt.refreshMaterialUniforms(ze,g,et,J,wt),mr.upload(I,Mi(At),ze,w)),g.isShaderMaterial&&g.uniformsNeedUpdate===!0&&(mr.upload(I,Mi(At),ze,w),g.uniformsNeedUpdate=!1),g.isSpriteMaterial&&de.setValue(I,"center",_.center),de.setValue(I,"modelViewMatrix",_.modelViewMatrix),de.setValue(I,"normalMatrix",_.normalMatrix),de.setValue(I,"modelMatrix",_.matrixWorld),g.isShaderMaterial||g.isRawShaderMaterial){const Ue=g.uniformsGroups;for(let Ln=0,Hi=Ue.length;Ln<Hi;Ln++)if(mt.isWebGL2){const _n=Ue[Ln];Bt.update(_n,le),Bt.bind(_n,le)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return le}function Gi(R,W){R.ambientLightColor.needsUpdate=W,R.lightProbe.needsUpdate=W,R.directionalLights.needsUpdate=W,R.directionalLightShadows.needsUpdate=W,R.pointLights.needsUpdate=W,R.pointLightShadows.needsUpdate=W,R.spotLights.needsUpdate=W,R.spotLightShadows.needsUpdate=W,R.rectAreaLights.needsUpdate=W,R.hemisphereLights.needsUpdate=W}function Si(R){return R.isMeshLambertMaterial||R.isMeshToonMaterial||R.isMeshPhongMaterial||R.isMeshStandardMaterial||R.isShadowMaterial||R.isShaderMaterial&&R.lights===!0}this.getActiveCubeFace=function(){return U},this.getActiveMipmapLevel=function(){return L},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(R,W,Z){St.get(R.texture).__webglTexture=W,St.get(R.depthTexture).__webglTexture=Z;const g=St.get(R);g.__hasExternalTextures=!0,g.__hasExternalTextures&&(g.__autoAllocateDepthBuffer=Z===void 0,g.__autoAllocateDepthBuffer||nt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),g.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(R,W){const Z=St.get(R);Z.__webglFramebuffer=W,Z.__useDefaultFramebuffer=W===void 0},this.setRenderTarget=function(R,W=0,Z=0){D=R,U=W,L=Z;let g=!0,_=null,S=!1,A=!1;if(R){const O=St.get(R);O.__useDefaultFramebuffer!==void 0?(Q.bindFramebuffer(I.FRAMEBUFFER,null),g=!1):O.__webglFramebuffer===void 0?w.setupRenderTarget(R):O.__hasExternalTextures&&w.rebindTextures(R,St.get(R.texture).__webglTexture,St.get(R.depthTexture).__webglTexture);const H=R.texture;(H.isData3DTexture||H.isDataArrayTexture||H.isCompressedArrayTexture)&&(A=!0);const z=St.get(R).__webglFramebuffer;R.isWebGLCubeRenderTarget?(Array.isArray(z[W])?_=z[W][Z]:_=z[W],S=!0):mt.isWebGL2&&R.samples>0&&w.useMultisampledRTT(R)===!1?_=St.get(R).__webglMultisampledFramebuffer:Array.isArray(z)?_=z[Z]:_=z,C.copy(R.viewport),G.copy(R.scissor),j=R.scissorTest}else C.copy(rt).multiplyScalar(et).floor(),G.copy(lt).multiplyScalar(et).floor(),j=st;if(Q.bindFramebuffer(I.FRAMEBUFFER,_)&&mt.drawBuffers&&g&&Q.drawBuffers(R,_),Q.viewport(C),Q.scissor(G),Q.setScissorTest(j),S){const O=St.get(R.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+W,O.__webglTexture,Z)}else if(A){const O=St.get(R.texture),H=W||0;I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,O.__webglTexture,Z||0,H)}q=-1},this.readRenderTargetPixels=function(R,W,Z,g,_,S,A){if(!(R&&R.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let P=St.get(R).__webglFramebuffer;if(R.isWebGLCubeRenderTarget&&A!==void 0&&(P=P[A]),P){Q.bindFramebuffer(I.FRAMEBUFFER,P);try{const O=R.texture,H=O.format,z=O.type;if(H!==1023&&Ct.convert(H)!==I.getParameter(I.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}const Y=z===1016&&(nt.has("EXT_color_buffer_half_float")||mt.isWebGL2&&nt.has("EXT_color_buffer_float"));if(z!==1009&&Ct.convert(z)!==I.getParameter(I.IMPLEMENTATION_COLOR_READ_TYPE)&&!(z===1015&&(mt.isWebGL2||nt.has("OES_texture_float")||nt.has("WEBGL_color_buffer_float")))&&!Y){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}W>=0&&W<=R.width-g&&Z>=0&&Z<=R.height-_&&I.readPixels(W,Z,g,_,Ct.convert(H),Ct.convert(z),S)}finally{const O=D!==null?St.get(D).__webglFramebuffer:null;Q.bindFramebuffer(I.FRAMEBUFFER,O)}}},this.copyFramebufferToTexture=function(R,W,Z=0){const g=Math.pow(2,-Z),_=Math.floor(W.image.width*g),S=Math.floor(W.image.height*g);w.setTexture2D(W,0),I.copyTexSubImage2D(I.TEXTURE_2D,Z,0,0,R.x,R.y,_,S),Q.unbindTexture()},this.copyTextureToTexture=function(R,W,Z,g=0){const _=W.image.width,S=W.image.height,A=Ct.convert(Z.format),P=Ct.convert(Z.type);w.setTexture2D(Z,0),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,Z.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Z.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,Z.unpackAlignment),W.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,g,R.x,R.y,_,S,A,P,W.image.data):W.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,g,R.x,R.y,W.mipmaps[0].width,W.mipmaps[0].height,A,W.mipmaps[0].data):I.texSubImage2D(I.TEXTURE_2D,g,R.x,R.y,A,P,W.image),g===0&&Z.generateMipmaps&&I.generateMipmap(I.TEXTURE_2D),Q.unbindTexture()},this.copyTextureToTexture3D=function(R,W,Z,g,_=0){if(M.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}const S=R.max.x-R.min.x+1,A=R.max.y-R.min.y+1,P=R.max.z-R.min.z+1,O=Ct.convert(g.format),H=Ct.convert(g.type);let z;if(g.isData3DTexture)w.setTexture3D(g,0),z=I.TEXTURE_3D;else if(g.isDataArrayTexture||g.isCompressedArrayTexture)w.setTexture2DArray(g,0),z=I.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,g.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,g.unpackAlignment);const Y=I.getParameter(I.UNPACK_ROW_LENGTH),K=I.getParameter(I.UNPACK_IMAGE_HEIGHT),ut=I.getParameter(I.UNPACK_SKIP_PIXELS),ot=I.getParameter(I.UNPACK_SKIP_ROWS),ht=I.getParameter(I.UNPACK_SKIP_IMAGES),Rt=Z.isCompressedTexture?Z.mipmaps[_]:Z.image;I.pixelStorei(I.UNPACK_ROW_LENGTH,Rt.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,Rt.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,R.min.x),I.pixelStorei(I.UNPACK_SKIP_ROWS,R.min.y),I.pixelStorei(I.UNPACK_SKIP_IMAGES,R.min.z),Z.isDataTexture||Z.isData3DTexture?I.texSubImage3D(z,_,W.x,W.y,W.z,S,A,P,O,H,Rt.data):Z.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),I.compressedTexSubImage3D(z,_,W.x,W.y,W.z,S,A,P,O,Rt.data)):I.texSubImage3D(z,_,W.x,W.y,W.z,S,A,P,O,H,Rt),I.pixelStorei(I.UNPACK_ROW_LENGTH,Y),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,K),I.pixelStorei(I.UNPACK_SKIP_PIXELS,ut),I.pixelStorei(I.UNPACK_SKIP_ROWS,ot),I.pixelStorei(I.UNPACK_SKIP_IMAGES,ht),_===0&&g.generateMipmaps&&I.generateMipmap(z),Q.unbindTexture()},this.initTexture=function(R){R.isCubeTexture?w.setTextureCube(R,0):R.isData3DTexture?w.setTexture3D(R,0):R.isDataArrayTexture||R.isCompressedArrayTexture?w.setTexture2DArray(R,0):w.setTexture2D(R,0),Q.unbindTexture()},this.resetState=function(){U=0,L=0,D=null,Q.reset(),Ot.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return 2e3}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===ms?"display-p3":"srgb",e.unpackColorSpace=ae.workingColorSpace===Sr?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===ye?3001:3e3}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===3001?ye:En}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}}class ff extends Ho{}ff.prototype.isWebGL1Renderer=!0;class Mr{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new Vt(t),this.near=e,this.far=n}clone(){return new Mr(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class df extends De{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}}class Qr extends qe{constructor(t,e,n,r,s,a,o,c,l){super(t,e,n,r,s,a,o,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class pn{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,r=this.getPoint(0),s=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),s+=n.distanceTo(r),e.push(s),r=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let r=0;const s=n.length;let a;e?a=e:a=t*n[s-1];let o=0,c=s-1,l;for(;o<=c;)if(r=Math.floor(o+(c-o)/2),l=n[r]-a,l<0)o=r+1;else if(l>0)c=r-1;else{c=r;break}if(r=c,n[r]===a)return r/(s-1);const u=n[r],h=n[r+1]-u,m=(a-u)/h;return(r+m)/(s-1)}getTangent(t,e){let r=t-1e-4,s=t+1e-4;r<0&&(r=0),s>1&&(s=1);const a=this.getPoint(r),o=this.getPoint(s),c=e||(a.isVector2?new gt:new F);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new F,r=[],s=[],a=[],o=new F,c=new xe;for(let m=0;m<=t;m++){const v=m/t;r[m]=this.getTangentAt(v,new F)}s[0]=new F,a[0]=new F;let l=Number.MAX_VALUE;const u=Math.abs(r[0].x),f=Math.abs(r[0].y),h=Math.abs(r[0].z);u<=l&&(l=u,n.set(1,0,0)),f<=l&&(l=f,n.set(0,1,0)),h<=l&&n.set(0,0,1),o.crossVectors(r[0],n).normalize(),s[0].crossVectors(r[0],o),a[0].crossVectors(r[0],s[0]);for(let m=1;m<=t;m++){if(s[m]=s[m-1].clone(),a[m]=a[m-1].clone(),o.crossVectors(r[m-1],r[m]),o.length()>Number.EPSILON){o.normalize();const v=Math.acos(Le(r[m-1].dot(r[m]),-1,1));s[m].applyMatrix4(c.makeRotationAxis(o,v))}a[m].crossVectors(r[m],s[m])}if(e===!0){let m=Math.acos(Le(s[0].dot(s[t]),-1,1));m/=t,r[0].dot(o.crossVectors(s[0],s[t]))>0&&(m=-m);for(let v=1;v<=t;v++)s[v].applyMatrix4(c.makeRotationAxis(r[v],m*v)),a[v].crossVectors(r[v],s[v])}return{tangents:r,normals:s,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Ss extends pn{constructor(t=0,e=0,n=1,r=1,s=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=r,this.aStartAngle=s,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e){const n=e||new gt,r=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const a=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=r;for(;s>r;)s-=r;s<Number.EPSILON&&(a?s=0:s=r),this.aClockwise===!0&&!a&&(s===r?s=-r:s=s-r);const o=this.aStartAngle+t*s;let c=this.aX+this.xRadius*Math.cos(o),l=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),h=c-this.aX,m=l-this.aY;c=h*u-m*f+this.aX,l=h*f+m*u+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class pf extends Ss{constructor(t,e,n,r,s,a){super(t,e,n,n,r,s,a),this.isArcCurve=!0,this.type="ArcCurve"}}function ys(){let i=0,t=0,e=0,n=0;function r(s,a,o,c){i=s,t=o,e=-3*s+3*a-2*o-c,n=2*s-2*a+o+c}return{initCatmullRom:function(s,a,o,c,l){r(a,o,l*(o-s),l*(c-a))},initNonuniformCatmullRom:function(s,a,o,c,l,u,f){let h=(a-s)/l-(o-s)/(l+u)+(o-a)/u,m=(o-a)/u-(c-a)/(u+f)+(c-o)/f;h*=u,m*=u,r(a,o,h,m)},calc:function(s){const a=s*s,o=a*s;return i+t*s+e*a+n*o}}}const fr=new F,ts=new ys,es=new ys,ns=new ys;class ls extends pn{constructor(t=[],e=!1,n="centripetal",r=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=r}getPoint(t,e=new F){const n=e,r=this.points,s=r.length,a=(s-(this.closed?0:1))*t;let o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/s)+1)*s:c===0&&o===s-1&&(o=s-2,c=1);let l,u;this.closed||o>0?l=r[(o-1)%s]:(fr.subVectors(r[0],r[1]).add(r[0]),l=fr);const f=r[o%s],h=r[(o+1)%s];if(this.closed||o+2<s?u=r[(o+2)%s]:(fr.subVectors(r[s-1],r[s-2]).add(r[s-1]),u=fr),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let v=Math.pow(l.distanceToSquared(f),m),x=Math.pow(f.distanceToSquared(h),m),p=Math.pow(h.distanceToSquared(u),m);x<1e-4&&(x=1),v<1e-4&&(v=x),p<1e-4&&(p=x),ts.initNonuniformCatmullRom(l.x,f.x,h.x,u.x,v,x,p),es.initNonuniformCatmullRom(l.y,f.y,h.y,u.y,v,x,p),ns.initNonuniformCatmullRom(l.z,f.z,h.z,u.z,v,x,p)}else this.curveType==="catmullrom"&&(ts.initCatmullRom(l.x,f.x,h.x,u.x,this.tension),es.initCatmullRom(l.y,f.y,h.y,u.y,this.tension),ns.initCatmullRom(l.z,f.z,h.z,u.z,this.tension));return n.set(ts.calc(c),es.calc(c),ns.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new F().fromArray(r))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function go(i,t,e,n,r){const s=(n-t)*.5,a=(r-e)*.5,o=i*i,c=i*o;return(2*e-2*n+s+a)*c+(-3*e+3*n-2*s-a)*o+s*i+e}function mf(i,t){const e=1-i;return e*e*t}function gf(i,t){return 2*(1-i)*i*t}function _f(i,t){return i*i*t}function Li(i,t,e,n){return mf(i,t)+gf(i,e)+_f(i,n)}function vf(i,t){const e=1-i;return e*e*e*t}function xf(i,t){const e=1-i;return 3*e*e*i*t}function Mf(i,t){return 3*(1-i)*i*i*t}function Sf(i,t){return i*i*i*t}function Di(i,t,e,n,r){return vf(i,t)+xf(i,e)+Mf(i,n)+Sf(i,r)}class Vo extends pn{constructor(t=new gt,e=new gt,n=new gt,r=new gt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new gt){const n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Di(t,r.x,s.x,a.x,o.x),Di(t,r.y,s.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class yf extends pn{constructor(t=new F,e=new F,n=new F,r=new F){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=r}getPoint(t,e=new F){const n=e,r=this.v0,s=this.v1,a=this.v2,o=this.v3;return n.set(Di(t,r.x,s.x,a.x,o.x),Di(t,r.y,s.y,a.y,o.y),Di(t,r.z,s.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class ko extends pn{constructor(t=new gt,e=new gt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new gt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new gt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Ef extends pn{constructor(t=new F,e=new F){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new F){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new F){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Wo extends pn{constructor(t=new gt,e=new gt,n=new gt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new gt){const n=e,r=this.v0,s=this.v1,a=this.v2;return n.set(Li(t,r.x,s.x,a.x),Li(t,r.y,s.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Tf extends pn{constructor(t=new F,e=new F,n=new F){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new F){const n=e,r=this.v0,s=this.v1,a=this.v2;return n.set(Li(t,r.x,s.x,a.x),Li(t,r.y,s.y,a.y),Li(t,r.z,s.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Xo extends pn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new gt){const n=e,r=this.points,s=(r.length-1)*t,a=Math.floor(s),o=s-a,c=r[a===0?a:a-1],l=r[a],u=r[a>r.length-2?r.length-1:a+1],f=r[a>r.length-3?r.length-1:a+2];return n.set(go(o,c.x,l.x,u.x,f.x),go(o,c.y,l.y,u.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const r=this.points[e];t.points.push(r.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const r=t.points[e];this.points.push(new gt().fromArray(r))}return this}}var us=Object.freeze({__proto__:null,ArcCurve:pf,CatmullRomCurve3:ls,CubicBezierCurve:Vo,CubicBezierCurve3:yf,EllipseCurve:Ss,LineCurve:ko,LineCurve3:Ef,QuadraticBezierCurve:Wo,QuadraticBezierCurve3:Tf,SplineCurve:Xo});class bf extends pn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new us[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),r=this.getCurveLengths();let s=0;for(;s<r.length;){if(r[s]>=n){const a=r[s]-n,o=this.curves[s],c=o.getLength(),l=c===0?0:1-a/c;return o.getPointAt(l,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,r=this.curves.length;n<r;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let r=0,s=this.curves;r<s.length;r++){const a=s[r],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let l=0;l<c.length;l++){const u=c[l];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(r.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const r=this.curves[e];t.curves.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const r=t.curves[e];this.curves.push(new us[r.type]().fromJSON(r))}return this}}class hs extends bf{constructor(t){super(),this.type="Path",this.currentPoint=new gt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new ko(this.currentPoint.clone(),new gt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,r){const s=new Wo(this.currentPoint.clone(),new gt(t,e),new gt(n,r));return this.curves.push(s),this.currentPoint.set(n,r),this}bezierCurveTo(t,e,n,r,s,a){const o=new Vo(this.currentPoint.clone(),new gt(t,e),new gt(n,r),new gt(s,a));return this.curves.push(o),this.currentPoint.set(s,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Xo(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,r,s,a){const o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,r,s,a),this}absarc(t,e,n,r,s,a){return this.absellipse(t,e,n,n,r,s,a),this}ellipse(t,e,n,r,s,a,o,c){const l=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+l,e+u,n,r,s,a,o,c),this}absellipse(t,e,n,r,s,a,o,c){const l=new Ss(t,e,n,r,s,a,o,c);if(this.curves.length>0){const f=l.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(l);const u=l.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class Es extends he{constructor(t=[new gt(0,-.5),new gt(.5,0),new gt(0,.5)],e=12,n=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:r},e=Math.floor(e),r=Le(r,0,Math.PI*2);const s=[],a=[],o=[],c=[],l=[],u=1/e,f=new F,h=new gt,m=new F,v=new F,x=new F;let p=0,d=0;for(let E=0;E<=t.length-1;E++)switch(E){case 0:p=t[E+1].x-t[E].x,d=t[E+1].y-t[E].y,m.x=d*1,m.y=-p,m.z=d*0,x.copy(m),m.normalize(),c.push(m.x,m.y,m.z);break;case t.length-1:c.push(x.x,x.y,x.z);break;default:p=t[E+1].x-t[E].x,d=t[E+1].y-t[E].y,m.x=d*1,m.y=-p,m.z=d*0,v.copy(m),m.x+=x.x,m.y+=x.y,m.z+=x.z,m.normalize(),c.push(m.x,m.y,m.z),x.copy(v)}for(let E=0;E<=e;E++){const M=n+E*u*r,b=Math.sin(M),U=Math.cos(M);for(let L=0;L<=t.length-1;L++){f.x=t[L].x*b,f.y=t[L].y,f.z=t[L].x*U,a.push(f.x,f.y,f.z),h.x=E/e,h.y=L/(t.length-1),o.push(h.x,h.y);const D=c[3*L+0]*b,q=c[3*L+1],T=c[3*L+0]*U;l.push(D,q,T)}}for(let E=0;E<e;E++)for(let M=0;M<t.length-1;M++){const b=M+E*t.length,U=b,L=b+t.length,D=b+t.length+1,q=b+1;s.push(U,L,q),s.push(D,q,L)}this.setIndex(s),this.setAttribute("position",new ie(a,3)),this.setAttribute("uv",new ie(o,2)),this.setAttribute("normal",new ie(l,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Es(t.points,t.segments,t.phiStart,t.phiLength)}}class Ts extends Es{constructor(t=1,e=1,n=4,r=8){const s=new hs;s.absarc(0,-e/2,t,Math.PI*1.5,0),s.absarc(0,e/2,t,0,Math.PI*.5),super(s.getPoints(n),r),this.type="CapsuleGeometry",this.parameters={radius:t,length:e,capSegments:n,radialSegments:r}}static fromJSON(t){return new Ts(t.radius,t.length,t.capSegments,t.radialSegments)}}class Pe extends he{constructor(t=1,e=1,n=1,r=32,s=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:c};const l=this;r=Math.floor(r),s=Math.floor(s);const u=[],f=[],h=[],m=[];let v=0;const x=[],p=n/2;let d=0;E(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(u),this.setAttribute("position",new ie(f,3)),this.setAttribute("normal",new ie(h,3)),this.setAttribute("uv",new ie(m,2));function E(){const b=new F,U=new F;let L=0;const D=(e-t)/n;for(let q=0;q<=s;q++){const T=[],C=q/s,G=C*(e-t)+t;for(let j=0;j<=r;j++){const tt=j/r,N=tt*c+o,V=Math.sin(N),J=Math.cos(N);U.x=G*V,U.y=-C*n+p,U.z=G*J,f.push(U.x,U.y,U.z),b.set(V,D,J).normalize(),h.push(b.x,b.y,b.z),m.push(tt,1-C),T.push(v++)}x.push(T)}for(let q=0;q<r;q++)for(let T=0;T<s;T++){const C=x[T][q],G=x[T+1][q],j=x[T+1][q+1],tt=x[T][q+1];u.push(C,G,tt),u.push(G,j,tt),L+=6}l.addGroup(d,L,0),d+=L}function M(b){const U=v,L=new gt,D=new F;let q=0;const T=b===!0?t:e,C=b===!0?1:-1;for(let j=1;j<=r;j++)f.push(0,p*C,0),h.push(0,C,0),m.push(.5,.5),v++;const G=v;for(let j=0;j<=r;j++){const N=j/r*c+o,V=Math.cos(N),J=Math.sin(N);D.x=T*J,D.y=p*C,D.z=T*V,f.push(D.x,D.y,D.z),h.push(0,C,0),L.x=V*.5+.5,L.y=J*.5*C+.5,m.push(L.x,L.y),v++}for(let j=0;j<r;j++){const tt=U+j,N=G+j;b===!0?u.push(N,N+1,tt):u.push(N+1,N,tt),q+=3}l.addGroup(d,q,b===!0?1:2),d+=q}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Pe(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Xe extends Pe{constructor(t=1,e=1,n=32,r=1,s=!1,a=0,o=Math.PI*2){super(0,t,e,n,r,s,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:r,openEnded:s,thetaStart:a,thetaLength:o}}static fromJSON(t){return new Xe(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class bs extends he{constructor(t=[],e=[],n=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:r};const s=[],a=[];o(r),l(n),u(),this.setAttribute("position",new ie(s,3)),this.setAttribute("normal",new ie(s.slice(),3)),this.setAttribute("uv",new ie(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(E){const M=new F,b=new F,U=new F;for(let L=0;L<e.length;L+=3)m(e[L+0],M),m(e[L+1],b),m(e[L+2],U),c(M,b,U,E)}function c(E,M,b,U){const L=U+1,D=[];for(let q=0;q<=L;q++){D[q]=[];const T=E.clone().lerp(b,q/L),C=M.clone().lerp(b,q/L),G=L-q;for(let j=0;j<=G;j++)j===0&&q===L?D[q][j]=T:D[q][j]=T.clone().lerp(C,j/G)}for(let q=0;q<L;q++)for(let T=0;T<2*(L-q)-1;T++){const C=Math.floor(T/2);T%2===0?(h(D[q][C+1]),h(D[q+1][C]),h(D[q][C])):(h(D[q][C+1]),h(D[q+1][C+1]),h(D[q+1][C]))}}function l(E){const M=new F;for(let b=0;b<s.length;b+=3)M.x=s[b+0],M.y=s[b+1],M.z=s[b+2],M.normalize().multiplyScalar(E),s[b+0]=M.x,s[b+1]=M.y,s[b+2]=M.z}function u(){const E=new F;for(let M=0;M<s.length;M+=3){E.x=s[M+0],E.y=s[M+1],E.z=s[M+2];const b=p(E)/2/Math.PI+.5,U=d(E)/Math.PI+.5;a.push(b,1-U)}v(),f()}function f(){for(let E=0;E<a.length;E+=6){const M=a[E+0],b=a[E+2],U=a[E+4],L=Math.max(M,b,U),D=Math.min(M,b,U);L>.9&&D<.1&&(M<.2&&(a[E+0]+=1),b<.2&&(a[E+2]+=1),U<.2&&(a[E+4]+=1))}}function h(E){s.push(E.x,E.y,E.z)}function m(E,M){const b=E*3;M.x=t[b+0],M.y=t[b+1],M.z=t[b+2]}function v(){const E=new F,M=new F,b=new F,U=new F,L=new gt,D=new gt,q=new gt;for(let T=0,C=0;T<s.length;T+=9,C+=6){E.set(s[T+0],s[T+1],s[T+2]),M.set(s[T+3],s[T+4],s[T+5]),b.set(s[T+6],s[T+7],s[T+8]),L.set(a[C+0],a[C+1]),D.set(a[C+2],a[C+3]),q.set(a[C+4],a[C+5]),U.copy(E).add(M).add(b).divideScalar(3);const G=p(U);x(L,C+0,E,G),x(D,C+2,M,G),x(q,C+4,b,G)}}function x(E,M,b,U){U<0&&E.x===1&&(a[M]=E.x-1),b.x===0&&b.z===0&&(a[M]=U/2/Math.PI+.5)}function p(E){return Math.atan2(E.z,-E.x)}function d(E){return Math.atan2(-E.y,Math.sqrt(E.x*E.x+E.z*E.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new bs(t.vertices,t.indices,t.radius,t.details)}}class qo extends hs{constructor(t){super(t),this.uuid=vi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,r=this.holes.length;n<r;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(r.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const r=this.holes[e];t.holes.push(r.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const r=t.holes[e];this.holes.push(new hs().fromJSON(r))}return this}}const Af={triangulate:function(i,t,e=2){const n=t&&t.length,r=n?t[0]*e:i.length;let s=Yo(i,0,r,e,!0);const a=[];if(!s||s.next===s.prev)return a;let o,c,l,u,f,h,m;if(n&&(s=Lf(i,t,s,e)),i.length>80*e){o=l=i[0],c=u=i[1];for(let v=e;v<r;v+=e)f=i[v],h=i[v+1],f<o&&(o=f),h<c&&(c=h),f>l&&(l=f),h>u&&(u=h);m=Math.max(l-o,u-c),m=m!==0?32767/m:0}return Ni(s,a,e,o,c,m,0),a}};function Yo(i,t,e,n,r){let s,a;if(r===Vf(i,t,e,n)>0)for(s=t;s<e;s+=n)a=_o(s,i[s],i[s+1],a);else for(s=e-n;s>=t;s-=n)a=_o(s,i[s],i[s+1],a);return a&&br(a,a.next)&&(Fi(a),a=a.next),a}function Wn(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(br(e,e.next)||me(e.prev,e,e.next)===0)){if(Fi(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Ni(i,t,e,n,r,s,a){if(!i)return;!a&&s&&Ff(i,n,r,s);let o=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,s?Rf(i,n,r,s):wf(i)){t.push(c.i/e|0),t.push(i.i/e|0),t.push(l.i/e|0),Fi(i),i=l.next,o=l.next;continue}if(i=l,i===o){a?a===1?(i=Cf(Wn(i),t,e),Ni(i,t,e,n,r,s,2)):a===2&&Pf(i,t,e,n,r,s):Ni(Wn(i),t,e,n,r,s,1);break}}}function wf(i){const t=i.prev,e=i,n=i.next;if(me(t,e,n)>=0)return!1;const r=t.x,s=e.x,a=n.x,o=t.y,c=e.y,l=n.y,u=r<s?r<a?r:a:s<a?s:a,f=o<c?o<l?o:l:c<l?c:l,h=r>s?r>a?r:a:s>a?s:a,m=o>c?o>l?o:l:c>l?c:l;let v=n.next;for(;v!==t;){if(v.x>=u&&v.x<=h&&v.y>=f&&v.y<=m&&pi(r,o,s,c,a,l,v.x,v.y)&&me(v.prev,v,v.next)>=0)return!1;v=v.next}return!0}function Rf(i,t,e,n){const r=i.prev,s=i,a=i.next;if(me(r,s,a)>=0)return!1;const o=r.x,c=s.x,l=a.x,u=r.y,f=s.y,h=a.y,m=o<c?o<l?o:l:c<l?c:l,v=u<f?u<h?u:h:f<h?f:h,x=o>c?o>l?o:l:c>l?c:l,p=u>f?u>h?u:h:f>h?f:h,d=fs(m,v,t,e,n),E=fs(x,p,t,e,n);let M=i.prevZ,b=i.nextZ;for(;M&&M.z>=d&&b&&b.z<=E;){if(M.x>=m&&M.x<=x&&M.y>=v&&M.y<=p&&M!==r&&M!==a&&pi(o,u,c,f,l,h,M.x,M.y)&&me(M.prev,M,M.next)>=0||(M=M.prevZ,b.x>=m&&b.x<=x&&b.y>=v&&b.y<=p&&b!==r&&b!==a&&pi(o,u,c,f,l,h,b.x,b.y)&&me(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;M&&M.z>=d;){if(M.x>=m&&M.x<=x&&M.y>=v&&M.y<=p&&M!==r&&M!==a&&pi(o,u,c,f,l,h,M.x,M.y)&&me(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;b&&b.z<=E;){if(b.x>=m&&b.x<=x&&b.y>=v&&b.y<=p&&b!==r&&b!==a&&pi(o,u,c,f,l,h,b.x,b.y)&&me(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function Cf(i,t,e){let n=i;do{const r=n.prev,s=n.next.next;!br(r,s)&&Zo(r,n,n.next,s)&&Ii(r,s)&&Ii(s,r)&&(t.push(r.i/e|0),t.push(n.i/e|0),t.push(s.i/e|0),Fi(n),Fi(n.next),n=i=s),n=n.next}while(n!==i);return Wn(n)}function Pf(i,t,e,n,r,s){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&zf(a,o)){let c=Jo(a,o);a=Wn(a,a.next),c=Wn(c,c.next),Ni(a,t,e,n,r,s,0),Ni(c,t,e,n,r,s,0);return}o=o.next}a=a.next}while(a!==i)}function Lf(i,t,e,n){const r=[];let s,a,o,c,l;for(s=0,a=t.length;s<a;s++)o=t[s]*n,c=s<a-1?t[s+1]*n:i.length,l=Yo(i,o,c,n,!1),l===l.next&&(l.steiner=!0),r.push(Bf(l));for(r.sort(Df),s=0;s<r.length;s++)e=Uf(r[s],e);return e}function Df(i,t){return i.x-t.x}function Uf(i,t){const e=Nf(i,t);if(!e)return t;const n=Jo(e,i);return Wn(n,n.next),Wn(e,e.next)}function Nf(i,t){let e=t,n=-1/0,r;const s=i.x,a=i.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){const h=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(h<=s&&h>n&&(n=h,r=e.x<e.next.x?e:e.next,h===s))return r}e=e.next}while(e!==t);if(!r)return null;const o=r,c=r.x,l=r.y;let u=1/0,f;e=r;do s>=e.x&&e.x>=c&&s!==e.x&&pi(a<l?s:n,a,c,l,a<l?n:s,a,e.x,e.y)&&(f=Math.abs(a-e.y)/(s-e.x),Ii(e,i)&&(f<u||f===u&&(e.x>r.x||e.x===r.x&&If(r,e)))&&(r=e,u=f)),e=e.next;while(e!==o);return r}function If(i,t){return me(i.prev,i,t.prev)<0&&me(t.next,i,i.next)<0}function Ff(i,t,e,n){let r=i;do r.z===0&&(r.z=fs(r.x,r.y,t,e,n)),r.prevZ=r.prev,r.nextZ=r.next,r=r.next;while(r!==i);r.prevZ.nextZ=null,r.prevZ=null,Of(r)}function Of(i){let t,e,n,r,s,a,o,c,l=1;do{for(e=i,i=null,s=null,a=0;e;){for(a++,n=e,o=0,t=0;t<l&&(o++,n=n.nextZ,!!n);t++);for(c=l;o>0||c>0&&n;)o!==0&&(c===0||!n||e.z<=n.z)?(r=e,e=e.nextZ,o--):(r=n,n=n.nextZ,c--),s?s.nextZ=r:i=r,r.prevZ=s,s=r;e=n}s.nextZ=null,l*=2}while(a>1);return i}function fs(i,t,e,n,r){return i=(i-e)*r|0,t=(t-n)*r|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Bf(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function pi(i,t,e,n,r,s,a,o){return(r-a)*(t-o)>=(i-a)*(s-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(s-o)>=(r-a)*(n-o)}function zf(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!Gf(i,t)&&(Ii(i,t)&&Ii(t,i)&&Hf(i,t)&&(me(i.prev,i,t.prev)||me(i,t.prev,t))||br(i,t)&&me(i.prev,i,i.next)>0&&me(t.prev,t,t.next)>0)}function me(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function br(i,t){return i.x===t.x&&i.y===t.y}function Zo(i,t,e,n){const r=pr(me(i,t,e)),s=pr(me(i,t,n)),a=pr(me(e,n,i)),o=pr(me(e,n,t));return!!(r!==s&&a!==o||r===0&&dr(i,e,t)||s===0&&dr(i,n,t)||a===0&&dr(e,i,n)||o===0&&dr(e,t,n))}function dr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function pr(i){return i>0?1:i<0?-1:0}function Gf(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Zo(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Ii(i,t){return me(i.prev,i,i.next)<0?me(i,t,i.next)>=0&&me(i,i.prev,t)>=0:me(i,t,i.prev)<0||me(i,i.next,t)<0}function Hf(i,t){let e=i,n=!1;const r=(i.x+t.x)/2,s=(i.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&r<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function Jo(i,t){const e=new ds(i.i,i.x,i.y),n=new ds(t.i,t.x,t.y),r=i.next,s=t.prev;return i.next=t,t.prev=i,e.next=r,r.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function _o(i,t,e,n){const r=new ds(i,t,e);return n?(r.next=n.next,r.prev=n,n.next.prev=r,n.next=r):(r.prev=r,r.next=r),r}function Fi(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function ds(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Vf(i,t,e,n){let r=0;for(let s=t,a=e-n;s<e;s+=n)r+=(i[a]-i[s])*(i[s+1]+i[a+1]),a=s;return r}class Ui{static area(t){const e=t.length;let n=0;for(let r=e-1,s=0;s<e;r=s++)n+=t[r].x*t[s].y-t[s].x*t[r].y;return n*.5}static isClockWise(t){return Ui.area(t)<0}static triangulateShape(t,e){const n=[],r=[],s=[];vo(t),xo(n,t);let a=t.length;e.forEach(vo);for(let c=0;c<e.length;c++)r.push(a),a+=e[c].length,xo(n,e[c]);const o=Af.triangulate(n,r);for(let c=0;c<o.length;c+=3)s.push(o.slice(c,c+3));return s}}function vo(i){const t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function xo(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}class As extends he{constructor(t=new qo([new gt(.5,.5),new gt(-.5,.5),new gt(-.5,-.5),new gt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,r=[],s=[];for(let o=0,c=t.length;o<c;o++){const l=t[o];a(l)}this.setAttribute("position",new ie(r,3)),this.setAttribute("uv",new ie(s,2)),this.computeVertexNormals();function a(o){const c=[],l=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1;let h=e.bevelEnabled!==void 0?e.bevelEnabled:!0,m=e.bevelThickness!==void 0?e.bevelThickness:.2,v=e.bevelSize!==void 0?e.bevelSize:m-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3;const d=e.extrudePath,E=e.UVGenerator!==void 0?e.UVGenerator:kf;let M,b=!1,U,L,D,q;d&&(M=d.getSpacedPoints(u),b=!0,h=!1,U=d.computeFrenetFrames(u,!1),L=new F,D=new F,q=new F),h||(p=0,m=0,v=0,x=0);const T=o.extractPoints(l);let C=T.shape;const G=T.holes;if(!Ui.isClockWise(C)){C=C.reverse();for(let I=0,vt=G.length;I<vt;I++){const nt=G[I];Ui.isClockWise(nt)&&(G[I]=nt.reverse())}}const tt=Ui.triangulateShape(C,G),N=C;for(let I=0,vt=G.length;I<vt;I++){const nt=G[I];C=C.concat(nt)}function V(I,vt,nt){return vt||console.error("THREE.ExtrudeGeometry: vec does not exist"),I.clone().addScaledVector(vt,nt)}const J=C.length,et=tt.length;function it(I,vt,nt){let mt,Q,It;const St=I.x-vt.x,w=I.y-vt.y,y=nt.x-I.x,k=nt.y-I.y,dt=St*St+w*w,ft=St*k-w*y;if(Math.abs(ft)>Number.EPSILON){const ct=Math.sqrt(dt),Dt=Math.sqrt(y*y+k*k),yt=vt.x-w/ct,Pt=vt.y+St/ct,Gt=nt.x-k/Dt,Jt=nt.y+y/Dt,pt=((Gt-yt)*k-(Jt-Pt)*y)/(St*k-w*y);mt=yt+St*pt-I.x,Q=Pt+w*pt-I.y;const re=mt*mt+Q*Q;if(re<=2)return new gt(mt,Q);It=Math.sqrt(re/2)}else{let ct=!1;St>Number.EPSILON?y>Number.EPSILON&&(ct=!0):St<-Number.EPSILON?y<-Number.EPSILON&&(ct=!0):Math.sign(w)===Math.sign(k)&&(ct=!0),ct?(mt=-w,Q=St,It=Math.sqrt(dt)):(mt=St,Q=w,It=Math.sqrt(dt/2))}return new gt(mt/It,Q/It)}const $=[];for(let I=0,vt=N.length,nt=vt-1,mt=I+1;I<vt;I++,nt++,mt++)nt===vt&&(nt=0),mt===vt&&(mt=0),$[I]=it(N[I],N[nt],N[mt]);const rt=[];let lt,st=$.concat();for(let I=0,vt=G.length;I<vt;I++){const nt=G[I];lt=[];for(let mt=0,Q=nt.length,It=Q-1,St=mt+1;mt<Q;mt++,It++,St++)It===Q&&(It=0),St===Q&&(St=0),lt[mt]=it(nt[mt],nt[It],nt[St]);rt.push(lt),st=st.concat(lt)}for(let I=0;I<p;I++){const vt=I/p,nt=m*Math.cos(vt*Math.PI/2),mt=v*Math.sin(vt*Math.PI/2)+x;for(let Q=0,It=N.length;Q<It;Q++){const St=V(N[Q],$[Q],mt);Et(St.x,St.y,-nt)}for(let Q=0,It=G.length;Q<It;Q++){const St=G[Q];lt=rt[Q];for(let w=0,y=St.length;w<y;w++){const k=V(St[w],lt[w],mt);Et(k.x,k.y,-nt)}}}const X=v+x;for(let I=0;I<J;I++){const vt=h?V(C[I],st[I],X):C[I];b?(D.copy(U.normals[0]).multiplyScalar(vt.x),L.copy(U.binormals[0]).multiplyScalar(vt.y),q.copy(M[0]).add(D).add(L),Et(q.x,q.y,q.z)):Et(vt.x,vt.y,0)}for(let I=1;I<=u;I++)for(let vt=0;vt<J;vt++){const nt=h?V(C[vt],st[vt],X):C[vt];b?(D.copy(U.normals[I]).multiplyScalar(nt.x),L.copy(U.binormals[I]).multiplyScalar(nt.y),q.copy(M[I]).add(D).add(L),Et(q.x,q.y,q.z)):Et(nt.x,nt.y,f/u*I)}for(let I=p-1;I>=0;I--){const vt=I/p,nt=m*Math.cos(vt*Math.PI/2),mt=v*Math.sin(vt*Math.PI/2)+x;for(let Q=0,It=N.length;Q<It;Q++){const St=V(N[Q],$[Q],mt);Et(St.x,St.y,f+nt)}for(let Q=0,It=G.length;Q<It;Q++){const St=G[Q];lt=rt[Q];for(let w=0,y=St.length;w<y;w++){const k=V(St[w],lt[w],mt);b?Et(k.x,k.y+M[u-1].y,M[u-1].x+nt):Et(k.x,k.y,f+nt)}}}at(),_t();function at(){const I=r.length/3;if(h){let vt=0,nt=J*vt;for(let mt=0;mt<et;mt++){const Q=tt[mt];Ut(Q[2]+nt,Q[1]+nt,Q[0]+nt)}vt=u+p*2,nt=J*vt;for(let mt=0;mt<et;mt++){const Q=tt[mt];Ut(Q[0]+nt,Q[1]+nt,Q[2]+nt)}}else{for(let vt=0;vt<et;vt++){const nt=tt[vt];Ut(nt[2],nt[1],nt[0])}for(let vt=0;vt<et;vt++){const nt=tt[vt];Ut(nt[0]+J*u,nt[1]+J*u,nt[2]+J*u)}}n.addGroup(I,r.length/3-I,0)}function _t(){const I=r.length/3;let vt=0;wt(N,vt),vt+=N.length;for(let nt=0,mt=G.length;nt<mt;nt++){const Q=G[nt];wt(Q,vt),vt+=Q.length}n.addGroup(I,r.length/3-I,1)}function wt(I,vt){let nt=I.length;for(;--nt>=0;){const mt=nt;let Q=nt-1;Q<0&&(Q=I.length-1);for(let It=0,St=u+p*2;It<St;It++){const w=J*It,y=J*(It+1),k=vt+mt+w,dt=vt+Q+w,ft=vt+Q+y,ct=vt+mt+y;Zt(k,dt,ft,ct)}}}function Et(I,vt,nt){c.push(I),c.push(vt),c.push(nt)}function Ut(I,vt,nt){Nt(I),Nt(vt),Nt(nt);const mt=r.length/3,Q=E.generateTopUV(n,r,mt-3,mt-2,mt-1);Xt(Q[0]),Xt(Q[1]),Xt(Q[2])}function Zt(I,vt,nt,mt){Nt(I),Nt(vt),Nt(mt),Nt(vt),Nt(nt),Nt(mt);const Q=r.length/3,It=E.generateSideWallUV(n,r,Q-6,Q-3,Q-2,Q-1);Xt(It[0]),Xt(It[1]),Xt(It[3]),Xt(It[1]),Xt(It[2]),Xt(It[3])}function Nt(I){r.push(c[I*3+0]),r.push(c[I*3+1]),r.push(c[I*3+2])}function Xt(I){s.push(I.x),s.push(I.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Wf(e,n,t)}static fromJSON(t,e){const n=[];for(let s=0,a=t.shapes.length;s<a;s++){const o=e[t.shapes[s]];n.push(o)}const r=t.options.extrudePath;return r!==void 0&&(t.options.extrudePath=new us[r.type]().fromJSON(r)),new As(n,t.options)}}const kf={generateTopUV:function(i,t,e,n,r){const s=t[e*3],a=t[e*3+1],o=t[n*3],c=t[n*3+1],l=t[r*3],u=t[r*3+1];return[new gt(s,a),new gt(o,c),new gt(l,u)]},generateSideWallUV:function(i,t,e,n,r,s){const a=t[e*3],o=t[e*3+1],c=t[e*3+2],l=t[n*3],u=t[n*3+1],f=t[n*3+2],h=t[r*3],m=t[r*3+1],v=t[r*3+2],x=t[s*3],p=t[s*3+1],d=t[s*3+2];return Math.abs(o-u)<Math.abs(a-l)?[new gt(a,1-c),new gt(l,1-f),new gt(h,1-v),new gt(x,1-d)]:[new gt(o,1-c),new gt(u,1-f),new gt(m,1-v),new gt(p,1-d)]}};function Wf(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,r=i.length;n<r;n++){const s=i[n];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Cn extends bs{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,r=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Cn(t.radius,t.detail)}}class ws extends he{constructor(t=1,e=32,n=16,r=0,s=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:r,phiLength:s,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(a+o,Math.PI);let l=0;const u=[],f=new F,h=new F,m=[],v=[],x=[],p=[];for(let d=0;d<=n;d++){const E=[],M=d/n;let b=0;d===0&&a===0?b=.5/e:d===n&&c===Math.PI&&(b=-.5/e);for(let U=0;U<=e;U++){const L=U/e;f.x=-t*Math.cos(r+L*s)*Math.sin(a+M*o),f.y=t*Math.cos(a+M*o),f.z=t*Math.sin(r+L*s)*Math.sin(a+M*o),v.push(f.x,f.y,f.z),h.copy(f).normalize(),x.push(h.x,h.y,h.z),p.push(L+b,1-M),E.push(l++)}u.push(E)}for(let d=0;d<n;d++)for(let E=0;E<e;E++){const M=u[d][E+1],b=u[d][E],U=u[d+1][E],L=u[d+1][E+1];(d!==0||a>0)&&m.push(M,b,L),(d!==n-1||c<Math.PI)&&m.push(b,U,L)}this.setIndex(m),this.setAttribute("position",new ie(v,3)),this.setAttribute("normal",new ie(x,3)),this.setAttribute("uv",new ie(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ws(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class Ci extends zi{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Vt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Vt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=0,this.normalScale=new gt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Ko extends De{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Vt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}class Xf extends Ko{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(De.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Vt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}}const is=new xe,Mo=new F,So=new F;class qf{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new gt(512,512),this.map=null,this.mapPass=null,this.matrix=new xe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new vs,this._frameExtents=new gt(1,1),this._viewportCount=1,this._viewports=[new Ae(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Mo.setFromMatrixPosition(t.matrixWorld),e.position.copy(Mo),So.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(So),e.updateMatrixWorld(),is.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(is),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(is)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}class Yf extends qf{constructor(){super(new xs(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class rs extends Ko{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(De.DEFAULT_UP),this.updateMatrix(),this.target=new De,this.shadow=new Yf}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"160"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="160");const Ri=36,kt=Math.PI*2,ps=i=>i*i*(3-2*i),un=i=>Math.max(0,Math.min(1,i)),ln=(i,t,e)=>i+(t-i)*e,Ge=(i,t,e,n,r)=>Math.exp(-((i-e)**2+(t-n)**2)/(r*r));function gr(i){let t=(i*9301+49297)%233280||1;return()=>(t=t*16807%2147483647,(t&268435455)/268435455)}function Zf(i){const t=(s,a)=>{const o=Math.sin(s*127.1+a*311.7+i*17.13)*43758.5453;return o-Math.floor(o)},e=(s,a)=>{const o=Math.floor(s),c=Math.floor(a),l=s-o,u=a-c,f=t(o,c),h=t(o+1,c),m=t(o,c+1),v=t(o+1,c+1),x=ps(l),p=ps(u);return f+(h-f)*x+(m-f)*p+(f-h-m+v)*x*p};return{noise:e,fbm:(s,a)=>e(s,a)*.55+e(s*2.03,a*2.03)*.27+e(s*4.1,a*4.1)*.12+e(s*8.3,a*8.3)*.06,ridged:(s,a)=>{const o=1-Math.abs(e(s,a)*2-1),c=1-Math.abs(e(s*2.1,a*2.1)*2-1);return o*o*.7+c*c*.3}}}const Hn={tuscany:{title:"Val d’Orcia, Tuscany",country:"Italy",vehicle:"city",carColor:"#2f6fd0",carColor2:"#f4f1ea",sky:["#9fc4e3","#e9e4d6"],fog:"#e3e0d4",grass:["#a7b257","#b6bb5d","#97a64f","#c3c06a"],field:["#d9b55b","#cfa64c","#e3c272"],rock:"#b99a6c",sand:"#d8c49a",snow:null,strata:["#a8714a","#93603d","#7c5034","#6a432c","#55362a"],foliage:["#6e8f3e","#7d9c45","#5f8136"],conifer:["#3f5f37","#355230","#4a6b40"],trunk:"#5a3b28",water:"#5fb7c9",amp:1.5,height(i,t,e){return(e.fbm(i*.2+3,t*.2+9)-.45)*2.6+2.2*Ge(i,t,-3.4,-3.4,2.6)+1.2*Ge(i,t,4.2,-2.8,2.2)},waterMask(i,t){return 0},river:[[-1.2,.4],[.4,1.6],[.2,3.4],[1,5.2],[1.4,8.5]],riverW:.75,pond:[-1.2,.4,1],road:{cx:.3,cz:.2,rx:4.9,rz:4.1,wob:.9,rot:.4},trees:{n:20,conifer:.45,kind:"cypress"},props:["hilltown","vineyard","cypressAvenue","haybales","farmhouse"]},dolomites:{title:"Passo Giau, Dolomites",country:"Italy",vehicle:"van",carColor:"#e4572e",carColor2:"#f4f1ea",sky:["#86b3dc","#e3ecf0"],fog:"#dfe7ec",grass:["#86ad55","#94b95d","#78a04c","#a2c066"],field:["#a9c56b"],rock:"#d6ccbd",rock2:"#b9ada0",sand:"#cfc3a8",snow:"#f6f7f9",strata:["#c9bfb1","#b3a899","#9d9284","#857b70","#6d655c"],foliage:["#5d8a45"],conifer:["#2f5a3c","#376644","#295035","#3d6f4a"],trunk:"#4a3426",water:"#46c1c9",amp:1.2,height(i,t,e){let n=(e.fbm(i*.22+1,t*.22+4)-.45)*1.8;const r=e.ridged(i*.33+7,t*.33+2),s=un((-(i+t)-1)/6);return n+=Math.pow(r,2.2)*6.8*s+5.2*Ge(i,t,-3.6,-4,1.7)*(.6+.4*r)+4*Ge(i,t,-5.6,-.6,1.4)*r+3.4*Ge(i,t,.4,-5.6,1.4)*r,n},waterMask(i,t){return un((1-Math.hypot((i-3)/1.6,(t-2.6)/1.1))*3)},river:[[3,2.6],[4.4,3.4],[5.8,4.4],[7,6.2]],riverW:.55,road:{cx:.6,cz:.6,rx:4.6,rz:3.6,wob:1.25,rot:.9,hair:6},trees:{n:46,conifer:1,kind:"pine"},props:["hut","cows"]},amalfi:{title:"Costiera Amalfitana",country:"Italy",vehicle:"roadster",carColor:"#d93a2b",carColor2:"#efe7d8",sky:["#7fb8e8","#f1e6d2"],fog:"#ece4d4",grass:["#8aa04a","#7f9744","#99ab55","#6f8b3c"],field:["#a7b45a"],rock:"#c9b394",rock2:"#ad987c",sand:"#e9dcc0",snow:null,strata:["#c7ae8c","#b39878","#9b8165","#836b54","#6b5745"],foliage:["#4f7d34","#5d8c3a","#447030"],conifer:["#3b5f33","#456b3a"],trunk:"#5a3b28",water:"#1f9bc4",amp:1,height(i,t,e){return 1.2+-(i+t)/2*.55+(e.fbm(i*.25,t*.25+5)-.45)*2.2+2.6*Ge(i,t,-3.8,-3.2,2.8)},waterMask(i,t){return un((i+t-3.2)/1.6)},road:{cx:-1,cz:-1.2,rx:4.6,rz:3.2,wob:.8,rot:.75},trees:{n:24,conifer:.25,kind:"lemon"},props:["pastelTown","boats","lighthouse","terraces"]},sardinia:{title:"Costa Smeralda, Sardinia",country:"Italy",vehicle:"tent4x4",carColor:"#f2efe6",carColor2:"#e88b1f",sky:["#79b9ea","#f2ebdc"],fog:"#ebe6d8",grass:["#8e9b52","#7e8d47","#9fa85c","#a99f62"],field:["#b8ad73"],rock:"#c9b7a4",rock2:"#b4a08c",sand:"#f1e7cf",snow:null,strata:["#c2ad97","#a9937e","#917c69","#7a6756","#645446"],foliage:["#5c7a3a","#6b8a43","#4f6b33"],conifer:["#466b3c","#3c5e35"],trunk:"#5a3b28",water:"#29c3c9",water2:"#1689b4",amp:1.1,height(i,t,e){return .2+(e.fbm(i*.24+11,t*.24+2)-.45)*2.4+1.6*Ge(i,t,-3.6,-2.6,2.6)},waterMask(i,t){return un((1.3-Math.hypot((i-3.6)/2.6,(t-2.8)/2.1))*2.4)},beach:!0,road:{cx:-1,cz:-.6,rx:4.3,rz:3.5,wob:.8,rot:.2},trees:{n:22,conifer:.15,kind:"shrub"},props:["granite","nuraghe","boats","umbrellas"]},moselle:{title:"Moselle valley",country:"Germany",vehicle:"caravan",carColor:"#5b6770",carColor2:"#f4f1ea",sky:["#9bbbd9","#e6e6de"],fog:"#e2e3dc",grass:["#7fa24b","#8cad52","#729645","#97b35c"],field:["#9db75c"],rock:"#8f8a80",rock2:"#7a756c",sand:"#cbbd9c",snow:null,strata:["#7a6f66","#6a605a","#5b524d","#4d4541","#3f3936"],foliage:["#5b8a3c","#6a9944","#4e7a34"],conifer:["#36593a","#2f5034"],trunk:"#4e3626",water:"#4f9fb6",amp:1,height(i,t,e){const n=Math.abs(this._rd(i,t));return .2+Math.min(n,4.2)*.6+(e.fbm(i*.25+5,t*.25+1)-.45)*1.4+1.6*Ge(i,t,3.6,-3.2,1.6)},_rd(i,t){return i-t*.15+.6*Math.sin(t*.5)},waterMask(i,t){return un((.95-Math.abs(this._rd(i,t)))*2.4)},road:{cx:0,cz:0,rx:4.9,rz:4,wob:.7,rot:.1,bridge:!0},trees:{n:26,conifer:.35,kind:"broadleaf"},props:["castle","vineRows","village","barge"]},fjord:{title:"Geirangerfjord",country:"Norway",vehicle:"motorhome",carColor:"#f2f0ea",carColor2:"#2e6fb0",sky:["#8fb2d2","#e1e7ea"],fog:"#dde4e8",grass:["#5f9a4c","#6aa553","#558d45","#78b05e"],field:["#7fb064"],rock:"#7d8288",rock2:"#686d73",sand:"#b9b2a2",snow:"#f5f7f9",strata:["#6c7178","#5c6168","#4e5359","#41454b","#34383d"],foliage:["#4f8a46"],conifer:["#264a35","#2c543c","#203f2d"],trunk:"#3e2c22",water:"#2c7f9c",amp:2,snowLine:5.4,height(i,t,e){const n=this._fd(i,t);return 1+Math.min(n,3.6)*.85+(e.fbm(i*.22+3,t*.22+8)-.45)*2+2.2*Ge(i,t,-4.6,-3,2)+1.6*Ge(i,t,1.4,-5.4,1.6)},_fd(i,t){const e=new gt(i,t);let n=99;for(let r=0;r<=30;r++){const s=r/30,a=ln(6.8,-.8,s)+Math.sin(s*3.4)*.9,o=ln(6.6,-.6,s)-Math.sin(s*3.4)*.9;n=Math.min(n,e.distanceTo(new gt(a,o))-(1.7-s*.7))}return Math.max(0,n)},waterMask(i,t){return un((.35-this._fd(i,t))*3)},road:{cx:-.8,cz:-.6,rx:4.6,rz:3.9,wob:.9,rot:.6,bridge:!0},trees:{n:40,conifer:.95,kind:"spruce"},props:["redHouses","ferry"]},bardenas:{title:"Bardenas Reales",country:"Spain",vehicle:"tent4x4",carColor:"#e9e4d8",carColor2:"#2f6b4a",sky:["#8fbde6","#f3e7d2"],fog:"#efe4d1",grass:["#cdb48a","#d6be93","#c3a87f","#dcc69c"],field:["#b9a274"],rock:"#d7b98d",rock2:"#c4a279",sand:"#e5d3ad",snow:null,strata:["#d9b98c","#c79f73","#e3c69b","#b88c63","#9c7452","#7f5d42"],foliage:["#8c9a5a","#7d8c50"],conifer:["#6f8048"],trunk:"#6a4a32",water:"#59b3c4",amp:1,terraces:.55,height(i,t,e){return .4+(e.fbm(i*.2+2,t*.2+13)-.4)*3+3*Ge(i,t,-3.8,-3,2.2)+2.2*Ge(i,t,3.2,-4.4,1.5)+2*Ge(i,t,-4.8,2.4,1.3)},waterMask(i,t){return 0},road:{cx:.5,cz:.5,rx:4.4,rz:3.6,wob:1,rot:1.1,dirt:!0},trees:{n:14,conifer:0,kind:"shrub"},props:["chimney","agave","mesaStripes"]},highlands:{title:"Glen Coe, Scottish Highlands",country:"Scotland",vehicle:"estate",carColor:"#2d5d46",carColor2:"#efe9dc",sky:["#9fb6c9","#e4e5e1"],fog:"#dfe1de",grass:["#8b9a52","#7c8c49","#96a25a","#a39a5a"],field:["#8d6a86","#9a7591","#7f5f7a"],rock:"#8e8a83",rock2:"#7a766f",sand:"#c3b799",snow:null,strata:["#77716a","#68625c","#5a554f","#4c4843","#3e3b37"],foliage:["#5e7d3e"],conifer:["#2f4f36","#36583c"],trunk:"#4a3426",water:"#3d7f98",amp:1.6,height(i,t,e){return .35+(e.fbm(i*.2+9,t*.2+3)-.45)*2.8+4.2*Ge(i,t,-3.6,-3.8,2.4)*(.7+.3*e.ridged(i*.4,t*.4))+2.2*Ge(i,t,2.4,-5,1.8)},waterMask(i,t){return un((1.25-Math.hypot((i-2.9)/3,(t-2.9)/2))*2.6)},road:{cx:-1.5,cz:-1.3,rx:3.9,rz:3.2,wob:.8,rot:.35},trees:{n:16,conifer:.85,kind:"pine"},props:["islandCastle","sheep","stoneWall"]}},Qf=Object.keys(Hn);function Jf(i,t={}){const e=Hn[i],n=t.seed??7,r=gr(n+i.length*31),s=(g,_)=>g+r()*(_-g),a=g=>g[Math.floor(r()*g.length)],o=Zf(n),c=[],l=new fe,u=new fe;l.add(u);const f=(g,_={})=>new Ci({color:g,flatShading:!0,roughness:.9,metalness:0,..._}),h=(g,_=!0,S=!0)=>(g.traverse(A=>{A.isMesh&&(A.castShadow=_,A.receiveShadow=S)}),g),m=7.4,v=g=>{const _=1+.13*Math.sin(g*3+n)+.08*Math.sin(g*5+1.7*n)+.05*Math.sin(g*11+.3)+.03*Math.sin(g*17);return{x:Math.cos(g)*m*_*1.1,z:Math.sin(g)*m*_*.9}},x=(g,_)=>{const S=Math.atan2(_/.9,g/1.1),A=v(S);return Math.hypot(A.x,A.z)},p=(g,_,S=0)=>Math.hypot(g,_)<x(g,_)-S,d=e.road,E=[],M=d.hair?14:10;for(let g=0;g<M;g++){const _=g/M*kt;let S=d.rx,A=d.rz;const P=1+d.wob*.18*Math.sin(_*3+n*.7)+(d.hair&&g%2?-.22:0),O=Math.cos(_)*S*P,H=Math.sin(_)*A*P,z=d.cx+O*Math.cos(d.rot)-H*Math.sin(d.rot),Y=d.cz+O*Math.sin(d.rot)+H*Math.cos(d.rot);E.push(new F(z,0,Y))}const b=new ls(E,!0,"centripetal"),U=360,L=b.getSpacedPoints(U),D=(g,_)=>{let S=1e9,A=0;for(let P=0;P<L.length;P++){const O=L[P],H=(O.x-g)**2+(O.z-_)**2;H<S&&(S=H,A=P)}return[Math.sqrt(S),A]};let q=null,T=[];e.river&&(q=new ls(e.river.map(([g,_])=>new F(g,0,_))),T=q.getSpacedPoints(90));const C=(g,_)=>{if(!q)return 99;let S=1e9;for(const A of T)S=Math.min(S,(A.x-g)**2+(A.z-_)**2);return Math.sqrt(S)},G=-.35,j=(g,_)=>{let S=e.height(g,_,o);if(e.terraces){const A=e.terraces,P=Math.floor(S/A)*A,O=(S-P)/A;S=P+A*Math.pow(O,4)}return S},tt=(g,_)=>{let S=e.waterMask(g,_);return q&&(S=Math.max(S,un((e.riverW-C(g,_))/.35))),e.pond&&(S=Math.max(S,un((e.pond[2]-Math.hypot(g-e.pond[0],_-e.pond[1]))*2))),S},N=L.map(g=>j(g.x,g.z));for(let g=0;g<40;g++)for(let _=0;_<N.length;_++){const S=N[(_-1+U+1)%(U+1)],A=N[(_+1)%(U+1)];N[_]=N[_]*.5+(S+A)*.25}{const g=U,_=.23*b.getLength()/U;for(let S=0;S<80;S++){for(let A=1;A<=g*2;A++){const P=A%g,O=(A-1)%g;N[P]=Math.min(Math.max(N[P],N[O]-_),N[O]+_)}for(let A=g*2;A>=1;A--){const P=(A-1)%g,O=A%g;N[P]=Math.min(Math.max(N[P],N[O]-_),N[O]+_)}}for(let S=0;S<25;S++)for(let A=0;A<g;A++)N[A]=N[A]*.5+(N[(A-1+g)%g]+N[(A+1)%g])*.25;N[g]=N[0]}for(let g=0;g<N.length;g++)N[g]=Math.max(N[g],.15);const V=g=>N[g]+.02,J=(g,_)=>{let S=j(g,_);const[A,P]=D(g,_),O=N[P],H=un((A-.55)/1.5);S=O+(S-O)*ps(H),A<.6&&(S=Math.min(S,O-.02));const z=tt(g,_);return S=Math.max(S,.08),z>0&&(S=ln(S,G-.45,z)),S},et=72,it=19,$=it/et,rt=[];for(let g=0;g<=et;g++){rt.push([]);for(let _=0;_<=et;_++)rt[g].push(new F(-it/2+g*$+s(-.28,.28)*$,0,-it/2+_*$+s(-.28,.28)*$))}for(let g=0;g<=et;g++)for(let _=0;_<=et;_++){const S=rt[g][_],A=x(S.x,S.z),P=Math.hypot(S.x,S.z);if(P>A-$*.6&&P<A+$*1.1){const O=A/P;S.x*=O,S.z*=O,S.edge=!0}S.in=P<=A+.001||S.edge,S.y=S.in?J(S.x,S.z):0}const lt=e.grass.map(g=>new Vt(g)),st=e.field.map(g=>new Vt(g)),X=new Vt(e.rock),at=new Vt(e.rock2||e.rock),_t=new Vt(e.sand),wt=e.snow?new Vt(e.snow):null;new Vt(e.grass[0]).offsetHSL(0,-.05,-.05);const Et=[],Ut=[],Zt=new F,Nt=new F,Xt=new F;function I(g,_,S){if(!(g.in&&_.in&&S.in))return;Zt.subVectors(_,g),Nt.subVectors(S,g),Xt.crossVectors(Zt,Nt).normalize(),Xt.y<0&&Xt.negate();const A=(g.x+_.x+S.x)/3,P=(g.y+_.y+S.y)/3,O=(g.z+_.z+S.z)/3,H=1-Xt.y;let z=a(lt).clone();if(o.fbm(A*.32+40,O*.32+7)>.56&&(z=a(st).clone()),H>.32&&(z=(r()>.5?X:at).clone().offsetHSL(0,0,s(-.03,.03))),wt&&P>(e.snowLine||4.3)+o.noise(A,O)*.8&&H<.55&&(z=wt.clone()),P<G+.55&&(z=(e.beach?_t:_t.clone().lerp(X,.4)).clone().offsetHSL(0,0,s(-.02,.02))),e.terraces){const K=Math.floor((P+2)/e.terraces)%e.strata.length;H>.22&&(z=new Vt(e.strata[K]).offsetHSL(0,0,s(-.02,.02)))}z.offsetHSL(0,0,s(-.025,.025));for(const K of[g,_,S])Et.push(K.x,K.y,K.z),Ut.push(z.r,z.g,z.b)}for(let g=0;g<et;g++)for(let _=0;_<et;_++){const S=rt[g][_],A=rt[g+1][_],P=rt[g+1][_+1],O=rt[g][_+1];(g+_)%2?(I(S,O,A),I(A,O,P)):(I(S,O,P),I(S,P,A))}const vt=new he;vt.setAttribute("position",new ie(Et,3)),vt.setAttribute("color",new ie(Ut,3)),vt.computeVertexNormals();const nt=new Lt(vt,f("#ffffff",{vertexColors:!0,side:2}));nt.receiveShadow=!0,u.add(nt);const mt=64,Q=[0,-.7,-1.6,-2.7,-3.9,-5.1,-6.3,-7.4,-8.3],It=[1,.985,.94,.86,.74,.58,.4,.22,.08],St=Q.map((g,_)=>{const S=[];for(let A=0;A<mt;A++){const P=A/mt*kt,O=v(P),H=It[_]*(_===0?1:s(.9,1.07)),z=_===0?0:s(-.35,.35),Y=_===0?J(O.x*.995,O.z*.995):g+z+(_>1?Math.sin(P*2+1)*.6:0);S.push(new F(O.x*H+(_>3?.5:0),Math.min(Y,_===0?99:Y),O.z*H))}return S}),w=[],y=[],k=e.strata.map(g=>new Vt(g));for(let g=0;g<Q.length-1;g++)for(let _=0;_<mt;_++){const S=St[g][_],A=St[g][(_+1)%mt],P=St[g+1][(_+1)%mt],O=St[g+1][_],H=k[Math.min(k.length-1,Math.floor(g*k.length/(Q.length-1)))];for(const z of[[S,A,P],[S,P,O]]){const Y=H.clone().offsetHSL(0,0,s(-.035,.035));for(const K of z)w.push(K.x,K.y,K.z),y.push(Y.r,Y.g,Y.b)}}const dt=new F(.8,-9.6,.1),ft=St[Q.length-1];for(let g=0;g<mt;g++){const _=ft[g],S=ft[(g+1)%mt],A=k[k.length-1].clone().offsetHSL(0,0,-.04);for(const P of[_,S,dt])w.push(P.x,P.y,P.z),y.push(A.r,A.g,A.b)}const ct=new he;ct.setAttribute("position",new ie(w,3)),ct.setAttribute("color",new ie(y,3)),ct.computeVertexNormals(),u.add(h(new Lt(ct,f("#ffffff",{vertexColors:!0,side:2})),!0,!0));{const g=[],_=[];for(let A=0;A<mt;A++){const P=St[0][A],O=St[0][(A+1)%mt],H=P.clone().multiplyScalar(.992);H.y=P.y-s(.22,.42);const z=O.clone().multiplyScalar(.992);z.y=O.y-s(.22,.42);const K=(P.y<G+.2?new Vt(e.sand):new Vt(e.grass[0])).offsetHSL(0,0,-.08);for(const ut of[P,O,z,P,z,H])g.push(ut.x*1.003,ut.y+.01,ut.z*1.003),_.push(K.r,K.g,K.b)}const S=new he;S.setAttribute("position",new ie(g,3)),S.setAttribute("color",new ie(_,3)),S.computeVertexNormals(),u.add(h(new Lt(S,f("#ffffff",{vertexColors:!0,side:2})),!1,!0))}const Dt=[];for(let g=0;g<12;g++){const _=s(0,kt),S=v(_),A=s(.18,.42),P=new Lt(new Xe(A,A*s(2.5,4.5),5),f(a(e.strata)));P.rotation.x=Math.PI,P.position.set(S.x*s(.55,.85),s(-6.5,-3.5),S.z*s(.55,.85)),u.add(h(P)),Dt.push([P,Math.atan2(S.z,S.x)])}const yt=(()=>{const _=document.createElement("canvas");_.width=256,_.height=256;const S=_.getContext("2d"),A=new Vt(e.water);S.fillStyle="#"+A.getHexString(),S.fillRect(0,0,256,256);const P=gr(5);for(let H=0;H<70;H++){const z=P()*256,Y=P()*256,K=24+P()*70;S.fillStyle=`rgba(255,255,255,${.14+P()*.2})`;for(const ut of[0,-256,256])S.beginPath(),S.ellipse(Y+ut,z,K/2,1.6,0,0,kt),S.fill()}for(let H=0;H<30;H++){const z=P()*256,Y=P()*256,K=40+P()*80;S.fillStyle=`rgba(10,40,60,${.06+P()*.06})`;for(const ut of[0,-256,256])S.beginPath(),S.ellipse(Y+ut,z,K/2,2.2,0,0,kt),S.fill()}const O=new Qr(_);return O.wrapS=O.wrapT=1e3,O.magFilter=1006,O.colorSpace=ye,O})(),Pt=(()=>{const _=document.createElement("canvas");_.width=128,_.height=128;const S=_.getContext("2d"),A=new Vt(e.water).lerp(new Vt("#ffffff"),.25);S.fillStyle="#"+A.getHexString(),S.fillRect(0,0,128,128);const P=gr(11);for(let H=0;H<46;H++){const z=P()*128,Y=1+P()*3,K=20+P()*60,ut=P()*128;S.fillStyle=`rgba(255,255,255,${.25+P()*.45})`;for(const ot of[0,-128,128])S.fillRect(z,ut+ot,Y,K)}for(let H=0;H<18;H++){const z=P()*128,Y=2+P()*4,K=30+P()*50,ut=P()*128;S.fillStyle=`rgba(20,60,80,${.08+P()*.08})`;for(const ot of[0,-128,128])S.fillRect(z,ut+ot,Y,K)}const O=new Qr(_);return O.wrapS=O.wrapT=1e3,O.colorSpace=ye,O})(),Gt=(()=>{const g=document.createElement("canvas");g.width=4,g.height=128;const _=g.getContext("2d"),S=_.createLinearGradient(0,0,0,128);S.addColorStop(0,"#000"),S.addColorStop(.42,"#eee"),S.addColorStop(1,"#eee"),_.fillStyle=S,_.fillRect(0,0,4,128);const A=new Qr(g);return A.repeat.set(1,.5),A})(),Jt=[];if((()=>{for(let g=0;g<=et;g+=2)for(let _=0;_<=et;_+=2){const S=rt[g][_];if(S.in&&tt(S.x,S.z)>.5)return!0}return!1})()){const g=[],_=[],S=ot=>{g.push(ot.x,0,ot.z),_.push(ot.x*.16,-ot.z*.16)};for(let ot=0;ot<et;ot++)for(let ht=0;ht<et;ht++){const Rt=rt[ot][ht],At=rt[ot+1][ht],ne=rt[ot+1][ht+1],Yt=rt[ot][ht+1];if(Rt.in&&At.in&&ne.in&&Yt.in&&!(Math.min(Rt.y,At.y,ne.y,Yt.y)>G+.02))for(const le of[Rt,Yt,ne,Rt,ne,At])S(le)}const A=new he;A.setAttribute("position",new ie(g,3)),A.setAttribute("uv",new ie(_,2)),A.computeVertexNormals();const P=yt.clone();P.needsUpdate=!0,P.repeat.set(1,1);const O=new Ci({color:"#ffffff",map:P,roughness:.25,metalness:0,transparent:!0,opacity:.94});O.side=2;const H=new Lt(A,O);H.position.y=G,H.receiveShadow=!0,u.add(H);const z=e.river?new gt(.4,1):new gt(1,.4);c.push(ot=>{P.offset.set(z.x*ot*3,z.y*ot*3)});const Y=[];for(let ot=0;ot<160;ot++){const ht=ot/160*kt,Rt=v(ht);tt(Rt.x*.97,Rt.z*.97)>.6&&Y.push(ht)}const K=[];let ut=[];for(let ot=0;ot<Y.length;ot++)ut.length&&Y[ot]-ut[ut.length-1]>.06&&(K.push(ut),ut=[]),ut.push(Y[ot]);ut.length&&K.push(ut);for(const ot of K){const ht=(ot[0]+ot[ot.length-1])/2,Rt=Math.min(.09,(ot[ot.length-1]-ot[0])/2+.02),At=ht-Rt,ne=ht+Rt;Jt.push(ht);const Yt=Math.max(3,Math.round((ne-At)/.03)),le=10,Be=6.5,Ve=[],gn=[],de=[];for(let _e=0;_e<=Yt;_e++){const Re=ln(At,ne,_e/Yt),Me=v(Re),Ne=new gt(Me.x,Me.z).normalize();for(let Ce=0;Ce<=le;Ce++){const sn=Ce/le,on=Math.sin(sn*Math.PI*.5)*.9+sn*.35,pe=1+sn*.25,ve=Me.x*1.004,an=Me.z*1.004,$e=v((At+ne)/2),Je=ln($e.x,ve,pe),ke=ln($e.z,an,pe);Ve.push(Je+Ne.x*on,G+.02-Math.pow(sn,1.25)*Be,ke+Ne.y*on),gn.push(_e/Yt,sn*2)}}for(let _e=0;_e<Yt;_e++)for(let Re=0;Re<le;Re++){const Me=_e*(le+1)+Re,Ne=(_e+1)*(le+1)+Re;de.push(Me,Ne,Me+1,Ne,Ne+1,Me+1)}const ze=new he;ze.setAttribute("position",new ie(Ve,3)),ze.setAttribute("uv",new ie(gn,2)),ze.setIndex(de),ze.computeVertexNormals();const je=Pt.clone();je.needsUpdate=!0,je.repeat.set(Math.max(1,Math.round((ne-At)*8)),1);const Ue=Gt,Ln=new Ci({map:je,alphaMap:Ue,transparent:!0,side:2,roughness:.35,depthWrite:!1}),Hi=new Lt(ze,Ln);Hi.renderOrder=2,u.add(Hi),c.push(_e=>{je.offset.set(0,_e*18)});const _n=v((At+ne)/2),Jn=new gt(_n.x,_n.z).normalize(),Vi=new gt(-Jn.y,Jn.x),Rs=Math.hypot(v(ne).x-v(At).x,v(ne).z-v(At).z),jo=f("#ffffff",{transparent:!0,opacity:.95,roughness:1});{const _e=ot[0]-.012,Re=ot[ot.length-1]+.012;let Me=0;const Ne=80,Ce=[];for(let pe=0;pe<=Ne;pe++){const ve=v(ln(_e,Re,pe/Ne));pe&&(Me+=Math.hypot(ve.x-Ce[pe-1].x,ve.z-Ce[pe-1].z));const an=tt(ve.x*.96,ve.z*.96)>.45&&J(ve.x*.97,ve.z*.97)<G+.05;Ce.push({x:ve.x,z:ve.z,s:Me,wet:an})}{const pe=[];for(let Je=0;Je<Ne;Je++){const ke=Ce[Je],cn=Ce[Je+1];if(!ke.wet||!cn.wet)continue;const Dn=new gt(ke.x,ke.z).normalize(),Un=new gt(cn.x,cn.z).normalize(),yi=[ke.x+Dn.x*.02,G+.012,ke.z+Dn.y*.02],Ar=[ke.x-Dn.x*.2,G+.012,ke.z-Dn.y*.2],ki=[cn.x+Un.x*.02,G+.012,cn.z+Un.y*.02],Kn=[cn.x-Un.x*.2,G+.012,cn.z-Un.y*.2];pe.push(...yi,...ki,...Kn,...yi,...Kn,...Ar)}const an=new he;an.setAttribute("position",new ie(pe,3)),an.computeVertexNormals();const $e=new Lt(an,f("#ffffff",{transparent:!0,opacity:.55,roughness:1,side:2,depthWrite:!1}));$e.renderOrder=1,u.add($e)}const on=Math.max(2,Math.round(Me/.07));for(let pe=0;pe<2;pe++)for(let ve=0;ve<=on;ve++){const an=Math.min(Me,(ve+pe*.5)/on*Me);let $e=1;for(;$e<Ne&&Ce[$e].s<an;)$e++;const Je=Ce[$e-1],ke=Ce[$e];if(!Je.wet||!ke.wet)continue;const cn=(an-Je.s)/Math.max(1e-6,ke.s-Je.s),Dn=ln(Je.x,ke.x,cn),Un=ln(Je.z,ke.z,cn),yi=new gt(Dn,Un).normalize(),Ar=pe?s(.06,.08):s(.075,.1),ki=pe?.11:.02,Kn=new Lt(new Cn(Ar,1),jo);u.add(Kn);const ta=Dn-yi.x*ki,ea=Un-yi.y*ki,na=r()*kt;c.push(ia=>{const wr=1+Math.sin(ia*kt*6+na)*.15;Kn.scale.set(wr,wr*.5,wr),Kn.position.set(ta,G+.02,ea)})}}const $o=new _s({color:"#ffffff",transparent:!0,opacity:.8,depthWrite:!1});for(let _e=0;_e<14;_e++){const Re=new Lt(new Cn(s(.035,.07),0),$o.clone());Re.renderOrder=3,u.add(Re);const Me=s(-.45,.45)*Rs,Ne=_e/14,Ce=s(.5,.9),sn=s(.15,.4);c.push(on=>{const pe=(on*6+Ne)%1,ve=pe*.9;Re.position.set(_n.x+Vi.x*Me+Jn.x*(.15+Ce*ve),G+.05+sn*ve-1.6*ve*ve,_n.z+Vi.y*Me+Jn.y*(.15+Ce*ve)),Re.material.opacity=.85*(1-pe)})}const Qo=f("#ffffff",{transparent:!0,opacity:.35,roughness:1,depthWrite:!1});for(let _e=0;_e<5;_e++){const Re=new Lt(new Cn(s(.35,.55),1),Qo);u.add(Re);const Me=(_e/4-.5)*Rs*1.1,Ne=r()*kt,Ce=_n.x+Vi.x*Me+Jn.x*1.3,sn=_n.z+Vi.y*Me+Jn.y*1.3;c.push(on=>{const pe=1+Math.sin(on*kt*2+Ne)*.12;Re.scale.setScalar(pe),Re.position.set(Ce,G-Be*.82+Math.sin(on*kt+Ne)*.1,sn)})}}}for(const[g,_]of Dt)for(const S of Jt){const A=v(S),P=Math.atan2(A.z,A.x);Math.abs(Math.atan2(Math.sin(_-P),Math.cos(_-P)))<.6&&(g.visible=!1)}function re(g,_,S,A,P,O=()=>!0){const H=[],z=g.length-1,Y=[],K=[];for(let ht=0;ht<=z;ht++){const Rt=g[(ht-1+z)%z],At=g[(ht+1)%z],ne=new F().subVectors(At,Rt).setY(0).normalize(),Yt=new F(-ne.z,0,ne.x),le=_(ht)+A,Be=g[ht].clone().addScaledVector(Yt,S/2);Be.y=le;const Ve=g[ht].clone().addScaledVector(Yt,-S/2);Ve.y=le,Y.push(Be),K.push(Ve)}for(let ht=0;ht<z;ht++)if(O(ht))for(const Rt of[Y[ht],Y[ht+1],K[ht+1],Y[ht],K[ht+1],K[ht]])H.push(Rt.x,Rt.y,Rt.z);const ut=new he;ut.setAttribute("position",new ie(H,3)),ut.computeVertexNormals();const ot=new Lt(ut,f(P,{side:2,roughness:.95}));return ot.receiveShadow=!0,ot}const Qt=d.dirt?"#b8946a":"#4a4d52";if(u.add(re(L,V,.62,.03,Qt)),!d.dirt){const g=f("#f2efe7",{side:2,roughness:.9,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),_=(P,O,H)=>{const z=[],Y=U,K=(ht,Rt)=>{const At=b.getTangentAt(ht%Y/Y),ne=new F(-At.z,0,At.x),Yt=L[ht%Y];return[Yt.x+ne.x*Rt,V(ht%Y)+.034,Yt.z+ne.z*Rt]};for(let ht=0;ht<Y;ht++){if(!H(ht))continue;const Rt=K(ht,P-O/2),At=K(ht+1,P-O/2),ne=K(ht+1,P+O/2),Yt=K(ht,P+O/2);z.push(...Rt,...At,...ne,...Rt,...ne,...Yt)}const ut=new he;ut.setAttribute("position",new ie(z,3)),ut.computeVertexNormals();const ot=new Lt(ut,g);return ot.receiveShadow=!0,ot};u.add(_(.255,.03,()=>!0)),u.add(_(-.255,.03,()=>!0));const S=4,A=4;u.add(_(0,.03,P=>P%(S+A)<S))}const Wt=g=>{const _=(g%U+U)%U,S=L[_];return tt(S.x,S.z)>.3&&J(S.x,S.z)<Math.min(V(_)-.3,G+.15)};{const g=[],_=[],S=(O,H)=>{const z=b.getTangentAt(O%U/U),Y=new F(-z.z,0,z.x),K=L[O%U];return[K.x+Y.x*H,K.z+Y.z*H]};for(let O=0;O<U;O++){if(!(Wt(O)||Wt(O+1)))continue;const H=V(O%U),z=V((O+1)%U);for(const Y of[-1,1]){const[K,ut]=S(O,.4*Y),[ot,ht]=S(O+1,.4*Y);g.push(K,H,ut,ot,z,ht,ot,z+.13,ht,K,H,ut,ot,z+.13,ht,K,H+.13,ut),_.push(K,H-.03,ut,ot,z-.03,ht,ot,z-.24,ht,K,H-.03,ut,ot,z-.24,ht,K,H-.24,ut)}}for(const[O,H]of[[g,"#ece7dc"],[_,"#d6cfc0"]]){if(!O.length)continue;const z=new he;z.setAttribute("position",new ie(O,3)),z.computeVertexNormals(),u.add(h(new Lt(z,f(H,{side:2}))))}const A=[];let P=-1;for(let O=0;O<=U;O++){const H=O<U&&Wt(O);H&&P<0&&(P=O),!H&&P>=0&&(A.push([P,O-1]),P=-1)}for(const[O,H]of A){const z=H-O,Y=Math.max(1,Math.round(z/12)-1);for(let K=1;K<=Y;K++){const ut=Math.round(O+z*K/(Y+1)),ot=L[ut];if(!p(ot.x,ot.z,.9))continue;const ht=b.getTangentAt(ut/U),Rt=V(ut)-.22,At=J(ot.x,ot.z),ne=(tt(ot.x,ot.z)>.5?Math.min(G,At):At)-.25,Yt=Rt-ne;if(Yt<.35)continue;const le=new Lt(new fn(.16,Yt,.66),f("#d6cfc0"));le.position.set(ot.x,ne+Yt/2,ot.z),le.rotation.y=Math.atan2(-ht.z,ht.x),u.add(h(le));const Be=new Lt(new fn(.24,.06,.78),f("#e4ded2"));Be.position.set(ot.x,Rt-.03,ot.z),Be.rotation.y=le.rotation.y,u.add(h(Be))}}}u.add(h(re(L,V,.84,-.03,"#d6cfc0",g=>Wt(g)||Wt(g+1))));const Ft=[],Ct=(g,_,S=.6,A=.7)=>{if(!p(g,_,A)||D(g,_)[0]<.75+S*.5||tt(g,_)>.02)return!1;for(const P of Ft)if(Math.hypot(P[0]-g,P[1]-_)<P[2]+S)return!1;return!0},Ot=(g,_,S)=>Ft.push([g,_,S]),Bt=(g,_)=>J(g,_);function se(g,_,S=1,A=1,P=.15){const O=new Cn(g,S).toNonIndexed(),H=O.attributes.position,z=new Map;for(let K=0;K<H.count;K++){const ut=[H.getX(K),H.getY(K),H.getZ(K)].map(ht=>ht.toFixed(3)).join(",");z.has(ut)||z.set(ut,1+s(-P,P));const ot=z.get(ut);H.setXYZ(K,H.getX(K)*ot,H.getY(K)*ot*A,H.getZ(K)*ot)}const Y=[];for(let K=0;K<H.count;K+=3){const ut=new Vt(a(_)).offsetHSL(0,0,s(-.03,.03));for(let ot=0;ot<3;ot++)Y.push(ut.r,ut.g,ut.b)}return O.setAttribute("color",new ie(Y,3)),O.computeVertexNormals(),new Lt(O,f("#ffffff",{vertexColors:!0}))}const jt=[];function xt(g,_=.035){const S=r()*kt,A=s(-1,1),P=s(-1,1);jt.push(O=>{const H=Math.sin(O*kt*4+S)*_;g.rotation.x=H*A,g.rotation.z=H*P})}function B(g,_,S,A=1){const P=Bt(_,S),O=new fe,H=new fe;O.add(H);const z=f(e.trunk);if(g==="cypress"){const Y=new Lt(new Pe(.05*A,.07*A,.3*A,5),z);Y.position.y=.15*A,H.add(Y);const K=se(.3*A,e.conifer,1,4.2,.12);K.position.y=1.35*A,H.add(K)}else if(g==="pine"||g==="spruce"){const Y=new Lt(new Pe(.05*A,.08*A,.45*A,5),z);Y.position.y=.22*A,H.add(Y);const K=g==="spruce"?4:3;for(let ut=0;ut<K;ut++){const ot=(.55-ut*.11)*A,ht=new Lt(new Xe(ot,.75*A,7),f(a(e.conifer)));ht.position.y=(.6+ut*.38)*A,ht.rotation.y=s(0,1),H.add(ht)}}else if(g==="shrub"){const Y=se(.36*A,e.foliage,1,.7);if(Y.position.y=.2*A,H.add(Y),r()>.5){const K=se(.26*A,e.foliage,0,.8);K.position.set(.3*A,.15*A,.1),H.add(K)}}else{const Y=new Lt(new Pe(.06*A,.1*A,.7*A,5),z);Y.position.y=.35*A,H.add(Y);const K=se(.5*A,e.foliage,1,.95);K.position.y=.95*A,H.add(K);const ut=se(.34*A,e.foliage,1,1);if(ut.position.set(s(-.3,.3)*A,.8*A,s(-.3,.3)*A),H.add(ut),g==="lemon")for(let ot=0;ot<6;ot++){const ht=new Lt(new Cn(.06*A,0),f("#f2cf2e")),Rt=s(0,kt),At=s(-.4,.6);ht.position.set(Math.cos(Rt)*.48*A,.95*A+At*.4*A,Math.sin(Rt)*.48*A),H.add(ht)}}return O.position.set(_,P-.03,S),O.rotation.y=s(0,kt),xt(H,g==="cypress"?.018:.012),u.add(h(O)),O}const Tt={hilltown:[[-3.4,-3.4,1.9]],farmhouse:[[4.2,-2.8,1.2]],vineyard:[[4,1.6,1.5]],haybales:[[-.6,-5.2,1.3]],hut:[[3.8,-1.6,1]],cows:[[2.6,0,1.4]],pastelTown:[[1.2,1,2.4]],terraces:[[-4.8,-1.6,1.3]],nuraghe:[[-3.6,-2.6,1.2]],castle:[[3.6,-3.2,1.2]],vineRows:[[-3.2,1.6,1.6],[2.6,-2,1.5]],village:[[-3.4,-2.6,1.6]],redHouses:[[-1.2,-1,1.6]],chimney:[[-3.4,-2.8,.8],[3,-4.2,.8]]},bt=e.props.flatMap(g=>Tt[g]||[]),qt=(g,_)=>bt.some(([S,A,P])=>Math.hypot(g-S,_-A)<P);let zt=0,oe=0;for(;zt<e.trees.n&&oe++<6e3;){const g=s(-8.5,8.5),_=s(-7.5,7.5);if(!Ct(g,_,.45)||qt(g,_))continue;const S=Bt(g,_);if(e.snow&&S>3.8||o.fbm(g*.28+70,_*.28+11)<.43)continue;const A=r()<e.trees.conifer?e.trees.kind==="cypress"?"cypress":e.trees.kind==="spruce"?"spruce":"pine":["lemon","shrub"].includes(e.trees.kind)?e.trees.kind:"broadleaf";B(A,g,_,s(.75,1.2)),Ot(g,_,.45),zt++}for(let g=0;g<70;g++){const _=s(-8,8),S=s(-7,7);if(!Ct(_,S,.05,.4))continue;const A=Bt(_,S);if(e.snow&&A>4)continue;const P=new Lt(new Xe(.05,s(.18,.3),3),f(new Vt(a(e.grass)).offsetHSL(0,.05,-.12)));P.position.set(_,A+.1,S),P.rotation.set(s(-.3,.3),s(0,3),s(-.3,.3)),u.add(P)}for(let g=0;g<16;g++){const _=s(-8,8),S=s(-7,7);if(!Ct(_,S,.3))continue;const A=se(s(.12,.3),[e.rock,e.rock2||e.rock],0,.7,.25);A.position.set(_,Bt(_,S)+.05,S),u.add(h(A)),Ot(_,S,.3)}const Ht=(g,_,S,A)=>new Lt(new fn(g,_,S),f(A)),ge=(g,_,S,A)=>{const P=new Lt(new Xe(Math.hypot(g,_)*.56,S,4),f(A));return P.rotation.y=Math.PI/4,P.scale.set(g/Math.max(g,_),1,_/Math.max(g,_)),P};function ce(g,_,S,A,P,O,H,z=0,Y=!1){const K=Bt(g,_),ut=new fe,ot=Ht(S,A+.5,P,O);if(ot.position.y=(A+.5)/2-.5,ut.add(ot),Y){const ht=Ht(S*1.02,.06,P*1.02,H);ht.position.y=A+.03,ut.add(ht)}else{const ht=ge(S*1.08,P*1.08,Math.min(S,P)*.55,H);ht.position.y=A+Math.min(S,P)*.27,ut.add(ht)}for(let ht=0;ht<Math.max(1,Math.floor(S/.32));ht++){const Rt=Ht(.09,.12,.02,"#3b4048");Rt.position.set(-S/2+.18+ht*.3,A*.6,P/2+.005),Rt.position.x<S/2-.1&&ut.add(Rt)}for(let ht=0;ht<Math.max(1,Math.floor(P/.32));ht++){const Rt=Ht(.02,.12,.09,"#3b4048");Rt.position.set(S/2+.005,A*.6,-P/2+.18+ht*.3),Rt.position.z<P/2-.1&&ut.add(Rt)}return ut.position.set(g,K,_),ut.rotation.y=z,u.add(h(ut)),Ot(g,_,Math.max(S,P)*.7),ut}function Kt(g,_,S,A=1.5,P=80){for(let O=0;O<P;O++){const H=g+s(-A,A),z=_+s(-A,A);if(Ct(H,z,S))return[H,z]}return null}const we=(g,_,S=.32)=>{const A=[[S,0],[-S,0],[0,S],[0,-S],[0,0]].map(([P,O])=>Bt(g+P,_+O));return Math.max(...A)-Math.min(...A)<.32&&p(g,_,1.1)};function Oe(g,_,S,A,P){let O=0;for(let H=0;H<S*12&&O<S;H++){const z=Kt(g,_,.35,A,1);z&&we(z[0],z[1])&&(P(z[0],z[1],O),O++)}}const Pn=(g,_,S,A,P,O,H=.28)=>{for(let z=-S/2;z<=S/2;z+=H)for(let Y=-A/2;Y<=A/2;Y+=.2){const K=g+z*Math.cos(P)-Y*Math.sin(P),ut=_+z*Math.sin(P)+Y*Math.cos(P);if(!Ct(K,ut,.05,.6))continue;const ot=Ht(.09,.2,.15,O);ot.position.set(K,Bt(K,ut)+.08,ut),ot.rotation.y=-P,u.add(h(ot))}},ee=new Set(e.props);if(ee.has("hilltown")){const S=["#ecdcc0","#e3cfae","#f1e5cf","#d9c09a"];Oe(-3.4,-3.4,14,1.4,(O,H,z)=>ce(O,H,s(.38,.6),s(.35,.6),s(.38,.55),a(S),"#b5562f",s(0,.4)));const A=Kt(-3.4,-3.4,.3,.8);A&&ce(A[0],A[1],.32,1.7,.32,"#e3cfae","#b5562f",0,!0);const P=Kt(-3.4,-3.4,.4,1);P&&ce(P[0],P[1],.5,.75,.9,"#efe3cb","#b5562f",.3)}if(ee.has("farmhouse")){const g=Kt(4.2,-2.8,.6,1.2);if(g){ce(g[0],g[1],.8,.55,.6,"#e9d6b4","#b5562f",.2);for(let _=0;_<4;_++)B("cypress",g[0]+.9,g[1]-.6+_*.35,.8)}}if(ee.has("cypressAvenue"))for(let g=20;g<110;g+=11){const _=L[g],S=b.getTangentAt(g/U),A=new F(-S.z,0,S.x);for(const P of[-1,1]){const O=_.x+A.x*.62*P,H=_.z+A.z*.62*P;p(O,H,.5)&&tt(O,H)<.05&&B("cypress",O,H,s(.8,.95))}}if(ee.has("vineyard")&&Pn(4,1.6,2.4,1.8,.5,"#5f7f2f"),ee.has("haybales"))for(let g=0;g<7;g++){const _=Kt(-.6,-5.2,.2,1.6);if(!_)continue;const S=new Lt(new Pe(.16,.16,.24,8),f("#d9b866"));S.rotation.z=Math.PI/2,S.rotation.y=s(0,3),S.position.set(_[0],Bt(..._)+.16,_[1]),u.add(h(S)),Ot(_[0],_[1],.2)}if(ee.has("hut")){const g=Kt(3.8,-1.6,.6,1.2);g&&ce(g[0],g[1],.7,.4,.55,"#8a5a3a","#4b3a32",.5)}if(ee.has("cows"))for(let g=0;g<5;g++){const _=Kt(2.6,0,.2,1.8);if(!_)continue;const S=new fe,A=Ht(.28,.14,.12,g%2?"#7a5238":"#efe9df");A.position.y=.16,S.add(A);const P=Ht(.09,.09,.09,"#3a2a22");P.position.set(.17,.2,0),S.add(P);for(const[O,H]of[[.1,.04],[.1,-.04],[-.1,.04],[-.1,-.04]]){const z=Ht(.03,.1,.03,"#3a2a22");z.position.set(O,.05,H),S.add(z)}S.position.set(_[0],Bt(..._),_[1]),S.rotation.y=s(0,kt),u.add(h(S)),Ot(_[0],_[1],.25)}if(ee.has("pastelTown")){const g=["#f2c7b4","#f5dfa5","#e9a98f","#f7efe2","#bcd6d9","#f0b8a0","#f6e3c1"];Oe(1.2,1,22,2.4,(S,A)=>ce(S,A,s(.36,.55),s(.4,.75),s(.36,.5),a(g),"#d6cbb8",s(-.3,.3),!0));const _=Kt(.4,.4,.4,1.4);if(_){const S=new Lt(new ws(.3,8,4,0,kt,0,Math.PI/2),f("#3f8f6a")),A=ce(_[0],_[1],.6,.7,.6,"#f7efe2","#f7efe2",0,!0);S.position.set(0,.74,0),A.add(S)}}if(ee.has("terraces")&&Pn(-4.8,-1.6,2.2,1.4,.9,"#6f8b3a",.35),ee.has("lighthouse")){const g=Kt(-1,5.4,.3,1.5)||Kt(5.4,-.8,.3,1.5);if(g){const _=new fe;for(let P=0;P<4;P++){const O=new Lt(new Pe(.17-P*.012,.19-P*.012,.3,8),f(P%2?"#c8402e":"#f5f2ea"));O.position.y=.15+P*.3,_.add(O)}const S=new Lt(new Pe(.12,.12,.16,8),f("#fff3b0",{emissive:"#ffe27a",emissiveIntensity:.6}));S.position.y=1.3,_.add(S);const A=new Lt(new Xe(.16,.18,8),f("#3a3f45"));A.position.y=1.47,_.add(A),_.position.set(g[0],Bt(...g),g[1]),u.add(h(_)),Ot(g[0],g[1],.3)}}if(ee.has("boats")||ee.has("barge")||ee.has("ferry")){const g=[];for(let _=0;_<600&&g.length<(ee.has("boats")?3:1);_++){const S=s(-8,8),A=s(-7,7);p(S,A,1)&&tt(S,A)>.98&&tt(S+.6,A)>.98&&tt(S-.6,A)>.98&&D(S,A)[0]>1.4&&g.every(P=>Math.hypot(P[0]-S,P[1]-A)>1.6)&&g.push([S,A])}g.forEach(([_,S],A)=>{const P=new fe;if(ee.has("barge")){const z=Ht(1.3,.14,.32,"#2f3b46");z.position.y=.07,P.add(z);const Y=Ht(.22,.18,.26,"#f2efe8");Y.position.set(-.5,.22,0),P.add(Y);const K=Ht(.8,.08,.26,"#8a6a4a");K.position.set(.15,.16,0),P.add(K)}else if(ee.has("ferry")){const z=Ht(1,.16,.36,"#e9e7e2");z.position.y=.08,P.add(z);const Y=Ht(1.02,.05,.37,"#b8352b");Y.position.y=.12,P.add(Y);const K=Ht(.4,.2,.3,"#f5f3ee");K.position.set(.1,.26,0),P.add(K)}else{const z=new qo;z.moveTo(-.34,.12),z.lineTo(.42,.12),z.quadraticCurveTo(.3,-.02,.18,-.06),z.lineTo(-.3,-.06),z.lineTo(-.34,.12);const Y=new As(z,{depth:.2,bevelEnabled:!1});Y.translate(0,0,-.1);const K=new Lt(Y,f(A%2?"#f5f2ea":"#2f5f8f"));P.add(K);const ut=Ht(.5,.03,.16,"#c9a77c");ut.position.set(0,.125,0),P.add(ut);const ot=Ht(.025,.78,.025,"#e8e6e0");ot.position.set(.04,.52,0),P.add(ot);const ht=new he().setFromPoints([new F(.02,.18,0),new F(.02,.88,0),new F(-.3,.18,0)]);ht.computeVertexNormals();const Rt=new Lt(ht,f("#fbfaf5",{side:2}));P.add(Rt);const At=new he().setFromPoints([new F(.06,.2,0),new F(.06,.8,0),new F(.36,.16,0)]);At.computeVertexNormals();const ne=new Lt(At,f("#f1efe8",{side:2}));P.add(ne)}P.position.set(_,G+.02,S),P.rotation.y=(ee.has("boats")?Math.PI/4+(r()>.5?Math.PI:0):s(0,kt))+s(-.2,.2),u.add(h(P));const O=r()*kt,H=P.rotation.y;c.push(z=>{P.position.y=G+.02+Math.sin(z*kt*2+O)*.025,P.rotation.z=Math.sin(z*kt*2+O)*.04,P.rotation.y=H+Math.sin(z*kt+O)*.12})})}if(ee.has("umbrellas"))for(let g=0;g<5;g++){let _=null;for(let O=0;O<300&&!_;O++){const H=s(-8,8),z=s(-7,7);tt(H,z)===0&&tt(H+.5,z+.5)>.1&&Ct(H,z,.2)&&(_=[H,z])}if(!_)continue;const S=new fe,A=Ht(.02,.32,.02,"#ddd");A.position.y=.16,S.add(A);const P=new Lt(new Xe(.2,.08,8),f(g%2?"#e4572e":"#2f6fa8"));P.position.y=.34,S.add(P),S.position.set(_[0],Bt(..._),_[1]),u.add(h(S)),Ot(_[0],_[1],.2)}if(ee.has("granite"))for(let g=0;g<12;g++){const _=Kt(s(-5,5),s(-5,5),.6,.5);if(!_)continue;const S=se(s(.35,.8),["#d2bfae","#c4b09e","#b9a593"],1,.75,.22);S.position.set(_[0],Bt(..._)+.15,_[1]),u.add(h(S)),Ot(_[0],_[1],.6)}if(ee.has("nuraghe")){const g=Kt(-3.6,-2.6,.7,1.4);if(g){const _=new fe,S=new Lt(new Pe(.42,.62,1,10),f("#b7a48e"));S.position.y=.5,_.add(S);const A=new Lt(new fn(.16,.26,.05),f("#2c2622"));A.position.set(0,.13,.6),_.add(A);for(let P=0;P<3;P++){const O=new Lt(new Pe(.62-P*.07,.62-P*.07,.02,10),f("#9e8c77"));O.position.y=.25+P*.3,O.scale.setScalar(.98-P*.07),_.add(O)}_.position.set(g[0],Bt(...g),g[1]),u.add(h(_)),Ot(g[0],g[1],.8)}}if(ee.has("castle")||ee.has("islandCastle")){let g;if(ee.has("islandCastle")){g=null;for(let _=0;_<400&&!g;_++){const S=s(-8,8),A=s(-7,7);p(S,A,1.5)&&tt(S,A)>.9&&tt(S+1,A)>.9&&tt(S,A+1)>.9&&tt(S-1,A)>.9&&(g=[S,A])}if(g){const _=se(.9,[e.grass[0],e.rock],1,.35,.1);_.position.set(g[0],G+.05,g[1]),u.add(h(_))}}else g=Kt(3.6,-3.2,.9,.8);if(g){const _=ee.has("islandCastle")?G+.3:Bt(...g),S=new fe,A=ee.has("islandCastle")?"#a49c8e":"#d9d2c4",P=Ht(.7,.9,.6,A);P.position.y=.45,S.add(P);const O=ge(.75,.65,.4,"#4a4f57");O.position.y=1.1,S.add(O);for(const[z,Y]of[[-.45,.4],[.45,.4],[.45,-.4],[-.45,-.4]]){const K=new Lt(new Pe(.16,.18,1.15,8),f(A));K.position.set(z,.57,Y),S.add(K);const ut=new Lt(new Xe(.2,.36,8),f("#4a4f57"));ut.position.set(z,1.32,Y),S.add(ut)}const H=Ht(1,.4,.1,A);if(H.position.set(0,.2,.42),S.add(H),S.position.set(g[0],_,g[1]),S.rotation.y=.5,u.add(h(S)),Ot(g[0],g[1],1),ee.has("castle")){const z=Ht(.18,.1,.01,"#c8402e");z.position.set(g[0]+.1,_+1.7,g[1]),u.add(z);const Y=Ht(.015,.4,.015,"#ddd");Y.position.set(g[0],_+1.6,g[1]),u.add(Y),c.push(K=>{z.rotation.y=Math.sin(K*kt*6)*.3})}}}if(ee.has("vineRows")&&(Pn(-3.2,1.6,2.6,2.2,-.15,"#5f8a33"),Pn(2.6,-2,2.4,2,-.15,"#5f8a33")),ee.has("village")){Oe(-3.4,-2.6,10,1.2,(_,S)=>{ce(_,S,s(.4,.55),s(.45,.65),s(.4,.5),"#f4f0e6","#3d4148",s(0,.5))});const g=Kt(-3.2,-2.4,.3,1);if(g){const _=ce(g[0],g[1],.3,1.2,.3,"#f4f0e6","#3d4148",0),S=new Lt(new Xe(.22,.7,4),f("#3d4148"));S.position.y=1.55,S.rotation.y=Math.PI/4,_.add(S)}}if(ee.has("redHouses")&&Oe(-1.2,-1,7,1.6,(g,_)=>ce(g,_,s(.45,.6),s(.3,.45),s(.35,.45),a(["#a8322a","#b8412f","#f1ede4","#c9a24a"]),"#3a3d40",s(0,1))),ee.has("sheep"))for(let g=0;g<9;g++){const _=Kt(s(-3,3),s(-3,3),.15,2.5);if(!_)continue;const S=new fe,A=se(.12,["#f4f2ec","#ecebe5"],0,.8);A.position.y=.13,S.add(A);const P=Ht(.06,.07,.06,"#2d2a28");P.position.set(.12,.15,0),S.add(P),S.position.set(_[0],Bt(..._),_[1]),S.rotation.y=s(0,kt),u.add(h(S)),Ot(_[0],_[1],.15);const O=r()*kt;c.push(H=>{P.rotation.z=Math.max(0,Math.sin(H*kt*2+O))*.5})}if(ee.has("stoneWall")){const g=_=>{const S=L[_%U],A=b.getTangentAt(_%U/U),P=new F(-A.z,0,A.x),O=S.x+P.x*.8,H=S.z+P.z*.8;return[O,H]};for(let _=200;_<300;_+=2){const[S,A]=g(_),[P,O]=g(_+2);if(!p(S,A,.4)||!p(P,O,.4)||tt(S,A)>0||tt(P,O)>0)continue;const H=Bt(S,A),z=Bt(P,O),Y=Math.hypot(P-S,O-A)+.04,K=Ht(.12,.17,Y,"#8e8a83");K.position.set((S+P)/2,(H+z)/2+.06,(A+O)/2),K.lookAt(P,z+.06,O),u.add(h(K))}}if(ee.has("chimney"))for(const[g,_,S]of[[-3.4,-2.8,2.6],[3,-4.2,1.8]]){const A=Kt(g,_,.5,.8);if(!A)continue;const P=new fe,O=new Lt(new Pe(.22,.42,S,7),f("#cfa77a"));O.position.y=S/2,P.add(O);const H=new Lt(new Pe(.42,.3,.32,7),f("#9c7452"));H.position.y=S+.12,P.add(H),P.position.set(A[0],Bt(...A),A[1]),u.add(h(P)),Ot(A[0],A[1],.5)}if(ee.has("agave"))for(let g=0;g<16;g++){const _=Kt(s(-5,5),s(-5,5),.15,.4);if(!_)continue;const S=new fe;for(let A=0;A<6;A++){const P=new Lt(new Xe(.05,.36,3),f("#7f9a6a"));P.position.y=.14,P.rotation.set(.6,A/6*kt,0,"YXZ"),S.add(P)}S.position.set(_[0],Bt(..._),_[1]),u.add(h(S)),Ot(_[0],_[1],.15)}if(ee.has("cliffFalls"))for(let g=0;g<3;g++){let _=null;for(let Y=0;Y<400&&!_;Y++){const K=s(-6,6),ut=s(-6,6);if(p(K,ut,1)&&tt(K,ut)>.9){const ot=K-1.3,ht=ut-1.3;Bt(ot,ht)>2.5&&(_=[K,ut,ot,ht])}}if(!_)continue;const[S,A,P,O]=_,H=Bt(P,O),z=new Lt(new Er(.16,H-G),new Ci({map:(()=>{const Y=yt.clone();return Y.needsUpdate=!0,Y.rotation=Math.PI/2,Y.center.set(.5,.5),c.push(K=>{Y.offset.set(K*8,0)}),Y})(),transparent:!0,opacity:.9,side:2}));z.position.set((S+P)/2+.35,(H+G)/2,(A+O)/2+.35),z.lookAt(30,z.position.y,30),u.add(z)}const mn=Kf(e.vehicle,e.carColor,e.carColor2,f);u.add(h(mn));const Xn=t.carStart??.08,qn=3,Mi=b.getLength(),Yn=g=>{const _=(g%1+1)%1*U,S=Math.floor(_),A=_-S;return ln(N[S%U],N[(S+1)%U],A)+.02},Zn=new F,Gi=new F,Si=new F,R=new xe,W=new F(0,1,0),Z=g=>{const _=(Xn+g*qn)%1,S=b.getPointAt(_),A=b.getTangentAt(_),P=.35/Mi,O=Yn(_+P),H=Yn(_-P);Zn.set(A.x,0,A.z).normalize().multiplyScalar(.7).setY(O-H).normalize(),Si.crossVectors(Zn,W).normalize(),Gi.crossVectors(Si,Zn).normalize(),R.makeBasis(Zn,Gi,Si),mn.quaternion.setFromRotationMatrix(R);const z=new F(-A.z,0,A.x);mn.position.set(S.x-z.x*.14,(O+H)/2+.03,S.z-z.z*.14)};c.push(Z);{const g=f("#33393f",{side:2});[[0,0,0],[-.24,.17,.04],[-.24,-.18,-.03],[-.48,.33,.06],[-.5,-.15,.07]].forEach(([S,A,P],O)=>{const H=new fe,z=new he().setFromPoints([new F(0,0,0),new F(-.08,0,.28),new F(.1,0,.05)]);z.computeVertexNormals();const Y=new Lt(z,g),K=new Lt(z,g);K.scale.z=-1,H.add(Y),H.add(K);const ut=new Lt(new Xe(.035,.22,4),g);ut.rotation.z=-Math.PI/2,H.add(ut),H.scale.setScalar(.6),u.add(H);const ot=r()*kt,ht=r()*kt;c.push(Rt=>{const At=(Xn+.5+Rt-S/Mi+1)%1,ne=b.getPointAt(At),Yt=b.getTangentAt(At),le=new F(-Yt.z,0,Yt.x),Be=A+Math.sin(Rt*kt*3+ht)*.04,Ve=ne.x+le.x*Be,gn=ne.z+le.z*Be;let de=-9;for(const[Ue,Ln]of[[0,0],[.9,0],[-.9,0],[0,.9],[0,-.9]])de=Math.max(de,J(Ve+Ue,gn+Ln));H.position.set(Ve,Math.max(Yn(At)+1.8,de+1.9)+P+Math.sin(Rt*kt*4+ht)*.06,gn),H.rotation.y=Math.atan2(-Yt.z,Yt.x);const ze=Math.max(0,Math.sin(Rt*kt*5+ot))**2,je=Math.sin(Rt*kt*140+ot)*.6*ze+.1;Y.rotation.x=-je,K.rotation.x=je})})}{const g=Math.round((Xn+.62)%1*U),_=L[g],S=b.getTangentAt(g/U),A=new F(-S.z,0,S.x),P=_.x+A.x*.62,O=_.z+A.z*.62,H=Math.max(Bt(P,O),V(g)),z=new fe,Y=Ht(.04,1.1,.04,"#2b2f33");Y.position.y=.55,z.add(Y);const K=new Lt(new he().setFromPoints([new F(0,0,0),new F(.48,-.13,0),new F(0,-.28,0)]),f(t.markerColor||"#1e6b52",{side:2}));K.geometry.computeVertexNormals(),K.position.y=1.08,z.add(K),z.position.set(P,H,O),u.add(h(z)),c.push(ut=>{K.rotation.y=Math.sin(ut*kt*5)*.25,K.scale.x=1+Math.sin(ut*kt*7)*.06})}for(let g=0;g<9;g++){let _=s(-.9,2.5);const S=s(1.5,7);for(const ht of Jt){const Rt=v(ht),At=Math.atan2(Rt.z/.8,Rt.x);let ne=Math.atan2(Math.sin(_-At),Math.cos(_-At));Math.abs(ne)<.55&&(_=At+(ne>=0?.55:-.55))}const A=se(s(.1,.38),e.strata.slice(1),r()>.5?1:0,.85,.25),P=Math.cos(_)*S,O=Math.sin(_)*S*.8,H=s(-12.2,-8.5)+(g<4?3:0);r()>.6&&se(A.geometry.parameters?.radius||.2,e.grass,0,.3),l.add(h(A,!0,!1));const z=r()*kt,Y=s(.08,.2),K=s(0,3),ut=s(0,3),ot=s(0,3);c.push(ht=>{A.position.set(P,H+Math.sin(ht*kt+z)*Y,O),A.rotation.set(K+Math.sin(ht*kt+z)*.08,ut+Math.sin(ht*kt+z)*.25,ot)})}return c.push(g=>{u.position.y=Math.sin(g*kt)*.18,u.rotation.y=Math.sin(g*kt)*.01}),c.push(g=>jt.forEach(_=>_(g))),l.userData={title:e.title,country:e.country,region:i},{root:l,car:mn,update:g=>c.forEach(_=>_(g)),config:e}}function Kf(i,t,e,n,r){const s=new fe,a=n("#1d2024",{roughness:.7}),o=n("#2c3a46",{roughness:.2}),c=n("#c9ccd0",{roughness:.4}),l=n(t,{roughness:.5}),u=n(e,{roughness:.55}),f=n("#fff6c8",{emissive:"#ffe58a",emissiveIntensity:.8}),h=(x,p,d,E,M,b,U)=>{const L=new Lt(new fn(x,p,d),E);return L.position.set(M,b,U),s.add(L),L},m=(x,p,d=.12,E=.09)=>{const M=new Lt(new Pe(d,d,E,10),a);M.rotation.x=Math.PI/2,M.position.set(x,d,p),s.add(M);const b=new Lt(new Pe(d*.45,d*.45,E+.01,6),c);b.rotation.x=Math.PI/2,b.position.set(x,d,p),s.add(b)},v=(x,p,d)=>d.forEach(E=>h(.02,.04,.07,f,x,p,E));if(i==="tent4x4")h(.86,.2,.4,l,0,.24,0),h(.52,.2,.37,l,-.12,.43,0),h(.5,.11,.38,o,-.12,.45,0),h(.04,.15,.33,o,.15,.43,0),h(.04,.12,.42,a,.44,.2,0),h(.56,.03,.38,a,-.12,.545,0),h(.48,.1,.35,u,-.14,.61,0),h(.06,.24,.24,a,-.47,.32,0),v(.445,.28,[.13,-.13]),[[.27,.2],[.27,-.2],[-.27,.2],[-.27,-.2]].forEach(([x,p])=>m(x,p,.13,.1));else if(i==="van")h(.82,.26,.4,l,0,.27,0),h(.82,.22,.4,u,0,.51,0),h(.7,.1,.405,o,-.04,.53,0),h(.03,.14,.34,o,.41,.52,0),h(.84,.03,.42,u,0,.635,0),h(.04,.04,.42,c,.42,.16,0),v(.415,.3,[.14,-.14]),[[.27,.2],[.27,-.2],[-.25,.2],[-.25,-.2]].forEach(([x,p])=>m(x,p,.11));else if(i==="motorhome")h(1.2,.5,.44,l,-.1,.4,0),h(.3,.26,.42,l,.58,.28,0),h(.03,.14,.38,o,.735,.34,0),h(.42,.14,.45,l,.5,.58,0),h(1.22,.05,.445,u,-.1,.3,0),h(.3,.1,.445,o,-.3,.5,0),h(.16,.1,.445,o,.15,.5,0),v(.735,.24,[.15,-.15]),[[.48,.21],[.48,-.21],[-.45,.21],[-.45,-.21]].forEach(([x,p])=>m(x,p,.11));else if(i==="caravan"){h(.7,.16,.36,l,.42,.19,0),h(.44,.15,.34,l,.36,.34,0),h(.42,.09,.345,o,.36,.35,0),h(.03,.11,.3,o,.59,.33,0),v(.775,.2,[.12,-.12]),[[.62,.17],[.62,-.17],[.22,.17],[.22,-.17]].forEach(([p,d])=>m(p,d,.1,.08)),h(.12,.03,.04,a,.02,.14,0);const x=new Lt(new Ts(.21,.42,3,8),u);x.rotation.z=Math.PI/2,x.scale.set(1.15,1,.92),x.position.set(-.42,.36,0),s.add(x),h(.6,.04,.42,n(t==="#5b6770"?"#7aa6c2":t),-.42,.34,0),h(.24,.08,.425,o,-.36,.44,0),m(-.42,.2,.1,.07),m(-.42,-.2,.1,.07)}else i==="roadster"?(h(.8,.13,.36,l,0,.17,0),h(.34,.06,.36,l,.2,.25,0),h(.03,.1,.3,o,.03,.29,0),h(.2,.06,.28,n("#5a3b2c"),-.1,.24,0),h(.1,.1,.03,n("#5a3b2c"),-.16,.3,.07),h(.1,.1,.03,n("#5a3b2c"),-.16,.3,-.07),h(.04,.05,.38,c,.41,.14,0),v(.405,.2,[.12,-.12]),[[.26,.18],[.26,-.18],[-.26,.18],[-.26,-.18]].forEach(([x,p])=>m(x,p,.1,.08))):i==="estate"?(h(.86,.17,.38,l,0,.2,0),h(.6,.16,.36,l,-.1,.36,0),h(.58,.1,.365,o,-.1,.37,0),h(.03,.12,.32,o,.2,.36,0),h(.5,.025,.3,c,-.12,.45,0),h(.36,.07,.26,u,-.12,.49,0),v(.435,.22,[.13,-.13]),[[.27,.18],[.27,-.18],[-.27,.18],[-.27,-.18]].forEach(([x,p])=>m(x,p,.11,.08))):(h(.66,.17,.36,l,0,.19,0),h(.42,.13,.33,l,-.06,.335,0),h(.4,.085,.335,o,-.06,.34,0),h(.03,.1,.29,o,.155,.335,0),h(.4,.025,.31,u,-.06,.41,0),h(.03,.03,.37,c,.335,.13,0),v(.335,.21,[.11,-.11]),[[.21,.17],[.21,-.17],[-.21,.17],[-.21,-.17]].forEach(([x,p])=>m(x,p,.1,.08)));return s.scale.setScalar(1.08),s}function jf(i,t=3,e={}){const n=gr(t),r=(f,h)=>f+n()*(h-f),s=new fe,a=[],o=(f,h={})=>new Ci({color:f,flatShading:!0,roughness:.95,...h});function c(f,h=1){const m=new fe,v=4+Math.floor(n()*3);for(let x=0;x<v;x++){const p=new Lt(new Cn(r(.5,.9),1),o(["#ffffff","#f6f8fa","#eef2f5"][x%3],{transparent:h<1,opacity:h}));p.position.set((x-v/2)*.75+r(-.2,.2),r(-.1,.35),r(-.3,.3)),p.scale.y=.7,m.add(p)}return m.scale.setScalar(f),m}if(e.sea!==!1)for(let f=0;f<46;f++){const h=r(0,kt),m=r(4,34),v=c(r(1.4,2.8));v.position.set(Math.cos(h)*m-4,r(-17,-14.5),Math.sin(h)*m-4),v.rotation.y=r(0,kt),s.add(v);const x=n()*kt,p=v.position.x;a.push(d=>{v.position.x=p+Math.sin(d*kt+x)*.6})}for(const[f,h,m,v]of[[-12,3.5,2,1.1],[4,6.5,-12,.8],[-6,8.5,-9,1],[12,-1.5,-5,.8]]){const x=c(v);x.position.set(f,h,m),s.add(x);const p=n()*kt;a.push(d=>{x.position.x=f+Math.sin(d*kt+p)*.8,x.position.y=h+Math.sin(d*kt*2+p)*.08})}const l=(f,h=.35)=>new Vt(f).lerp(new Vt(i.fog),h),u=(f,h,m,v,x)=>{const p=new fe;x=l(x);const d=new Lt(new Pe(1,.9,.3,11),o(x));p.add(d);const E=new Lt(new Xe(.95,2.4,11,3),o(l(i.strata[1])));E.rotation.x=Math.PI,E.position.y=-1.35,p.add(E);for(let b=0;b<3;b++){const U=new Lt(new Xe(.16,.6,6),o(l(i.conifer[0])));U.position.set(r(-.5,.5),.45,r(-.5,.5)),p.add(U)}p.position.set(f,h,m),p.scale.setScalar(v),s.add(p);const M=n()*kt;a.push(b=>{p.position.y=h+Math.sin(b*kt+M)*.25})};return u(-20,-6,-4,1.5,i.grass[1]),u(-4,-4,-20,1.2,i.grass[2]),u(-10,-12,4,.9,i.grass[0]),{env:s,update:f=>a.forEach(h=>h(f))}}function $f(i,t,e={}){const n=new Ho({antialias:!0,alpha:!!e.transparent,preserveDrawingBuffer:!!e.preserve});n.setSize(i,t,!1),n.setPixelRatio(e.dpr||1),n.shadowMap.enabled=!0,n.shadowMap.type=2,n.toneMapping=4,n.toneMappingExposure=1.05,n.outputColorSpace=ye;const r=new df,s=new xs(-1,1,1,-1,.1,300),a=(f,h,m=14)=>{const v=f/h;s.left=-m*v,s.right=m*v,s.top=m,s.bottom=-m,s.updateProjectionMatrix()};a(i,t,e.zoom),s.position.set(30,25,30),s.lookAt(0,-1.8,0);const o=new Xf("#eef4fb","#7d6a58",.9);r.add(o);const c=new rs("#fff3dc",3.1);c.position.set(4,20,14),c.castShadow=!0,c.shadow.mapSize.set(e.shadow||2048,e.shadow||2048),Object.assign(c.shadow.camera,{left:-15,right:15,top:15,bottom:-15,near:1,far:70}),c.shadow.bias=-5e-4,c.shadow.normalBias=.02,r.add(c);const l=new rs("#bcd3ee",.8);l.position.set(-14,6,-10),r.add(l);const u=new rs("#ffe2c4",.35);return u.position.set(16,2,4),r.add(u),{renderer:n,scene:r,cam:s,setView:a,lights:{hemi:o,sun:c,rim:l,fill:u}}}const yo="#16283a";function td(i,t={}){const e={region:"tuscany",air:!0,sea:!1,fit:.9,lift:0,interactive:!0,fps:30,motion:!0,phase:.1,mood:"day",...t};Hn[e.region]||(e.region="tuscany");const n=typeof matchMedia=="function"&&matchMedia("(prefers-reduced-motion: reduce)").matches;let r=e.motion&&!n,s=Math.max(1,i.clientWidth),a=Math.max(1,i.clientHeight);const o=Math.min(2,globalThis.devicePixelRatio||1),c=$f(s,a,{transparent:!0,dpr:o,shadow:2048});c.renderer.setClearColor(0,0);const l=c.renderer.domElement;Object.assign(l.style,{width:"100%",height:"100%",display:"block",touchAction:e.interactive?"pan-y":"auto"}),i.appendChild(l);const u=()=>{const st=s/a,X=10.6/Math.min(st,1)/e.fit;c.setView(s,a,X),c.cam.position.set(30,25,30),c.cam.lookAt(0,-1.8,0),c.cam.translateY(-e.lift*2*X),c.cam.updateProjectionMatrix()};u();let f=e.region,h=null,m=null,v=0,x=0,p=null,d=e.phase,E=0,M=performance.now()-d*Ri*1e3,b=null,U=!0,L=!0,D=0,q=!1;function T(st){h&&(c.scene.remove(h.root),ss(h.root)),Hn[st],h=Jf(st,{seed:7}),c.scene.add(h.root),f=st,C(),G()}function C(){if(m&&(c.scene.remove(m.env),ss(m.env),m=null),!e.air)return;const st=Hn[f];m=jf(j==="dusk"?{...st,fog:yo}:st,3,{sea:e.sea}),c.scene.add(m.env)}function G(){const st=Hn[f],X=c.lights,at=j==="dusk",_t=(wt,Et,Ut)=>{wt.color.set(Et),wt.intensity=Ut};at?(_t(X.hemi,"#a9bcdc",.8),X.hemi.groundColor.set("#3a2f3a"),_t(X.sun,"#ffbb88",2.9),X.sun.position.set(16,12,8),_t(X.rim,"#86a6e0",1.15),_t(X.fill,"#d4927c",.3),c.renderer.toneMappingExposure=.98,c.scene.fog=new Mr(yo,40,88)):(_t(X.hemi,"#eef4fb",.9),X.hemi.groundColor.set("#7d6a58"),_t(X.sun,"#fff3dc",3.1),X.sun.position.set(4,20,14),_t(X.rim,"#bcd3ee",.8),_t(X.fill,"#ffe2c4",.35),c.renderer.toneMappingExposure=1.05,c.scene.fog=new Mr(st.fog,46,92)),c.scene.traverse(wt=>{const Et=wt.material;if(!(!Et||!Et.emissive))for(const Ut of Array.isArray(Et)?Et:[Et])Ut.userData.glow===void 0&&(Ut.userData.glow=Ut.emissiveIntensity),Ut.userData.glow>0&&(Ut.emissiveIntensity=at?Ut.userData.glow*3.2:Ut.userData.glow)})}let j=e.mood==="dusk"?"dusk":"day";T(f);function tt(st){r&&(d=(st-M)/(Ri*1e3)%1),!p&&Math.abs(x)>1e-4&&(v+=x,x*=.93);let X=0,at=1;if(b){const _t=Math.min(1,(st-b.t)/900);if(_t<.5){const wt=_t/.5;X=-wt*wt*6,at=1-wt*.12}else{b.to&&(T(b.to),b.to=null);const wt=1-(_t-.5)/.5;X=-wt*wt*6,at=1-wt*.12}_t>=1&&(b=null)}h.root.rotation.y=v,h.root.position.y=X,h.root.scale.setScalar(at),h.update(d),m&&m.update(d),c.renderer.render(c.scene,c.cam),q||(q=!0,e.onReady&&e.onReady())}function N(st){D=0,L&&(st-E>=1e3/e.fps-2&&(E=st,tt(st)),U&&(r||b||p||Math.abs(x)>1e-4)&&(D=requestAnimationFrame(N)))}const V=()=>{!D&&L&&U&&(D=requestAnimationFrame(N))};tt(performance.now()),V();const J=st=>{p={x:st.clientX,yaw:v,t:performance.now()},x=0,l.setPointerCapture?.(st.pointerId),V()},et=st=>{if(!p)return;const X=p.yaw+(st.clientX-p.x)*.008;x=X-v,v=X,V()},it=()=>{p=null,V()};e.interactive&&(l.addEventListener("pointerdown",J),l.addEventListener("pointermove",et),l.addEventListener("pointerup",it),l.addEventListener("pointercancel",it));const $=typeof IntersectionObserver=="function"?new IntersectionObserver(st=>{U=st[0].isIntersecting,U&&(M=performance.now()-d*Ri*1e3,V())}):null;$&&$.observe(i);const rt=()=>{U=!document.hidden,U&&(M=performance.now()-d*Ri*1e3,V())};document.addEventListener("visibilitychange",rt);const lt=typeof ResizeObserver=="function"?new ResizeObserver(()=>{const st=Math.max(1,i.clientWidth),X=Math.max(1,i.clientHeight);st===s&&X===a||(s=st,a=X,c.renderer.setSize(s,a,!1),u(),tt(performance.now()))}):null;return lt&&lt.observe(i),{get region(){return f},setRegion(st,X=!0){if(!(!Hn[st]||st===f&&!b)){if(!X||!r){T(st),tt(performance.now());return}b={t:performance.now(),to:st},V()}},setMood(st){const X=st==="dusk"?"dusk":"day";X!==j&&(j=X,C(),G(),tt(performance.now()))},get mood(){return j},setMotion(st){r=!!st&&!n,M=performance.now()-d*Ri*1e3,V()},turn(st){v+=st,tt(performance.now())},destroy(){L=!1,cancelAnimationFrame(D),$&&$.disconnect(),lt&&lt.disconnect(),document.removeEventListener("visibilitychange",rt),ss(c.scene),c.renderer.dispose(),c.renderer.forceContextLoss?.(),l.remove()}}}function ss(i){i.traverse(t=>{t.geometry&&t.geometry.dispose();const e=t.material;if(e)for(const n of Array.isArray(e)?e:[e])n.map&&n.map.dispose(),n.alphaMap&&n.alphaMap.dispose(),n.dispose()})}export{Ri as LOOP,Hn as REGIONS,Qf as REGION_KEYS,td as mountIsland};
//# sourceMappingURL=engine-Dc937yUA.js.map
