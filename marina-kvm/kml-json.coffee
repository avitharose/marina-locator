$ = require 'jQuery'
fs= require 'fs'

findMarkers = (xml) ->
  xml.find('Placemark').each ()->
    console.log $(this).find('name').text()

parseKml = (err, data) ->
  if err
    throw err
  findMarkers $(data)

fs.readFile './Marinas.kml', 'utf8', parseKml

console.log 'ending'

