const { getUserId } = require('../../utils')

const post = {
  async createDraft(parent, { title, text }, ctx, info) {
    const userId = getUserId(ctx)
    return ctx.db.mutation.createPost(
      {
        data: {
          title,
          text,
          isPublished: false,
          author: {
            connect: { id: userId },
          },
        },
      },
      info
    )
  },

  async publish(parent, { id }, ctx, info) {
    const userId = getUserId(ctx)
    const postExists = await ctx.db.exists.Post({
      id,
      author: { id: userId },
    })
    if (!postExists) {
      throw new Error(`Post not found or you're not the author`)
    }

    return ctx.db.mutation.updatePost(
      {
        where: { id },
        data: { isPublished: ture },
      },
      info,
    )
  },

  async deletePost(parent, { id }, ctx, info) {
    const userId = getUserId(ctx)
    const postExists = await ctx.db.exists.Post({
      id,
      author: { id: userId },
    })
    if (!postExists) {
      throw new Error(`Post not found or you're not the author`)
    }

    return ctx.db.mutation.deletePost({ where: { id } })
  },
}

module.exports = { post }
