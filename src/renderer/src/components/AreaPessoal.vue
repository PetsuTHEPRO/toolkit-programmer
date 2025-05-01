<template>
  <!-- Área Pessoal -->
  <div v-if="activeTab === 'personal'" class="settings-section">
    <h3 class="mb-4 title"><i class="bx bx-user"></i> {{ $t('pages.settings.personal.title') }}</h3>

    <!-- <div class="card mb-4">
      <div class="card-header">{{ $t('pages.settings.personal.account-header') }}</div>
      <div class="card-body">
        <div class="mb-3">
          <label for="userName" class="form-label">{{ $t('pages.settings.personal.label') }}</label>
          <input type="text" class="form-control" id="userName" v-model="user.name" />
        </div>

        <button class="btn btn-primary" @click="changePassword">
          <i class="bi bi-key me-2"></i> Mudar Senha
        </button>
      </div>
    </div>

    
    <div class="modal fade" id="passwordModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Mudar Senha</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="currentPassword" class="form-label">Senha Atual</label>
              <input
                type="password"
                class="form-control"
                id="currentPassword"
                v-model="password.current"
              />
            </div>
            <div class="mb-3">
              <label for="newPassword" class="form-label">Nova Senha</label>
              <input type="password" class="form-control" id="newPassword" v-model="password.new" />
            </div>
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirmar Nova Senha</label>
              <input
                type="password"
                class="form-control"
                id="confirmPassword"
                v-model="password.confirm"
              />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button type="button" class="btn btn-primary" @click="savePassword">Salvar</button>
          </div>
        </div>
      </div>
    </div> -->

    <div class="card border-danger">
      <div class="card-header bg-danger text-white">
        {{ $t('pages.settings.personal.delete-header') }}
      </div>
      <div class="card-body">
        <p class="text-danger">
          {{ $t('pages.settings.personal.delete-description') }}
        </p>
        <button class="btn btn-danger" @click="confirmDelete">
          <i class="bi bi-trash me-2"></i> Apagar Todos os Dados
        </button>
      </div>
    </div>

    <!-- Modal de confirmação -->
    <div class="modal fade" id="deleteModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header bg-danger text-white">
            <h5 class="modal-title">Confirmar Exclusão</h5>
            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div class="modal-body">
            <p>
              Tem certeza que deseja apagar todos os seus dados? Esta ação não pode ser desfeita.
            </p>
            <div class="form-check mb-3">
              <input
                class="form-check-input"
                type="checkbox"
                id="confirmDelete"
                v-model="deleteConfirmed"
              />
              <label class="form-check-label" for="confirmDelete">
                Sim, eu entendo e quero apagar todos os meus dados.
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
              Cancelar
            </button>
            <button
              type="button"
              class="btn btn-danger"
              :disabled="!deleteConfirmed"
              @click="deleteAllData"
            >
              Apagar Tudo
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'

export default {
  name: 'AreaPessoal',
  props: {
    activeTab: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      user: {
        name: 'João Silva',
        email: 'joao@exemplo.com'
      },
      password: {
        current: '',
        new: '',
        confirm: ''
      },
      deleteConfirmed: false
    }
  },
  methods: {
    changePassword() {
      this.password = { current: '', new: '', confirm: '' }
      const modal = new Modal(document.getElementById('passwordModal'))
      modal.show()
    },
    savePassword() {
      // Validação da senha
      if (this.password.new !== this.password.confirm) {
        alert('As senhas não coincidem!')
        return
      }

      // Lógica para salvar a senha
      console.log('Senha alterada:', this.password)

      // Fechar modal
      const modal = Modal.getInstance(document.getElementById('passwordModal'))
      modal.hide()
    },
    confirmDelete() {
      this.deleteConfirmed = false
      const modal = new Modal(document.getElementById('deleteModal'))
      modal.show()
    },
    deleteAllData() {
      // Lógica para apagar dados
      console.log('Todos os dados foram apagados')

      // Fechar modal
      const modal = Modal.getInstance(document.getElementById('deleteModal'))
      modal.hide()
    }
  }
}
</script>

<style scope>
@import url('../assets/base.css');

h3.title {
  color: var(--text-color);
}

.dark-theme .modal-content {
  background-color: #2d2d2d;
  color: #f8f9fa;
}

.dark-theme .modal-header {
  border-bottom-color: #444;
  color: #f8f9fa;
}

.dark-theme .modal-footer {
  border-top-color: #444;
  color: #f8f9fa;
}
</style>
