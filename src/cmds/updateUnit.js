'use strict'
const fs = require('fs')
module.exports = async(obj = {})=>{
  try{
    if(obj.baseId && obj.payload)
    await mongo.set('units', {_id: obj.baseId}, obj.payload)
    let unit = (await mongo.find('units', {_id: obj.baseId}, obj.projection))[0]
    if(unit) return unit
  }catch(e){
    console.error(e)
    return({message: 'error saving file'})
  }
}
