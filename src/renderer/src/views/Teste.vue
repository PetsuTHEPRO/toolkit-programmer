<template>
  <div class="min-vh-100 bg-gradient bg-purple-900 text-white">
    <!-- Navbar -->
    <nav class="bg-purple-800 py-3">
      <div class="container d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center text-decoration-none">
          <i class="bx bx-code-alt text-purple-300" style="font-size: 32px"></i>
          <span class="ms-2 fs-4 fw-bold text-white">Programmer's Toolkit</span>
        </div>
        <a
          href="https://github.com/petsuTHEPRO"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-outline-light d-flex align-items-center justify-content-center"
        >
          <i class="bx bxl-github me-2" style="font-size: 20px"></i>
          GitHub
        </a>
      </div>
    </nav>

    <!-- Main Content -->
    <div
      class="d-flex flex-column align-items-center justify-content-center min-vh-100 position-relative pt-5"
    >
      <!-- Background Image -->
      <div
        class="position-absolute top-0 bottom-0 start-0 end-0"
        style="
          background-image: url('https://picsum.photos/1912/1080');
          background-size: cover;
          background-position: center;
          filter: blur(5px) brightness(0.5);
        "
      ></div>
      <!-- Card -->
      <div
        class="w-75 z-1 bg-purple-800 bg-opacity-30 backdrop-blur-lg rounded-3 p-5 text-center mb-5"
      >
        <div class="d-flex justify-content-center align-items-center mb-4">
          <i class="bx bx-code-alt text-purple-300" style="font-size: 48px"></i>
          <h1 class="ms-3 display-5 text-white bounce-animation">Programmer's Toolkit</h1>
        </div>
        <p class="fs-4 text-purple-100">
          Bem-vindo ao seu arsenal definitivo de desenvolvimento! Aqui você tem o poder de
          armazenar, organizar e acessar rapidamente todos os recursos essenciais para sua jornada
          de programação.
        </p>

        <div class="d-flex justify-content-center mt-4">
          <router-link
            to="/"
            class="btn btn-lg btn-purple-500 hover-scale mx-2 d-flex align-items-center justify-content-center"
          >
            <i class="bx bx-right-arrow-alt me-2"></i>
            Começar Agora
          </router-link>
          <a
            href="https://www.ko-fi.com/petermenezes"
            target="_blank"
            class="btn btn-lg btn-purple-400 hover-scale mx-2 d-flex align-items-center justify-content-center"
          >
            <i class="bx bx-heart me-2"></i>
            Doar
          </a>
          <a
            href="https://github.com/petsuTHEPRO/toolkit-programmer/blob/master/README.md"
            target="_blank"
            class="btn btn-lg btn-purple-600 hover-scale mx-2 d-flex align-items-center justify-content-center"
          >
            <i class="bx bx-book-open me-2"></i>
            Documentação
          </a>
        </div>

        <p class="mt-4 text-purple-200">
          Armazene imagens, ícones, fontes, trechos de código, frameworks e muito mais!
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style>
.hover-scale {
  transition: transform 0.3s ease-in-out;
}

.hover-scale:hover {
  transform: scale(1.05);
}

.btn-purple-600 {
  background-color: #3b82f6; /* Um tom de roxo correspondente ao valor 600 do Tailwind CSS */
  color: #ffffff; /* Cor do texto, branco para contraste */
  padding: 0.5rem 1rem; /* Adiciona um pouco de espaço interno */
  border: none; /* Remove bordas padrão */
  border-radius: 0.375rem; /* Bordas arredondadas */
  cursor: pointer; /* Muda o cursor para indicar que é clicável */
  transition: background-color 0.3s; /* Efeito de transição para o fundo */
}

.btn-purple-600:hover {
  background-color: #2563eb; /* Cor ao passar o mouse */
}

.btn-purple-500 {
  background-color: #22c55e; /* Um tom de roxo correspondente ao valor 500 do Tailwind CSS */
  color: #ffffff; /* Cor do texto, branco para contraste */
  padding: 0.5rem 1rem; /* Adiciona um pouco de espaço interno */
  border: none; /* Remove bordas padrão */
  border-radius: 0.375rem; /* Bordas arredondadas */
  cursor: pointer; /* Muda o cursor para indicar que é clicável */
  transition: background-color 0.3s; /* Efeito de transição para o fundo */
}

.btn-purple-500:hover {
  background-color: #16a34a; /* Cor ao passar o mouse */
}

.btn-purple-400 {
  background-color: #ec4899; /* Um tom de roxo correspondente ao valor 400 do Tailwind CSS */
  color: #ffffff; /* Cor do texto, branco para contraste */
  padding: 0.5rem 1rem; /* Adiciona um pouco de espaço interno */
  border: none; /* Remove bordas padrão */
  border-radius: 0.375rem; /* Bordas arredondadas */
  cursor: pointer; /* Muda o cursor para indicar que é clicável */
  transition: background-color 0.3s; /* Efeito de transição para o fundo */
}

.btn-purple-400:hover {
  background-color: #db2777; /* Cor ao passar o mouse */
}

.bg-purple-800 {
  background-color: rgba(94, 43, 145, 0.5); /* Cor roxa com 30% de opacidade */
  color: #ffffff; /* Texto branco */
  padding: 1rem;
  border-radius: 0.375rem; /* Bordas arredondadas */
}

.bg-purple-900 {
  background-color: rgba(94, 43, 145); /* Cor roxa com 50% de opacidade */
  color: #ffffff; /* Texto branco */
}

/* Animação de subir e descer */
@keyframes bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

/* Aplicar a animação ao título */
.bounce-animation {
  animation: bounce 2s infinite ease-in-out;
}
</style>
