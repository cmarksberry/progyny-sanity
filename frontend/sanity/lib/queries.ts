import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`);

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`;

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`;

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`;

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => {
        ${linkFields},
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`);

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`);

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`);

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`);

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`);

// Educational Content Queries for Progyny
const educationalArticleFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  featuredImage,
  category,
  subcategory,
  "publishedDate": coalesce(publishedDate, _updatedAt),
  "author": author->{firstName, lastName, picture},
  "medicalReviewer": medicalReviewer->{firstName, lastName, picture},
  readingTime,
  tags,
  targetAudience,
  featured,
`;

export const allEducationalArticlesQuery = defineQuery(`
  *[_type == "educationalArticle" && defined(slug.current)] | order(publishedDate desc, _updatedAt desc) {
    ${educationalArticleFields}
  }
`);

export const educationalArticleQuery = defineQuery(`
  *[_type == "educationalArticle" && slug.current == $slug] [0] {
    content[]{
      ...,
      markDefs[]{
        ...,
        ${linkReference}
      }
    },
    ${educationalArticleFields}
    seoTitle,
    seoDescription,
  }
`);

export const educationalArticlesSlugs = defineQuery(`
  *[_type == "educationalArticle" && defined(slug.current)]
  {"slug": slug.current}
`);

export const homepageQuery = defineQuery(`
  *[_type == "homepage"] [0] {
    title,
    heroSection,
    logos {
      leftLogo {
        image {
          asset->{
            _id,
            url
          },
          alt
        },
        alt
      },
      rightLogo {
        image {
          asset->{
            _id,
            url
          },
          alt
        },
        alt
      }
    },
    codeSnippet,
    documentationLink,
    seo
  }
`);

export const educationalArticlesByCategoryQuery = defineQuery(`
  *[_type == "educationalArticle" && category == $category && defined(slug.current)] | order(publishedDate desc, _updatedAt desc) {
    ${educationalArticleFields}
  }
`);

export const featuredEducationalArticlesQuery = defineQuery(`
  *[_type == "educationalArticle" && featured == true && defined(slug.current)] | order(publishedDate desc, _updatedAt desc) [0..2] {
    ${educationalArticleFields}
  }
`);


