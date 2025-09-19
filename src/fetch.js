
import { parse } from 'node-html-parser';
import geolocation from './region.json';

import { invoke } from "@tauri-apps/api/core";
import {log} from "./log";

function regions() {
    const data = {};
    for (const province of geolocation.districts) {
        const entry = province.name;
        for (const city of province.districts) {
            const key = city.name;
            if (!data[entry]) {
                data[entry] = {};
            }
            data[entry][key] = [city.center.longitude, city.center.latitude];
        }
    }

    return (province, city) => {
        for (const entry of Object.keys(data)) {
            if (entry.indexOf(province) > -1) {
                for (const key of Object.keys(data[entry])) {
                    if (key.indexOf(city) > -1) {
                        return data[entry][key];
                    }
                }
            }
        }
    }

}


/**
 * GET 请求
 * @param {string} url 请求地址
 * @returns {Promise<string>} 返回一个解析为字符串的 Promise
 */
function get(url) {
  return invoke('get_data', { url });
}

export function cities() {
    const getPosition = regions();
    return get('http://waptianqi.2345.com/temperature-rank-rev.htm')
    .then(html => {
        // debugger;
        // log('cities()', res)
        //console.log(`statusCode: ${res.status}`);
        //console.log(res.data);
        //console.log(res);
        const parser = new DOMParser();
        const root = parser.parseFromString(html, 'text/html');
        const list = root.querySelector('.temperList');
        const ret = [];
        for (const tr of list.childNodes) {
            const nodes = tr.childNodes;
            const link = nodes[1].querySelector('a');
            const city = link.textContent;
            const province = nodes[1].querySelector('i').textContent;
            const position = getPosition(province, city);
            const item = {
                city,
                province,
                position,
                link: link.getAttribute('href'),
                range: nodes[2].textContent,
                average: nodes[3].textContent,
            };
            //console.log(item);
            ret.push(item);
        }
        return ret;
    })
    .catch(error => {
        log('cities() caught error', error)
        console.error(error);
    });

};

export function weather(links) {
    return Promise.all(links.map(link => {
        // log('link', link);
        if (!link) return Promise.reject();
        return get('http://waptianqi.2345.com' + link)
        //.get('http://waptianqi.2345.com' + link)
        .then(res => {

            const parser = new DOMParser();
            const root = parser.parseFromString(res, 'text/html');
            // debugger;
            //console.log('x', root);
            //window.x = root;
            //console.log(res);
            const list = [].slice.call(root.querySelectorAll('.days15-weather .phrase')).map(x => x.textContent.indexOf('雨') > -1);
            // log('雨', list);
            return list;
        })
        .catch(error => {
            log('caught error', error)
            console.error('caught error', error);
        });

    }))

}
