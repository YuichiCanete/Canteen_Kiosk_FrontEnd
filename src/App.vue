<script setup>
  import { useRouter } from 'vue-router';
  import { myOrder } from './pages/data';
  const router = new useRouter()
  myOrder.loginDefault()
  router.push('/welcome')
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style scoped>

</style>
