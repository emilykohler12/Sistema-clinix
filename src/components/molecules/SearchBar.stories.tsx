import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { SearchBar } from './SearchBar'
import type { SortOption, ViewMode } from '../../types'

const meta: Meta<typeof SearchBar> = {
  title: 'Molecules/SearchBar',
  component: SearchBar,
}
export default meta

type Story = StoryObj<typeof SearchBar>

export const Default: Story = {
  render: () => {
    const [search, setSearch] = useState('')
    const [sort, setSort] = useState<SortOption>('az')
    const [view, setView] = useState<ViewMode>('grid')
    return (
      <SearchBar
        search={search}
        onSearchChange={setSearch}
        sortOption={sort}
        onSortChange={setSort}
        viewMode={view}
        onViewModeToggle={() => setView(prev => prev === 'grid' ? 'list' : 'grid')}
        onAddPatient={() => alert('Agregar paciente')}
      />
    )
  },
}

export const ConBusqueda: Story = {
  render: () => {
    const [search, setSearch] = useState('Juan')
    const [sort, setSort] = useState<SortOption>('az')
    const [view, setView] = useState<ViewMode>('grid')
    return (
      <SearchBar
        search={search}
        onSearchChange={setSearch}
        sortOption={sort}
        onSortChange={setSort}
        viewMode={view}
        onViewModeToggle={() => setView(prev => prev === 'grid' ? 'list' : 'grid')}
        onAddPatient={() => alert('Agregar paciente')}
      />
    )
  },
}