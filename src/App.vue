<template>
  <div id="app">
    <!-- Header avec navigation -->
    <HeaderNav />
    
    <!-- Contenu principal avec routeur -->
    <main class="main-content">
      <RouterView />
    </main>
    
    <!-- Footer -->
    <FooterComponent />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import HeaderNav from './components/layout/HeaderNav.vue'
import FooterComponent from './components/layout/FooterComponent.vue'
</script>

<style>
/* Reset et styles globaux */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 0;
}

/* Variables CSS pour la cohérence des couleurs */
:root {
  --primary-color: #4CAF50;
  --secondary-color: #8BC34A;
  --accent-color: #FF9800;
  --text-dark: #333333;
  --text-light: #666666;
  --background-light: #f8f9fa;
  --border-color: #e0e0e0;
  --white: #ffffff;
  --error-color: #f44336;
  --success-color: #4CAF50;
}
</style>
