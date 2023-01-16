import {defineField, defineType} from 'sanity'
import author from './author'

export default defineType({
  name: 'comment',
  title: 'Comment',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
    }),
    defineField({
      name: 'Approved',
      title: 'Approved',
      type: 'boolean',
      description: "Comment won't show on site without approval",
    }),
    defineField({
      name: 'email',
      type: 'string',
    }),
    defineField({
      name: 'comment',
      type: 'text',
    }),
    defineField({
      name: 'post',
      type: 'reference',
      to: [
        {
          type: 'post',
        },
      ],
    }),
  ],

  preview: {
    select: {
      title: 'comment',
      author: 'name',
    },
    prepare(selection) {
      return {
        ...selection,
        subtitle: `by ${selection.author}`,
      }
    },
  },
})
