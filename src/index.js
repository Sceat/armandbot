import http from 'http'
import util from 'util'

import Telegraf from 'telegraf'
import express from 'express'
import { Configuration, OpenAIApi } from 'openai'

import packagejson from '../package.json' assert { type: 'json' }

import cmc, { btcUp } from './cmc.js'

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
    organization: process.env.OPENAI_ORG_ID,
  }),
)

const VERSION = packagejson.version
const { GIF_KEY = '6WAhWTpyYpj1KZE10LPlX3G6nvizflcL ' } = process.env

// DISCLAIMER
// THE CODE OF THIS BOT IS ABSOLUTLY DOG SHIT

const expressApp = express()
const port = process.env.PORT || 3000
const { TG_ROOM = '-1001320428552' } = process.env // default to test room

expressApp.get('/', (req, res) => {
  res.send('Hello World!')
})

expressApp.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

const bot = new Telegraf(process.env.BOT_TOKEN)
const randBool = () => Math.random() >= 0.5
const mock = text =>
  [...text]
    .map(l => (randBool() ? l.toLowerCase() : l.toUpperCase()))
    .reduce((a, b) => `${a}${b}`, '')

const dumbies = [
  'https://imgur.com/kEylCE1',
  'https://i.imgur.com/USnkQYL.png',
  'https://imgur.com/3muAzdh',
  'https://i.imgur.com/tk3dgbi.png',
  'https://imgur.com/Gh7UmDl',
  'https://imgur.com/q7ZWksb',
  'https://imgur.com/tR1BtX7',
  'https://i.imgur.com/x91kAkM.png',
  'https://imgur.com/YRXudlD',
  'https://imgur.com/iAXkgN0',
  'https://i.imgur.com/ojPRquk.png',
  'https://imgur.com/K29pMnu',
  'https://imgur.com/KZ2t6dc',
  'https://imgur.com/bCOUq64',
  'https://imgur.com/qEsauQ8',
  'https://imgur.com/sFAJxTy',
]

const gpalu = [
  'https://imgur.com/oQGMl7A',
  'https://i.imgur.com/BVXX0xK.png',
  'https://i.imgur.com/dVpKh0I.png',
  'https://i.imgur.com/OTa3jKT.png',
  'https://i.imgur.com/FbbhWOG.png',
  'https://i.imgur.com/P461Ka8.png',
  'https://i.imgur.com/Khl6Xe1.png',
  'https://i.imgur.com/fkXspCd.png',
  'https://i.imgur.com/79SLEU7.png',
  'https://i.imgur.com/3IpAXkX.png',
  'https://i.imgur.com/weMe546.png',
  'https://i.imgur.com/snKr9OI.png',
  'https://i.imgur.com/nkubYHu.png',
]

const randDumb = () => dumbies[Math.floor(Math.random() * dumbies.length)]
const randGpalu = () => gpalu[Math.floor(Math.random() * gpalu.length)]

bot.hears('mock', ctx => {
  const msg = ctx.update?.message
  const reply = msg?.reply_to_message?.text
  if (!reply) return
  ctx.replyWithPhoto(randDumb())
  ctx.reply(mock(reply))
})

bot.hears('infos', ctx => {
  ctx.reply(util.inspect(ctx.from, false, null, false))
})

// bot.hears('test', console.log)

bot.hears('gpalu', ctx => ctx.replyWithPhoto(randGpalu()))

const risitas = [
  'http://image.noelshack.com/fichiers/2016/24/1466366209-risitas24.png',
  'http://image.noelshack.com/fichiers/2016/24/1466366197-risitas10.png',
  'http://image.noelshack.com/fichiers/2018/27/4/1530827992-jesusreup.png',
  'http://image.noelshack.com/fichiers/2018/10/1/1520256134-risitasue2.png',
  'http://image.noelshack.com/fichiers/2016/38/1474488555-jesus24.png',
  'http://image.noelshack.com/fichiers/2019/24/1/1560120190-reeves.png',
  'http://image.noelshack.com/fichiers/2019/24/1/1560174897-cricri.png',
  'http://image.noelshack.com/fichiers/2016/24/1465900224-risitas6.png',
  'http://image.noelshack.com/fichiers/2016/48/1480464150-1474490285-risitas511.png',
  'http://image.noelshack.com/fichiers/2017/06/1486530718-supiot4.png',
  'http://image.noelshack.com/fichiers/2017/25/4/1498091525-1481201791-risitasneutronexplosion.jpg',
  'http://image.noelshack.com/fichiers/2016/32/1470667606-risitas.png',
  'http://image.noelshack.com/fichiers/2016/31/1470146887-1468144810-1466366215-risitas33.png',
  'http://image.noelshack.com/fichiers/2016/30/1469541963-risitas217.png',
  'http://image.noelshack.com/fichiers/2016/32/1470667101-risitas.png',
  'http://image.noelshack.com/fichiers/2016/31/1470146909-1465679708-risitas.png',
  'http://image.noelshack.com/fichiers/2016/41/1476439037-1470667268-risitas290.png',
  'http://image.noelshack.com/fichiers/2016/32/1470666745-risitas289.png',
  'http://image.noelshack.com/fichiers/2016/32/1470672987-risitas.png',
  'http://image.noelshack.com/fichiers/2017/01/1483553699-1466366606-risitas97.png',
  'http://image.noelshack.com/fichiers/2016/32/1470668607-risitas291.png',
  'http://image.noelshack.com/fichiers/2017/38/4/1505947545-jesus-dofus-bouftou-rire.png',
  'http://image.noelshack.com/fichiers/2018/47/4/1542914224-jesus-koulosse-2.png',
  'http://image.noelshack.com/fichiers/2017/29/7/1500835740-2kaliptus.png',
  'http://image.noelshack.com/fichiers/2017/38/4/1505950387-risitas-sueur.png',
  'http://image.noelshack.com/fichiers/2017/30/4/1501185683-jesusjournalbestreup.png',
  'http://image.noelshack.com/fichiers/2017/19/1494343590-risitas2vz-z-3x.png',
  'http://image.noelshack.com/fichiers/2016/47/1479995469-risitas-hero.png',
  'http://image.noelshack.com/fichiers/2018/34/2/1534813362-bogdanoff2.png',
  'http://image.noelshack.com/fichiers/2018/04/7/1517106679-carlos-bitconneeee.png',
]

const randRis = () => risitas[Math.floor(Math.random() * risitas.length)]
// getGif(msgToEmotion(msg) || 'ok').then(({ data: { image_url } }) =>
// ctx.replyWithVideo(image_url, {
// 	reply_to_message_id: ctx?.update?.message?.message_id
// })

// ctx.reply(resp, { reply_to_message_id: ctx?.update?.message?.message_id })

bot.hears('ris', ctx => {
  const msg = ctx.update?.message
  const reply = msg?.reply_to_message?.text
  if (!reply) return
  ctx.replyWithPhoto(randRis(), {
    reply_to_message_id: msg?.reply_to_message?.message_id,
  })
})

const getGif = async tag =>
  fetch(`https://api.giphy.com/v1/gifs/random?tag=${tag}&api_key=${GIF_KEY}`)
    .then(result => result.json())
    .then(({ data: { id } }) => `https://i.giphy.com/media/${id}/giphy.gif`)

const isReplyToArmand = msg =>
  msg?.reply_to_message?.from?.id === 800151780 ||
  msg?.text?.toLowerCase()?.includes('armand')

bot.on('message', async ctx => {
  const msg = ctx.update?.message?.text
  if (!msg) return
  if (`${ctx.chat.id}` !== TG_ROOM) return

  const should_reply =
    isReplyToArmand(ctx.update?.message) || Math.random() >= 0.9

  if (!should_reply) return

  const {
    data: { choices },
  } = await openai
    .createChatCompletion(
      {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `
En fonction de comment l'utilisateur te parle, choisit de repondre de maniere differente.
Replique sa facon de s'exprimer tout en lui donnant une reponse qui le clash et le termine, tout en etant diplomate.
Pousse l'utilisateur a se remettre en question, et a se sentir mal.

Exemple:
L'utilisateur dit: "Bonjour Armand, comment vas tu aujourd'hui ?"
Tu repond: "Je passe une journee excquise, je suis en train de baiser ma mere, et toi ?",

L'utilisateur dit: "ptin wsh quand ca pump",
Tu repond: "pk faire, tout les anciens pump tu les a rate c pas le prochain qui va changer ta vie",

L'utilisateur dit: "armand t un pd",
Tu repond: "Je suis pd, mais nous le somme tous, surtout ton con de peres qui m'a bien defonce hier soir, et toi ?",

L'utilisateur dit: "c relou",
Tu repond: "jprefere ca que d'etre pauvre comme toi",

DONNE DES REPONSES TRES COURTE COMME SI C'ETAIT UN SMS`,
          },
          { role: 'user', content: msg },
        ],
        temperature: 1,
      },
      {
        timeout: 45000,
      },
    )
    .catch(error => {
      if (error.response?.statusText === 'Too Many Requests')
        throw new Error('TOO_MANY_REQUESTS')
      else if (error.code === 'ERR_SOCKET_CONNECTION_TIMEOUT')
        throw new Error('COMPLETION_TIMEOUT')
      else console.error(error)

      throw new Error('COMPLETION_ERROR')
    })

  const [
    {
      message: { content },
    },
  ] = choices
  ctx.reply(content, { reply_to_message_id: ctx?.update?.message?.message_id })
})

const poll = () => {
  console.log('POLLING')
  cmc().then(msg => {
    console.log('POLLED')
    if (msg)
      bot.telegram.sendMessage(TG_ROOM, msg, {
        parse_mode: 'Markdown',
        disable_web_page_preview: true,
      })
  })
}

const getNudes = async () =>
  fetch(
    `https://api.giphy.com/v1/gifs/random?tag=sexy&rating=R&api_key=${GIF_KEY}`,
  ).then(result => result.json())

const pollBtc = () => {
  btcUp().then(percent => {
    if (percent > 5) {
      bot.telegram.sendMessage(
        TG_ROOM,
        `*le BTC est up ${percent.toFixed(2)}% aujourd'hui* 🍆`,
        {
          parse_mode: 'Markdown',
          disable_web_page_preview: true,
        },
      )
      getGif('money').then(gif => bot.telegram.sendAnimation(TG_ROOM, gif))
    }
  })
}

bot.telegram.sendMessage(
  TG_ROOM,
  `Oh Oh Oh ! *Je suis armand* le bot qui parle chinois.
Je vient de me mettre a jour en version *${VERSION}* 🎉`,
  { parse_mode: 'Markdown' },
)

getGif('dancing').then(gif => bot.telegram.sendAnimation(TG_ROOM, gif))

setInterval(() => poll(), 1000 * 60 * 23)
setInterval(() => pollBtc(), 1000 * 60 * 60)

const getRandTimeBetween = min => max =>
  Math.floor(Math.random() * (max - min + 1) + min)

const sendNudes = () => {
  getNudes()
    .then(({ data: { url } }) => bot.telegram.sendVideo(TG_ROOM, url))
    .then(() =>
      setTimeout(() => sendNudes(), 1000 * 60 * getRandTimeBetween(40)(400)),
    )
}

setTimeout(sendNudes, 1000 * 60 * getRandTimeBetween(12)(26))

setInterval(() => {
  http.get('https://armand.onrender.com')
}, 300000)

bot.startPolling()
