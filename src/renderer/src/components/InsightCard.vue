<script setup>
// Este componente não tem dependências externas de outros componentes no setup.
</script>

<template>
  <!-- O componente é encapsulado em um card para ser facilmente reutilizável -->
  <div class="card shadow-sm insight-card">
    <div class="card-header d-flex justify-content-between align-items-center">
      <h5 class="card-title mb-0 d-flex align-items-center">
        <i class="bx bx-bulb me-2 text-warning"></i>
        <span>Insight do Dia</span>
      </h5>
      <button class="btn btn-sm btn-outline-secondary" @click="getNewInsight" :disabled="isLoading">
        <i class="bx bx-refresh" :class="{ 'bx-spin': isLoading }"></i>
      </button>
    </div>
    <div class="card-body d-flex align-items-center justify-content-center" style="min-height: 150px;">
      <!-- Estado de Carregamento -->
      <div v-if="isLoading" class="text-center">
        <div class="spinner-border spinner-border-sm text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted small mt-2">Buscando um novo insight...</p>
      </div>
      
      <!-- Exibição do Insight -->
      <blockquote v-else class="blockquote text-center mb-0">
        <p class="mb-2 fs-5">"{{ currentInsight }}"</p>
      </blockquote>
    </div>
    <div class="card-footer text-end">
        <button class="btn btn-sm btn-primary" @click="copyInsight" :disabled="isLoading || !currentInsight">
            <i class="bx bx-copy me-1"></i>
            Copiar
        </button>
    </div>
  </div>
</template>

<script>
import notificationService from '@renderer/service/notificationService';

export default {
  data() {
    return {
      // Lista de insights de teste. Futuramente, pode ser preenchida por uma chamada de IA.
      insightsList: [
        'Organizar seus componentes em pastas por funcionalidade, em vez de por tipo, pode melhorar a manutenibilidade a longo prazo.',
        'Considere adicionar testes unitários para seus componentes mais críticos. Isso pode economizar horas de depuração no futuro.',
        'Você já cadastrou 3 frameworks de frontend. Que tal explorar um de backend como Node.js com Express para completar seu conjunto de ferramentas?',
        'Uma boa paleta de cores geralmente não precisa de mais de 5 cores. Foco no contraste e na acessibilidade.',
        'Documentar suas APIs desde o início, mesmo as internas, é uma prática que acelera o desenvolvimento em equipe.',
        'Otimizar o tamanho das imagens antes de adicioná-las ao projeto pode melhorar significativamente o tempo de carregamento inicial do seu aplicativo.',
        'Aprender um novo atalho de teclado no seu editor de código a cada dia pode aumentar sua produtividade em mais de 20% em um ano.'
      ],
      currentInsight: '',
      isLoading: false
    }
  },
  mounted() {
    // Carrega um insight inicial quando o componente é montado.
    this.getNewInsight();
  },
  methods: {
    // O método principal para obter um insight.
    getNewInsight() {
      this.isLoading = true;
      this.currentInsight = ''; // Limpa o insight atual

      // Simula uma chamada de rede para a IA (futuramente, isso será uma chamada real).
      setTimeout(() => {
        // Escolhe um insight aleatório da lista.
        const randomIndex = Math.floor(Math.random() * this.insightsList.length);
        this.currentInsight = this.insightsList[randomIndex];
        this.isLoading = false;
      }, 500); // Meio segundo de delay para simular o carregamento
    },
    copyInsight() {
        if(!this.currentInsight) return;
        navigator.clipboard.writeText(this.currentInsight).then(() => {
            notificationService.success('Insight copiado para a área de transferência!');
        });
    }
  }
}
</script>

<style scoped>
.insight-card {
  border: 1px solid var(--card-border);
  background-color: var(--card-element-bg);
  color: var(--card-element-text);
}

.card-header {
    background-color: var(--card-header);
    border-bottom: 1px solid var(--card-border);
}

.card-footer {
    background-color: var(--card-header);
    border-top: 1px solid var(--card-border);
}

.blockquote p {
    font-style: italic;
    color: var(--container-color);
}

.btn-outline-secondary {
    border-color: var(--bs-secondary-border-subtle);
    color: var(--bs-secondary-color);
}

.btn-outline-secondary:hover {
    background-color: var(--bs-secondary);
    color: white;
}
</style>
```

### Como Usar e Futura Implementação da IA

1.  **Uso Atual:** Você pode simplesmente importar e usar `<InsightCard />` em qualquer lugar do seu aplicativo, como no seu Dashboard. Ele já é totalmente funcional com as mensagens de teste.

2.  **Futura Integração com a IA:** Para integrar a IA, a única mudança necessária será no método `getNewInsight`. Você vai substituir o bloco `setTimeout` por uma chamada real ao `SystemController`, assim:

    ```javascript
    async getNewInsight() {
      this.isLoading = true;
      this.currentInsight = '';
      
      try {
        // Futuramente, esta será a sua chamada real para a IA.
        // O prompt pode ser algo como "gere um insight de desenvolvimento".
        const aiResponse = await SystemController.askAI("Gere um insight útil para um desenvolvedor de software.", null, 'insights');
        this.currentInsight = aiResponse;
      } catch (error) {
        this.currentInsight = "Não foi possível gerar um insight no momento.";
        notificationService.error("Falha ao contatar a IA.");
      } finally {
        this.isLoading = false;
      }
    }
    ```