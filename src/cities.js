import { options } from './weather';
import debounce from 'debounce';
import { cities as fetchData } from './fetch';

export class Cities {
    items = null;
    provinces = new Map;
    citiesOfProvinces = new Map;
    constructor(cityList, onFocus, mark) {
        const tabs = document.querySelector('#tabs');
        const pannel = document.querySelector('#panel');
        // pannel.className = 'pannel';
        this.items = fetchData().then(items => {
            const cityOl = document.createElement('ol');
            cityOl.dataset.name = '全国';
            cityOl.className = 'panel';
            const provinces = this.provinces;
            provinces.set('全国', { dom: cityOl, cities: null })
            tabs.addEventListener('click', e => {
                pannel.querySelectorAll('.panel').forEach(pannel => {
                    //console.log(e.target.textContent, pannel.dataset.name);
                    
                    debounce(() => onFocus(provinces.get(e.target.textContent).cities), 30).call();
                    if (e.target.textContent === pannel.dataset.name) {
                        pannel.style.display = 'block';
                    }
                    else {
                        pannel.style.display = 'none';
                    }
                })
            // console.log(e.target);
            })
            const ret = [];
            for (const item of items.slice(0, 180)) {
                let province;
                if (provinces.has(item.province)) {
                    province = provinces.get(item.province);
                } else {
                    const provincePannel = document.createElement('ol');
                    provincePannel.appendChild(options());
                    provincePannel.className = 'panel';
                    provincePannel.dataset.name = item.province;
                    provincePannel.style.display = 'none';
                    // pannel.appendChild(provincePannel);
                    const btn = document.createElement('li');
                    btn.textContent = item.province;
                    tabs.appendChild(btn);
                    province = { dom: provincePannel, cities: [] };
                    provinces.set(item.province, province);
                }
                const cityLi = document.createElement('li');
                const re = /\d+℃～(-?\d+℃)/;
                const temperature = item.range.match(re)[1];
                
                cityLi.textContent = temperature + ' ' + item.province + item.city;
                let fnZoom;
                function clickHandler() {
                    if (fnZoom) fnZoom();
                }
                cityList.value.push({
                    text: temperature + ' ' + item.province + item.city,
                    clickHandler,
                });
                cityOl.appendChild(cityLi);
                cityLi.title = JSON.stringify(item);
                const provinceLi = document.createElement('li');
                provinceLi.dataset.link = item.link;
                provinceLi.textContent = temperature + ' ' + item.province + item.city;
                province.dom.appendChild(provinceLi);
                provinceLi.title = JSON.stringify(item);
                const marker = mark(item);
                province.cities.push(marker);
                ret.push({
                    onClick(zoom) {
                        fnZoom = zoom;
                        cityLi.addEventListener('click', zoom);
                        provinceLi.addEventListener('click', zoom);
                    },
                    ...item,
                });
            }
            // pannel.appendChild(cityOl);
            //console.log(cityOl);
            return ret;
        })
    }
    getProvinceCities(province) {
        return this.provinces.get(province).cities;
    }
}
