import { getPrismicClient } from "@/services/prismic";
import Prismic from "@prismicio/client";
import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { RichText } from "prismic-dom";
import { useState } from "react";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
} from "react-icons/fi";
import styles from "./styles.module.scss";
type Post = {
  slug: string;
  title: string;
  cover: string;
  description: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
  page: string;
  totalPage: string;
}

export default function Posts({
  posts: postsBlog,
  page,
  totalPage,
}: PostsProps) {
  const [posts, setPosts] = useState(postsBlog || []);
  const [currentPage, setCurrentPage] = useState<number>(Number(page));

  async function reqPost(pageNumber: number) {
    const prismic = getPrismicClient();

    const response = await prismic.query(
      [Prismic.Predicates.at("document.type", "post")],
      {
        orderings: "[document.last_publication_date]",
        fetch: ["post.title", "post.description", "post.cover"],
        pageSize: 3,
        page: String(pageNumber),
      },
    );

    return response;
  }

  async function navigatePage(pageNumber: number) {
    const response = await reqPost(pageNumber);

    if (response.results.length === 0) {
      return;
    }

    const getPosts = response.results.map((post) => {
      return {
        slug: post.uid ?? "",
        title: RichText.asText(post.data.title) ?? "",
        description:
          post.data.description.find(
            (content: any) => content.type === "paragraph",
          )?.text ?? "",
        cover: post.data.cover.url ?? "",
        updatedAt:
          new Date(post.last_publication_date ?? "").toLocaleDateString(
            "pt-BR",
            {
              day: "2-digit",
              month: "long",
              year: "numeric",
            },
          ) ?? "",
      };
    });
    setCurrentPage(pageNumber);

    setPosts(getPosts);
  }

  return (
    <>
      <Head>
        <title>Posts do Blog | Page {currentPage}</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map((post) => (
            <Link key={post.slug} legacyBehavior href={`/posts/${post.slug}`}>
              <a key={post.slug}>
                <Image
                  src={post.cover}
                  alt={post.title}
                  width={720}
                  height={410}
                  quality={100}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMsraurBwAE0wHyeLy4+wAAAABJRU5ErkJggg=="
                />
                <strong>{post.title}</strong>
                <time>{post.updatedAt}</time>
                <p>{post.description}</p>
              </a>
            </Link>
          ))}

          <div className={styles.buttonNavigate}>
            {Number(currentPage) >= 2 && (
              <div>
                <button onClick={() => navigatePage(1)}>
                  <FiChevronsLeft color="#fff" />
                </button>
                <button onClick={() => navigatePage(Number(currentPage - 1))}>
                  <FiChevronLeft color="#fff" />
                </button>
              </div>
            )}
            {Number(currentPage) < Number(totalPage) && (
              <div>
                <button onClick={() => navigatePage(Number(currentPage + 1))}>
                  <FiChevronRight color="#fff" />
                </button>
                <button onClick={() => navigatePage(Number(totalPage))}>
                  <FiChevronsRight color="#fff" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.Predicates.at("document.type", "post")],
    {
      orderings: "[document.last_publication_date]",
      fetch: ["post.title", "post.description", "post.cover"],
      pageSize: 3,
    },
  );

  const posts = response.results.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      description:
        post.data.description.find(
          (content: any) => content.type === "paragraph",
        )?.text ?? "",
      cover: post.data.cover.url,
      updatedAt: new Date(post.last_publication_date ?? "").toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        },
      ),
    };
  });

  return {
    props: { posts, page: response.page, totalPage: response.total_pages },
    revalidate: 60 * 30,
  };
};
