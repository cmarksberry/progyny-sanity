import {DocumentTextIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'
import {defineField, defineType} from 'sanity'

/**
 * Educational Article schema for Progyny content.
 * Covers fertility, pregnancy, postpartum, and menopause educational content.
 */

export const educationalArticle = defineType({
  name: 'educationalArticle',
  title: 'Educational Article',
  icon: DocumentTextIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'A slug is required for the article to show up in the preview',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Content Category',
      type: 'string',
      options: {
        list: [
          {title: 'Fertility & Family Building', value: 'fertility'},
          {title: 'Pregnancy & Postpartum', value: 'pregnancy'},
          {title: 'Menopause & Midlife', value: 'menopause'},
          {title: 'General Health & Wellness', value: 'wellness'},
          {title: 'Benefits Education', value: 'benefits'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subcategory',
      title: 'Subcategory',
      type: 'string',
      options: {
        list: [
          // Fertility subcategories
          {title: 'IVF Education', value: 'ivf'},
          {title: 'IUI Education', value: 'iui'},
          {title: 'Egg Freezing', value: 'egg-freezing'},
          {title: 'Male Fertility', value: 'male-fertility'},
          {title: 'LGBTQ+ Family Building', value: 'lgbtq-family-building'},
          {title: 'Adoption & Surrogacy', value: 'adoption-surrogacy'},
          {title: 'Fertility Testing', value: 'fertility-testing'},
          {title: 'Trying to Conceive', value: 'trying-to-conceive'},
          // Pregnancy subcategories
          {title: 'Prenatal Care', value: 'prenatal-care'},
          {title: 'Maternal Mental Health', value: 'maternal-mental-health'},
          {title: 'Pregnancy Symptoms', value: 'pregnancy-symptoms'},
          {title: 'Postpartum Recovery', value: 'postpartum-recovery'},
          {title: 'Return to Work', value: 'return-to-work'},
          // Menopause subcategories
          {title: 'Menopause Symptoms', value: 'menopause-symptoms'},
          {title: 'Treatment Options', value: 'treatment-options'},
          {title: 'Workplace Support', value: 'workplace-support'},
          // General subcategories
          {title: 'Nutrition & Lifestyle', value: 'nutrition-lifestyle'},
          {title: 'Mental Health Support', value: 'mental-health'},
          {title: 'Benefits Navigation', value: 'benefits-navigation'},
        ],
      },
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: 'Brief summary that appears in article listings and search results',
      validation: (rule) => rule.max(200),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'blockContent',
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (rule) => {
            return rule.custom((alt, context) => {
              if ((context.document?.featuredImage as any)?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            })
          },
        },
      ],
    }),
    defineField({
      name: 'publishedDate',
      title: 'Published Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Last Updated',
      type: 'datetime',
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'person'}],
    }),
    defineField({
      name: 'medicalReviewer',
      title: 'Medical Reviewer',
      type: 'reference',
      to: [{type: 'person'}],
      description: 'Medical professional who reviewed this content for accuracy',
    }),
    defineField({
      name: 'readingTime',
      title: 'Estimated Reading Time (minutes)',
      type: 'number',
      validation: (rule) => rule.min(1).max(60),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'targetAudience',
      title: 'Target Audience',
      type: 'string',
      options: {
        list: [
          {title: 'Individuals/Patients', value: 'individuals'},
          {title: 'Employers/HR Teams', value: 'employers'},
          {title: 'Healthcare Providers', value: 'providers'},
          {title: 'Benefits Consultants', value: 'consultants'},
          {title: 'General Public', value: 'general'},
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Article',
      type: 'boolean',
      description: 'Mark as featured to highlight in special sections',
      initialValue: false,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Custom title for search engines (leave blank to use main title)',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      description: 'Meta description for search engines',
      validation: (rule) => rule.max(160),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category',
      subcategory: 'subcategory',
      authorFirstName: 'author.firstName',
      authorLastName: 'author.lastName',
      publishedDate: 'publishedDate',
      media: 'featuredImage',
    },
    prepare({title, media, category, subcategory, authorFirstName, authorLastName, publishedDate}) {
      const subtitles = [
        category && `${category}${subcategory ? ` • ${subcategory}` : ''}`,
        authorFirstName && authorLastName && `by ${authorFirstName} ${authorLastName}`,
        publishedDate && `${format(parseISO(publishedDate), 'MMM d, yyyy')}`,
      ].filter(Boolean)

      return {title, media, subtitle: subtitles.join(' • ')}
    },
  },
}) 