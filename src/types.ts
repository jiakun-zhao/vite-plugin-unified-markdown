import type { Root as HastRoot } from 'hast'
import type { Root as MdastRoot } from 'mdast'
import type { Plugin } from 'unified'

export type RemarkPlugin<Parameters extends any[] = any[]> = Plugin<Parameters, MdastRoot>

export type RemarkPlugins = (string | [string, any] | RemarkPlugin | [RemarkPlugin, any])[]

export type RehypePlugin<Parameters extends any[] = any[]> = Plugin<Parameters, HastRoot>

export type RehypePlugins = (string | [string, any] | RehypePlugin | [RehypePlugin, any])[]
