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
		BTC: { percent_change_1h }
	}
}) => percent_change_1h >= 10
const spread = ({
	id,
	symbol,
	slug,
	quote: {
		BTC: { percent_change_1h }
	}
}) => {
	console.log('spreading', symbol)
	return {
		id,
		symbol,
		slug,
		percent_change_1h: percent_change_1h.toFixed(2),
		expire: Date.now() + EXPIRE
	}
}

const filterNew = ({ id }) => !last.has(id)
const emoji = p => (p > 200 ? '⁉️🏆🏄' : p > 100 ? '🔞' : p > 50 ? '🛰' : p > 25 ? '🚀' : '🔥')
const coinToMsg = ({ symbol, percent_change_1h, slug }) =>
	`*[$${symbol}](https://coinmarketcap.com/currencies/${slug}/)* (+${percent_change_1h}%) ${emoji(
		percent_change_1h
	)}`

setInterval(() => {
	for (let [id, { expire }] of last.entries())
		if (Date.now() > expire) {
			console.log('deleting', last.get(id).symbol)
			last.delete(id)
		}
}, DELETE_EVERY)

export default async () => {
	const { data } = await fetchCryptos()
	const cryptos = data
		.filter(keepWinners)
		.filter(filterNew)
		.map(spread)
	if (!cryptos.length) return
	cryptos.forEach(c => last.set(c.id, c))
	const reducedCoins = cryptos.map(coinToMsg).reduce((a, b) => `${a}\n${b}`, '')
	return `WOOOOSH ¯\\\_(ツ)_/¯ ! 🌚
_(Top ${COIN_LIMIT} 24h winners)_
	${reducedCoins}`
}
