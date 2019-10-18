import moment from 'moment'

export const dateFilter = {
  filters: {
    dateTimeFormatter: function(value) {
      if (!value) return ''
      let date = new Date(value)
      //return date.toLocaleString(['en-US'], {
      //   month: 'short',
      //   day: '2-digit',
      //   year: 'numeric',
      //   hour: '2-digit',
      //   minute: '2-digit',
      //   second: '2-digit'
      // })
      date = date.toUTCString()
      return moment(date).format('YYYY-MM-DD, h:mm:ss a')
    },
    dateFormatter: function(value) {
      if (!value) return ''
      let date = new Date(value)
      // return date.toLocaleString(['en-US'], {
      //   month: 'short',
      //   day: '2-digit',
      //   year: 'numeric'
      // })
      date = date.toUTCString()
      return moment(date).format('YYYY-MM-DD')
    }
  }
}
