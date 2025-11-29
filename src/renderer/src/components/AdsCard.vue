<template>
  <div class="carousel-container">
    <div class="carousel-header">
      <h1>
        <span class="logo">TN</span>
        TabNews
      </h1>

      <div class="live-badge" @click="fetchPosts" title="Clique para atualizar">
        <span class="live-dot" :class="{ loading: isLoading }"></span>
        {{ isLoading ? 'ATUALIZANDO' : 'RSS LIVE' }}
      </div>
    </div>

    <div class="carousel-content">
      <div
        v-for="(post, index) in posts"
        :key="'post-' + index"
        :class="['post-slide', getSlideClass(index)]"
      >
        <div>
          <div class="post-meta">
            <span class="post-author">{{ post.author }}</span>
            <span class="post-date">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {{ formatDate(post.date) }}
            </span>
          </div>

          <h2 class="post-title">{{ post.title }}</h2>
          <p class="post-description">{{ post.description }}</p>
        </div>

        <a
          :href="post.link"
          target="_blank"
          class="post-link"
          :class="{ disabled: post.link === '#' }"
        >
        {{ post.link === '#' ? 'Carregando...' : 'Ler mais' }}
        <i class="bx bx-right-arrow-alt"></i>
        </a>
      </div>

      <!-- Indicators -->
      <div class="carousel-indicators">
        <div
          v-for="(post, index) in posts"
          :key="'indicator-' + index"
          class="indicator"
          :class="{ active: index === currentIndex }"
          @click="goToSlide(index)"
        ></div>
      </div>

      <!-- Controls -->
      <div class="carousel-controls">
        <button class="control-btn" @click="prev" :disabled="isLoading">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>

        <button class="control-btn" @click="next" :disabled="isLoading">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TabNewsCarousel',

  data() {
    return {
      currentIndex: 0,
      direction: 'next',
      autoPlayInterval: null,
      isLoading: true,
      autoPlayPaused: false,
      posts: [
        {
          title: 'Carregando as últimas notícias do TabNews...',
          link: '#',
          description:
            'Aguarde um momento enquanto buscamos o feed RSS mais recente diretamente da fonte.',
          date: new Date().toISOString(),
          author: 'System'
        }
      ]
    }
  },

  mounted() {
    this.fetchPosts()
    this.startAutoPlay()
  },

  beforeUnmount() {
    this.stopAutoPlay()
  },

  methods: {
    async fetchPosts() {
      this.isLoading = true
      try {
        const proxyUrl = 'https://api.allorigins.win/raw?url='
        const targetUrl = 'https://www.tabnews.com.br/recentes/rss'

        const response = await fetch(proxyUrl + encodeURIComponent(targetUrl))
        if (!response.ok) throw new Error('Erro ao buscar RSS')

        const text = await response.text()
        const parser = new DOMParser()
        const xmlDoc = parser.parseFromString(text, 'text/xml')

        const items = xmlDoc.querySelectorAll('item')
        const newPosts = []

        items.forEach((item, index) => {
          if (index >= 10) return

          const title = item.querySelector('title')?.textContent || 'Sem título'
          const link = item.querySelector('link')?.textContent || '#'
          const pubDate = item.querySelector('pubDate')?.textContent || new Date().toISOString()

          // Extrair autor da URL (ex: tabnews.com.br/aliensi/titulo -> aliensi)
          let creator = 'TabNews'
          if (link && link.includes('tabnews.com.br/')) {
            const urlParts = link.split('tabnews.com.br/')[1]?.split('/')
            if (urlParts && urlParts[0]) {
              creator = urlParts[0]
            }
          }

          let description = item.querySelector('description')?.textContent || ''
          description = description
            .replace(/<[^>]*>?/gm, '')
            .replace(/\[CDATA\[|\]\]/g, '')
            .trim()

          if (description.length < 5) {
            description = "Toque em 'Ler mais' para ver o conteúdo completo desta publicação."
          }

          // Limita a descrição
          if (description.length > 200) {
            description = description.substring(0, 200) + '...'
          }

          newPosts.push({
            title: title.replace(/\[CDATA\[|\]\]/g, '').trim(),
            link,
            description,
            date: pubDate,
            author: creator
          })
        })

        if (newPosts.length > 0) {
          this.posts = newPosts
          this.currentIndex = 0
        }
      } catch (error) {
        console.error('Erro ao carregar RSS:', error)
        this.posts = [
          {
            title: 'Erro ao carregar RSS',
            link: '#',
            description: 'Não foi possível carregar o feed. Por favor, tente novamente mais tarde.',
            date: new Date().toISOString(),
            author: 'System'
          }
        ]
      } finally {
        this.isLoading = false
      }
    },

    handleLinkClick(index) {
      if (this.posts[index].link !== '#') {
        window.open(this.posts[index].link, '_blank')
      }
    },

    next() {
      this.direction = 'next'
      this.currentIndex = (this.currentIndex + 1) % this.posts.length
      this.pauseAutoPlayTemporarily()
    },

    prev() {
      this.direction = 'prev'
      this.currentIndex = (this.currentIndex - 1 + this.posts.length) % this.posts.length
      this.pauseAutoPlayTemporarily()
    },

    goToSlide(index) {
      if (index === this.currentIndex) return
      this.direction = index > this.currentIndex ? 'next' : 'prev'
      this.currentIndex = index
      this.pauseAutoPlayTemporarily()
    },

    getSlideClass(index) {
      if (index === this.currentIndex) return 'slide-active'

      if (this.direction === 'next') {
        if (index === (this.currentIndex - 1 + this.posts.length) % this.posts.length) {
          return 'slide-exit'
        }
        return 'slide-enter'
      }

      if (index === (this.currentIndex + 1) % this.posts.length) {
        return 'slide-exit-next'
      }
      return 'slide-enter-prev'
    },

    formatDate(dateString) {
      try {
        const date = new Date(dateString)
        if (isNaN(date.getTime())) return ''

        const now = new Date()
        const diff = Math.floor((now - date) / 60000)

        if (diff < 1) return 'Agora'
        if (diff < 60) return `${diff} min atrás`
        if (diff < 1440) return `${Math.floor(diff / 60)}h atrás`

        return date.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short'
        })
      } catch {
        return ''
      }
    },

    startAutoPlay() {
      this.stopAutoPlay()
      this.autoPlayInterval = setInterval(() => {
        if (!this.isLoading && !this.autoPlayPaused) {
          this.direction = 'next'
          this.currentIndex = (this.currentIndex + 1) % this.posts.length
        }
      }, 6000)
    },

    stopAutoPlay() {
      if (this.autoPlayInterval) {
        clearInterval(this.autoPlayInterval)
        this.autoPlayInterval = null
      }
    },

    pauseAutoPlayTemporarily() {
      this.autoPlayPaused = true

      // Retoma o autoplay após 15 segundos
      setTimeout(() => {
        this.autoPlayPaused = false
      }, 35000)
    }
  }
}
</script>

<style scoped>
.carousel-container {
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  position: relative;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
}

/* HEADER */
.carousel-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px 30px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.carousel-header h1 {
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.logo {
  width: 32px;
  height: 32px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: #667eea;
  font-size: 14px;
}

.live-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s;
  user-select: none;
}

.live-badge:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.live-dot {
  width: 8px;
  height: 8px;
  background: #ff4444;
  border-radius: 50%;
  animation: blink 1.5s infinite;
}

.live-dot.loading {
  background: #fbbf24;
  animation: spin 1s linear infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* CAROUSEL */
.carousel-content {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.post-slide {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  pointer-events: none;
}

.post-slide.slide-active {
  pointer-events: auto;
}

/* ANIMAÇÕES */
.post-slide.slide-enter {
  transform: translateX(100%);
  opacity: 0;
}

.post-slide.slide-enter-prev {
  transform: translateX(-100%);
  opacity: 0;
}

.post-slide.slide-active {
  transform: translateX(0);
  opacity: 1;
}

.post-slide.slide-exit {
  transform: translateX(-100%);
  opacity: 0;
}

.post-slide.slide-exit-next {
  transform: translateX(100%);
  opacity: 0;
}

.post-meta {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  font-size: 14px;
  color: #666;
  flex-wrap: wrap;
}

.post-author {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 600;
}

.post-date {
  display: flex;
  align-items: center;
  gap: 6px;
}

.post-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 20px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.post-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border-radius: 30px;
  text-decoration: none;
  font-weight: 600;
  align-self: flex-start;
  transition: all 0.3s;
  position: relative;
  z-index: 1;
}

.post-link:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
}

.post-link svg {
  flex-shrink: 0;
  pointer-events: none;
}

.post-link.disabled {
  pointer-events: none;
  opacity: 0.7;
  background: #ccc;
}

.carousel-controls {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 15px;
  z-index: 10;
}

.control-btn {
  background: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.control-btn:hover:not(:disabled) {
  transform: scale(1.1);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-btn svg {
  width: 24px;
  height: 24px;
  stroke: #667eea;
}

.carousel-indicators {
  position: absolute;
  top: 30px;
  right: 30px;
  display: flex;
  height: 6px;
  gap: 14px;
  z-index: 10;
}

.indicator {
  width: 40px;
  height: 4px;
  background: rgba(102, 126, 234, 0.3);
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.3s;
}

.indicator:hover {
  background: rgba(102, 126, 234, 0.5);
}

.indicator.active {
  background: #667eea;
  width: 60px;
}

@media (max-width: 768px) {
  .carousel-content {
    height: 500px;
  }

  .post-slide {
    padding: 30px 20px;
  }

  .post-title {
    font-size: 22px;
  }

  .post-description {
    font-size: 14px;
  }

  .carousel-header h1 {
    font-size: 20px;
  }

  .carousel-indicators {
    top: 20px;
    right: 20px;
    gap: 6px;
  }

  .indicator {
    width: 30px;
  }

  .indicator.active {
    width: 45px;
  }
}

</style>
