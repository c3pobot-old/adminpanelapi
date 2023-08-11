'use strict'
module.exports = async(obj = {})=>{
  try{
    if(obj.baseId && obj.type){
      if(obj.baseId === 'all'){
        return await mongo.find(obj.type, {})
      }else{
        return (await mongo.find(obj.type, {_id: obj.baseId}))[0]
      }
    }
  }catch(e){
    console.error(e);
  }
}
