<template>
  <div class="calendar-container">
    <div class="calendar-header calendar-grid">
      <div v-for="dayName in dayNames" :key="dayName" class="calendar-day-name ms-1 mb-2">
        {{ dayName }}
      </div>
    </div>

    <div class="calendar-grid">
      <div
        v-for="(activity, day) in data"
        :key="day"
        :style="getDayStyle(activity)"
        class="calendar-day d-flex align-items-center justify-content-center"
      >
        {{ day }}
      </div>
    </div>
  </div>
</template>

<script>
import SystemController from '../controller/SystemController'

export default {
  data() {
    return {
      data: {},
      dayNames: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    }
  },
  created() {
    this.data = this.generateActivityData()
  },
  methods: {
    getDayStyle(activity) {
      const colors = ['#EBEDF0', '#e0b3ff', '#d580ff', '#b84dff', '#8000ff']
      return {
        backgroundColor: colors[this.getIntensity(activity)],
        width: '30px',
        height: '30px',
        margin: '2px',
        display: 'inline-block',
        borderRadius: '25px'
      }
    },

    getIntensity(activity) {
      if (activity === 0) {
        return 0
      } else if (activity >= 1 && activity <= 9) {
        return 1
      } else if (activity >= 10 && activity <= 27) {
        return 2
      } else if (activity >= 28 && activity <= 54) {
        return 3
      } else {
        return 4
      }
    },
    generateActivityData() {
      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth()
      const daysInMonth = new Date(year, month + 1, 0).getDate()
      const resertCalendar = SystemController.getCurrentCalendar()
      const calendarWithRoutine = SystemController.getDiaryRoutine()

      // Inicializa this.data como um objeto vazio ou com 0 para cada dia
      for (let i = 1; i <= daysInMonth; i++) {
        this.data[i] = 0
      }

      if (resertCalendar !== month + 1) {
        SystemController.resetCalendar(month + 1)
      } else {
        for (let chave in calendarWithRoutine) {
          if (Object.prototype.hasOwnProperty.call(calendarWithRoutine, chave)) {
            this.data[chave] = calendarWithRoutine[chave]
          }
        }
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
