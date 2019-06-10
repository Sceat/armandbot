import rp from 'request-promise'

const { CMC_KEY } = process.env
const last = new Map()

const COINS_LIMIT = 300
const EXPIRE = 1000 * 60 * 60 * 3
const DELETE_EVERY = 1000 * 60 * 20

const requestOptions = {
	method: 'GET',
	uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
	qs: {
		start: '1',
		limit: COINS_LIMIT,
		convert: 'BTC'
	},
	headers: { 'X-CMC_PRO_API_KEY': CMC_KEY },
	json: true,
	gzip: true
}

const fetchCryptos = async () => rp(requestOptions)
const keepWinners = ({
	quote: {
		BTC: { percent_change_24h }
	}
}) => percent_change_24h >= 15
const spread = ({
	id,
	symbol,
	slug,
	quote: {
		BTC: { percent_change_24h }
	}
}) => {
	console.log('spreading', symbol)
	return {
		id,
		symbol,
		slug,
		percent_change_24h: percent_change_24h.toFixed(2),
		expire: Date.now() + EXPIRE
	}
}

const sortWinner = ({ percent_change_24h: pa }, { percent_change_24h: pb }) => +pb - +pa

const filterNew = ({ id }) => !last.has(id)
const emoji = p => (p > 200 ? '⁉️🏆🏄' : p > 100 ? '🔞' : p > 50 ? '🛰' : p > 25 ? '🚀' : '🔥')
const coinToMsg = ({ symbol, percent_change_24h, slug }) =>
	`[$${symbol}](https://coinmarketcap.com/currencies/${slug}/) (+${percent_change_24h}%) ${emoji(
		percent_change_24h
	)}`

setInterval(() => {
	for (let [id, { expire }] of last.entries())
		if (Date.now() > expire) {
			console.log('deleting', last.get(id).symbol)
			last.delete(id)
		}
}, DELETE_EVERY)

const taunt = [
	'WOOOOOSH ATTENTION BULL RUN',
	'OH OH OH WOOSHY WOOSHA, TIME FOR WILLY WONKA',
	'WOOOOOHSSSSSSHHHH hihihi c parti',
	'WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO lol',
	'WOOOOOOOOOOOSH c pas des coins de PD CA',
	'ZOOGATA BANG BANG CA PUMP',
	'LES COINS DU DD.. et toi ?',
	'ALORS LES PD CA MANGE DES PATES ?',
	'HUMMM LE DELICIEUX ARGENT',
	'ET BAH... ET VOUS EN AVEZ AUCUN BANDE DE SINGE',
	'ENCORE UN BATEAU QUI PART SANS VOUS',
	'HAHAHA ALORS LES CLOCHARDS.. CA C DES VRAI COINS',
	'MDR C PAS XBL QUI FERAIT CA...',
	'OWO BAH ALORS PAS TROP LE SEUM ??',
	`LOL PERSONNE N'ETAIT PRET`,
	'PUTIN MAIS VOUS SERVEZ VRAIMENT A RIEN...'
]

const randTaunt = () => taunt[Math.floor(Math.random() * taunt.length)]

export default async () => {
	const { data } = await fetchCryptos()
	const cryptos = data
		.filter(keepWinners)
		.filter(filterNew)
		.map(spread)
	if (!cryptos.length) return
	cryptos.sort(sortWinner)
	cryptos.forEach(c => last.set(c.id, c))
	const reducedCoins = cryptos.map(coinToMsg).reduce((a, b) => `${a}\n${b}`, '')
	return `*${randTaunt()}* 🌚
	${reducedCoins}`
}
