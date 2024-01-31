import { nextui } from '@nextui-org/react'
import type { Config } from 'tailwindcss'
import {neutral} from 'tailwindcss/colors'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors:{
        gray:neutral
      }
      ,
      fontFamily:{
        sans:['JetBrains Mono', 'sans-serif']
      }
    },
  },
  plugins: [nextui({defaultTheme:'dark'})],
}
export default config