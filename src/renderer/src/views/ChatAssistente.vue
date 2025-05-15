<script setup>
import Sidebar from '../components/Sidebar.vue'
import AssistenteIA from '../components/AssistenteIA.vue'
</script>

<template>
  <div
    class="container-fluid d-flex p-0"
    :class="themeMode === 'dark' ? 'dark-theme' : 'light-theme'"
  >
    <Sidebar />
    <div class="row w-100 m-0" :class="isSidebarOpen ? 'open-menu' : 'close-menu'">
      <!-- Título da Página -->
      <div class="col">
        <nav aria-label="breadcrumb" class="mt-3">
          <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">Assistente IA</li>
          </ol>
        </nav>

        <div class="card mb-4">
          <div class="card-header d-flex align-items-center justify-content-between">
            <h5 class="card-title">Assistente IA - Toolkit Programmer (Em Modo de Teste)</h5>
          </div>
          <AssistenteIA />
        </div>

        <!-- Pequeno texto explicando que usamos uma assistente ia e que pode perguntar sobre qualquer duvida do programa -->
        <div class="d-flex flex-column align-items-start justify-content-between mb-2">
          <h3>🧠 Plataforma Multimodelo de IA</h3>
          <div
            style="
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 20px;
              margin-top: 10px;
            "
          >
            <!-- Card DeepSeek -->
            <div
              style="
                border-radius: 10px;
                padding: 20px;
                background: linear-gradient(135deg, #1a73e8 0%, #4285f4 100%);
                color: white;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              "
            >
              <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px">
                <img
                  src="https://1000logos.net/wp-content/uploads/2025/01/DeepSeek-Emblem.png"
                  alt="DeepSeek"
                  style="
                    width: 50px;
                    height: 50px;
                    object-fit: contain;
                    background-color: white;
                    border-radius: 25%;
                  "
                />
                <h3 style="margin: 0; font-size: 18px">DeepSeek</h3>
              </div>
              <p style="font-size: 14px; opacity: 0.9">
                Respostas técnicas e análise de código especializada.
              </p>
              <div style="margin-top: 15px">
                <span
                  style="
                    background: rgba(255, 255, 255, 0.2);
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 11px;
                    display: inline-block;
                    margin: 0 5px 5px 0;
                  "
                  >Precisão</span
                >
                <span
                  style="
                    background: rgba(255, 255, 255, 0.2);
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 11px;
                    display: inline-block;
                    margin: 0 5px 5px 0;
                  "
                  >Código</span
                >
              </div>
            </div>

            <!-- Card Gemini -->
            <div
              style="
                border-radius: 10px;
                padding: 20px;
                background: linear-gradient(135deg, #5e91f2 0%, #d96570 100%);
                color: white;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              "
            >
              <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px">
                <img
                  src="https://images.seeklogo.com/logo-png/61/1/gemini-icon-logo-png_seeklogo-611605.png"
                  alt="Gemini"
                  style="width: 50px; height: 50px; object-fit: contain"
                />
                <h3 style="margin: 0; font-size: 18px">Gemini</h3>
              </div>
              <p style="font-size: 14px; opacity: 0.9">
                Excelência em tarefas multimodais e criativas.
              </p>
              <div style="margin-top: 15px">
                <span
                  style="
                    background: rgba(255, 255, 255, 0.2);
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 11px;
                    display: inline-block;
                    margin: 0 5px 5px 0;
                  "
                  >Multimídia</span
                >
                <span
                  style="
                    background: rgba(255, 255, 255, 0.2);
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 11px;
                    display: inline-block;
                    margin: 0 5px 5px 0;
                  "
                  >Criatividade</span
                >
              </div>
            </div>

            <!-- Card Meta LLaMA -->
            <div
              style="
                border-radius: 10px;
                padding: 20px;
                background: linear-gradient(135deg, #00b4d8 0%, #90e0ef 100%);
                color: white;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              "
            >
              <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px">
                <img
                  src="https://www.citypng.com/public/uploads/preview/facebook-meta-logo-icon-hd-png-701751694777703xqxtpvbu9q.png"
                  alt="Meta LLaMA"
                  style="width: 50px; height: 50px; object-fit: contain"
                />
                <h3 style="margin: 0; font-size: 18px">Meta LLaMA</h3>
              </div>
              <p style="font-size: 14px; opacity: 0.9">
                Framework open-source para desenvolvimento de IA.
              </p>
              <div style="margin-top: 15px">
                <span
                  style="
                    background: rgba(255, 255, 255, 0.2);
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 11px;
                    display: inline-block;
                    margin: 0 5px 5px 0;
                  "
                  >Open-source</span
                >
                <span
                  style="
                    background: rgba(255, 255, 255, 0.2);
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 11px;
                    display: inline-block;
                    margin: 0 5px 5px 0;
                  "
                  >Customizável</span
                >
              </div>
            </div>

            <!-- Card Qwen -->
            <div
              style="
                border-radius: 10px;
                padding: 20px;
                background: linear-gradient(135deg, #613cd2 0%, #9d7aff 100%);
                color: white;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              "
            >
              <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px">
                <img
                  src="https://images.seeklogo.com/logo-png/61/1/qwen-icon-logo-png_seeklogo-611724.png"
                  alt="Qwen"
                  style="width: 50px; height: 50px; object-fit: contain; border-radius: 25%"
                />
                <h3 style="margin: 0; font-size: 18px">Qwen</h3>
              </div>
              <p style="font-size: 14px; opacity: 0.9">
                Solução avançada para processamento multilíngue.
              </p>
              <div style="margin-top: 15px">
                <span
                  style="
                    background: rgba(255, 255, 255, 0.2);
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 11px;
                    display: inline-block;
                    margin: 0 5px 5px 0;
                  "
                  >Chinês/Inglês</span
                >
                <span
                  style="
                    background: rgba(255, 255, 255, 0.2);
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 11px;
                    display: inline-block;
                    margin: 0 5px 5px 0;
                  "
                  >Negócios</span
                >
              </div>
            </div>

            <!-- Card NVIDIA LLaMA -->
            <div
              style="
                border-radius: 10px;
                padding: 20px;
                background: linear-gradient(135deg, #76b900 0%, #98ca40 100%);
                color: white;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              "
            >
              <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/882/882731.png"
                  alt="NVIDIA LLaMA"
                  style="
                    width: 50px;
                    height: 50px;
                    object-fit: contain;
                    background-color: white;
                    border-radius: 25%;
                  "
                />
                <h3 style="margin: 0; font-size: 18px">NVIDIA LLaMA</h3>
              </div>
              <p style="font-size: 14px; opacity: 0.9">Otimizado para GPU com máxima eficiência.</p>
              <div style="margin-top: 15px">
                <span
                  style="
                    background: rgba(255, 255, 255, 0.2);
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 11px;
                    display: inline-block;
                    margin: 0 5px 5px 0;
                  "
                  >GPU</span
                >
                <span
                  style="
                    background: rgba(255, 255, 255, 0.2);
                    padding: 4px 10px;
                    border-radius: 12px;
                    font-size: 11px;
                    display: inline-block;
                    margin: 0 5px 5px 0;
                  "
                  >Performance</span
                >
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
import { getTheme } from '../service/userPreferences'

export default {
  data() {
    return {
      themeMode: getTheme()
    }
  },
  computed: {
    ...mapGetters(['isSidebarOpen'])
  },
  methods: {}
}
</script>

<style scoped>
@import url('../assets/base.css');

.breadcrumb-item {
  color: var(--breadcrumb-color);
}

.container-fluid {
  /*background-color: var(--container-bg);*/
  color: var(--container-color);
}

.object-contain {
  object-fit: contain;
}

.card-header,
.card-footer {
  background-color: var(--card-header);
  color: var(--card-header-color);
}

.search {
  font-family: 'Poppins', sans-serif;
  border-radius: 20px;
  border: none;
  height: 40px;
  background-color: #3d444d;
  color: white;
}

.search:focus {
  background-color: #3d444d;
  color: white;
}

.search::-webkit-input-placeholder {
  color: #b1b4b8;
}
</style>
