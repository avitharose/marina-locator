$ = require 'jQuery'
fs= require 'fs'

parseHtml = (err, data) ->
  if err
    throw err
  console.log data

fs.readFile './Marinas.kml', 'utf8', parseHtml

console.log 'ending'

