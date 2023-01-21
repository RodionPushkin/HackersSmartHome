<template>
  <preloader></preloader>
<!--  <headerComponent></headerComponent>-->
  <mainComponent>
    <router-view v-slot="{ Component, route }">
      <transition mode="out-in">
        <component :is="Component"/>
      </transition>
    </router-view>
  </mainComponent>
  <footerComponent></footerComponent>
</template>

<script>
import headerComponent from "@/components/header.component.vue";
import mainComponent from "@/components/main.component.vue";
import footerComponent from "@/components/footer.component.vue";
import Preloader from "@/components/preloader.component.vue";

export default {
  components: {Preloader, headerComponent, mainComponent, footerComponent},
  data() {
    return {}
  },
  mounted() {
    setInterval(()=>{
      if(localStorage.getItem('token')){
        this.$api.put('user/refresh').then((res)=>{
          if(res == 'logout'){
            throw "logout"
          }else{
            localStorage.setItem('token',res.access_token)
            this.$peer._options.token = localStorage.getItem('token')
            this.$peer.disconnect()
            this.$peer.reconnect()
          }
        }).catch(err=>{
          this.$peer.destroy()
          localStorage.removeItem('token')
          this.$router.push('/auth')
        })
      }
    },3*60*1000)
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
