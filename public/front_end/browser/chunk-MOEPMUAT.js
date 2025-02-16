import{b as l,c as h,e as p}from"./chunk-AUOKAUQD.js";import{Y as d,ba as g,f as i,t as n}from"./chunk-SFNPEGCY.js";var u=class c{constructor(t){this.http=t}rootUrl=p.rootURL;currentLocation;map;resultMarks=[];loadGoogleMapsApi(t){return new Promise((e,r)=>{if(typeof google<"u"&&google.maps)e();else if(document.getElementById("googleMapsScript"))e();else{let o=document.createElement("script");o.id="googleMapsScript",o.src=`https://maps.googleapis.com/maps/api/js?key=${t}&libraries=marker`,o.async=!0,o.defer=!0,o.onload=()=>e(),o.onerror=()=>r(),document.body.appendChild(o)}})}getUserLocation(){return new Promise((t,e)=>{navigator.geolocation?navigator.geolocation.getCurrentPosition(r=>{this.currentLocation={lat:r.coords.latitude,lng:r.coords.longitude},t()},r=>{console.error("\u7121\u6CD5\u53D6\u5F97\u4F4D\u7F6E:",r),e("\u7121\u6CD5\u53D6\u5F97\u4F7F\u7528\u8005\u4F4D\u7F6E")}):e("\u700F\u89BD\u5668\u4E0D\u652F\u63F4 Geolocation API")})}initMap(t){let e=t.nativeElement;this.map=new google.maps.Map(e,{mapId:p.googleMapsId,center:{lat:this.currentLocation.lat,lng:this.currentLocation.lng},zoom:18});let r=new google.maps.marker.AdvancedMarkerElement({map:this.map,position:this.currentLocation,title:"Advanced Marker",content:this.createCustomMarkerContent()});e.style.margin="30px"}createCustomMarkerContent(){let t=document.createElement("div"),e=document.createElement("img");return t.textContent="U R Here",t.style.display="flex",t.style.flexDirection="column",t.style.alignItems="center",t.style.color="Blue",e.src="../../assets/person.png",e.style.width="70px",e.style.height="auto",t.appendChild(e),t}createMark(t,e){let r=document.createElement("div");r.style.display="flex",r.style.flexDirection="column",r.style.alignItems="center",r.style.color="blue";let o=document.createElement("span");o.textContent=t,o.style.fontWeight="bold";let a=document.createElement("img");switch(e){case 0:a.src="../../assets/food.png";break;case 1:a.src="../../assets/\u8AB0\u5077\u4E86\u5783\u573E\u6876.png"}return a.style.width="50px",a.style.height="50px",r.appendChild(a),r.appendChild(o),r}addMarkersToMap(t,e){return new Promise((r,o)=>{if(!t||t.length===0){o("\u627E\u4E0D\u5230\u6307\u5B9A\u5167\u5BB9");return}if(!this.map){o("\u5730\u5716\u5C1A\u672A\u521D\u59CB\u5316");return}let a=0;this.resultMarks.length>0&&this.clearMarkers(),t.forEach(s=>{let m;switch(e){case 0:m=new google.maps.marker.AdvancedMarkerElement({map:this.map,position:{lat:s.location.latitude,lng:s.location.longitude},title:s.displayName.text,content:this.createMark(s.displayName.text,0)});break;case 1:m=new google.maps.marker.AdvancedMarkerElement({map:this.map,position:{lat:parseFloat(s.latitude),lng:parseFloat(s.longitude)},title:s.time,content:this.createMark(s.time,1)});break}a++,this.resultMarks.push(m),a===t.length&&r()})})}clearMarkers(){this.resultMarks.forEach(t=>t.map=null),this.resultMarks=[]}searchByArea(t){return i(this,null,function*(){try{let e=new l().set("area",t),r=this.http.get(`${this.rootUrl}/api/google/searchByArea`,{params:e}),o=yield n(r);this.addMarkersToMap(o,1)}catch(e){console.error("Failed to fetch places data: ",e)}})}searchByAreaAndTime(t,e){return i(this,null,function*(){try{let r=new l().set("area",t).set("time",e),o=this.http.get(`${this.rootUrl}/api/google/searchByAreaAndTime`,{params:r}),a=yield n(o);this.addMarkersToMap(a,1)}catch(r){console.error("Failed to fetch places data: ",r)}})}findFood(){return i(this,null,function*(){let t=new l().set("lat",this.currentLocation.lat).set("lon",this.currentLocation.lng).set("radius",2e3);try{let e=this.http.get(`${this.rootUrl}/api/google/food`,{params:t}),r=yield n(e);this.addMarkersToMap(r,0)}catch(e){console.error("Failed to fetch places data: ",e)}})}getAreaList(){return i(this,null,function*(){try{console.log("getAreaList",this.rootUrl);let t=this.http.get(`${this.rootUrl}/api/google/areaList`);return yield n(t)}catch(t){return console.error("Failed to fetch places data: ",t),[]}})}static \u0275fac=function(e){return new(e||c)(g(h))};static \u0275prov=d({token:c,factory:c.\u0275fac,providedIn:"root"})};export{u as a};
