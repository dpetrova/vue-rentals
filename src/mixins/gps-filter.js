function toDMS(coordinate) {
  var absolute = Math.abs(coordinate)
  var degrees = Math.floor(absolute)
  var minutesNotTruncated = (absolute - degrees) * 60
  var minutes = minutesNotTruncated.toFixed(3)

  return `${degrees}° ${minutes}'`
}

export const gpsFilter = {
  filters: {
    LatLongToDMSFormatter: function(value) {
      const coordinates = value.split(',')
      const lat = parseFloat(coordinates[0])
      const lng = parseFloat(coordinates[1])
      var latitude = toDMS(lat)
      var latitudeCardinal = lat >= 0 ? 'N' : 'S'

      var longitude = toDMS(lng)
      var longitudeCardinal = lng >= 0 ? 'E' : 'W'

      return `${latitude} ${latitudeCardinal} ${longitude} ${longitudeCardinal}`
    },
    speedFormatter: function(value) {
      //convert m/s -> NM (vnmi/h = 1.94384449 × vm/s)
      return (value * 1.94384449).toFixed(3)
    }
  }
}
