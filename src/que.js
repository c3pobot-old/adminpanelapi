'use strict'
const Queue = require('bull');
const { createBullBoard } = require('@bull-board/api');
const { BullAdapter } = require('@bull-board/api/bullAdapter');
const { ExpressAdapter } = require('@bull-board/express');

const redisConnection = {
  host: process.env.REDIS_SERVER,
  port: +process.env.REDIS_PORT,
  password: process.env.REDIS_PASS
}
const shardQue = new Queue('shardQue', { redis: redisConnection })
const discord = new Queue('discord', { redis: redisConnection })
const discordPrivate = new Queue('discordPrivate', { redis: redisConnection })
const oauth = new Queue('oauth', { redis: redisConnection })
const oauthPrivate = new Queue('oauthPrivate', { redis: redisConnection })
const swgoh = new Queue('swgoh', { redis: redisConnection })
const swgohPrivate = new Queue('swgohPrivate', { redis: redisConnection })
const guildQue = new Queue('guildQue', { redis: redisConnection })

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/bull');
const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
  queues: [
    new BullAdapter(shardQue),
    new BullAdapter(discord),
    new BullAdapter(discordPrivate),
    new BullAdapter(oauth),
    new BullAdapter(oauthPrivate),
    new BullAdapter(swgoh),
    new BullAdapter(swgohPrivate),
    new BullAdapter(guildQue)
  ],
  serverAdapter: serverAdapter,
});

module.exports = serverAdapter
