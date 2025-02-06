<template>
  <div class="card w-100 mx-auto" style="max-width: 900px;">
    <div class="card-header">
      <div class="d-flex align-items-center">
        <div class="avatar me-3">
          <img src="https://ui-avatars.com/api/?name=João+Silva" class="rounded-circle" alt="João Silva" />
        </div>
        <div>
          <h5 class="card-title mb-0">João Silva</h5>
          <p class="card-description">Configurações de Perfil</p>
        </div>
      </div>
    </div>
    <div class="card-body">
      <ul class="nav nav-tabs">
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'geral' }" @click="activeTab = 'geral'">Geral</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'seguranca' }" @click="activeTab = 'seguranca'">Segurança</button>
        </li>
        <li class="nav-item">
          <button class="nav-link" :class="{ active: activeTab === 'backup' }" @click="activeTab = 'backup'">Backup</button>
        </li>
      </ul>

      <div v-if="activeTab === 'geral'" class="mt-4">
        <div class="mb-3">
          <label for="idioma">Idioma</label>
          <div class="d-flex">
            <button class="btn" :class="{'btn-outline-primary': idioma !== 'en', 'btn-primary': idioma === 'en'}" @click="mudarIdioma('en')">
              🇺🇸 English
            </button>
            <button class="btn ms-2" :class="{'btn-outline-primary': idioma !== 'pt', 'btn-primary': idioma === 'pt'}" @click="mudarIdioma('pt')">
              🇧🇷 Português
            </button>
            <button class="btn ms-2" :class="{'btn-outline-primary': idioma !== 'es', 'btn-primary': idioma === 'es'}" @click="mudarIdioma('es')">
              🇪🇸 Español
            </button>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center">
          <label>Tema</label>
          <div class="d-flex align-items-center">
            <i class='bx bx-sun me-2'></i>
            <input type="checkbox" class="form-check-input" v-model="tema" @change="mudarTema" />
            <i class='bx bx-moon ms-2'></i>
            <span class="ms-2">{{ tema === 'light' ? 'Claro' : 'Escuro' }}</span>
          </div>
        </div>

        <button class="btn btn-danger w-100" @click="confirmarExclusao">
          <i class='bx bx-trash me-2'></i> Excluir Todos os Dados
        </button>

        <div v-if="mostrarConfirmacao" class="mt-3">
          <label for="senha-exclusao">Digite sua senha para confirmar</label>
          <input type="password" v-model="senhaExclusao" class="form-control" />
          <button class="btn btn-danger w-100 mt-3" @click="excluirDados">Confirmar Exclusão</button>
        </div>
      </div>

      <div v-if="activeTab === 'seguranca'" class="mt-4">
        <div class="mb-3">
          <label for="senha">Senha</label>
          <div class="input-group">
            <input :type="mostrarSenha ? 'text' : 'password'" :value="mostrarSenha ? senha : '*'.repeat(senha.length)" readonly class="form-control" />
            <button class="btn btn-outline-secondary" @click="mostrarSenha = !mostrarSenha">
              <i :class="mostrarSenha ? 'bx bx-hide' : 'bx bx-show'"></i>
            </button>
          </div>
        </div>

        <button class="btn btn-secondary" @click="mostrarCamposSenha = !mostrarCamposSenha">
          {{ mostrarCamposSenha ? 'Cancelar' : 'Mudar Senha' }}
        </button>

        <div v-if="mostrarCamposSenha" class="mt-4">
          <div class="mb-3">
            <label for="senha-atual">Senha Atual</label>
            <input type="password" v-model="senhaAtual" class="form-control" />
          </div>
          <div class="mb-3">
            <label for="nova-senha">Nova Senha</label>
            <input type="password" v-model="novaSenha" class="form-control" />
          </div>
          <div class="mb-3">
            <label for="confirmar-senha">Confirmar Nova Senha</label>
            <input type="password" v-model="confirmarSenha" class="form-control" />
          </div>
          <button class="btn btn-primary" @click="mudarSenha">Confirmar Mudança de Senha</button>
        </div>
      </div>

      <div v-if="activeTab === 'backup'" class="mt-4">
        <h5>Backup de Informações</h5>
        <p>
          Faça backup das suas informações, incluindo fontes, imagens e paletas de cores para garantir que seus dados estejam seguros e recuperáveis quando necessário.
        </p>
        <div class="row mt-5">
          <div class="col-4">

            <div class="text-center mb-3">
              <i class='bx bxs-cloud-upload' style="font-size: 80px"></i>
            </div>
          </div>
          <div class="col-8">

            <button class="btn btn-primary w-100" @click="backup">
          <i class='bx bx-download me-2'></i> Criar Backup
        </button>
        <button class="btn btn-outline-secondary w-100 mt-3" @click="carregarBackup">
          <i class='bx bx-upload me-2'></i> Carregar Backup
        </button>
      </div>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeTab: 'geral',
      nome: 'João Silva',
      idioma: 'pt',
      tema: 'light',
      senha: 'senha123',
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: '',
      senhaExclusao: '',
      mostrarSenha: false,
      mostrarCamposSenha: false,
      mostrarConfirmacao: false
    };
  },
  methods: {
    mudarIdioma(idioma) {
      this.idioma = idioma;
    },
    mudarTema() {
      this.tema = this.tema === 'light' ? 'dark' : 'light';
    },
    mudarSenha() {
      if (this.novaSenha === this.confirmarSenha) {
        this.senha = this.novaSenha;
        this.senhaAtual = this.novaSenha = this.confirmarSenha = '';
        this.mostrarCamposSenha = false;
        console.log('Senha alterada com sucesso!');
      } else {
        console.log('As senhas não coincidem!');
      }
    },
    backup() {
      console.log('Criando backup...');
    },
    carregarBackup() {
      console.log('Carregando backup...');
    },
    confirmarExclusao() {
      this.mostrarConfirmacao = true;
    },
    excluirDados() {
      if (this.senhaExclusao === this.senha) {
        console.log('Dados excluídos com sucesso!');
        this.senhaExclusao = '';
        this.mostrarConfirmacao = false;
      } else {
        console.log('Senha incorreta!');
      }
    }
  }
};
</script>

<style scoped>
.card-description {
  font-size: 14px;
  color: #6c757d;
}
</style>
