import {blue, gray, indigo} from 'tailwindcss/colors'

import type { Config } from 'tailwindcss'
import { nextui } from '@nextui-org/react'

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
        gray:gray
      }
      ,
      fontFamily:{
        sans:['JetBrains Mono', 'sans-serif']
      }
    },
  },
  plugins: [nextui({defaultTheme:'dark',themes:{
    dark:{
      colors:{
        primary:{
          ...indigo,
          DEFAULT:indigo["500"],
        },
        secondary:{
          ...blue,
          DEFAULT:blue["400"],
        },
        default:{
          DEFAULT:gray["600"],
          ...gray,
        }
      }
    }
  }},)],
}
export default config