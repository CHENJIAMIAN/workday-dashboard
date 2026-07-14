import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HashRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { App } from '../src/app/App'

describe('WorkDay 核心流程', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.location.hash = ''
  })

  it('能够在三个主要页面之间导航', async () => {
    const user = userEvent.setup()
    render(<HashRouter><App /></HashRouter>)

    expect(screen.getByRole('heading', { name: /\d{2} : \d{2} : \d{2}|今日已完成/ })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '计划' }))
    expect(screen.getByRole('heading', { name: '计划' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '洞察' }))
    expect(screen.getByRole('heading', { name: '洞察' })).toBeInTheDocument()
  })

  it('能够新建分区并分配时间块', async () => {
    const user = userEvent.setup()
    render(<HashRouter><App /></HashRouter>)

    await user.click(screen.getByRole('button', { name: /新建分区/ }))
    await user.type(screen.getByRole('textbox', { name: '分区名称' }), '专注工作')
    await user.click(screen.getByRole('button', { name: '保存' }))

    expect(screen.getByText('专注工作')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: '增加 专注工作 的时间块' }))
    expect(screen.getByText('1 块')).toBeInTheDocument()
  })

  it('打开导入弹窗时会收起设置抽屉', async () => {
    const user = userEvent.setup()
    render(<HashRouter><App /></HashRouter>)

    await user.click(screen.getByRole('button', { name: '打开设置' }))
    await user.click(screen.getByRole('button', { name: /导入备份/ }))

    expect(screen.getByRole('heading', { name: '导入 JSON 备份' })).toBeInTheDocument()
    expect(document.querySelector('.settings-drawer')).not.toHaveClass('is-open')
  })
})
