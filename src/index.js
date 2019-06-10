import Telegraf from 'telegraf'
import express from 'express'
import http from 'http'
import cmc, { btcUp } from './cmc'
import Giphy from 'giphy-random'

const VERSION = require('../package.json').version
const { GIF_KEY = 'dc6zaTOxFJmzC ' } = process.env

// DISCLAIMER
// THE CODE OF THIS BOT IS ABSOLUTLY DOG SHIT
// I'M NOT INTERESTED IN MAKING IT CLEAN, YOU THINK I HAVE THE TIME ? lol nop

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
	'https://imgur.com/sFAJxTy'
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
	'https://i.imgur.com/nkubYHu.png'
]

const randDumb = () => dumbies[Math.floor(Math.random() * dumbies.length)]
const randGpalu = () => gpalu[Math.floor(Math.random() * gpalu.length)]

bot.hears('mock', ctx => {
	const msg = ctx.update?.message
	const text = msg?.text
	const reply = msg?.reply_to_message?.text
	if (!reply) return
	ctx.replyWithPhoto(randDumb())
	ctx.reply(mock(reply))
})

// bot.hears('test', console.log)

bot.hears('gpalu', ctx => ctx.replyWithPhoto(randGpalu()))

const replied = new Map()

const sometimeReplyTo = bot => trigger => couldown => respond =>
	bot.hears(trigger, ctx => {
		if (`${ctx.chat.id}` !== TG_ROOM) return
		const last = replied.get(trigger) || 0
		if (randBool() && Date.now() > last + 1000 * 60 * couldown) {
			respond(ctx)
			replied.set(trigger, Date.now())
		}
	})

const pRep = sometimeReplyTo(bot)

const fdpRep = [
	'oh tu croi t ki pr parler comme ca ?',
	'mais mdr parle mieux jvai te lever',
	'ftg tu parle a ki',
	'oh lui jvai vrmt le lever',
	'jsai pa t ki mais reste trkl'
]

const btcRep = [
	'tg sale pauvre',
	'clochar',
	'c mort soon 1k',
	'mdr..',
	'okok..',
	'en fait non',
	'ouloulou pk tu continue de parler ?',
	'dump it',
	'BOGDANOV LAUNCH THE KOREA FUD',
	'dump it again',
	'wooooooooooooosh personne tecoute fils',
	'xD allez ca suffit ya ecole demain raconte pas des conneries stp'
]

const marginRep = [
	'le margin c vrmt pour les singe',
	'jpense que t fait pr etre pauvre',
	'ouai ouai',
	'mec t t encore un putin de sperma je tradai deja',
	'ouai de ouf! non tg',
	'awai ? g pa lu',
	'ok.',
	'uiui si tu veu tkt pas ca va aller'
]

const stpRep = [
	'tema ce mandiant mdr',
	'wsh demerde toi non ?',
	'jpp de toi..',
	'suce au lieu de faire la manche comme ca',
	'clochar',
	't le gitan dla room ?',
	'mdr encore toi ?'
]

const kenRep = [
	'tu baise rien du tout',
	't puceau et tu parle',
	'tlm sait ke t pd',
	'en vrai on sen branle',
	'meme un chameau de dubai ken plus que toi',
	'micro teub',
	't pd',
	'allez ferme la baltringue',
	"jpense vrmt ta un complexe d'inferioriter",
	'ptite pucelle tu baise walou',
	'ta bsoin de prouver qqchose ?',
	'mdr grolar tu ment encore et encore'
]

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
	'http://image.noelshack.com/fichiers/2018/04/7/1517106679-carlos-bitconneeee.png'
]

const randFdp = () => fdpRep[Math.floor(Math.random() * fdpRep.length)]
const randMargin = () => marginRep[Math.floor(Math.random() * marginRep.length)]
const randStp = () => stpRep[Math.floor(Math.random() * stpRep.length)]
const randRis = () => risitas[Math.floor(Math.random() * risitas.length)]
const randKen = () => kenRep[Math.floor(Math.random() * kenRep.length)]

bot.hears('ris', ctx => {
	const msg = ctx.update?.message
	const text = msg?.text
	const reply = msg?.reply_to_message?.text
	if (!reply) return
	ctx.replyWithPhoto(randRis(), { reply_to_message_id: msg?.reply_to_message?.message_id })
})

pRep([
	/\bjbaise\b/,
	/\bjken\b/,
	/\bBAISE\b/,
	/\bJBAISE\b/,
	/\bBAIZ\b/,
	/\bBAIZE\b/,
	/\bjtebaiz\b/,
	/\bJTEBAIZ\b/,
	/\bjnik\b/,
	/\bniker\b/,
	/\bjbaiz\b/,
	/\bsucer\b/,
	/\bchatte\b/,
	/\bchate\b/,
	/\bbaise\b/,
	/\bken\b/,
	/\bbaiz\b/,
	/\bbaiser\b/
])(3)(ctx => ctx.reply(randKen(), { reply_to_message_id: ctx?.update?.message?.message_id }))

pRep(/\bfdp\b/)(3)(ctx =>
	ctx.reply(randFdp(), { reply_to_message_id: ctx?.update?.message?.message_id })
)

pRep(/\bmargin\b/)(10)(ctx =>
	ctx.reply(randMargin(), { reply_to_message_id: ctx?.update?.message?.message_id })
)

pRep(/\bstp\b/)(4)(ctx =>
	ctx.reply(randStp(), { reply_to_message_id: ctx?.update?.message?.message_id })
)

const poll = () => {
	console.log('POLLING')
	cmc().then(msg => {
		console.log('POLLED')
		if (msg)
			bot.telegram.sendMessage(TG_ROOM, msg, {
				parse_mode: 'Markdown',
				disable_web_page_preview: true
			})
	})
}

const quotesBtc = [
	`Si un homme n'embrasse pas une femme au premier rendez-vous, c'est un gentleman. Au second, c'est qu'il est gay`,
	`Heureux de vivre comme une cigale`,
	`J'aimerais être gay juste pour faire chier les homophobest`,
	`Être gay n'est pas une invention occidentale. C'est une réalité humaine`,
	`- Êtes vous homosexuel, répondez à la question ! Êtes vous un homo ? Êtes vous une pédale, une tapette, une folle, une chochotte un empaffé, un de la jaquette, une tantouse ? ÊTES VOUS GAY `,
	`Cela ne devrait jamais être un crime d'être gay`,
	`Il est gay comme un poisson dans l'eau`,
	`Où est le cyclope gay ?`,
	`Eh bien voila, ton fils est gay`,
	`Être gay n'est pas quelque chose que l'on décide, mais être homophobe oui`,
	`C'est vraiment un drôle de gay mon poto Michou. Il écopa du coup du sobriquet de broute-de-train`,
	`Tout gay est un homophobe qui s'ignore !`
]

const randGay = () => quotesBtc[Math.floor(Math.random() * quotesBtc.length)]

const pollBtc = () => {
	btcUp().then(percent => {
		if (percent > 5)
			bot.telegram.sendMessage(
				TG_ROOM,
				`${randGay()}

*le BTC est up ${percent.toFixed(2)}% aujourd'hui* 🍆`,
				{
					parse_mode: 'Markdown',
					disable_web_page_preview: true
				}
			)
		bot.telegram.sendVideo(TG_ROOM, 'https://media.giphy.com/media/8LWOXKCJxAOic/giphy.gif')
	})
}

const dancingGif = async () => Giphy(GIF_KEY, { tag: 'dancing' })
const horrayGif = async () => Giphy(GIF_KEY, { tag: 'horray' })

bot.telegram.sendMessage(
	TG_ROOM,
	`Oh Oh Oh ! *Je suis armand* le bot qui parle chinois.
@sceat le bg vient de me deployer en version *${VERSION}* 🎉`,
	{ parse_mode: 'Markdown' }
)
bot.telegram.sendVideo(TG_ROOM, 'https://media.giphy.com/media/GxZpLbwKRQo0M/giphy.gif')
// horrayGif().then(({ data: { image_mp4_url } }) => bot.telegram.sendVideo(TG_ROOM, image_mp4_url))

setInterval(() => poll(), 1000 * 60 * 10)
setInterval(() => pollBtc(), 1000 * 60 * 60)

setInterval(() => {
	http.get('http://armandbot.herokuapp.com/')
}, 300000)

bot.startPolling()
