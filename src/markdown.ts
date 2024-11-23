import type { PluggableList } from 'unified'
import { isString } from '@antfu/utils'
import rehypeStringify from 'rehype-stringify'
import remarkMdc from 'remark-mdc'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import type { RehypePlugins, RemarkPlugins } from '~/types'

declare module 'vfile' {
  interface DataMap {
    script: string
    style: Style
  }
}

type Style = string | { css: string, scoped?: boolean }

interface Input {
  content: string
  remarkPlugins?: RemarkPlugins
  rehypePlugins?: RehypePlugins
  script?: string
  style?: Style
}

export async function toVueComponent(input: Input) {
  const { value, data: { script, style } } = await unified()
    .use(remarkParse)
    .use(input.remarkPlugins as PluggableList ?? [])
    .use(remarkRehype)
    .use(remarkMdc)
    .use(input.rehypePlugins as PluggableList ?? [])
    .use(rehypeStringify)
    .process({
      value: input.content,
      data: {
        script: input.script ?? '',
        style: input.style ?? '',
      },
    })

  const css = isString(style)
    ? { css: style, scoped: '' }
    : { css: style?.css ?? '', scoped: style?.scoped ? ' scoped' : '' }

  return `<template>${value}</template><script>${script}</script><style${css.scoped}>${css.css}</style>`
}
