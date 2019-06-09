import Telegraf from 'telegraf'
import express from 'express'
const expressApp = express()
const port = process.env.PORT || 3000

expressApp.get('/', (req, res) => {
  res.send('Hello World!')
})

expressApp.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

const bot = new Telegraf(process.env.BOT_TOKEN)
const rand = () => Math.random() >= 0.5
const mock = text =>
	[...text].map(l => (rand() ? l.toLowerCase() : l.toUpperCase())).reduce((a, b) => `${a}${b}`, '')

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
	'https://imgur.com/sFAJxTy'
]

const randDumb = () => dumbies[Math.floor(Math.random() * dumbies.length)]

bot.on('text', ctx => {
	const msg = ctx.update?.message
	const text = msg?.text
	const reply = msg?.reply_to_message?.text
	switch (text) {
		case '/pls mock':
			if (!reply) return
			ctx.replyWithPhoto(randDumb())
			ctx.reply(mock(reply))
			break

		default:
			break
	}
})
bot.startPolling()
