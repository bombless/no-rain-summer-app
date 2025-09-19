import { options } from './weather';
import debounce from 'debounce';
import { cities as fetchData } from './fetch';

export class Cities {
    items = null;
    provinces = new Map;
    constructor(cityList, provinceList, onFocus, mark) {
        this.items = fetchData().then(items => {
            const provinces = this.provinces;
            provinces.set('全国', { cities: null })
            const ret = [];
            for (const item of items.slice(0, 180)) {
                let province;
                if (provinces.has(item.province)) {
                    province = provinces.get(item.province);
                } else {
                    provinceList.value.push({text: item.province});
                    province = { cities: [] };
                    provinces.set(item.province, province);
                }
                const re = /\d+℃～(-?\d+℃)/;
                const temperature = item.range.match(re)[1];
                let fnZoom;
                function clickHandler() {
                    if (fnZoom) fnZoom();
                }
                cityList.value.push({
                    text: temperature + ' ' + item.province + item.city,
                    clickHandler,
                    province: item.province,
                });
                const marker = mark(item);
                province.cities.push(marker);
                ret.push({
                    onClick(zoom) {
                        fnZoom = zoom;
                    },
                    ...item,
                });
            }
            return ret;
        })
    }
    getProvinceCities(province) {
        return this.provinces.get(province).cities;
    }
}
