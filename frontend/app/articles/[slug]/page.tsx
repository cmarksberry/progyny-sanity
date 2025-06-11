import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { type PortableTextBlock } from "next-sanity";
import { Suspense } from "react";

import PortableText from "@/app/components/PortableText";
import { sanityFetch } from "@/sanity/lib/live";
import { educationalArticleQuery, educationalArticlesSlugs } from "@/sanity/lib/queries";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Generate the static params for the page.
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: educationalArticlesSlugs,
    perspective: "published",
    stega: false,
  });
  return data;
}

/**
 * Generate metadata for the page.
 */
export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const { data: article } = await sanityFetch({
    query: educationalArticleQuery,
    params,
    stega: false,
  });
  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: article?.seoTitle || article?.title,
    description: article?.seoDescription || article?.excerpt,
    openGraph: {
      images: previousImages,
    },
  } satisfies Metadata;
}

export default async function ArticlePage(props: Props) {
  const params = await props.params;
  const [{ data: article }] = await Promise.all([
    sanityFetch({ query: educationalArticleQuery, params }),
  ]);

  if (!article?._id) {
    return notFound();
  }

  return (
    <>
      <div className="">
        <div className="container my-12 lg:my-24 grid gap-12">
          <div>
            <div className="pb-6 grid gap-6 mb-6 border-b border-gray-100">
              <div className="max-w-3xl flex flex-col gap-6">
                <div className="flex gap-2 text-sm">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                    {article.category}
                  </span>
                  {article.subcategory && (
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                      {article.subcategory}
                    </span>
                  )}
                </div>
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
                  {article.title}
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>
              <div className="max-w-3xl flex gap-4 items-center text-sm text-gray-500">
                <span>{article.readingTime} min read</span>
                <span>•</span>
                <span className="capitalize">For {article.targetAudience}</span>
                {article.publishedDate && (
                  <>
                    <span>•</span>
                    <time dateTime={article.publishedDate}>
                      {new Date(article.publishedDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </time>
                  </>
                )}
              </div>
            </div>
            <article className="gap-6 grid max-w-4xl">
              {article.content?.length && (
                <PortableText
                  className="max-w-3xl prose prose-lg"
                  value={article.content as PortableTextBlock[]}
                />
              )}
              {article.tags && article.tags.length > 0 && (
                <div className="max-w-3xl pt-8 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </article>
          </div>
        </div>
      </div>
    </>
  );
} 