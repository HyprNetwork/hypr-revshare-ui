export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Hypr ⚡️ RevShare',
      meta: [{ name: 'description', content: 'Hypr Revenue Share App' }],
      link: [{ rel: 'icon', type: 'image/png', href: '/favicon.png' }],
    }
  },
  devtools: { enabled: true },
  modules: [
    'nuxt-icon',
  ],
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],
})
