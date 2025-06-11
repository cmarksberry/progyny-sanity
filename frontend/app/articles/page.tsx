import Link from "next/link";
import { Suspense } from "react";

import { sanityFetch } from "@/sanity/lib/live";
import { allEducationalArticlesQuery } from "@/sanity/lib/queries";

export default async function ArticlesPage() {
  const { data: articles } = await sanityFetch({
    query: allEducationalArticlesQuery,
  });

  // Add defensive checks
  const safeArticles = articles || [];
  const categories = [...new Set(safeArticles
    .filter(article => article?.category)
    .map(article => article.category)
  )];

  return (
    <div className="container my-12 lg:my-24">
      <div className="max-w-4xl">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl mb-4">
            Educational Articles
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive resources on fertility, family building, and reproductive health
          </p>
        </div>

        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-gray-900 mb-3">Categories</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <span
                  key={category}
                  className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm capitalize"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <Suspense fallback={<div>Loading articles...</div>}>
          <div className="grid gap-8">
            {safeArticles.map((article) => (
              <article key={article._id} className="border-b border-gray-100 pb-8">
                <div className="grid gap-4">
                  <div className="flex gap-2 text-sm">
                    {article.category && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full capitalize">
                        {article.category}
                      </span>
                    )}
                    {article.subcategory && (
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full capitalize">
                        {article.subcategory}
                      </span>
                    )}
                    {article.featured && (
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      <Link 
                        href={`/articles/${article.slug}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {article.title}
                      </Link>
                    </h2>
                    {article.excerpt && (
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {article.excerpt}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-4 items-center text-sm text-gray-500">
                    {article.readingTime && <span>{article.readingTime} min read</span>}
                    {article.readingTime && article.targetAudience && <span>•</span>}
                    {article.targetAudience && (
                      <span className="capitalize">For {article.targetAudience}</span>
                    )}
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

                  {article.tags && article.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {article.tags.length > 3 && (
                        <span className="text-gray-400 text-xs px-2 py-1">
                          +{article.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </Suspense>

        {safeArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found.</p>
          </div>
        )}
      </div>
    </div>
  );
} 