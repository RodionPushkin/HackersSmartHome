<template>
  <div class="container">
    <header>
      <h1 class="m">Умный дом</h1>
      <div class="settings">
        <!--        <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">-->
        <!--          <path-->
        <!--            d="M262.29 192.31C249.159 191.013 235.948 193.807 224.466 200.308C212.983 206.81 203.791 216.701 198.148 228.629C192.505 240.556 190.686 253.937 192.941 266.937C195.196 279.938 201.415 291.925 210.745 301.255C220.075 310.585 232.062 316.804 245.063 319.059C258.064 321.314 271.444 319.495 283.371 313.852C295.299 308.209 305.19 299.017 311.692 287.534C318.193 276.052 320.987 262.841 319.69 249.71C318.212 234.99 311.689 221.233 301.228 210.772C290.767 200.311 277.01 193.788 262.29 192.31ZM416.39 256C416.349 262.957 415.838 269.902 414.86 276.79L460.07 312.25C462.039 313.882 463.365 316.159 463.814 318.676C464.262 321.194 463.804 323.789 462.52 326L419.75 400C418.451 402.19 416.421 403.851 414.017 404.691C411.613 405.531 408.99 405.495 406.61 404.59L361.71 386.51C359.234 385.524 356.552 385.168 353.905 385.473C351.257 385.779 348.727 386.736 346.54 388.26C339.688 392.979 332.487 397.171 325 400.8C322.646 401.944 320.61 403.65 319.072 405.767C317.534 407.884 316.541 410.348 316.18 412.94L309.45 460.83C309.008 463.359 307.701 465.656 305.753 467.329C303.805 469.001 301.337 469.946 298.77 470H213.23C210.705 469.956 208.271 469.054 206.328 467.442C204.385 465.829 203.049 463.603 202.54 461.13L195.82 413.31C195.443 410.689 194.424 408.203 192.854 406.071C191.283 403.939 189.211 402.228 186.82 401.09C179.342 397.48 172.166 393.277 165.36 388.52C163.181 387.004 160.659 386.054 158.021 385.755C155.383 385.457 152.713 385.819 150.25 386.81L105.36 404.88C102.981 405.786 100.359 405.823 97.9551 404.985C95.5514 404.148 93.5205 402.488 92.2201 400.3L49.4501 326.3C48.1642 324.089 47.7047 321.494 48.1533 318.976C48.602 316.458 49.9297 314.181 51.9001 312.55L90.1101 282.55C92.2034 280.888 93.8487 278.73 94.8964 276.271C95.9442 273.812 96.3614 271.131 96.1101 268.47C95.7501 264.3 95.5301 260.14 95.5301 255.97C95.5301 251.8 95.7401 247.7 96.1101 243.62C96.3339 240.975 95.8963 238.316 94.8367 235.883C93.777 233.449 92.1287 231.318 90.0401 229.68L51.8501 199.68C49.9117 198.041 48.6119 195.772 48.1786 193.271C47.7453 190.77 48.206 188.196 49.4801 186L92.2501 112C93.5489 109.81 95.5792 108.149 97.9831 107.309C100.387 106.469 103.01 106.505 105.39 107.41L150.29 125.49C152.766 126.476 155.448 126.832 158.096 126.527C160.743 126.221 163.274 125.264 165.46 123.74C172.313 119.021 179.513 114.829 187 111.2C189.354 110.056 191.39 108.35 192.928 106.233C194.466 104.116 195.459 101.652 195.82 99.06L202.55 51.17C202.992 48.6408 204.299 46.3436 206.247 44.6711C208.195 42.9985 210.663 42.0544 213.23 42H298.77C301.295 42.0437 303.729 42.946 305.672 44.5583C307.615 46.1707 308.951 48.3968 309.46 50.87L316.18 98.69C316.557 101.311 317.576 103.797 319.147 105.929C320.717 108.061 322.789 109.772 325.18 110.91C332.658 114.52 339.834 118.723 346.64 123.48C348.819 124.996 351.341 125.946 353.979 126.245C356.617 126.543 359.287 126.181 361.75 125.19L406.64 107.12C409.019 106.214 411.641 106.177 414.045 107.015C416.449 107.852 418.48 109.512 419.78 111.7L462.55 185.7C463.836 187.911 464.295 190.506 463.847 193.024C463.398 195.542 462.07 197.819 460.1 199.45L421.89 229.45C419.788 231.106 418.133 233.262 417.076 235.721C416.019 238.18 415.595 240.865 415.84 243.53C416.17 247.67 416.39 251.83 416.39 256Z"-->
        <!--            stroke="currentColor" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/>-->
        <!--        </svg>-->
      </div>
    </header>
    <div class="groups">
      <span
        v-for="(group, index) in groups"
        :key="index"
        :class="{ active: selectedGroup == group }"
        @click="selectedGroup = group"
        >{{ group }}</span
      >
    </div>
<!--            <div contenteditable="true" style="white-space: pre;">{{selected_devices[0]}}</div>-->
    <div class="devices" ref="devices" @mouseleave="stopDrag">
      <div class="device-wrapper"
           v-for="(device, index) in selected_devices"
           :key="index">
        <div
          class="device"
          @mousedown="mouseStart($event,device)"
          @mouseup="mouseEnd($event,device)"
          @mousemove="mouseMove($event,device)"
          @touchstart="touchStart($event,device)"
          @touchend="touchEnd($event,device)"
          @touchmove="touchMove($event,device)"
          @click.prevent.right="toggleStart($event, device, true)"
        >
          <i v-if="device.online" class="online"></i>
          <i v-else class="offline"></i>
          <div
            class="color"
            v-if="device.device_type == 7"
            @click="
            changeLight(
              $event,
              device,
              device?.values?.color.value.split(',')[3] == 0 ? 255 : 0
            )
          "
          >
            <div
              v-if="device?.values?.color"
              :style="`background: ${
              device?.values?.color.value.split(',')[3] == 0
                ? '#000'
                : rgbToHex(
                    device?.values?.color.value.split(',')[0],
                    device?.values?.color.value.split(',')[1],
                    device?.values?.color.value.split(',')[2]
                  )
            }; width: ${
              device?.values?.color.value.split(',')[3] != 0
                ? device.values.color.value.split(',')[3] / (255 / 50)
                : device.values.color.value.split(',')[3]
            }%`"
            ></div>
            <!--          <input v-if="device?.values?.color"-->
            <!--                 @change="changeLight($event,device)" type="color"-->
            <!--                 :value="rgbToHex(device?.values?.color.value.split(',')[0],device?.values?.color.value.split(',')[1],device?.values?.color.value.split(',')[2])">-->
          </div>
          <p class="alert-big"
            v-if="device.values?.water"
            :class="{ alert: device.values.water?.value == 1 }"
          ></p>
          <p class="alert-big"
             v-if="device.values?.gas"
             :class="{ alert: device.values.water?.value == 1 }"
          ></p>
          <p class="alert-big"
             v-if="device.values?.enabled"
             :class="{ alert: device.values.enabled?.value == 1 }"
          ></p>
          <p class="temp" v-if="device.device_type == 3">
            Влажность:
            {{ device?.values?.humi[device.values?.humi.length - 1].value }}%
          </p>
          <p class="temp-big" v-if="device.device_type == 3">
            {{ device?.values?.temp[device.values?.temp.length - 1].value }}
            <span>°C</span>
          </p>
          <span>{{ device.title }}</span>
          <canvas :id="'deviceCanvas' + index"></canvas>
        </div>
      </div>
      <div class="device-wrapper">
        <div class="device add" @click="addDevice($event)">
          <svg
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M256 112V400M400 256H112"
              stroke="currentColor"
              stroke-width="32"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
    <div class="color-picker-wrapper" :class="{ active: colorPicker.show }">
      <div class="color-picker" id="colorpicker">
        <div
          class="current-color"
          :style="`background: ${
            colorPicker.color[3] == 0
              ? '#000'
              : rgbToHex(
                  colorPicker.color[0],
                  colorPicker.color[1],
                  colorPicker.color[2]
                )
          }; width: ${
            colorPicker.color[3] != 0
              ? colorPicker.color[3] / (255 / 40)
              : colorPicker.color[3]
          }%`"
        ></div>
      </div>
      <div
        class="backdrop"
        @click="openColorPicker(false)"
        @click.prevent.right="openColorPicker(false)"
      ></div>
    </div>
  </div>
</template>
<script>
import gsap from "gsap";
import { TweenMax, TweenLite } from "gsap";
import P5 from "p5";
import { isProxy, toRaw } from "vue";

export default {
  name: "home",
  data() {
    return {
      devices: [],
      selected_devices: [],
      device_type: [],
      groups: [],
      selectedGroup: "все",
      toggle: {
        is_toggling: false,
        time: 0,
        action_time: 700,
      },
      drag: {
        item: undefined,
        interval: undefined,
        time: undefined
      },
      p5: undefined,
      colorPicker: {
        show: false,
        color: [0, 0, 0, 0],
        device: undefined,
      },
    };
  },
  watch: {
    selectedGroup(val) {
      this.loadData();
    },
  },
  mounted() {
    new P5((p5) => {
      this.p5 = p5;
      let colorpickercanvas = undefined;
      let colorpicker = document.getElementById("colorpicker");
      let img = undefined;
      const mouse = {};
      let timeout;
      let brightnessTimeout;
      const getColor = () => {
        if (this.colorPicker.show && !mouse.start) {
          let color = p5.get(p5.mouseX, p5.mouseY);
          if (color[3] != 0) {
            if (
              JSON.stringify(color) != JSON.stringify(this.colorPicker.color)
            ) {
              this.colorPicker.color = [
                color[0],
                color[1],
                color[2],
                this.colorPicker.color[3],
              ];
              delete mouse.start;
              clearTimeout(timeout);
              timeout = setTimeout(() => {
                let color = {
                  r: this.colorPicker.color[0],
                  g: this.colorPicker.color[1],
                  b: this.colorPicker.color[2],
                  a: this.colorPicker.color[3],
                };
                this.$api
                  .get(
                    `device/values?deviceId=${this.colorPicker.device.mac}&color=${color.r},${color.g},${color.b},${color.a}`
                  )
                  .then(() => {});
              }, 50);
            }
          }
        }
      };
      p5.setup = (_) => {
        colorpickercanvas = p5.createCanvas(
          colorpicker.offsetHeight,
          colorpicker.offsetWidth
        );
        colorpickercanvas.parent("colorpicker");
        img = p5.loadImage("/api/static/color.png");
        if (
          !(
            navigator.userAgent.match(/Android/i) ||
            navigator.userAgent.match(/webOS/i) ||
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i) ||
            navigator.userAgent.match(/BlackBerry/i) ||
            navigator.userAgent.match(/Windows Phone/i)
          )
        ) {
          colorpickercanvas.mouseClicked(getColor);
        }
        colorpickercanvas.mousePressed((event) => {
          event.preventDefault();
          if (p5.get(p5.mouseX, p5.mouseY)[3] == 0) {
            mouse.start = {
              x: p5.mouseX,
              y: p5.mouseY,
            };
          }
        });
        colorpickercanvas.mouseMoved(() => {
          if (mouse.start) {
            mouse.move = {
              x: p5.mouseX,
              y: p5.mouseY,
            };
            mouse.length = Math.sqrt(
              Math.pow(mouse.center.x - mouse.move.x, 2) +
                Math.pow(mouse.center.y - mouse.move.y, 2)
            );
            if (mouse.length > 255) {
              mouse.length = 255;
            } else if (mouse.length < 10) {
              mouse.length = 10;
            }
            this.colorPicker.color[3] = mouse.length;
          }
        });
        colorpickercanvas.mouseReleased(() => {
          delete mouse.start;
          let color = {
            r: this.colorPicker.color[0],
            g: this.colorPicker.color[1],
            b: this.colorPicker.color[2],
            a: this.colorPicker.color[3],
          };
          this.$api
            .get(
              `device/values?deviceId=${this.colorPicker.device.mac}&color=${color.r},${color.g},${color.b},${color.a}`
            )
            .then(() => {});
        });
        colorpickercanvas.touchStarted(() => {
          if (p5.get(p5.mouseX, p5.mouseY)[3] == 0) {
            mouse.start = {
              x: p5.mouseX,
              y: p5.mouseY,
            };
          }
        });
        colorpickercanvas.touchMoved(() => {
          if (mouse.start) {
            mouse.move = {
              x: p5.mouseX,
              y: p5.mouseY,
            };
            mouse.length = Math.sqrt(
              Math.pow(mouse.center.x - mouse.move.x, 2) +
                Math.pow(mouse.center.y - mouse.move.y, 2)
            );
            if (mouse.length > 255) {
              mouse.length = 255;
            } else if (mouse.length < 0) {
              mouse.length = 0;
            }
            this.colorPicker.color[3] = mouse.length;
          } else {
            getColor();
          }
        });
        colorpickercanvas.touchEnded(() => {
          delete mouse.start;
          let color = {
            r: this.colorPicker.color[0],
            g: this.colorPicker.color[1],
            b: this.colorPicker.color[2],
            a: this.colorPicker.color[3],
          };
          this.$api
            .get(
              `device/values?deviceId=${this.colorPicker.device.mac}&color=${color.r},${color.g},${color.b},${color.a}`
            )
            .then(() => {});
        });
      };
      p5.draw = (_) => {
        p5.clear();
        p5.image(img, 0, 0);
        img.resize(colorpicker.offsetHeight, colorpicker.offsetWidth);
        mouse.center = {
          x: colorpicker.offsetHeight * 0.8 * 0.5,
          y: colorpicker.offsetHeight * 0.8 * 0.5,
        };
      };
    });
    this.groups.push("все");
    this.loadData();
    this.loadData(true);
    if (window.navigator && window.navigator.vibrate) {
      console.log("поддерживается");
    } else {
      console.log("не поддерживается");
    }
  },
  methods: {
    loadData(longpooling = false) {
      this.$api
        .get(`user/device${longpooling ? "?longpool=true" : ""}`)
        .then((res) => {
          if (res.event) {
            this.loadData();
            this.loadData(true);
          } else {
            if (!res.devices) throw "нет девайсов";
            let localDevices = res.devices;
            localDevices.forEach((device,index) => {
              device.online =
                new Date(device.online.replace(" ", "T")).getTime() >
                new Date().getTime();
              if(!device.index){
                device.index = index
              }
              device.group.forEach((group) => {
                if (!this.groups.includes(group.title)) {
                  this.groups.push(group.title);
                }
              });
            });
            // if (JSON.stringify(this.devices) != JSON.stringify(localDevices)) {
            this.devices = localDevices;
            // localDevices.forEach(device=>{
            //   console.log(device.group)
            // })
            // console.log(this.selectedGroup, this.groups,this.devices);
            if (this.selectedGroup != "все") {
              localDevices = localDevices.filter(
                (device) =>
                  !!device.group.find(
                    (group) => group.title == this.selectedGroup
                  )
              );
            }
            // console.log(
            //   localDevices.filter(
            //     (device) =>
            //       !!device.group.find(
            //         (group) => group.title == this.selectedGroup
            //       )
            //   )
            // );
            // localDevices = localDevices.map(device => {
            //   if(device.group.find(group=>group.title == this.selectedGroup))return device
            // })
            // console.log(localDevices.filter(device=>!!device.group.find(group=>group.title == this.selectedGroup)))
            this.selected_devices = localDevices;
            // console.log(localDevices)
            // }
          }
        })
        .catch((err) => {
          console.log(err);
          setTimeout(() => {
            this.loadData(true);
          }, 2000);
        });
    },
    hexToRgb(hex) {
      hex = hex.replace("#", "").match(/.{1,2}/g);
      return {
        r: parseInt(hex[0], 16),
        g: parseInt(hex[1], 16),
        b: parseInt(hex[2], 16),
      };
    },
    rgbToHex(r, g, b) {
      r = +r;
      g = +g;
      b = +b;
      // console.log(r.toString(16))
      // console.log(`#${r.toString(16).length == 1 ? "0" + r.toString(16) : r.toString(16)}${g.toString(16).length == 1 ? "0" + g.toString(16) : g.toString(16)}${b.toString(16).length == 1 ? "0" + b.toString(16) : b.toString(16)}`)
      return `#${
        r.toString(16).length == 1 ? "0" + r.toString(16) : r.toString(16)
      }${g.toString(16).length == 1 ? "0" + g.toString(16) : g.toString(16)}${
        b.toString(16).length == 1 ? "0" + b.toString(16) : b.toString(16)
      }`;
    },
    vibrate(value) {
      let navigator = window.navigator;
      if ("vibrate" in navigator) {
        navigator.vibrate(value);
      } else if ("oVibrate" in navigator) {
        navigator.oVibrate(value);
      } else if ("mozVibrate" in navigator) {
        navigator.mozVibrate(value);
      } else if ("webkitVibrate" in navigator) {
        navigator.webkitVibrate(value);
      }
    },
    animate(el = document.body, vibration = 0) {
      if (!el.classList.contains("device")) {
        if (!el.parentElement.classList.contains("device")) {
          if (!el.parentElement.parentElement.classList.contains("device")) {
          } else {
            el = el.parentElement.parentElement;
          }
        } else {
          el = el.parentElement;
        }
      }
      this.vibrate(vibration);
      if (vibration == 0) {
        el.style.transform = "none";
      } else {
        TweenLite.to(el, 0.03, {
          x: `${Math.random() > 0.5}${Math.random() * 10}`,
          y: `${Math.random() > 0.5}${Math.random() * 10}`,
          rotation: `2`,
          yoyo: true,
          repeat: 1,
        });
      }
    },
    addDevice(event) {
      this.animate(event.target, 150);
    },
    touchStart(event, item) {
      if (window.mobileAndTabletCheck() && !this.drag.item) {
        this.animate(event.target,100)
        this.drag.item = item
        event.target.classList.toggle('active', true)
        clearInterval(this.drag.interval)
        this.drag.interval = setInterval(()=>{
          TweenLite.to(event.target, 0.03, {
            rotation: `3`,
            yoyo: true,
            repeat: 1,
          });
        },100)
      }
    },
    touchEnd(event, item) {
      if (window.mobileAndTabletCheck()){
        for (let i = 0; i < this.$refs.devices.querySelectorAll('.device').length; i++) {
          const index = i
          const device = this.$refs.devices.querySelectorAll('.device')[i]
          if (index != this.devices.find(c => c == item).index &&
            event.changedTouches[0].pageX >= device.offsetLeft &&
            event.changedTouches[0].pageX <= device.offsetWidth + device.offsetLeft &&
            event.changedTouches[0].pageY >= device.offsetTop &&
            event.changedTouches[0].pageY <= device.offsetHeight + device.offsetTop) {
            let newIndex = this.devices[index].index
            this.devices[index].index = item.index
            this.devices.map(c=>{
              if(c != this.devices[index] && c.index == item.index){
                c.index = newIndex
              }
              return c
            })
            this.filterByIndex()
            break
          }
        }
        this.stopDrag()
      }
    },
    touchMove(event, item) {
      if (window.mobileAndTabletCheck() && this.drag.item) {
        // event.target.style.top = `${event.changedTouches[0].pageY - event.target.offsetHeight / 2}px`
        // event.target.style.left = `${event.changedTouches[0].pageX - event.target.offsetWidth / 2}px`
        gsap.to(event.target,{
          top: event.changedTouches[0].pageY - event.target.offsetHeight / 2,
          left: event.changedTouches[0].pageX - event.target.offsetWidth / 2,
          duration: 0
        })
      }
    },
    mouseStart(event, item) {
      if (!window.mobileAndTabletCheck() && !this.drag.item) {
        this.animate(event.target,100)
        this.drag.item = item
        event.target.classList.toggle('active', true)
        clearInterval(this.drag.interval)
        this.drag.interval = setInterval(()=>{
          TweenLite.to(event.target, 0.03, {
            rotation: `3`,
            yoyo: true,
            repeat: 1,
          });
        },100)
      }
    },
    mouseEnd(event, item) {
      if (!window.mobileAndTabletCheck()){
        for (let i = 0; i < this.$refs.devices.querySelectorAll('.device').length; i++) {
          const index = i
          const device = this.$refs.devices.querySelectorAll('.device')[i]
          if (index != this.devices.find(c => c == item).index &&
            event.pageX >= device.offsetLeft &&
            event.pageX <= device.offsetWidth + device.offsetLeft &&
            event.pageY >= device.offsetTop &&
            event.pageY <= device.offsetHeight + device.offsetTop) {
            let newIndex = this.devices[index].index
            this.devices[index].index = item.index
            this.devices.map(c=>{
              if(c != this.devices[index] && c.index == item.index){
                c.index = newIndex
              }
              return c
            })
            this.filterByIndex()
            break
          }
        }
        this.stopDrag()
      }
    },
    mouseMove(event, item) {
      if (!window.mobileAndTabletCheck() && this.drag.item) {
        gsap.to(event.target, {
          top: event.pageY - event.target.offsetHeight / 2,
          left: event.pageX - event.target.offsetWidth / 2,
          duration: 0
        })
      }
    },
    stopDrag() {
      if (this.drag.item) {
        this.drag.item = undefined
        clearInterval(this.drag.interval)
        this.$refs.devices.querySelectorAll('.device').forEach((device, index) => {
          device.classList?.toggle('active', false)
          gsap.to(device, {
            top: "auto",
            left: "auto",
            duration: 0.3,
            rotation: 0
          })
        })
      }
    },
    filterByIndex(){
      for (let j = this.devices.length - 1; j > 0; j--) {
        for (let i = 0; i < j; i++) {
          if (this.devices[i].index > this.devices[i + 1].index) {
            let temp = this.devices[i];
            this.devices[i] = this.devices[i + 1];
            this.devices[i + 1] = temp;
          }
        }
      }
    },
    changeLight(event, device, alpha = 255) {
      if (event.target.value && device) {
        let color = this.hexToRgb(event.target.value);
        this.$api
          .get(
            `device/values?deviceId=${device.mac}&color=${color.r},${color.g},${color.b},${alpha}`
          )
          .then(() => {});
      } else {
        let color = {
          r: device.values.color.value.split(",")[0],
          g: device.values.color.value.split(",")[1],
          b: device.values.color.value.split(",")[2],
        };
        this.animate(event.target, 80);
        setTimeout(() => {
          this.animate(event.target, 80);
        }, 230);
        setTimeout(() => {
          this.animate(event.target, 0);
        }, 260);
        this.$api
          .get(
            `device/values?deviceId=${device.mac}&color=${color.r},${color.g},${color.b},${alpha}`
          )
          .then(() => {});
      }
    },
    toggleStart(event, device, force = false) {
      if (device.device_type == 7) {
        if (force) {
          this.openColorPicker(true, device);
          this.animate(event.target, 250);
        } else {
          this.toggle.is_toggling = true;
          this.toggle.time = new Date().getTime();
          const interval = setInterval(() => {
            if (this.toggle.is_toggling == false) clearInterval(interval);
            if (this.toggle.time != 0) {
              if (
                this.toggle.time + this.toggle.action_time <
                new Date().getTime()
              ) {
                this.toggle.is_toggling = false;
                this.openColorPicker(true, device);
                this.toggle.time = 0;
                this.animate(event.target, 250);
              }
            }
          }, 30);
        }
      }
    },
    toggleEnd(event, device) {
      this.toggle.is_toggling = false;
      this.toggle.time = 0;
    },
    openColorPicker(value, device) {
      this.colorPicker.show = value;
      if (value) {
        this.colorPicker.color = device.values.color.value.split(",");
        this.colorPicker.device = device;
      }
      // else{
      //   let color = {
      //     r: this.colorPicker.color[0],
      //     g: this.colorPicker.color[1],
      //     b: this.colorPicker.color[2],
      //     a: this.colorPicker.color[3],
      //   }
      //   this.$api.get(`device/values?deviceId=${this.colorPicker.device.mac}&color=${color.r},${color.g},${color.b},${color.a}`).then(() => {})
      // }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding-top: 48px;
  padding-bottom: 48px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;

  header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;

    h1 {
      user-select: none;
    }

    .settings {
      height: 36px;
      aspect-ratio: 1/1;
      cursor: pointer;
      border-radius: var(--border-radius);
      @media screen and (min-width: 768px) {
        &:hover svg {
          transform: rotate(180deg);
        }
      }

      svg {
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

      &.active {
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
    gap: 16px;
    place-items: center ;
    @media screen and (max-width: 1000px) {
      grid-template-columns: 1fr 1fr 1fr;
    }
    @media screen and (max-width: 800px) {
      grid-template-columns: 1fr 1fr;
    }
    .device-wrapper {
      width: 256px;
      height: 256px;
      @media screen and  (max-width: 768px) {
        width: 156px;
        height: 156px;
      }
      aspect-ratio: 1/1;
      background: rgba(220, 220, 220, 0.25);
      border-radius: var(--border-radius);
    }
    .device {
      position: absolute;
      padding: 16px;
      padding-top: 24px;
      width: 256px;
      height: 256px;
      @media screen and  (max-width: 768px) {
        width: 156px;
        height: 156px;
      }
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
      box-shadow: 0px 25px 50px -10px rgba(50, 50, 93, 0.05),
        0px 15px 30px -15px rgba(0, 0, 0, 0.01);

      &.active {
        z-index: 999;
        box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.03);
      }

      .temp,
      .hud {
        font-size: 12px;
        pointer-events: none;
      }

      .temp-big {
        pointer-events: none;
        font-size: 40px;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        white-space: nowrap;
        @media screen and (max-width: 768px) {
          font-size: 28px;
        }
        span {
          font-size: 18px;
        }
      }

      .input-checkbox {
        position: absolute;
        top: 12px;
        right: 12px;
      }
      .alert-big {
        background: #26e510;
        width: 25%;
        pointer-events: none;
        &.alert {
          background: #bd0e22;
          width: 45%;
        }
        position: absolute;
        aspect-ratio: 1/1;
        filter: blur(40px);
        transition: background 0.3s, width 0.25s;
        top: 50%;
        left: 50%;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        @media screen and (max-width: 768px) {
          filter: blur(20px);
        }
      }
      .color {
        position: static;
        width: 100%;
        height: 100%;
        //pointer-events: none;

        > div {
          position: absolute;
          width: 45%;
          aspect-ratio: 1/1;
          filter: blur(40px);
          @media screen and (max-width: 768px) {
            filter: blur(20px);
          }
          transition: background 0.3s, width 0.25s;
          top: 50%;
          left: 50%;
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        input {
          width: 100%;
          height: 100%;
          padding: 0;
          margin: 0;
          min-width: 0;
          opacity: 0;
        }
      }

      canvas {
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        pointer-events: none;
      }

      > span {
        font-size: 16px;
        opacity: 0.9;
        position: absolute;
        bottom: 16px;
        left: 16px;
        pointer-events: none;
        @media screen and (max-width: 800px) {
          font-size: 14px;
        }
      }

      .online,
      .offline {
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
      &.add {
        svg {
          margin: auto;
          width: 48px;
          aspect-ratio: 1/1;
        }
      }
    }
  }
  .color-picker-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 768px) {
      align-items: flex-end;
    }
    pointer-events: none;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 999;
    .color-picker {
      //padding: 24px;
      pointer-events: all;
      position: relative;
      width: 100%;
      max-width: 512px;
      aspect-ratio: 1/1;
      transition: 0.3s;
      transform: translateY(2000px);
      display: flex;
      align-items: center;
      justify-content: center;
      @media screen and (max-width: 768px) {
        transform: translateY(0);
        bottom: -100vh;
        margin: 0 24px;
      }
      &:before {
        pointer-events: all;
        z-index: -1;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        content: "";
        display: block;
        background: var(--bg-darken-color);
        border-radius: var(--border-radius);
        opacity: 0.9;
      }
      .p5Canvas {
        //display: none;
        //margin: auto;
        pointer-events: none;
      }
      .current-color {
        width: 40%;
        aspect-ratio: 1/1;
        position: absolute;
        border-radius: 50%;
        filter: blur(40px);
        pointer-events: none;
        @media screen and (max-width: 768px) {
          filter: blur(20px);
        }
        transition: background 0.3s, width 0.25s;
      }
    }
    .backdrop {
      z-index: -2;
      position: absolute;
      left: 0;
      top: 0;
      height: 100vh;
      width: 100vw;
      background: rgba(0, 0, 0, 0.5);
      //backdrop-filter: blur(4px);
      opacity: 0;
      transition: 0.5s;
      pointer-events: none;
    }

    &.active {
      .color-picker {
        transform: translateY(0px);
        @media screen and (max-width: 768px) {
          bottom: 0px;
          margin: 0 24px;
        }
      }
      .backdrop {
        opacity: 1;
        pointer-events: all;
      }
    }
  }
}
</style>
