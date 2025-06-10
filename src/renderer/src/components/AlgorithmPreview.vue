<script setup>
import Sidebar from '@renderer/components/Sidebar.vue'
import MonacoEditor from './MonacoEditor.vue'
import CodeSnippetModal from '@renderer/components/modals/CodeSnippetModal.vue'
</script>

<template>
  <div
    class="container-fluid d-flex p-0"
    :class="themeMode === 'dark' ? 'dark-theme' : 'light-theme'"
  >
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <div class="col">
        <nav aria-label="breadcrumb" class="my-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item">
              <router-link :to="{ name: 'algorithm' }">Algoritmo</router-link>
            </li>
            <li v-if="algorithm" class="breadcrumb-item active" aria-current="page">
              {{ algorithm.name }}
            </li>
          </ol>
        </nav>

        <div v-if="algorithm" class="card w-100 mx-auto max-w-4xl">
          <div class="card-header">
            <h5 class="card-title fs-2 fw-bold text-center mb-2">{{ algorithm.name }}</h5>
            <p class="card-description text-lg mt-2">{{ algorithm.description }}</p>
          </div>
          <div class="card-body">
            <ul class="nav nav-tabs">
              <li class="nav-item" v-for="lang in availableLanguages" :key="lang">
                <a
                  class="nav-link"
                  :class="{
                    active: selectedLanguage === lang,
                    'has-code': hasCodeForLanguage(lang),
                    'no-code': !hasCodeForLanguage(lang)
                  }"
                  @click.prevent="selectedLanguage = lang"
                >
                  {{ lang }}
                </a>
              </li>
            </ul>

            <div class="tab-content">
              <div class="code-container mt-3">
                <div v-if="currentSnippet" class="position-relative h-100">
                  <MonacoEditor
                    :code="currentSnippet.code"
                    :language="selectedLanguage.toLowerCase()"
                    :key="selectedLanguage"
                  />
                  <!--
                  <button
                    class="btn btn-sm btn-light position-absolute"
                    style="top: 10px; right: 10px; z-index: 10"
                    @click="openModal(true)"
                  >
                    <i class="bx bx-pencil me-1"></i> Editar Código
                  </button> -->
                </div>

                <div
                  v-else
                  class="h-100 d-flex flex-column align-items-center justify-content-center text-muted"
                >
                  <p>Ainda não há código para {{ selectedLanguage }}.</p>
                  <button class="btn btn-success mt-2" @click="openModal(false)">
                    <i class="bx bx-plus me-1"></i> Adicionar Código
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center p-5"><p>Carregando algoritmo...</p></div>
      </div>
    </div>

    <CodeSnippetModal
      v-if="showModal"
      :visible="showModal"
      :algorithmId="algorithm.id"
      :language="selectedLanguage"
      :snippetToEdit="snippetToEdit"
      @close="onCloseModal"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SystemController from '@renderer/controller/SystemController'
import { getTheme } from '@renderer/service/userPreferences'

export default {
  data() {
    return {
      algorithm: null,
      codeSnippets: [], // Armazena os trechos de código para este algoritmo
      availableLanguages: ['JavaScript', 'Python', 'Java', 'Ruby', 'Go', 'Rust', 'PHP', 'C++'],
      selectedLanguage: 'JavaScript', // Começa com uma linguagem padrão
      showModal: false,
      snippetToEdit: null, // Guarda o snippet a ser editado
      themeMode: getTheme()
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen']),
    // Esta computed property encontra o trecho de código para a aba selecionada
    currentSnippet() {
      return this.codeSnippets.find((s) => s.lang === this.selectedLanguage)
    },
    // A computed para observar a store
    allAlgorithmsFromStore() {
      return this.$store.getters.getStorage('algorithmsStorage')
    }
  },
  watch: {
    // Observa a lista de algoritmos na store
    allAlgorithmsFromStore(newList) {
      if (newList && newList.length > 0) {
        this.loadData()
      }
    }
  },
  created() {
    // Tenta carregar os dados imediatamente
    this.loadData()
  },
  methods: {
    // O método de carregamento agora busca o algoritmo E seus snippets
    async loadData() {
      const algorithmId = this.$route.params.id

      const allAlgorithms = this.allAlgorithmsFromStore
      if (!allAlgorithms || allAlgorithms.length === 0) return

      this.algorithm = allAlgorithms.find((a) => a.id === algorithmId)

      // Se encontrou o algoritmo, busca os snippets de código associados a ele
      if (this.algorithm) {
        this.codeSnippets = await SystemController.loadCodeSnippets(this.algorithm.id)
      }
    },
    // Lógica para abrir o modal
    openModal(isEditing) {
      this.snippetToEdit = isEditing ? this.currentSnippet : null
      this.showModal = true
    },
    // Quando o modal fecha, recarregamos os dados para ver as mudanças
    onCloseModal() {
      this.showModal = false
      this.loadData()
    },
    hasCodeForLanguage(lang) {
      // O método 'some' é super eficiente. Ele para de procurar
      // assim que encontra o primeiro resultado correspondente.
      return this.codeSnippets.some((snippet) => snippet.lang === lang)
    }
  }
}
</script>

<style scoped>
@import url('../assets/base.css');

.container-fluid {
  background-color: var(--container-bg);
  color: var(--container-color);
}
.card-header,
.card-footer {
  background-color: var(--card-header);
  color: var(--card-header-color);
}
.card-body {
  padding: 0; /* Remove o padding padrão para o MonacoEditor preencher */
}
.code-container {
  height: 60vh; /* Define uma altura boa para o editor */
  border-radius: 0 0 0.375rem 0.375rem; /* Arredonda as bordas inferiores */
  overflow: hidden; /* Garante que o editor não vaze */
}
.breadcrumb-link {
  color: #1e90ff;
}

.breadcrumb-item.active{
  color: var(--breadcrumb-color-active);
}

.card-description {
  font-size: 1.1rem;
  color: var(--card-description-color);
}

.code-container {
  height: 60vh;
}
.nav-tabs .nav-link {
  cursor: pointer;
}

/* Estilo para a aba quando TEM código (texto preto/escuro) */
.nav-tabs .nav-link.has-code {
  color: var(--text-color); /* Usa a cor de texto do seu tema ou preto como fallback */
  font-weight: 500;
}

/* Estilo para a aba quando NÃO tem código (texto cinza) */
.nav-tabs .nav-link.no-code {
  color: #868e96; /* Um tom de cinza padrão 'muted' */
  font-style: italic; /* Opcional: para dar mais ênfase visual */
}

/* Garante que a aba ATIVA sempre tenha destaque, mesmo sem código */
.nav-tabs .nav-link.active {
  font-weight: bold !important;
  font-style: normal !important;
}

/* Sobrescreve a cor da aba ativa se ela não tiver código, para não ficar preta */
.nav-tabs .nav-link.active.no-code {
  color: #495057; /* Um cinza mais escuro para indicar seleção */
}

.nav-tabs .nav-link.active.has-code {
  color: var(--container-bg); /* Usa a cor de texto do seu tema ou preto como fallback */
  font-weight: 500;
}

.card-description {
  font-size: 1.1rem;
}
</style>
