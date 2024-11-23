import { describe, expect, it } from 'vitest'
import { toVueComponent } from './markdown'

describe('test', () => {
  it('markdown', async () => {
    const res = await toVueComponent({
      content: '# Hi',
    })
    expect(res).toMatchInlineSnapshot(`"<template><h1>Hi</h1></template><script></script><style></style>"`)
  })
})
