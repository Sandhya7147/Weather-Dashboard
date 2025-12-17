const searchEl = document.getElementById('city-name');
const container = document.getElementById('weatherdetails');
const submit_button = document.getElementById('submit');
const his = document.getElementById('search-history');
let search_history=[];
let imp=true;
submit_button.addEventListener('click',handleSearchClick);


function addDiv(className,message){
    const newdiv = document.createElement("div");
    newdiv.classList.add(className);
    newdiv.innerText=message;
    container.appendChild(newdiv);
}



function displayLoc(r){
    let className='city-heading';
    let message=`${r.location['name']}: ${r.location['region']}, ${r.location['country']}`
    addDiv(className,message);
}
function addElementCurrent(r){
    const c=r.current;
    const temp_c=c.temp_c;
    const desc=c.condition.text;
    const hum=c.humidity;
    const wind=c.wind_kph;
    const press=c.pressure_mb;
    const name=r.location.name;
    const region=r.location.region;
    const country=r.location.country;
    
    const date=r.location.localtime;
    const dateObj = new Date(date.replace(" ", "T"));
    const options = { 
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    const formattedDate = dateObj.toLocaleDateString('en-US', options);
    
    addDiv("place-name",`${name}, ${region}, ${country}`);
    addDiv("date",formattedDate);
    const newDiv = document.createElement("div");
    newDiv.classList.add("icon-temp");
    container.appendChild(newDiv);

    addDiv("desc",desc);

    const newimg = document.createElement("img");
    newimg.classList.add("weather-icon");
    newimg.src=`https:${c.condition.icon}`
    const icon_temp_cont= document.getElementsByClassName('icon-temp');
    icon_temp_cont[0].appendChild(newimg);

    const newdiv = document.createElement("div");
    newdiv.classList.add('temp');
    newdiv.innerHTML=temp_c+"&deg;C";
    icon_temp_cont[0].appendChild(newdiv);

    const divo = document.createElement("div");
    divo.classList.add("other-det");
    container.appendChild(divo);
    const other_det_cont= document.getElementsByClassName('other-det');

    const divh = document.createElement("div");
    divh.classList.add('humidity');
    divh.innerHTML=`Humidity: ${hum}%`;
    other_det_cont[0].appendChild(divh);

    const divw = document.createElement("div");
    divw.classList.add('wind');
    divw.innerHTML=`Wind Speed: ${wind} km/h`;
    other_det_cont[0].appendChild(divw);

    const divp = document.createElement("div");
    divp.classList.add('pressure');
    divp.innerHTML=`Atmospheric Pressure: ${press} millibar`;
    other_det_cont[0].appendChild(divp);

}

async function fetchData(){
    try{
        submit_button.disabled = true;
        let city=searchEl.value;
       
        console.log(city);
        
        const API_KEY=import.meta.env.VITE_WEATHER_API_KEY;
        const BASE_URL="https://api.weatherapi.com/v1/current.json";
        const url=`${BASE_URL}?key=${API_KEY}&q=${city}`;
        const response= await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }
        if(imp){
            search_history.unshift(city);
            search_history = [...new Set(search_history)].slice(0, 5);
            console.log(search_history);
            
        }
        
        const result = await response.json();
        console.log(result);
        addElementCurrent(result);

    } catch(error){
        console.error(error);
        console.log(`${error.message}`);//typeof gives string
        if(error.message.includes('400')){
            let className = 'error-message';
            let message ='PLEASE ENTER VALID CITY NAME';
            addDiv(className,message);
            imp=false;
        }
    } finally{
        submit_button.disabled = false;
    }
}

async function handleSearchClick() {
    container.innerHTML = ""; 
    const city = searchEl.value.trim();
    if (city) {
        await fetchData();
    }
    else{
        let className = 'error-message';
        let message ='PLEASE ENTER VALID CITY NAME';
        addDiv(className,message);
        imp=false;
    }
    
    if(imp){
        displaySearchHistory();
    }
    imp=true;
}

function displaySearchHistory(){
    his.innerHTML="";
    search_history.map((search)=> {
        const btn= document.createElement("button");
        btn.classList.add("history-button");
        btn.innerHTML=search;
        btn.onclick = () => {
            container.innerHTML = ""; 
            searchEl.value = search;
            fetchData();
        };
        his.appendChild(btn); 
    });
}