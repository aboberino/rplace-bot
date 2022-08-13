declare global {
    namespace NodeJS {
        interface ProcessEnv {
            botToken: string
            guildId: string
            clientId: string
            enviroment: 'dev' | 'prod' | 'debug'
        }
    }
}

export {}