// src/services/highlightService.js

import 'highlight.js/styles/dracula.css'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import java from 'highlight.js/lib/languages/java'
import python from 'highlight.js/lib/languages/python'
import php from 'highlight.js/lib/languages/php'
import rust from 'highlight.js/lib/languages/rust'
import go from 'highlight.js/lib/languages/go'

// Registrar as linguagens que você precisa
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('java', java)
hljs.registerLanguage('python', python)
hljs.registerLanguage('php', php)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('go', go)

const highlightCode = (code, language) => {
    console.log("code, language", code, language)
  return hljs.highlight(code, { language }).value
}

export default {
  highlightCode
}
