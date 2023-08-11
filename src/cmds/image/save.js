'use strict'
const path = require('path')
const S3_BUCKET = process.env.S3_IMAGE_BUCKET || 'web-public-test'
const s3client = require('s3client')

module.exports = async(obj = {})=>{
  try{
    if(obj.type && obj.thumbnailName && obj.img){
      let res = await s3client.put(S3_BUCKET, path.join(obj.type, obj.thumbnailName+'.png'), obj.img)
      if(res) return {status: 'ok'}
    }
  }catch(e){
    throw(e);
  }
}
