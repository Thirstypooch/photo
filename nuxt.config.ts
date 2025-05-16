// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },
  pages: false,
  nitro: {
    compatibilityDate: '2025-05-16'
  }
})