<template>
  <nav :class="['sidebar d-flex flex-column', { 'sidebar-closed': !isSidebarOpen }]">
    <div class="flex-grow-1">
      <div class="d-flex align-items-center justify-content-center py-4">
        <div class="d-flex align-items-center justify-content-around">
          <i :class="isSidebarOpen ? 'bx bx-pen mx-2' : ''"></i>
          <h3 :class="['fw-bold fs-5 my-0', { 'd-none': !isSidebarOpen }]">Toolkit Programmer</h3>
        </div>
        <button
          class="btn-sidebar d-flex align-items-center justify-content-center mx-2"
          @click="toggleSidebar"
        >
          <i :class="isSidebarOpen ? 'bx bx-chevron-left' : 'bx bx-chevron-right'"></i>
        </button>
      </div>
      <ul class="nav flex-column px-2">
        <li v-for="item in menuItems" :key="item.text" class="nav-item">
          <div v-if="item.children">
            <span
              class="nav-link d-flex align-items-center my-1"
              style="cursor: pointer"
              @click="toggleSubmenu(item.text)"
            >
              <i :class="item.icon"></i>
              <span v-if="isSidebarOpen" class="ms-2">{{ item.text }}</span>
              <i
                v-if="isSidebarOpen"
                :class="isSubmenuOpen(item.text) ? 'bx bx-chevron-up' : 'bx bx-chevron-down'"
                class="ms-auto"
              ></i>
            </span>
            <ul v-if="isSubmenuOpen(item.text) && isSidebarOpen" class="nav flex-column ms-0">
              <li v-for="subItem in item.children" :key="subItem.text" class="nav-item">
                <router-link
                  v-if="subItem.rota"
                  :to="{ name: subItem.rota }"
                  class="nav-link d-flex align-items-center my-1"
                >
                  <i :class="subItem.icon"></i>
                  <span class="ms-2">{{ subItem.text }}</span>
                </router-link>
                <span
                  v-else
                  class="nav-link d-flex align-items-center my-1"
                  style="cursor: not-allowed"
                >
                  <i :class="subItem.icon"></i>
                  <span class="ms-2">{{ subItem.text }}</span>
                </span>
              </li>
            </ul>
          </div>

          <!-- If the item doesn't have children, show a normal link -->
          <router-link
            v-else-if="item.rota"
            :to="{ name: item.rota }"
            class="nav-link d-flex align-items-center my-1"
          >
            <i :class="item.icon"></i>
            <span v-if="isSidebarOpen" class="ms-2">{{ item.text }}</span>
          </router-link>
          <span v-else class="nav-link d-flex align-items-center my-1" style="cursor: not-allowed">
            <i :class="item.icon"></i>
            <span v-if="isSidebarOpen" class="ms-2">{{ item.text }}</span>
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
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      role: 'Student',
      menuItems: [
        {
          text: 'Home',
          icon: 'bx bx-home',
          rota: 'home'
        },
        {
          text: 'Resources',
          icon: 'bx bx-folder',
          rota: '',
          children: [
            { text: 'Images', icon: 'bx bx-image-alt', rota: 'image' },
            { text: 'Fonts', icon: 'bx bx-font', rota: 'font' },
            { text: 'Color Palette', icon: 'bx bx-palette', rota: '' }
          ]
        },
        {
          text: 'Developers',
          icon: 'bx bx-code-block',
          rota: '',
          children: [
            { text: 'Code Snippets', icon: 'bx bx-code-alt', rota: '' },
            { text: 'Algorithm', icon: 'bx bx-calculator', rota: 'algorithm' },
            { text: 'Frameworks', icon: 'bx bx-extension', rota: 'framework' }
          ]
        },
        {
          text: 'Learn',
          icon: 'bx bx-brain',
          rota: '',
          children: [
            { text: 'Articles', icon: 'bx bx-book-open', rota: '' },
            { text: 'Videos', icon: 'bx bx-video', rota: '' },
            { text: 'Links', icon: 'bx bx-link', rota: 'link' }
          ]
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen', 'isSubmenuOpen'])
  },
  methods: {
    ...mapActions(['toggleSidebar', 'toggleSubmenu']),
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

.nav .nav-item .nav {
  padding-left: 20px;
}

.nav .nav-item .nav-link {
  font-size: 0.9rem;
}

</style>
