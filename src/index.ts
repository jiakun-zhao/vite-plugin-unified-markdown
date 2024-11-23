import { createFilter, type Plugin } from 'vite'
import { toVueComponent } from '~/markdown'
import { name } from '../package.json'

export default function (): Plugin {
  const filter = createFilter(/\.md$/)
  return {
    name,
    async transform(code, id) {
      if (!filter(id))
        return
      return {
        code: await toVueComponent({ content: code }),
        map: {
          mappings: '',
        },
      }
    },
    handleHotUpdate(ctx) {
      if (!filter(ctx.file))
        return
      const defRead = ctx.read
      ctx.read = async function () {
        const code = await defRead()
        return await toVueComponent({ content: code })
      }
    },
  }
}
