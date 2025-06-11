import {defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  fields: [
    {
      name: 'title',
      title: 'Page Title',
      type: 'string',
      description: 'This is used for SEO and browser tab title',
      validation: Rule => Rule.required(),
    },
    {
      name: 'heroSection',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'tagline',
          title: 'Tagline',
          type: 'string',
          description: 'Small text above the main title (e.g., "A starter template for")',
          validation: Rule => Rule.required(),
        },
        {
          name: 'mainTitle',
          title: 'Main Title',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'text',
                  title: 'Text',
                  type: 'string',
                  validation: Rule => Rule.required(),
                },
                {
                  name: 'link',
                  title: 'Link (optional)',
                  type: 'url',
                  description: 'Make this part of the title clickable',
                },
                {
                  name: 'color',
                  title: 'Color Style',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Brand Color', value: 'brand'},
                      {title: 'Framework Color', value: 'framework'},
                      {title: 'Default (Black)', value: 'default'},
                    ],
                  },
                  initialValue: 'default',
                },
              ],
            },
          ],
          description: 'Build your title with multiple clickable parts',
          validation: Rule => Rule.required().min(1),
        },
      ],
    },
    {
      name: 'logos',
      title: 'Logo Icons',
      type: 'object',
      fields: [
        {
          name: 'leftLogo',
          title: 'Left Logo',
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Logo Image',
              type: 'image',
              description: 'Upload your logo image (SVG, PNG, or JPG)',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: Rule => Rule.required(),
            },
          ],
        },
        {
          name: 'rightLogo',
          title: 'Right Logo',
          type: 'object',
          fields: [
            {
              name: 'image',
              title: 'Logo Image',
              type: 'image',
              description: 'Upload your logo image (SVG, PNG, or JPG)',
              options: {
                hotspot: true,
              },
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: Rule => Rule.required(),
            },
          ],
        },
      ],
    },
    {
      name: 'codeSnippet',
      title: 'Code Snippet',
      type: 'object',
      fields: [
        {
          name: 'command',
          title: 'Command',
          type: 'string',
          description: 'The command to display and copy',
          validation: Rule => Rule.required(),
        },
        {
          name: 'copyButtonText',
          title: 'Copy Button Text',
          type: 'string',
          description: 'Text shown on mobile copy button',
          initialValue: 'Copy Snippet',
        },
        {
          name: 'copiedText',
          title: 'Copied Confirmation Text',
          type: 'string',
          description: 'Text shown after copying',
          initialValue: 'Copied!',
        },
      ],
    },
    {
      name: 'documentationLink',
      title: 'Documentation Link',
      type: 'object',
      fields: [
        {
          name: 'text',
          title: 'Link Text',
          type: 'string',
          validation: Rule => Rule.required(),
        },
        {
          name: 'url',
          title: 'URL',
          type: 'url',
          validation: Rule => Rule.required(),
        },
        {
          name: 'openInNewTab',
          title: 'Open in New Tab',
          type: 'boolean',
          initialValue: true,
        },
      ],
    },
    {
      name: 'seo',
      title: 'SEO',
      type: 'object',
      fields: [
        {
          name: 'description',
          title: 'Meta Description',
          type: 'text',
          rows: 3,
          description: 'Description for search engines (150-160 characters recommended)',
          validation: Rule => Rule.max(160),
        },
      ],
    },
  ],
  preview: {
    prepare() {
      return {
        title: 'Homepage',
        subtitle: 'Homepage content settings',
      }
    },
  },
}) 