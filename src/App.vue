<script setup>
  import { useRouter } from 'vue-router';
  const router = new useRouter()
  router.push('/welcome')
</script>

<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<style scoped>

</style>
