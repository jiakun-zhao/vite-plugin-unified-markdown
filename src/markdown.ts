import type { PluggableList } from 'unified'
import { isString } from '@antfu/utils'
import rehypeStringify from 'rehype-stringify'
import remarkMdc, { parseFrontMatter } from 'remark-mdc'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'
import type { RehypePlugins, RemarkPlugins } from '~/types'

declare module 'vfile' {
  interface DataMap {
    script: string
    style: Style
    frontmatter: Frontmatter
  }
}

type Frontmatter = ReturnType<typeof parseFrontMatter>['data']
type Style = string | { css: string, scoped?: boolean }

interface TransformFnValue {
  frontmatter: Frontmatter
  style: Style
  script: string
  template: string
}

interface Input {
  content: string
  remarkPlugins?: RemarkPlugins
  rehypePlugins?: RehypePlugins
  transform?: (value: TransformFnValue) => Omit<TransformFnValue, 'frontmatter'>
  script?: string
  style?: Style
}

export async function toVueComponent(input: Input) {
  const { content, data: frontmatter } = parseFrontMatter(input.content)

  const result = await unified()
    .use(remarkParse)
    .use(input.remarkPlugins as PluggableList ?? [])
    .use(remarkRehype)
    .use(remarkMdc)
    .use(input.rehypePlugins as PluggableList ?? [])
    .use(rehypeStringify)
    .process({
      value: content,
      data: {
        frontmatter,
        script: input.script ?? '',
        style: input.style ?? '',
      },
    })

  const value = { frontmatter, script: result.data.script!, style: result.data.style!, template: result.value.toString() }
  const { script, style, template } = input.transform ? input.transform(value) : value
  const { css, scoped } = isString(style)
    ? { css: style, scoped: '' }
    : { css: style?.css ?? '', scoped: style?.scoped ? ' scoped' : '' }
  return `<template>${template}</template><script>${script}</script><style${scoped}>${css}</style>`
}
