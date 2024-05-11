import client from '../bot'

client.on('messageCreate', async () => {
    console.log('im a muter :)')
})

export default client
