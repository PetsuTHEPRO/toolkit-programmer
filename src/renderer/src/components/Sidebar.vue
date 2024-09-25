<template>
  <nav :class="['sidebar d-flex flex-column', { 'sidebar-closed': !isOpen }]">
    <div class="flex-grow-1">
      <div class="d-flex align-items-center justify-content-center py-4">
        <div class="d-flex align-items-center justify-content-around">
          <i :class="isOpen ? 'bx bx-pen mx-2' : ''"></i>
          <h3 :class="['fw-bold fs-5 my-0', { 'd-none': !isOpen }]">Toolkit Programmer</h3>
        </div>
        <button
          @click="toggleSidebar"
          class="btn-sidebar d-flex align-items-center justify-content-center mx-2"
        >
          <i :class="isOpen ? 'bx bx-chevron-left' : 'bx bx-chevron-right'"></i>
        </button>
      </div>
      <ul class="nav flex-column px-2">
        <li class="nav-item" v-for="item in menuItems" :key="item.text">
          <router-link
            v-if="item.rota"
            :to="{ name: item.rota }"
            class="nav-link d-flex align-items-center my-1"
          >
            <i :class="item.icon"></i>
            <span v-if="isOpen" class="ms-2">{{ item.text }}</span>
          </router-link>
          <span v-else class="nav-link d-flex align-items-center my-1" style="cursor: not-allowed">
            <i :class="item.icon"></i>
            <span v-if="isOpen" class="ms-2">{{ item.text }}</span>
          </span>
        </li>
      </ul>
    </div>
    <footer class="text-center py-3">
      <small>&copy; 2024 Peterson</small>
    </footer>
  </nav>
</template>



<script>
export default {
  data() {
    return {
      role: 'Student',
      isOpen: true,
      menuItems: [
        { text: 'Home', icon: 'bx bx-home', rota: 'home' },
        { text: 'Images', icon: 'bx bx-image-alt', rota: 'image' },
        { text: 'Links', icon: 'bx bx-link', rota: 'link' },
        { text: 'Color Palette', icon: 'bx bx-palette', rota: '' },
        { text: 'Code Snippets', icon: 'bx bx-code-alt', rota: '' },
        { text: 'Fonts', icon: 'bx bx-font', rota: 'font' },
        { text: 'Videos', icon: 'bx bx-video', rota: '' },
        { text: 'Algorithm', icon: 'bx bx-calculator', rota: 'algorithm' },
        { text: 'Frameworks', icon: 'bx bx-extension', rota: 'framework' }
      ]
    }
  },
  methods: {
    toggleSidebar() {
      this.isOpen = !this.isOpen
      console.log(this.isOpen)
    }
  }
}
</script>

<style scoped>

.sidebar {
  width: 220px;
  min-height: 100vh;
  background-color: #1d1d21;
  color: white;
  transition: width 0.3s ease-in-out;
  z-index: 1000;
}

.btn-sidebar {
  width: 40px;
  height: 40px;
  border-radius: 25%;
  border: none;
  color: white;
  background-color: #111;
}

.sidebar-closed {
  width: 80px;
}

.sidebar .nav-link {
  color: white;
}

.sidebar .nav-link:hover {
  background-color: #495057;
}

.sidebar .bx {
  font-size: 1.5rem;
}
</style>