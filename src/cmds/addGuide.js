'use strict'
const mongo = require('mongoclient')
module.exports = async(obj = {})=>{
  try{
    if(!obj.name && !obj.value) return
    let manualGuides = (await mongo.find('botSettings', {_id: 'manualGuides'}))[0]
    if(!manualGuides) manualGuides = {data: []}
    if(manualGuides?.data?.filter(x=>x.value === obj.value).length === 0){
      manualGuides.data.push(obj)
      await mongo.set('botSettings', {_id: 'manualGuides'}, {data: manualGuides.data})
    }
    let guides = (await mongo.find('autoComplete', {_id: 'journey'}))[0]
    if(guides?.data?.length > 0){
      if(guides?.data?.filter(x=>x.value === obj.value).length === 0) guides.data.push(obj)
      await mongo.set('autoComplete', {_id: 'journey'}, {data: guides.data})
      return {status: true}
    }
  }catch(e){
    throw(e);
  }
}
