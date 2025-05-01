<template>
  <div ref="editorContainer" class="monaco-editor-container"></div>
</template>

<script>
import * as monaco from 'monaco-editor'
import { getTheme } from '../service/userPreferences'

// Definição global do tema Dracula (executa apenas uma vez)
let draculaThemeDefined = false

export default {
  name: 'MonacoEditor',
  props: {
    code: {
      type: String,
      default: ''
    },
    language: {
      type: String,
      default: 'javascript',
      validator: value => ['javascript', 'typescript', 'html', 'css', 'json', 'python'].includes(value)
    },
    readOnly: {
      type: Boolean,
      default: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      editor: null,
      themeMode: getTheme() === 'dark' ? 'dracula' : 'vs'
    }
  },
  computed: {
    editorOptions() {
      return {
        value: this.code,
        language: this.language,
        theme: this.themeMode,
        readOnly: this.readOnly,
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        ...this.options
      }
    }
  },
  watch: {
    code(newValue) {
      if (this.editor && this.editor.getValue() !== newValue) {
        // Preserva a posição do cursor ao atualizar
        const position = this.editor.getPosition()
        this.editor.setValue(newValue)
        if (position) this.editor.setPosition(position)
      }
    },
    language(newLanguage) {
      if (this.editor) {
        monaco.editor.setModelLanguage(this.editor.getModel(), newLanguage)
      }
    },
    themeMode(newTheme) {
      if (this.editor) {
        const themeToApply = newTheme === 'dark' ? 'dracula' : newTheme
        monaco.editor.setTheme(themeToApply)
      }
    },
    readOnly(newValue) {
      if (this.editor) {
        this.editor.updateOptions({ readOnly: newValue })
      }
    }
  },
  mounted() {
    this.initEditor()
  },
  beforeUnmount() {
    this.destroyEditor()
  },
  methods: {
    initEditor() {
      if (this.editor) return

      // Define o tema Dracula apenas uma vez
      if (!draculaThemeDefined) {
        monaco.editor.defineTheme('dracula', {
          base: 'vs-dark',
          inherit: true,
          rules: [
            { token: 'comment', foreground: '#6272A4', fontStyle: 'italic' },
            { token: 'string', foreground: '#F1FA8C' },
            { token: 'keyword', foreground: '#FF79C6' },
            { token: 'number', foreground: '#BD93F9' },
            { token: 'operator', foreground: '#FF79C6' },
            { token: 'identifier', foreground: '#F8F8F2' },
            { token: 'type', foreground: '#8BE9FD' },
          ],
          colors: {
            'editor.background': '#282A36',
            'editor.lineHighlightBackground': '#383A59',
            'editorCursor.foreground': '#F8F8F0',
            'editor.selectionBackground': '#44475A',
            'editor.inactiveSelectionBackground': '#44475A55',
          }
        })
        draculaThemeDefined = true
      }

      this.editor = monaco.editor.create(this.$refs.editorContainer, this.editorOptions)
      
      // Configuração adicional para melhor performance
      this.editor.getModel()?.setEOL(monaco.editor.EndOfLineSequence.LF)
    },
    setLanguage(language) {
    if (this.editor) {
      const model = this.editor.getModel()
      monaco.editor.setModelLanguage(model, language)
      
      // Opcional: força nova tokenização
      model.setValue(model.getValue())
    }
  },
    destroyEditor() {
      if (this.editor) {
        // Limpeza mais completa
        const model = this.editor.getModel()
        if (model) {
          model.dispose()
        }
        this.editor.dispose()
        this.editor = null
      }
    },
    getCurrentValue() {
      return this.editor ? this.editor.getValue() : ''
    },
    setTheme(theme) {
      this.themeMode = theme === 'dark' ? 'dracula' : theme
    }
  }
}
</script>

<style scoped>
.monaco-editor-container {
  height: 100vh;
  width: 100%;
  min-height: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
}
</style>