import type { Preview } from '@storybook/react-vite'
import { MemoryRouter } from 'react-router-dom'
import React from 'react'
import '../src/index.css'

const preview: Preview = {
  decorators: [
    (Story) => React.createElement(MemoryRouter, null, React.createElement(Story))
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo'
    }
  },
}

export default preview