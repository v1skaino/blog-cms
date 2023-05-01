import { getPrismicClient } from "@/services/prismic";
import { GetServerSideProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { RichText } from "prismic-dom";
import styles from "./post.module.scss";

type Post = {
  slug: string;
  title: string;
  cover: string;
  description: string;
  updatedAt: string;
};

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <main className={styles.container}>
        <article className={styles.post}>
          <Image
            alt={post.title}
            src={post.cover}
            width={720}
            height={410}
            quality={100}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mMsraurBwAE0wHyeLy4+wAAAABJRU5ErkJggg=="
          />
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.description }}
          ></div>
        </article>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const slug = params?.slug;

  if (!slug) return { redirect: { destination: "/", permanent: false } };

  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID("post", String(slug), {});

  if (!response) return { redirect: { destination: "/", permanent: false } };

  const post = {
    slug: slug,
    title: RichText.asText(response.data.title),
    description: RichText.asHtml(response.data.description),
    cover: response.data.cover.url,
    updatedAt: new Date(
      response.last_publication_date ?? "",
    ).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  };

  return { props: { post } };
};
