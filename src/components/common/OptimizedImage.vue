<template>
  <div class="optimized-image-container" :style="{ width, height }">
    <!-- Loader pendant le chargement -->
    <div v-if="!imageLoaded && !imageError" class="image-loader">
      <div class="loader-spinner"></div>
    </div>
    
    <!-- Placeholder si erreur -->
    <div v-if="imageError" class="image-error">
      <div class="error-icon">📷</div>
      <p class="error-text">Image non disponible</p>
    </div>
    
    <!-- Image principale -->
    <img 
      v-show="!imageError"
      :src="optimizedSrc" 
      :alt="alt"
      @load="handleImageLoad"
      @error="handleImageError"
      :class="{ 
        'optimized-image': true,
        'image-loaded': imageLoaded, 
        'image-hidden': !imageLoaded 
      }"
      loading="lazy"
      decoding="async"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useImage } from '@/composables/useImage'

interface Props {
  src: string
  alt: string
  width?: string
  height?: string
  optimizeWidth?: number
  optimizeHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '200px',
  optimizeWidth: 400,
  optimizeHeight: 300
})

// Composable pour la gestion des images
const { imageLoaded, imageError, handleImageLoad, handleImageError, getOptimizedImageUrl } = useImage()

// URL optimisée
const optimizedSrc = computed(() => {
  return getOptimizedImageUrl(props.src, props.optimizeWidth, props.optimizeHeight)
})
</script>

<style scoped>
.optimized-image-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--light-gray);
  border-radius: 8px;
  overflow: hidden;
}

.image-loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--light-gray);
}

.loader-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: var(--text-light);
  background: var(--light-gray);
  width: 100%;
  height: 100%;
}

.error-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.error-text {
  font-size: 0.9rem;
  text-align: center;
  margin: 0;
}

.optimized-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 0.3s ease;
}

.image-hidden {
  opacity: 0;
}

.image-loaded {
  opacity: 1;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
