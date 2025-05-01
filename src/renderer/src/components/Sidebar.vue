<template>
  <nav :class="['sidebar d-flex flex-column', { 'sidebar-closed': !isSidebarOpen }, themeClass]">
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
        <li v-for="item in menuItems" :key="item.id" class="nav-item">
          <div v-if="item.children">
            <span
              class="nav-link d-flex align-items-center my-1"
              :class="{ activo: isSubmenuOpen(item.id) }"
              style="cursor: pointer"
              @click="toggleSubmenu(item.id)"
            >
              <i :class="item.icon"></i>
              <span v-if="isSidebarOpen" class="ms-2">{{ item.text }}</span>
              <i
                v-if="isSidebarOpen"
                :class="isSubmenuOpen(item.id) ? 'bx bx-chevron-up' : 'bx bx-chevron-down'"
                class="ms-auto"
              ></i>
            </span>
            <ul v-if="isSubmenuOpen(item.id) && isSidebarOpen" class="nav flex-column ms-0">
              <li
                v-for="subItem in item.children"
                :key="subItem.text"
                class="nav-item"
                :class="{ linkActual: isActive(subItem.rota) }"
              >
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
            :class="{ linkActual: isActive(item.rota) }"
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
      <small>&copy; 2024 Yuri</small>
    </footer>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { menuStructure } from './menuStructure'
import { getTheme } from '../service/userPreferences'

export default {
  data() {
    return {
      role: 'Student',
      menuItems: [],
      currentTheme: 'light' // Valor padrão
    }
  },
  props: {
    theme: {
      type: String,
      default: 'light'
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen', 'isSubmenuOpen']),
    themeClass() {
      return this.currentTheme === 'dark' ? 'dark-theme' : 'light-theme'
    }
  },
  watch: {
    '$i18n.locale'() {
      this.updateMenuItems()
    },
    theme(newTheme) {
      this.currentTheme = newTheme
    }
  },
  async created() {
    this.updateMenuItems()
    this.currentTheme = (await getTheme()) || 'light'
  },
  methods: {
    ...mapActions(['toggleSidebar', 'toggleSubmenu']),
    isActive(routeName) {
      return this.$route.name === routeName
    },
    updateMenuItems() {
      this.menuItems = menuStructure(this.$t)
    },
    async updateTheme() {
      this.currentTheme = (await getTheme()) || 'light'
    }
  }
}
</script>

<style scoped>

.light-theme {
  --sidebar-bg: #ffffff;
  --sidebar-border: #e0e0e0;
  --sidebar-text: #333333;
  --sidebar-hover: #e1f0ef;
  --sidebar-active-bg: #e1f0ef;
  --sidebar-active-border: #1668dc;
  --btn-sidebar-bg: #dbdddf;
  --btn-sidebar-color: #333333;
  --btn-sidebar-hover: #e0e0e0;
}

.dark-theme {
  --sidebar-bg: #1e1e1e;
  --sidebar-border: #292929;
  --sidebar-text: white;
  --sidebar-hover: #292929;
  --sidebar-active-bg: #292929;
  --sidebar-active-border: #1668dc;
  --btn-sidebar-bg: #111;
  --btn-sidebar-color: white;
  --btn-sidebar-hover: #333;
}

.sidebar {
  position: fixed;
  width: 220px;
  min-height: 100vh;
  background-color: var(--sidebar-bg);
  border-right: 2px solid var(--sidebar-border);
  color: var(--sidebar-text);
  overflow: hidden;
  transition: width 0.3s ease-in-out;
  z-index: 1000;
}

/*.sidebar {
  position: fixed;
  width: 220px;
  min-height: 100vh;
  background-color: #ffffff; 
  border-right: 2px solid #e0e0e0; 
  color: #333333; 
  overflow: hidden;
  transition: width 0.3s ease-in-out;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}*/

.btn-sidebar {
  width: 40px;
  height: 40px;
  border-radius: 25%;
  border: none;
  color: var(--btn-sidebar-color);
  background-color: var(--btn-sidebar-bg);
}

.sidebar-closed {
  width: 80px;
}

.sidebar .nav-link {
  color: var(--sidebar-text); /* Texto escuro */
}

.activo {
  color: var(--sidebar-active-border) !important;
}

.sidebar .nav-link:hover {
  background-color: var(--sidebar-hover);
}

.dark-theme .sidebar .nav-link:hover {
  background-color: var(--sidebar-hover);
}

.sidebar .linkActual {
  background-color: var(--sidebar-active-bg);
  border-right: 3px solid var(--sidebar-active-border);
  cursor: default;
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
