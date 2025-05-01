<template>
  <div>
    <!-- Modal -->
    <div
      v-if="visible"
      class="modal fade show d-block"
      tabindex="-1"
      aria-labelledby="modalTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-lg">
        <div class="modal-content bg-dark text-white">
          <div class="modal-header">
            <h5 id="modalTitle" class="modal-title">
              <slot name="title">{{ titleModal }} Video</slot>
            </h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
          </div>
          <div class="modal-body">
            <slot name="body">
              <div class="mb-3">
                <label for="name" class="form-label">Nome da Video</label>
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  v-model="video.name"
                  placeholder="Digite o nome da Video"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Descrição</label>
                <textarea
                  class="form-control"
                  id="description"
                  v-model="video.description"
                  placeholder="Digite a descrição da video"
                  required
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="code" class="form-label">link</label>
                <input
                  type="text"
                  class="form-control"
                  id="code"
                  v-model="video.link"
                  :disabled="idVideo !== -1"
                  @input="buscarDadosDoYoutube()"
                  placeholder="Cole o link do Video aqui"
                  required
                />
              </div>
              <!-- Preview do vídeo -->
              <div v-if="video.link && video.thumbnailUrl" class="mt-3 d-flex flex-column">
                <label for="code" class="form-label">Preview:</label>
                <img :src="video.thumbnailUrl" class="img-fluid mb-2" />
                <p>{{ video.titulo }}</p>
              </div>
            </slot>
          </div>
          <div class="modal-footer">
            <slot name="footer">
              <button type="button" class="btn btn-secondary" @click="closeModal">Cancelar</button>
              <button type="button" class="btn btn-primary" @click="submitVideo">{{ titleModal }}</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
    <div v-if="visible" class="modal-backdrop fade show"></div>
  </div>
</template>

<script>
import SystemController from '../../controller/SystemController'
import axios from 'axios'
import Video from '../../model/entity/video'

const NO_VIDEO_ID = -1

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    idVideo: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      titleModal: this.idVideo !== NO_VIDEO_ID ? 'Editar' : 'Adicionar',
      video: new Video(-1, '', '', '', '', ''),
      apiIdVideo: -1
    }
  },
  created() {
    if (this.idVideo !== -1) {
      const storedVideos = SystemController.getStorage('videosStorage')
      const storedVideo = storedVideos.find((v) => v.id === this.idVideo)
      if (storedVideo) {
        this.video = new Video(
          storedVideo.id,
          storedVideo.name,
          storedVideo.description,
          storedVideo.link,
          storedVideo.thumbnailUrl,
          storedVideo.titulo
        )
        this.apiIdVideo = storedVideo.apiIdVideo || -1
      }
    }
  },
  methods: {
    closeModal() {
      this.video = new Video(-1, '', '', '', '', '')
      this.apiIdVideo = -1
      this.$emit('close')
    },
    submitVideo() {
      const videoData = {
        ...this.video.toDTO(),
        id: this.generateId(),
        apiIdVideo: this.apiIdVideo
      }

      if (this.idVideo !== NO_VIDEO_ID) {
        SystemController.editVideo({ ...videoData, id: this.idVideo })
      } else {
        console.log(videoData)
        SystemController.addVideo(videoData)
      }

      this.closeModal()
    },
    generateId() {
      return (
        Date.now().toString(36) +
        Math.floor(Math.random() * 1000)
          .toString(36)
          .padStart(4, '0')
      )
    },
    // Exemplo de ID: "kx7d9zq42a" (10 caracteres),
    async buscarDadosDoYoutube() {
      this.apiIdVideo = this.extractVideoId(this.video.link)
      if (!this.apiIdVideo) return

      const apiKey = await window.env.getApiKey()

      const snippet = await this.fetchYouTubeData(this.apiIdVideo, apiKey)
      if (snippet) {
        this.video.titulo = snippet.title
        this.video.thumbnailUrl = snippet.thumbnails.medium.url
      }
    },
    extractVideoId(url) {
      const regex = /(?:v=|youtu\.be\/|\/embed\/)([a-zA-Z0-9_-]{11})/
      const match = url.match(regex)
      return match ? match[1] : null
    },
    async fetchYouTubeData(videoId, apiKey) {
      const url = `https://www.googleapis.com/youtube/v3/videos`
      try {
        const res = await axios.get(url, {
          params: {
            part: 'snippet',
            id: videoId,
            key: apiKey
          }
        })
        return res.data.items[0]?.snippet
      } catch (err) {
        console.error('Erro ao buscar dados do YouTube:', err)
        return null
      }
    }
  }
}
</script>

<style scoped>
/* Estilos mantidos iguais */
.modal-content {
  background-color: #1a001a;
}

.modal-backdrop {
  z-index: 1040;
}

.modal-dialog {
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
}

.form-control,
.form-select {
  background-color: #282a36;
  color: #f8f8f2;
}

.form-control::placeholder {
  color: #b1b4b8;
}

.form-control:disabled {
  background-color: #495057dc;
  color: #adb5bd;
  cursor: default;
  border-color: #6c757d;
  opacity: 1;
}
</style>
