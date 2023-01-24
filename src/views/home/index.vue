<template>
  <div class="container">
    <header>
      <h1 class="m">Умный дом</h1>
      <div class="settings">
        <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M262.29 192.31C249.159 191.013 235.948 193.807 224.466 200.308C212.983 206.81 203.791 216.701 198.148 228.629C192.505 240.556 190.686 253.937 192.941 266.937C195.196 279.938 201.415 291.925 210.745 301.255C220.075 310.585 232.062 316.804 245.063 319.059C258.064 321.314 271.444 319.495 283.371 313.852C295.299 308.209 305.19 299.017 311.692 287.534C318.193 276.052 320.987 262.841 319.69 249.71C318.212 234.99 311.689 221.233 301.228 210.772C290.767 200.311 277.01 193.788 262.29 192.31ZM416.39 256C416.349 262.957 415.838 269.902 414.86 276.79L460.07 312.25C462.039 313.882 463.365 316.159 463.814 318.676C464.262 321.194 463.804 323.789 462.52 326L419.75 400C418.451 402.19 416.421 403.851 414.017 404.691C411.613 405.531 408.99 405.495 406.61 404.59L361.71 386.51C359.234 385.524 356.552 385.168 353.905 385.473C351.257 385.779 348.727 386.736 346.54 388.26C339.688 392.979 332.487 397.171 325 400.8C322.646 401.944 320.61 403.65 319.072 405.767C317.534 407.884 316.541 410.348 316.18 412.94L309.45 460.83C309.008 463.359 307.701 465.656 305.753 467.329C303.805 469.001 301.337 469.946 298.77 470H213.23C210.705 469.956 208.271 469.054 206.328 467.442C204.385 465.829 203.049 463.603 202.54 461.13L195.82 413.31C195.443 410.689 194.424 408.203 192.854 406.071C191.283 403.939 189.211 402.228 186.82 401.09C179.342 397.48 172.166 393.277 165.36 388.52C163.181 387.004 160.659 386.054 158.021 385.755C155.383 385.457 152.713 385.819 150.25 386.81L105.36 404.88C102.981 405.786 100.359 405.823 97.9551 404.985C95.5514 404.148 93.5205 402.488 92.2201 400.3L49.4501 326.3C48.1642 324.089 47.7047 321.494 48.1533 318.976C48.602 316.458 49.9297 314.181 51.9001 312.55L90.1101 282.55C92.2034 280.888 93.8487 278.73 94.8964 276.271C95.9442 273.812 96.3614 271.131 96.1101 268.47C95.7501 264.3 95.5301 260.14 95.5301 255.97C95.5301 251.8 95.7401 247.7 96.1101 243.62C96.3339 240.975 95.8963 238.316 94.8367 235.883C93.777 233.449 92.1287 231.318 90.0401 229.68L51.8501 199.68C49.9117 198.041 48.6119 195.772 48.1786 193.271C47.7453 190.77 48.206 188.196 49.4801 186L92.2501 112C93.5489 109.81 95.5792 108.149 97.9831 107.309C100.387 106.469 103.01 106.505 105.39 107.41L150.29 125.49C152.766 126.476 155.448 126.832 158.096 126.527C160.743 126.221 163.274 125.264 165.46 123.74C172.313 119.021 179.513 114.829 187 111.2C189.354 110.056 191.39 108.35 192.928 106.233C194.466 104.116 195.459 101.652 195.82 99.06L202.55 51.17C202.992 48.6408 204.299 46.3436 206.247 44.6711C208.195 42.9985 210.663 42.0544 213.23 42H298.77C301.295 42.0437 303.729 42.946 305.672 44.5583C307.615 46.1707 308.951 48.3968 309.46 50.87L316.18 98.69C316.557 101.311 317.576 103.797 319.147 105.929C320.717 108.061 322.789 109.772 325.18 110.91C332.658 114.52 339.834 118.723 346.64 123.48C348.819 124.996 351.341 125.946 353.979 126.245C356.617 126.543 359.287 126.181 361.75 125.19L406.64 107.12C409.019 106.214 411.641 106.177 414.045 107.015C416.449 107.852 418.48 109.512 419.78 111.7L462.55 185.7C463.836 187.911 464.295 190.506 463.847 193.024C463.398 195.542 462.07 197.819 460.1 199.45L421.89 229.45C419.788 231.106 418.133 233.262 417.076 235.721C416.019 238.18 415.595 240.865 415.84 243.53C416.17 247.67 416.39 251.83 416.39 256Z" stroke="currentColor" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
    </header>
    <div class="groups">
      <span v-for="(group,index) in groups" :key="index" :class="{active: selectedGroup == group}" @click="selectedGroup = group">{{ group }}</span>
    </div>
<!--    <div contenteditable="true" style="white-space: pre;">{{devices[0]}}</div>-->
    <div class="devices">
      <div class="device"
           v-for="(device,index) in devices"
           :key="index"
           @click="({target})=>animate(target,120)">
<!--          @mousedown="startDrag($event,device)"-->
<!--          @mouseup="stopDrag($event,device)"-->
<!--          @mousemove="moveDrag($event,device)"-->
<!--          @mouseleave="stopDrag($event,device)"-->
<!--        @touchStart="startDrag($event,device)"-->
<!--        @touchEnd="stopDrag($event,device)"-->
<!--        @touchCancel="stopDrag($event,device)"-->
<!--        @touchMove="moveDrag($event,device)"-->
          <i v-if="device.online" class="online"></i>
          <i v-else class="offline"></i>
          <div class="color" v-if="device.device_type.id == 7">
            <div v-if="device?.values?.find(item=>item.title == 'color')" :style="`background: ${rgbToHex(device?.values?.find(item=>item.title == 'color').value.r,device?.values?.find(item=>item.title == 'color').value.g,device?.values?.find(item=>item.title == 'color').value.b)}`"></div>
            <input v-if="device?.values?.find(item=>item.title == 'color')"
                   @change="changeLight($event,device)" type="color"
                   :value="rgbToHex(device?.values?.find(item=>item.title == 'color').value.r,device?.values?.find(item=>item.title == 'color').value.g,device?.values?.find(item=>item.title == 'color').value.b)">
          </div>
          <p class="temp" v-if="device.device_type.id == 3">Температура: {{device?.values?.find(item=>item.title == 'temp').value.temp}} °C</p>
          <p class="temp-big" v-if="device.device_type.id == 3">{{device?.values?.find(item=>item.title == 'temp').value.temp}} <span>°C</span></p>
          <p class="hud" v-if="device.device_type.id == 3">Влажность: {{device?.values?.find(item=>item.title == 'temp').value.hud}}%</p>
          <span>{{ device.title }}</span>
          <canvas :id="'deviceCanvas'+index"></canvas>
      </div>
    </div>
  </div>
</template>
<script>
import gsap from "gsap";
import {TweenMax} from "gsap";
import P5 from "p5";
import { isProxy, toRaw } from 'vue';

export default {
  name: "home",
  data() {
    return {
      devices: [],
      device_type: [],
      groups: [],
      selectedGroup: 'все',
      dragInterval: undefined,
      isDragging: false,
      dragEl: undefined
    }
  },
  watch: {
    selectedGroup(val){
      this.loadData()
    }
  },
  mounted() {
    // new P5((p5)=>{
    //   // p5.setup = _ =>{
    //   //   let canvas = p5.createCanvas(500, 500)
    //   //   canvas.parent("p5Canvas");
    //   //   // p5.background(100);
    //   //   p5.noStroke()
    //   //   p5.fill(255, 204, 0)
    //   //   p5.circle(100,100,100)
    //   // }
    // })
    this.loadData()
    this.groups.push('все')
    setInterval(()=>{
      this.loadData()
    },5000)
    if (window.navigator && window.navigator.vibrate) {
      console.log("поддерживается")
    } else {
      console.log("не поддерживается")
    }
  },
  methods: {
    loadData(){
      this.$api.get('user/device').then(res => {
        let localDevices = res.devices
        localDevices.forEach(device => {
          device.online = new Date(device.online.replace(' ', 'T')).getTime() > new Date().getTime()
          device.group.forEach(group => {
            if (!this.groups.find(item => item == group)) {
              this.groups.push(group)
            }
          })
        })
        this.device_type = res.device_type
        localDevices = localDevices.filter(device => this.selectedGroup == 'все' ? true : device.group.includes(this.selectedGroup))
        localDevices = localDevices.sort((a, b) => {
          if (a.index < b.index) return -1;
          if (a.index > b.index) return 1;
          return 0;
        })
        if(JSON.stringify(this.devices) != JSON.stringify(localDevices)){
          this.devices = localDevices
          for (let i = 0; i < this.devices.length; i++) {
            this.devices[i].index = i
            this.$api.get(`device/values?deviceId=${this.devices[i].key}`).then(res=>{
              this.devices[i].values = res
            })
          }
          console.log(localDevices)
        }
      })
    },
    hexToRgb(hex) {
      hex = hex.replace('#', '').match(/.{1,2}/g)
      return {
        "r": parseInt(hex[0], 16),
        "g": parseInt(hex[1], 16),
        "b": parseInt(hex[2], 16)
      };
    },
    rgbToHex(r, g, b) {
      return `#${r.toString(16).length == 1 ? "0"+r.toString(16) : r.toString(16)}${g.toString(16).length == 1 ? "0"+g.toString(16) : g.toString(16)}${b.toString(16).length == 1 ? "0"+b.toString(16) : b.toString(16)}`;
    },
    vibrate(value) {
      let navigator = window.navigator
      if ("vibrate" in navigator) {
        navigator.vibrate(value)
      } else if ("oVibrate" in navigator) {
        navigator.oVibrate(value)
      } else if ("mozVibrate" in navigator) {
        navigator.mozVibrate(value)
      } else if ("webkitVibrate" in navigator) {
        navigator.webkitVibrate(value)
      }
    },
    animate(el = document.body, vibration = 0){
      this.vibrate(vibration)
      TweenMax.to(el, 0.03, {
        x: `${Math.random()>0.5}${Math.random()*10}`,
        y: `${Math.random()>0.5}${Math.random()*10}`,
        rotation: `2`,
        yoyo: true,
        repeat: 1
      })
    },
    startDrag(event,device){
      console.log(event,device)
      this.isDragging = true
      this.animate(event.target,100)
      // event.target.style.opacity=0
      // event.dataTransfer.dropEffect = "move"
      // event.dataTransfer.effectAllowed = "move"
      // event.dataTransfer.setData('item',device.index)
      this.dragEl = event.target
      this.dragInterval = setInterval(()=>{
        this.animate(event.target)
      },320)
    },
    stopDrag(event,device){
      this.isDragging = false
      clearInterval(this.dragInterval)
      gsap.set(this.dragEl, {
        css: {
          transform: 'none',
          top: 'auto',
          left: 'auto',
        }
      })
      // event.target.style.opacity=1
    },
    moveDrag(event,device){
      if(this.isDragging){
        console.log(2,event)
        gsap.set(this.dragEl, {
          css: {
            left: event.clientX - this.dragEl.offsetWidth / 2,
            top: event.clientY - this.dragEl.offsetHeight / 2
          }
        })
      }
    },
    onDrop(event,index){
      index = index.index
      const dragIndex = Number(event.dataTransfer.getData('item'))
      if(index != dragIndex){
        let dropItem = this.devices.find(item => item.index == index)
        let dragItem = this.devices.find(item => item.index == dragIndex)
        this.devices.splice(this.devices.findIndex(item=> item == dragItem),1)
        this.devices.splice(this.devices.findIndex(item=> item == dropItem),1)
        dropItem.index = dragIndex
        dragItem.index = index
        this.devices.push(dragItem,dropItem)
        this.devices = this.devices.sort((a, b) => {
          if (a.index < b.index) return -1;
          if (a.index > b.index) return 1;
          return 0;
        })
      }
    },
    changeLight(event,device){
      if(event.target.value && device){
        console.log(this.hexToRgb(event.target.value),device.key)
        let color = this.hexToRgb(event.target.value)
        this.$api.get(`device/values?deviceId=${device.key}&color=${color.r},${color.g},${color.b},255`).then(()=>{
          this.loadData()
        })
      }
    },
    touchDrag(){

    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 48px;
  padding-bottom: 48px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
  header{
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
    h1{
      user-select: none;
    }
    .settings{
      height: 36px;
      aspect-ratio: 1/1;
      cursor: pointer;
      border-radius: var(--border-radius);
      @media screen and (min-width: 768px) {
        &:hover svg{
          transform: rotate(180deg);
        }
      }
      svg{
        transition: 0.2s;
        pointer-events: none;
        height: 24px;
        aspect-ratio: 1/1;
        margin: 0 auto;
      }
    }
  }
  .groups {
    width: 100%;
    display: flex;
    gap: 12px;

    span {
      user-select: none;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: var(--border-radius);
      transition: 0.3s;
      border: 1px solid transparent;
      &.active{
        border: 1px solid var(--font-color);
      }
      @media screen and (min-width: 768px) {
        &:hover {
          background: var(--bg-darken-color);
        }
      }
    }
  }

  .devices {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    width: 100%;
    gap: 24px;
    @media screen and (max-width: 1000px) {
      grid-template-columns: 1fr 1fr 1fr;
      gap: 20px;
    }
    @media screen and (max-width: 800px) {
      grid-template-columns: 1fr 1fr;
      gap: 16px;
    }
    .device {
      position: relative;
      padding: 16px;
      padding-top: 24px;
      width: 100%;
      max-width: 400px;
      aspect-ratio: 1/1;
      transition: background 0.3s, border-radius 0.2s;
      background: var(--bg-darken-color);
      border-radius: var(--border-radius);
      user-select: none;
      transform-origin: center;
      cursor: pointer;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 12px;
      box-shadow: 0px 25px 50px -10px rgba(50, 50, 93, 0.05), 0px 15px 30px -15px rgba(0, 0, 0, 0.01);
      @media screen and (min-width: 768px) {
        &:hover {
        }
      }
      .temp{
        pointer-events: none;
      }
      .hud{
        pointer-events: none;
      }
      .temp-big{
        pointer-events: none;
        font-size: 40px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
        text-align: center;
        white-space: nowrap;
        span{
          font-size: 18px;
        }
      }
      .color{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        >div{
          position: absolute;
          width: 45%;
          aspect-ratio: 1/1;
          filter: blur(40px);
          top: 50%;
          left: 50%;
          transform: translate(-50%,-50%);
          transition: background 0.3s;
        }
        input{
          width: 100%;
          height: 100%;
          padding: 0;
          margin: 0;
          min-width: 0;
          opacity: 0;
        }
      }
      canvas{
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        pointer-events: none;
      }
      >span{
        font-size: 16px;
        opacity: 0.9;
        position: absolute;
        bottom: 16px;
        left: 16px;
        pointer-events: none;
        @media screen and (max-width: 800px){
          font-size: 14px;
        }
      }
      .online, .offline {
        pointer-events: none;
        position: absolute;
        top: 8px;
        left: 8px;
        height: 8px;
        width: 8px;
        background: #26e510;
        border-radius: 12px;
      }

      .offline {
        background: none;
        border: 1px solid var(--font-color);
      }
    }
  }

  //.cards {
  //  display: grid;
  //  gap: 24px;
  //  grid-template-columns: repeat(2, 172px);
  //}
  //
  //.card {
  //  display: flex;
  //  flex-direction: column;
  //  align-items: flex-start;
  //  cursor: pointer;
  //  gap: 24px;
  //  padding: 16px;
  //  aspect-ratio: 1/1;
  //  border-radius: var(--border-radius);
  //  background: var(--bg-light-color);
  //  transition: background 0.4s;
  //  position: relative;
  //  user-select: none;
  //
  //  svg {
  //    height: 48px;
  //    width: 48px;
  //    position: absolute;
  //    left: 50%;
  //    top: 50%;
  //    transform: translate(-50%, -50%);
  //  }
  //
  //  @media screen and (min-width: 768px) {
  //    &:hover {
  //      background: var(--bg-darken-color);
  //    }
  //  }
  //}
  //
  //.card {
  //  input {
  //    height: 96px;
  //    width: 96px;
  //    padding: 0;
  //    margin: 0;
  //    min-width: 0;
  //    min-height: 0;
  //    margin: auto;
  //    overflow: hidden;
  //  }
  //}
  //
  //.card:last-child {
  //  justify-content: center;
  //  align-items: center;
  //}
}
</style>
