import { useToast } from 'vue-toastification'

const toast = useToast()

export default {
  success(message) {
    toast.success(message, 3000)
  },
  error(message) {
    toast.error(message, 3000)
  },
  warning(message) {
    toast.warning(message, 3000)
  },
  info(message) {
    toast.info(message, 3000)
  }
}