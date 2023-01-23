<template>
  <div class="container">
    <h1 class="m" >Умный дом</h1>
    <div class="groups">
      <span v-for="(group,index) in groups" :key="index">{{ group }}</span>
    </div>
    <div class="devices">
      <div class="device" v-for="(device,index) in devices">
        <i v-if="device.online" class="online"></i>
        <i v-else class="offline"></i>
        <span>{{ device.title }}</span>
      </div>
    </div>
    <!--    <div id="p5Canvas"></div>-->
    <!--    <h1 class="l noselect">Умный дом от Hackers 54</h1>-->
    <!--    <div class="cards">-->
    <!--      <button @click="vibrate(150)">я вибрирую</button>-->
    <!--      <div class="card" @click="changeLight(!this.sun)">-->
    <!--        <h2>Лампочка</h2>-->
    <!--        <svg v-if="sun" viewBox="0 0 513 513" fill="none" xmlns="http://www.w3.org/2000/svg">-->
    <!--          <path-->
    <!--            d="M256.595 48.7625V96.7625M256.595 416.763V464.763M403.675 109.683L369.735 143.623M143.455 369.903L109.515 403.842M464.595 256.763H416.595M96.5952 256.763H48.5952M403.675 403.842L369.735 369.903M143.455 143.623L109.515 109.683"-->
    <!--            stroke="currentColor" stroke-width="32" stroke-miterlimit="10" stroke-linecap="round"/>-->
    <!--          <path-->
    <!--            d="M256.595 336.763C300.778 336.763 336.595 300.945 336.595 256.763C336.595 212.58 300.778 176.763 256.595 176.763C212.412 176.763 176.595 212.58 176.595 256.763C176.595 300.945 212.412 336.763 256.595 336.763Z"-->
    <!--            stroke="currentColor" stroke-width="32" stroke-miterlimit="10" stroke-linecap="round"/>-->
    <!--        </svg>-->
    <!--        <svg v-else viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">-->
    <!--          <path-->
    <!--            d="M256 118C250.165 118 244.569 115.682 240.444 111.556C236.318 107.431 234 101.835 234 96V48C234 42.1652 236.318 36.5694 240.444 32.4436C244.569 28.3178 250.165 26 256 26C261.835 26 267.431 28.3178 271.556 32.4436C275.682 36.5694 278 42.1652 278 48V96C278 101.835 275.682 107.431 271.556 111.556C267.431 115.682 261.835 118 256 118ZM256 486C250.165 486 244.569 483.682 240.444 479.556C236.318 475.431 234 469.835 234 464V416C234 410.165 236.318 404.569 240.444 400.444C244.569 396.318 250.165 394 256 394C261.835 394 267.431 396.318 271.556 400.444C275.682 404.569 278 410.165 278 416V464C278 469.835 275.682 475.431 271.556 479.556C267.431 483.682 261.835 486 256 486ZM369.14 164.86C364.79 164.859 360.537 163.569 356.92 161.152C353.303 158.736 350.484 155.301 348.819 151.282C347.153 147.263 346.717 142.841 347.564 138.574C348.412 134.307 350.505 130.387 353.58 127.31L387.52 93.37C391.664 89.3339 397.231 87.0923 403.015 87.1304C408.799 87.1684 414.336 89.4832 418.426 93.5735C422.517 97.6638 424.832 103.201 424.87 108.985C424.908 114.769 422.666 120.336 418.63 124.48L384.69 158.42C382.65 160.465 380.226 162.086 377.557 163.191C374.889 164.296 372.028 164.863 369.14 164.86ZM108.92 425.08C104.569 425.079 100.315 423.789 96.6974 421.37C93.0797 418.952 90.2603 415.516 88.5958 411.495C86.9314 407.475 86.4965 403.051 87.3463 398.784C88.1961 394.516 90.2924 390.596 93.37 387.52L127.31 353.58C129.343 351.493 131.77 349.83 134.45 348.689C137.131 347.547 140.012 346.95 142.925 346.931C145.838 346.911 148.727 347.471 151.422 348.577C154.117 349.683 156.566 351.314 158.626 353.374C160.686 355.434 162.317 357.883 163.423 360.578C164.529 363.273 165.089 366.162 165.069 369.075C165.05 371.988 164.453 374.869 163.311 377.549C162.17 380.23 160.507 382.657 158.42 384.69L124.48 418.63C122.439 420.677 120.014 422.301 117.344 423.408C114.673 424.515 111.811 425.083 108.92 425.08ZM464 278H416C410.165 278 404.569 275.682 400.444 271.556C396.318 267.431 394 261.835 394 256C394 250.165 396.318 244.569 400.444 240.444C404.569 236.318 410.165 234 416 234H464C469.835 234 475.431 236.318 479.556 240.444C483.682 244.569 486 250.165 486 256C486 261.835 483.682 267.431 479.556 271.556C475.431 275.682 469.835 278 464 278ZM96 278H48C42.1652 278 36.5694 275.682 32.4436 271.556C28.3178 267.431 26 261.835 26 256C26 250.165 28.3178 244.569 32.4436 240.444C36.5694 236.318 42.1652 234 48 234H96C101.835 234 107.431 236.318 111.556 240.444C115.682 244.569 118 250.165 118 256C118 261.835 115.682 267.431 111.556 271.556C107.431 275.682 101.835 278 96 278ZM403.08 425.08C400.189 425.083 397.327 424.515 394.656 423.408C391.986 422.301 389.561 420.677 387.52 418.63L353.58 384.69C349.544 380.546 347.302 374.979 347.34 369.195C347.378 363.411 349.693 357.874 353.784 353.784C357.874 349.693 363.411 347.378 369.195 347.34C374.979 347.302 380.546 349.544 384.69 353.58L418.63 387.52C421.708 390.596 423.804 394.516 424.654 398.784C425.503 403.051 425.069 407.475 423.404 411.495C421.74 415.516 418.92 418.952 415.303 421.37C411.685 423.789 407.431 425.079 403.08 425.08ZM142.86 164.86C139.971 164.866 137.11 164.3 134.441 163.194C131.772 162.089 129.349 160.466 127.31 158.42L93.37 124.48C89.3339 120.336 87.0923 114.769 87.1304 108.985C87.1684 103.201 89.4832 97.6638 93.5735 93.5735C97.6638 89.4832 103.201 87.1684 108.985 87.1304C114.769 87.0923 120.336 89.3339 124.48 93.37L158.42 127.31C161.495 130.387 163.588 134.307 164.436 138.574C165.283 142.841 164.847 147.263 163.181 151.282C161.516 155.301 158.697 158.736 155.08 161.152C151.463 163.569 147.21 164.859 142.86 164.86ZM256 358C235.826 358 216.106 352.018 199.332 340.81C182.558 329.602 169.484 313.672 161.764 295.034C154.044 276.396 152.024 255.887 155.96 236.101C159.896 216.315 169.61 198.14 183.875 183.875C198.14 169.61 216.315 159.896 236.101 155.96C255.887 152.024 276.396 154.044 295.034 161.764C313.672 169.484 329.602 182.558 340.81 199.332C352.018 216.106 358 235.826 358 256C357.968 283.042 347.212 308.968 328.09 328.09C308.968 347.212 283.042 357.968 256 358Z"-->
    <!--            fill="currentColor"/>-->
    <!--        </svg>-->
    <!--        &lt;!&ndash;        <div class="input-checkbox">&ndash;&gt;-->
    <!--        &lt;!&ndash;          <input id="checkbox" type="checkbox">&ndash;&gt;-->
    <!--        &lt;!&ndash;          <label for="checkbox"></label>&ndash;&gt;-->
    <!--        &lt;!&ndash;        </div>&ndash;&gt;-->
    <!--      </div>-->
    <!--      <div class="card">-->
    <!--        <input type="color" ref="color" @change="changeLight(true)">-->
    <!--      </div>-->
    <!--      <div class="card">-->
    <!--        <svg viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">-->
    <!--          <path d="M256 112V400M400 256H112" stroke="currentColor" stroke-width="32" stroke-linecap="round"-->
    <!--                stroke-linejoin="round"/>-->
    <!--        </svg>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>
<script>
// import {gsap} from 'gsap'
import {TweenMax} from "gsap";
import P5 from "p5";

export default {
  name: "home",
  data() {
    return {
      devices: [],
      device_type: [],
      groups: []
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
    setInterval(()=>{
      this.$api.get('user/device').then(res => {
        this.devices = res.devices
        this.devices.forEach(device => {
          device.online = new Date(device.online.replace(' ', 'T')).getTime() > new Date().getTime()
          device.group.forEach(group => {
            if (!this.groups.find(item => item == group)) {
              this.groups.push(group)
            }
          })
        })
        this.device_type = res.device_type
      })
    },1000)
    // fetch(`/api/color`).then(res => res.json()).then((result) => {
    //   this.$refs.color.value = this.rgbToHex(Number(result.r),Number(result.g),Number(result.b))
    //   this.sun = result.a > 0 ? true : false
    // })
    if (window.navigator && window.navigator.vibrate) {
      console.log("поддерживается")
    } else {
      console.log("не поддерживается")
    }
  },
  methods: {
    hexToRgb(hex) {
      hex = hex.replace('#', '').match(/.{1,2}/g)
      return {
        "r": parseInt(hex[0], 16),
        "g": parseInt(hex[1], 16),
        "b": parseInt(hex[2], 16)
      };
    },
    rgbToHex(r, g, b) {
      return "#" + r.toString(16) + g.toString(16) + b.toString(16);
    },
    // changeLight(sun) {
    //   let color = this.hexToRgb(this.$refs.color.value)
    //   // console.log(color,this.$refs.color.value)
    //   this.vibrate(35)
    //   fetch(`/api/color?rgba=${color.r},${color.g},${color.b},${this.sun ? 255 : 0}`).then(() => {
    //     setTimeout(() => {
    //       this.sun = sun
    //     }, 50)
    //   })
    // },
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
      TweenMax.to(document.body, 0.05, {x: `${Math.random() * (10) - 5}`, yoyo: true, repeat: 1})
      TweenMax.to(document.body, 0.05, {y: `${Math.random() * (10) - 5}`, yoyo: true, repeat: 1})
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  padding-top: 48px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;

  .groups {
    width: 100%;
    display: flex;
    gap: 12px;

    span {
      cursor: pointer;
      padding: 8px 16px;
      border-radius: var(--border-radius);
      transition: background 0.3s;
      @media screen and (min-width: 768px) {
        &:hover {
          background: var(--bg-darken-color);
        }
      }
    }
  }

  .devices {
    .device {
      position: relative;
      padding: 16px;
      background: var(--bg-darken-color);
      border-radius: var(--border-radius);

      .online, .offline {
        position: absolute;
        top: 6px;
        left: 6px;
        height: 8px;
        width: 8px;
        background: #26e510;
        border-radius: 4px;
      }

      .offline {
        background: var(--bg-light-color);
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
