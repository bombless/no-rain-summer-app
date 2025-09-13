<script setup>
import { ref } from "vue";
import { invoke } from "@tauri-apps/api/core";
import './renderer'


function get(url) {
  return invoke('get_data', { url });
}
</script>

<template>
<div id="content">
  <div id="map_container"></div>
      <div id="pannel">
        <fieldset>
          <input type="radio" name="temperature-type" id="higherTemperature"></input>
          <label for="higherTemperature">找高温</label>
          <input type="radio" name="temperature-type" id="lowerTemperature"></input>
          <label for="lowerTemperature">找低温</label>
        </fieldset>
        <fieldset>
          <legend>个人信息：</legend>
          <label for="departurePoint">出发地：</label>
          <input id="departurePoint"></input>
        </fieldset>
        <ul id="tabs">
          <li>全国</li>
        </ul>
      </div>
    </div>

</template>


    <!--
<script type="text/javascript" src="https://webapi.amap.com/maps?v=2.0&key=bd025ef2a45752cd896864d70447a76f"></script>
    
    -->
<style scoped>

      body { margin: 0; }
      #content { position: relative; }
      window, #content { width: 1500px; height: 900px; }
      #map_container { position: absolute; left: 0; width: 1200px; height: 900px; }
      #pannel { position: absolute; left: 1200px; height: 900px; }
      .pannel { overflow-y: scroll; }
      #pannel li { cursor: pointer; }
      .amap-info-content { background-color: yellow !important; opacity: .75; }

</style>
<style>
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
