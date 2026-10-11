(() => {
  const places = {};
  for(const place of window.CommuteMatchLocations?.places||[]) places[place.value]=[place.lat,place.lng];
  const pricing={
    'car4-petrol':{label:'4 chỗ (xe xăng)',capacity:3,under:2000,over:1600},
    'car4-electric':{label:'4 chỗ (xe điện)',capacity:3,under:2200,over:1800},
    'car7-petrol':{label:'7 chỗ (xăng)',capacity:6,under:2400,over:2000},
    'car7-electric':{label:'7 chỗ (điện)',capacity:6,under:2700,over:2200},
    'limo9':{label:'Limo (9 chỗ)',capacity:8,under:3000,over:2500},
    'van16':{label:'16 chỗ',capacity:15,under:2700,over:2200}
  };
  function discountFor(count){return count>=15?.12:count>=8?.10:count>=6?.08:count>=2?.05:0}
  function calculateFare(km,vehicleId,count){const type=pricing[vehicleId]||pricing['car4-petrol'],people=Math.max(1,Math.min(type.capacity,Number(count)||1)),rate=km<=100?type.under:type.over,base=Math.round(km*rate),discount=discountFor(people),perPerson=Math.round(base*(1-discount));return {rate,basePerPerson:base,discount,perPerson,groupTotal:perPerson*people,people,vehicle:type}}
  window.cmVehiclePricing=pricing;
  window.cmCalculateFare=calculateFare;
  const format=new Intl.NumberFormat('vi-VN');
  const locationFields='[name="origin"],[name="destination"],[name="place"],[name="target"]';
  const routeCache=new Map();
  let mapsPromise;
  function customLocations(){try{const v=JSON.parse(localStorage.getItem('cm-custom-hanoi-locations'));if(!Array.isArray(v))return [];const valid=v.filter(x=>typeof x==='string'&&x.trim()&&!/trung tâm thương mại|shopping|\bmall\b|lotte|times city|royal city|công viên nước|khu vui chơi|bến xe|sân bay|đại học|trường học|nhà máy thủy điện/i.test(x));if(valid.length!==v.length){localStorage.setItem('cm-custom-hanoi-locations',JSON.stringify(valid));const coords=customCoordinates();for(const name of Object.keys(coords))if(!valid.includes(name))delete coords[name];localStorage.setItem('cm-custom-hanoi-coordinates',JSON.stringify(coords))}return valid}catch{return []}}
  function customCoordinates(){try{return JSON.parse(localStorage.getItem('cm-custom-hanoi-coordinates'))||{}}catch{return {}}}
function saveCustomPlace(name,coords){const saved=customLocations().filter(x=>x.toLocaleLowerCase('vi')!==name.toLocaleLowerCase('vi'));saved.push(name);localStorage.setItem('cm-custom-hanoi-locations',JSON.stringify(saved));if(coords){const locations=customCoordinates();locations[name]=coords;localStorage.setItem('cm-custom-hanoi-coordinates',JSON.stringify(locations));routeCache.clear()}addSavedOptions()}
function addSavedOptions(){const known=window.CommuteMatchLocations?.places||[],saved=customLocations(),allowed=new Set([...known.map(place=>place.value),...saved]);document.querySelectorAll(locationFields).forEach(select=>{if(select.tagName!=='SELECT')return;[...select.options].forEach(option=>{if(option.value&&!allowed.has(option.value))option.remove()});known.forEach(place=>{if(![...select.options].some(option=>option.value===place.value)){const option=document.createElement('option');option.value=place.value;option.textContent=`${place.place} · ${place.province}`;select.appendChild(option)}});saved.forEach(name=>{if(![...select.options].some(option=>option.value===name)){const option=document.createElement('option');option.value=name;option.textContent=name;select.appendChild(option)}});if(![...select.options].some(option=>option.value===select.value))select.value=known[0]?.value||saved[0]||''})}
  function loadMaps(){if(window.google?.maps?.importLibrary)return Promise.resolve(true);if(mapsPromise)return mapsPromise;const key=window.COMMUTEMATCH_GOOGLE_MAPS_API_KEY?.trim();if(!key)return Promise.resolve(false);mapsPromise=new Promise(resolve=>{let done=false;const finish=ok=>{if(done)return;done=true;clearTimeout(timer);resolve(ok)};const timer=setTimeout(()=>finish(false),12000);window.cmTripMapsReady=()=>finish(Boolean(window.google?.maps?.importLibrary));const script=document.createElement('script');script.src=`https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&callback=cmTripMapsReady&loading=async&v=weekly`;script.async=true;script.onerror=()=>finish(false);document.head.appendChild(script)});return mapsPromise}
  function inNorthernVietnam(lat,lng){return lat>=19.0&&lat<=24.1&&lng>=102.0&&lng<=108.2}
async function locateHanoiPlace(name){if(places[name])return {lat:places[name][0],lng:places[name][1]};const existing=customCoordinates()[name];if(existing)return existing;if(!await loadMaps())return null;try{const {Geocoder}=await google.maps.importLibrary('geocoding');const {results}=await new Geocoder().geocode({address:`${name}, miền Bắc, Việt Nam`,region:'VN',componentRestrictions:{country:'VN'}});const point=results?.[0]?.geometry?.location;if(!point)return null;const coords={lat:point.lat(),lng:point.lng()};return inNorthernVietnam(coords.lat,coords.lng)?coords:null}catch{return null}}
  window.cmLocateHanoiPlace=locateHanoiPlace;
  window.cmSaveHanoiPlace=saveCustomPlace;
function addLocationButtons(){document.querySelectorAll(locationFields).forEach(field=>{if(field.dataset.locationButton)return;field.dataset.locationButton='1';const button=document.createElement('button');button.type='button';button.className='add-location-button';button.textContent='＋ Thêm điểm du lịch miền Bắc';const note=document.createElement('small');note.className='location-save-message';note.setAttribute('aria-live','polite');button.onclick=async()=>{const name=(window.prompt('Nhập tên điểm du lịch miền Bắc để lưu:')||'').trim();if(!name)return;const matched=[...document.querySelectorAll(locationFields)].find(item=>item.tagName==='SELECT'&&[...item.options].some(option=>option.value.toLocaleLowerCase('vi')===name.toLocaleLowerCase('vi')));if(matched){let coords=coordinates(matched.value);if(!coords)coords=await locateHanoiPlace(matched.value);if(coords)saveCustomPlace(matched.value,coords);field.value=matched.value;field.dispatchEvent(new Event('change',{bubbles:true}));note.textContent=coords?'Địa điểm đã lưu và có tọa độ.':'Đã lưu tên; thêm API key hợp lệ và mở ứng dụng bằng localhost để tính km.';return}note.textContent='Đang nhận diện địa điểm…';const coords=await locateHanoiPlace(name);saveCustomPlace(name,coords);field.value=name;field.dispatchEvent(new Event('change',{bubbles:true}));note.textContent=coords?'Đã lưu địa điểm và nhận diện tọa độ miền Bắc.':'Đã lưu tên địa điểm. Cần API key bản đồ hợp lệ để nhận diện và tính km.'};field.insertAdjacentElement('afterend',button);button.insertAdjacentElement('afterend',note)})}
  function coordinates(name){const point=places[name]||customCoordinates()[name];return point?{lat:Number(point.lat??point[0]),lng:Number(point.lng??point[1])}:null}
  function straightLineKm(origin,destination){const a=coordinates(origin),b=coordinates(destination);if(!a||!b)return null;const rad=v=>v*Math.PI/180,dLat=rad(b.lat-a.lat),dLon=rad(b.lng-a.lng),h=Math.sin(dLat/2)**2+Math.cos(rad(a.lat))*Math.cos(rad(b.lat))*Math.sin(dLon/2)**2;return Math.round(6371*2*Math.atan2(Math.sqrt(h),Math.sqrt(1-h))*1.25*10)/10}
  async function drivingKm(origin,destination){const a=coordinates(origin),b=coordinates(destination);if(!a||!b||!await loadMaps())return null;const cacheKey=`${origin}|${destination}`;if(routeCache.has(cacheKey))return routeCache.get(cacheKey);try{const {Route}=await google.maps.importLibrary('routes');const {routes}=await Route.computeRoutes({origin:a,destination:b,travelMode:'DRIVING',fields:['distanceMeters']});const meters=routes?.[0]?.distanceMeters;if(!meters)return null;const km=Math.round(meters/100)/10;routeCache.set(cacheKey,km);return km}catch{return null}}
  function showEstimate(anchor,origin,destination,people,vehicle){
    const panel=document.createElement('div');
    panel.className='trip-estimate';
    panel.innerHTML=`<div><small>Loại xe</small><strong data-vehicle>4 chỗ (xe xăng)</strong></div><div><small>Quãng đường</small><strong data-distance>—</strong></div><div><small>Giá mỗi người/km</small><strong data-rate>—</strong></div><div><small>Ưu đãi nhóm</small><strong data-discount>—</strong></div><div><small>Dự kiến mỗi người</small><strong data-total-person>—</strong></div><div><small>Tổng nhóm</small><strong data-total-group>—</strong></div><p>* Đơn giá áp dụng theo loại xe và quãng đường: đến 100 km / trên 100 km. Giảm theo nhóm: 2–5 người 5%, 6–7 người 8%, 8–14 người 10%, 15 người 12%. Số hành khách tối đa lần lượt là 3, 6, 8 hoặc 15 theo loại xe.</p>`;
    anchor.insertAdjacentElement('afterend',panel);
    let requestId=0;
    const update=async()=>{
      const id=++requestId,from=origin.value,to=destination.value;
      const vehicleId=vehicle?.value||'car4-petrol',type=pricing[vehicleId]||pricing['car4-petrol'];
      const parsedCount=Number(String(people?.value||'1').match(/\d+/)?.[0]||1),count=Math.max(1,Math.min(type.capacity,parsedCount));
      panel.querySelector('[data-vehicle]').textContent=type.label;
      panel.querySelector('[data-distance]').textContent='Đang tính…';
      const km=await drivingKm(from,to)??straightLineKm(from,to);
      if(id!==requestId)return;
      panel.querySelector('[data-distance]').textContent=km===null?'Chưa có tọa độ':`${km.toLocaleString('vi-VN',{minimumFractionDigits:1,maximumFractionDigits:1})} km`;
      if(km===null){for(const selector of ['[data-rate]','[data-discount]','[data-total-person]','[data-total-group]'])panel.querySelector(selector).textContent='—';return}
      const quote=calculateFare(km,vehicleId,count);
      panel.querySelector('[data-rate]').textContent=`${format.format(quote.rate)}đ/km`;
      panel.querySelector('[data-discount]').textContent=quote.discount?`${Math.round(quote.discount*100)}% · ${count} người`:'Không giảm · 1 người';
      panel.querySelector('[data-total-person]').textContent=`${format.format(quote.perPerson)}đ/người`;
      panel.querySelector('[data-total-group]').textContent=`${format.format(quote.groupTotal)}đ · ${count} người`;
      const priceInput=anchor.querySelector?.('[name="price"]');if(priceInput)priceInput.value=quote.perPerson;
    };
    [origin,destination,people,vehicle].filter(Boolean).forEach(field=>field.addEventListener('change',update));
    update();
  }
  function limitSeatsByVehicle(){
    document.querySelectorAll('select[name="vehicle"]').forEach(vehicle=>{
      const form=vehicle.form,searchCard=vehicle.closest(".search-card"),occupancy=form?.elements.people||form?.elements.seats||searchCard?.querySelector("[name=people]");if(!occupancy)return;
      const isSeatCount=occupancy.name==='seats';
      const updateLimit=()=>{
        const type=pricing[vehicle.value]||pricing['car4-petrol'],max=type.capacity,current=Number(String(occupancy.value||occupancy.selectedOptions?.[0]?.textContent||'1').match(/\d+/)?.[0]||1);
        const existing=new Set([...occupancy.options].map(option=>Number(String(option.value||option.textContent).match(/\d+/)?.[0]||0)));
        for(let count=1;count<=15;count++)if(!existing.has(count)){const option=document.createElement('option');option.value=isSeatCount?`${count} chỗ`:String(count);option.textContent=isSeatCount?`${count} chỗ`:`${count} người`;occupancy.appendChild(option)}
        let changed=false;
        [...occupancy.options].forEach(option=>{const count=Number(String(option.value||option.textContent).match(/\d+/)?.[0]||0);option.disabled=count>max;if(option.disabled&&option.selected)changed=true});
        if(changed){const safe=[...occupancy.options].find(option=>Number(String(option.value||option.textContent).match(/\d+/)?.[0]||0)===max);if(safe)occupancy.value=safe.value;}
        if(changed)occupancy.dispatchEvent(new Event('change',{bubbles:true}));
        updateAirportTripPrices();
      };
      vehicle.addEventListener('change',updateLimit);occupancy.addEventListener('change',updateAirportTripPrices);updateLimit();
    });
  }
  function updateAirportTripPrices(){
    const search=document.querySelector('.search-card'),vehicleId=search?.querySelector('[name="vehicle"]')?.value||'car4-petrol',people=Number(search?.querySelector('[name="people"]')?.value||1);
    document.querySelectorAll('[data-airport-distance]').forEach(card=>{const quote=calculateFare(Number(card.dataset.airportDistance),vehicleId,people),price=card.querySelector('[data-airport-price]'),car=card.querySelector('[data-airport-car]'),discount=card.querySelector('[data-airport-discount]');if(price)price.textContent=`${format.format(quote.perPerson)}đ`;if(car)car.textContent=quote.vehicle.label;if(discount)discount.textContent=quote.discount?`Giảm ${Math.round(quote.discount*100)}%/người`:'Chưa áp dụng ưu đãi nhóm'});
  }
  addSavedOptions();addLocationButtons();limitSeatsByVehicle();document.querySelectorAll(".search-card [name=\"people\"],.search-card [name=\"vehicle\"]").forEach(field=>field.addEventListener("change",updateAirportTripPrices));updateAirportTripPrices();
  const home=document.querySelector('.search-card');if(home){const o=home.querySelector('[name="origin"]'),d=home.querySelector('[name="destination"]'),p=home.querySelector('[name="people"]');if(o&&d&&p)showEstimate(home,o,d,p,home.querySelector('[name="vehicle"]'))}
  document.querySelectorAll('#trip-search,#match-route-form,#create-trip').forEach(form=>{if(form.elements.origin&&form.elements.destination)showEstimate(form,form.elements.origin,form.elements.destination,form.elements.people||form.elements.seats,form.elements.vehicle)});
})();
