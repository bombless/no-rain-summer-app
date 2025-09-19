
import { Cities } from './cities';
import debounce from 'debounce';


import { watch } from "vue";

import { log } from './log';


export function start({temperatureMode, departurePoint, cityList, provinceList}) {

    AMapLoader.load({
        "key": "bd025ef2a45752cd896864d70447a76f",          // 申请好的Web端开发者Key，首次调用 load 时必填
        "version": "2.0",   // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        "plugins": [],           // 需要使用的的插件列表，如比例尺'AMap.Scale'等
        "AMapUI": {         // 是否加载 AMapUI，缺省不加载
            "version": '1.1',   // AMapUI 版本
            "plugins": ['overlay/SimpleMarker'],       // 需要加载的 AMapUI ui插件
        },
        "Loca": {        // 是否加载 Loca， 缺省不加载
            "version": '2.0'  // Loca 版本
        },
    }).then((AMap) => {
        const map = new AMap.Map('map_container');
        init(AMap, map);
        //map.addControl(new AMap.Scale());
    }).catch((e) => {
        console.error(e);  //加载错误提示
    });

    function mark(map, info) {
        const marker = new AMap.Marker({
            icon: 'http://vdata.amap.com/icons/b18/1/2.png',
            position: info.position,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
            title: info.province + info.city,
        });
        // log('position', info.position, 'title', info.province + info.city);

        // 将创建的点标记添加到已有的地图实例：
        debounce(() => {
            map.add(marker);
            map.setFitView();
        }, 20).call();
        return marker;
    }

    const storage = localStorage;

    async function init(AMap, map) {

        departurePoint.value = storage.getItem('departurePoint') || '';

        watch(departurePoint, newVal => {
            storage.setItem('departurePoint', newVal.toString());
        });

        temperatureMode.value = storage.getItem('temperatureMode') || '';

        watch(temperatureMode, newVal => {
            log('temperatureMode', newVal);
            storage.setItem('temperatureMode', newVal.toString());
        });



        const cities = new Cities(cityList, provinceList, x => {
            map.setFitView(x)
        }, info => mark(map, info));
        for (const item of await cities.items) {

            const info = document.createElement('div');
            const cityInfo = document.createElement('div');
            cityInfo.textContent = item.city;
            const temperatureInfo = document.createElement('div');
            temperatureInfo.textContent = item.range;
            info.append(cityInfo, temperatureInfo);

            function zoom() {

                const infoWindow = new AMap.InfoWindow({
                    content: info  //传入 dom 对象，或者 html 字符串
                });

                // 打开信息窗体
                infoWindow.open(map, item.position);
                map.setFitView(cities.getProvinceCities(item.province));
            }

            item.onClick(zoom);
        }
        // log(cityList.value.length, '个城市')
        // computedCities(cityList)
    }

}
