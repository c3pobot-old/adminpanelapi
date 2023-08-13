'use strict'
const log = require('logger')
const bottleneck = require('bottleneck')
const fs = require('fs-extra')
const path = require('path')
const s3client = require('s3client')
const { createHash } = require('crypto')

const IMG_DIR = ['portrait', 'thumbnail', 'asset']
const S3_BUCKET = process.env.S3_IMAGE_BUCKET || 'web-public-test'
let notify = true, counts = { portrait: 0, thumbnail: 0, asset: 0 }

const limiter = new bottleneck({
  minTime: 20
})

const getFileHash = (dir, filename)=>{
  try{
    let file = fs.readFileSync(path.join(__dirname, 'public', dir, `${filename}`))
    let hash = createHash("md5")?.update(file)?.digest("hex");
    return `"${hash}"`
  }catch(e){
    return
  }
}
const getRemoteList = async(prefix)=>{
  try{
    return await s3client.list(S3_BUCKET, prefix)
  }catch(e){
    throw(e)
  }
}
const checkFile = async(dir, filename, md5)=>{
  try{
    let fileHash = await getFileHash(dir, filename)
    if(fileHash && fileHash === md5) return
    let img = await limiter.schedule(()=>s3client.get(S3_BUCKET, `${dir}/${filename}`))
    if(img){
      fs.writeFileSync(path.join(__dirname, 'public', dir, `${filename}`), img)
      counts[dir]++
    }
  }catch(e){
    log.error(e)
  }
}
const checkList = async(dir)=>{
  try{
    await fs.ensureDir(path.join(__dirname, 'public', dir), {mode: 0o2775})
    let list = await getRemoteList(dir)
    if(list?.length > 0){
      if(notify) log.info(`downloading ${list.length} files for ${dir}`)
      let res = []
      for(let i in list) res.push(checkFile(dir, list[i].Key?.replace(`${dir}/`, ''), list[i].ETag))
      await Promise.all(res)
    }
    if(notify || counts[dir]) log.info(`downloaded ${counts[dir]} new files for ${dir}`)
  }catch(e){
    log.error(e)
  }
}
const syncFiles = async()=>{
  try{
    counts = { portrait: 0, thumbnail: 0, asset: 0 }
    for(let i in IMG_DIR) await checkList(IMG_DIR[i])
    if(notify){
      notify = false
      log.info('Intial check of s3 file complete')
    }
    setTimeout(syncFiles, 5000)
  }catch(e){
    log.error(e)
    setTimeout(syncFiles, 5000)
  }
}
syncFiles()
