<template>
  <div class="blank-layout">
    <router-view /> <!-- Este elemento renderiza Login o Register -->
  </div>
</template>

<script setup>
</script>

<style scoped>
.blank-layout {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f9f9f9;
}
</style>