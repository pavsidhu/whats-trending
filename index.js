const Alexa = require('alexa-sdk')
const Twit = require('twit')

const config = require('./config')

const twit = new Twit({
  consumer_key: config.consumer_key,
  consumer_secret: config.consumer_secret,
  access_token: config.access_token,
  access_token_secret: config.access_token_secret
})

const messages = {
  error:
    "I'm sorry there's something wrong with Twitter at the moment, please try again later.",
  getTrending: trends =>
    `At the moment ${trends[0]}, ${trends[1]} and ${trends[2]} are trending.`
}

const uk_woeid = '23424975'

const handlers = {
  GetTrending: function() {
    const self = this

    twit.get('trends/place', { id: uk_woeid }, (error, data, response) => {
      if (response.headers.status !== '200 OK')
        self.emit(':tell', messages.error)

      const trendNames = data[0].trends
        .slice(0, 3)
        .map(trend => trend.name.substr(1))

      self.emit(':tell', messages.getTrending(trendNames))
    })
  },

  LaunchRequest: function() {
    this.emit('GetTrending')
  }
}

exports.handler = (event, context, callback) => {
  const alexa = Alexa.handler(event, context, callback)
  alexa.registerHandlers(handlers)
  alexa.execute()
}
