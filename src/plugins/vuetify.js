import 'material-design-icons-iconfont/dist/material-design-icons.css'
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: colors.deepOrange.darken1,
        secondary: colors.deepOrange.lighten1,
        accent: colors.deepOrange.accent4,
        notes: colors.deepOrange.accent2
      }
    }
  },
  icons: {
    iconfont: 'md'
  }
})
