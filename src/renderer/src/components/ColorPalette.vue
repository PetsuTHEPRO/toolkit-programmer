<template>
    <div class="card overflow-hidden">
      <div class="card-header p-4">
        <h5 class="card-title text-lg">{{ title }}</h5>
        <p class="card-text text-muted">{{ description }}</p>
      </div>
      <div class="card-body p-0">
        <div class="d-flex h-24">
          <div
            v-for="(color, index) in colors"
            :key="index"
            class="flex-fill"
            :style="{ backgroundColor: color }"
          ></div>
        </div>
      </div>
      <div class="card-footer d-flex flex-wrap justify-content-between p-2 bg-light">
        <span v-for="(color, index) in colors" :key="index" class="text-xs font-mono">
          {{ color.toUpperCase() }}
        </span>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      colors: {
        type: Array,
        required: true,
      },
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  .h-24 {
    height: 6rem;
  }
  </style>
  