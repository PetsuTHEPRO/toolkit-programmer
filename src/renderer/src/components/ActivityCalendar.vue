<template>
  <div class="calendar-container">
    <!-- Linha de títulos dos dias da semana -->
    <div class="calendar-header calendar-grid">
      <div v-for="dayName in dayNames" :key="dayName" class="calendar-day-name ms-1 mb-2">
        {{ dayName }}
      </div>
    </div>

    <!-- Dias do mês -->
    <div class="calendar-grid">
      <div
        v-for="(activity, day) in data"
        :key="day"
        :style="getDayStyle(activity)"
        class="calendar-day d-flex align-items-center justify-content-center"
      >
        {{ day }}
        <!-- Exibir o número do dia no calendário -->
      </div>
    </div>
  </div>
</template>

<script>
import SystemController from '../controller/SystemController';

export default {
  data() {
    return {
      data: {},
      dayNames: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'] // Dias da semana
    }
  },
  created() {
    this.data = this.generateActivityData()
  },
  methods: {
    getDayStyle(activity) {
      const colors = ['#d3d3d3', '#e0b3ff', '#d580ff', '#b84dff', '#8000ff'] // Cores de intensidade
      return {
        backgroundColor: colors[Math.min(activity, colors.length - 1)], // Mapeia atividade com cor
        width: '30px',
        height: '30px',
        margin: '2px',
        display: 'inline-block',
        borderRadius: '25px'
      }
    },
    generateActivityData() {
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth()
      const daysInMonth = new Date(year, month + 1, 0).getDate()

      let resertCalendar = SystemController.getCurrentCalendar()

      let data2 = SystemController.getDiaryRoutine()
      console.log("Bug", resertCalendar)
      if (resertCalendar != month + 1) {
        for (let i = 1; i <= daysInMonth; i++) {
          this.data[i] = 0
        }
        SystemController.resetCalendar(month + 1)
      } else {
        console.log("Entrou, la ele")
        for (let i = 1; i <= daysInMonth; i++) {
          this.data[i] = 0
        }

        for (let chave in data2) {
          if (Object.prototype.hasOwnProperty.call(this.data, chave)) {
            this.data[chave] = data2[chave]
          }
        }
        console.log("Arrumou", this.data)
      }

      return this.data
    }
  }
}
</script>

<style>
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr); /* 7 dias da semana */
  gap: 5px;
}

.calendar-day {
  display: inline-block;
  position: relative;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>
