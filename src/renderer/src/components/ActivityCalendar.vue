<template>
  <div class="calendar-container">
    <div class="calendar-header calendar-grid">
      <div v-for="dayName in dayNames" :key="dayName" class="calendar-day-name ms-1 mb-2">
        {{ dayName }}
      </div>
    </div>

    <div class="calendar-grid">
      <div v-for="(day, index) in daysWithPadding" :key="index">
        <div
          v-if="day.type === 'day'"
          :style="getDayStyle(day.activity)"
          class="calendar-day d-flex align-items-center justify-content-center"
          :title="`${day.activity} atividades`"
        >
          {{ day.number }}
        </div>
        <div v-else class="calendar-padding"></div>
      </div>
    </div>
  </div>
</template>

<script>
import SystemController from '../controller/SystemController'

export default {
  data() {
    return {
      // O 'data' agora será preenchido com os dados do banco
      activityData: {},
      daysWithPadding: [],
      dayNames: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
      currentDate: new Date()
    }
  },
  // Usamos 'mounted' porque é assíncrono e garante que o componente está na tela
  async mounted() {
    this.buildCalendar()
  },
  methods: {
    async buildCalendar() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth() + 1 // getMonth() é 0-11

      // 1. Busca as atividades do banco de dados
      const activities = await SystemController.getActivitiesForMonth(year, month)

      const daysInMonth = new Date(year, month, 0).getDate()
      const firstDayOfMonth = new Date(year, month - 1, 1).getDay() // 0 = Domingo

      const calendarDays = []

      // 2. Adiciona "espaçadores" para os dias do mês anterior
      for (let i = 0; i < firstDayOfMonth; i++) {
        calendarDays.push({ type: 'padding' })
      }

      // 3. Adiciona os dias do mês atual, juntando com os dados de atividade
      for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push({
          type: 'day',
          number: day,
          activity: activities[day] || 0 // Pega a contagem do dia ou 0 se não houver
        })
      }

      this.daysWithPadding = calendarDays
    },

    getDayStyle(activityCount) {
      // Sua lógica de intensidade de cor continua perfeita
      const colors = ['#161B22', '#39D353', '#26A641', '#006D32', '#0E4429']
      let intensity = 0
      if (activityCount >= 1 && activityCount <= 9) intensity = 1
      else if (activityCount >= 10 && activityCount <= 27) intensity = 2
      else if (activityCount >= 28 && activityCount <= 54) intensity = 3
      else if (activityCount >= 55) intensity = 4

      return {
        backgroundColor: colors[intensity],
        width: '30px',
        height: '30px',
        margin: '2px',
        display: 'inline-block',
        borderRadius: '25px'
      }
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
  color: white;
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

.calendar-previous-day {
  background-color: #ebedf0; /* Cinza claro */
  color: #a9a9a9; /* Cinza para texto */
  width: 30px;
  height: 30px;
  margin: 2px;
  display: inline-block;
  border-radius: 25px;
}
</style>
