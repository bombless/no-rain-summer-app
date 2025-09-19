<script setup>
import {ref, computed} from "vue";
import {start} from './renderer';
import {log} from "./log.js";
import { rainyFilters, currFilter, watchCities } from "./weather.js";

const temperatureMode = ref('lower');
const forHigherTemperature = computed(() => temperatureMode.value === 'higher');
const departurePoint = ref('');
const cityList = ref([]);
const provinceList = ref([]);
const currProvince = ref('');
const cityOfWeather = watchCities(cityList);
const cityDisplayList = computed(() => {
  const provinceFiltered = cityList.value.filter(x => !currProvince.value || x.province === currProvince.value);
  if (cityOfWeather.value) {
    return provinceFiltered.filter(x => cityOfWeather.value.has(x.city));
  } else {
    return provinceFiltered;
  }
});

start({temperatureMode, departurePoint, cityList, provinceList});


</script>

<template>
  <div id="content">
    <div id="map_container"></div>
    <div id="panel">
      <fieldset>
        <label>
          <input type="radio" name="temperatureMode" value="higher" v-model="temperatureMode">
          找高温
        </label>
        <label>
          <input type="radio" name="temperatureMode" value="lower" v-model="temperatureMode">
          找低温
        </label>
      </fieldset>
      <fieldset>
        <legend>个人信息：</legend>
        <label for="departurePoint">出发地：</label>
        <input id="departurePoint" v-model="departurePoint">
      </fieldset>
      <fieldset>
        <label class="block" v-for="o in rainyFilters">
          <input type="radio" name="rainyFilter" :value="o" v-model="currFilter">
          {{ o }}
        </label>
      </fieldset>
      <ul id="tabs">
        <li @click="currProvince = null">全国</li>
        <li v-for="p in provinceList" v-text="p.text" @click="currProvince = p.text"></li>
      </ul>
      <ol>
        <li v-for="c in cityDisplayList" v-text="c.text" @click="c.clickHandler"></li>
      </ol>
    </div>
  </div>

</template>


<style scoped>
#content {
  width: 1500px;
  height: 900px;
}

#map_container {
  position: absolute;
  left: 0;
  width: 1200px;
  height: 900px;
}

#panel {
  position: absolute;
  left: 1200px;
  height: 900px;
  overflow-y: auto;
}

.panel {
  overflow-y: scroll;
}

#panel li {
  cursor: pointer;
}

.amap-info-content {
  background-color: yellow !important;
  opacity: .75;
}

</style>
<style>
body {
  margin: 0;
}

:root {
  font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;

  color: #0f0f0f;
  background-color: #f6f6f6;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;
}


</style>
