$  = require 'jQuery'
fs = require 'fs'
marinas = []

createPosition = (coords) ->
  [lat,lng] = coords.split ','
  position =
    latitude: lat,
    longitude: lng

findMarkers = (xml) ->
  xml.find('Placemark').each ()->
    marinas.push
      name: $(this).find('name').text()
      position: createPosition $(this).find('Point coordinates').text()
  console.log marinas

parseKml = (err, data) ->
  if err
    throw err
  findMarkers $(data)

fs.readFile './Marinas.kml', 'utf8', parseKml

