<script setup>
    import { useRouter } from 'vue-router';
    import { myOrder } from '../pages/data';
    const router = new useRouter()
    defineProps({
        icon: String,
        title: String,
    })

    function reset(){
        router.push('/welcome')
        myOrder.loginDefault()
    }

</script>

<template>
    <div class="color-base p-2" style="display: flex; justify-content: space-between; align-items: center;">
      <div style="display: flex; align-items: center;">
        <img src="../assets/Canteen Kiosk.png" alt="" style="border-radius: 100%; width: 100px;" class="box-shadow m-2">
        <div class="text-light">
          <h1 class="text-shadow">Canteen Kiosk</h1>    
          <h2 class="text-shadow fs-4 fs-md-5 fs-lg-6 fs-xl-7"><i :class="icon" class="pi text-shadow m-2 mt-0 mb-0 fs-5 fs-md-6 fs-lg-7 fs-xl-8"></i >{{ title }}</h2>
        </div>
      </div>
  
      <Button icon="pi pi-power-off" label="Logout" class="logoutButton text-shadow" @click="reset()" v-if="title !== 'Login Page'"></Button>
      <Button icon="pi pi-home" label="Home" class="logoutButton text-shadow" @click="reset()" v-else></Button>
    </div>
  </template>
  
  <style scoped>
    .logoutButton {
      background: none;
      outline: none;
      border: none;
      box-shadow: none;
    }
  
    /* Media Queries for Font Size */
    @media (min-width: 576px) { /* Small devices (576px and up) */
      .fs-md-5 { font-size: 2rem; }
      .fs-md-6 { font-size: 2.5rem; }
    }
  
    @media (min-width: 768px) { /* Medium devices (768px and up) */
      .fs-lg-6 { font-size: 3rem; }
      .fs-lg-7 { font-size: 3.5rem; }
    }
  
    @media (min-width: 992px) { /* Large devices (992px and up) */
      .fs-xl-7 { font-size: 4rem; }
      .fs-xl-8 { font-size: 4.5rem; }
    }
  </style>
  