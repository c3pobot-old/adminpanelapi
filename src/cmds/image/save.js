'use strict'
const fs = require('fs')
const path = require('path')
const S3_BUCKET = process.env.S3_IMAGE_BUCKET || 'web-public-test'
const s3client = require('s3client')

module.exports = async(obj = {})=>{
  try{
    if(obj.type && obj.thumbnailName && obj.img){
      await s3client.delete(S3_BUCKET, path.join(obj.type, obj.thumbnailName+'.png'))
      let res = await s3client.put(S3_BUCKET, path.join(obj.type, obj.thumbnailName+'.png'), obj.img)
      if(res){
        await fs.writeFileSync(path.join(baseDir, 'src', 'public', obj.type, `${obj.thumbnailName}.png`), obj.img, {encoding: 'base64'})
        return {status: 'ok'}
      }
    }
  }catch(e){
    throw(e);
  }
}
