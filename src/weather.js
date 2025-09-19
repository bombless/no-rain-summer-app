import { weather } from './fetch';
import { ref, watch } from "vue";
import {log} from "./log.js";

export const rainyFilters = ['查看全部', '七天内三天无雨', '七天内五天无雨', '连续三天无雨', '七天内有雨', '七天内无雨'];
export const currFilter = ref('查看全部');

const options = {};
const result = ref(null);

export function watchCities(cityList) {
    watch([cityList, currFilter], ([currCityList, currWeatherFilter]) => {

        const links = currCityList.map(x => x.link);

        function trigger(list) {
            // log('trigger', list);
            // if (list.length) {
            //     log('list[0] type', typeof list[0])
            // } else {
            //     log('list[0] empty')
            // }
            result.value = new Set;
            for (const idx in currCityList) {
                // log('idx', idx, list.includes(idx))
                if (list.includes(+idx)) {
                    result.value.add(currCityList[idx].city);
                    // log('add', currCityList[idx])
                }
            }
            // log('trigger准备返回', result.value.size)
        }

        //console.log(links);
        // log('触发', links);
        cachedWeather(links).then(list => {
            // log('cachedWeather(links).then', list)
            // debugger;
            switch (currWeatherFilter) {
                case '查看全部':
                    return trigger([...Array(links.length).keys()]);
                case '七天内三天无雨':
                    return trigger(list.reduce((acc, x, idx) => {
                        function helper(list) {
                            return list.reduce((acc, x) => x ? acc + 1 : acc, 0);
                        }

                        if (helper(x) <= 4) {
                            acc.push(idx);
                        }
                        return acc;
                    }, []));
                case '七天内五天无雨':
                    return trigger(list.reduce((acc, x, idx) => {
                        function helper(list) {
                            return list.reduce((acc, x) => x ? acc + 1 : acc, 0);
                        }

                        if (helper(x) <= 2) {
                            acc.push(idx);
                        }
                        return acc;
                    }, []));
                case '连续三天无雨':
                    // log('处理连续三天无雨')
                    return trigger(list.reduce((acc, x, idx) => {
                        function helper(list) {
                            return list.reduce((acc, x) => x ? 0 : acc + 1, 0);
                        }

                        if (helper(x) >= 3) {
                            acc.push(idx);
                        }
                        return acc;
                    }, []));
                case '七天内有雨':
                    return trigger(list.reduce((acc, x, idx) => {
                        if (x.some(x => x)) {
                            acc.push(idx);
                        }
                        return acc;
                    }, []));
                case '七天内无雨':
                    return trigger(list.reduce((acc, x, idx) => {
                        if (!x.some(x => x)) {
                            acc.push(idx);
                        }
                        return acc;
                    }, []));
            }
        });


        function cachedWeather(links) {
            // log('获取', links.length, '个链接')
            const key = 'cache:' + links.join(':');
            if (options[key]) {
                return Promise.resolve(options[key])
            }
            return weather(links).then(list => {
                // log('cachedWeather准备返回')
                options[key] = list;
                return list;
            });
        }
    });
    return result;
}

