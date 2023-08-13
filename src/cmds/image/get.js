'use strict'
const log = require('logger')
const path = require('path')
const fs = require('fs')
module.exports = async(obj = {})=>{
  try{
    if(obj.iconKey && obj.type){
      let file = await fs.readFileSync(path.join(baseDir, 'src', 'public', obj.type, `${obj.iconKey}.png`))
      if(file) return file.toString('base64')
    }
  }catch(e){
    log.error(e);
  }
}
