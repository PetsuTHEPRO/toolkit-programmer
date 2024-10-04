<script setup>
import Sidebar from '../components/Sidebar.vue'
</script>
<template>
  <div class="container-fluid d-flex p-0">
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <div class="col">
        <nav aria-label="breadcrumb" class="my-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link :to="{ name: 'algorithm' }">Algoritmo</router-link>
            </li>
            <li class="breadcrumb-item active" aria-current="page">{{ algorithms.name }}</li>
          </ol>
        </nav>
        <div class="card w-100 mx-auto max-w-4xl">
          <div class="card-header">
            <h5 class="card-title fs-2 font-bold text-center mb-4">{{ algorithms.name }}</h5>
            <p class="card-description text-lg mt-2">{{ algorithms.explanation }}</p>
          </div>
          <div class="card-body">
            <ul class="nav nav-tabs">
              <li class="nav-item" v-for="lang in languages" :key="lang">
                <a
                  class="nav-link"
                  :class="{ active: selectedLanguage === lang, disabled: selectedLanguage !== lang }"
                  @click.prevent="setSelectedLanguage(lang)"
                >
                  {{ lang }}
                </a>
              </li>
            </ul>

            <div class="tab-content">
              <div
                v-for="lang in availableLanguages"
                :key="lang"
                v-show="selectedLanguage === lang"
                class="tab-pane fade show active"
              >
                <div class="card mt-3">
                  <div class="card-header">
                    <h5 class="card-title">{{ lang }}</h5>
                    <p class="card-description">Implementação do Bubble Sort em {{ lang }}</p>
                  </div>
                  <div class="card-body">
                    <pre class="bg-light p-4 rounded-md overflow-auto">
                      <code :class="'language-' + selectedLanguage.toLowerCase()" v-html="highlightedCode"></code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import highlightService from '../service/highlightService'
import SystemController from '../controller/SystemController'

export default {
  data() {
    return {
      languages: ['Java', 'Python', 'Javascript', 'Rust', 'Go', 'Php'],
      algorithms: [],
      algorithmId: null,
      selectedLanguage: '',
      highlightedCode: ''
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    availableLanguages() {
      return this.languages.filter(
        (lang) => this.algorithms.code[lang] && this.algorithms.code[lang].trim() !== ''
      )
    }
  },
  watch: {
    // Atualiza o destaque sempre que a linguagem selecionada mudar
    selectedLanguage() {
      this.highlightCode()
    }
  },
  created() {
    this.algorithmId = this.$route.params.id
    this.algorithms = SystemController.getStorage('algorithmsStorage')[this.algorithmId]
    this.selectedLanguage = Object.keys(this.algorithms.code)[0]
    this.highlightCode()
  },
  methods: {
    setSelectedLanguage(lang) {
      this.selectedLanguage = lang
    },
    highlightCode() {
      // Aplica o destaque de código para a linguagem selecionada
      let code = this.algorithms.code[this.selectedLanguage]

      code = '\n' + code;
      
      this.highlightedCode = highlightService.highlightCode(
        code,
        this.selectedLanguage.toLowerCase()
      )
    }
  }
}
</script>

<style scoped>
/* Estilos adicionais, se necessário */
pre {
  background: #282a36 !important;
  color: white;
  padding: 1rem;
  border-radius: 0.25rem;
  overflow-x: auto;
}
</style>
