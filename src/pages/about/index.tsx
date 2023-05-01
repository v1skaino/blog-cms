import { getPrismicClient } from "@/services/prismic";
import Prismic from "@prismicio/client";
import { GetStaticProps } from "next";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";
import styles from "./styles.module.scss";

type Content = {
  title: string;
  description: string;
  banner: string;
  facebook: string;
  linkedin: string;
  instagram: string;
};

interface ContentProps {
  content: Content;
}

export default function About({ content }: ContentProps) {
  return (
    <>
      <Head>
        <title>Sobre | {content.title}</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaText}>
            <h1>{content.title}</h1>
            <div
              className={styles.desc}
              dangerouslySetInnerHTML={{ __html: content.description }}
            />
            <a href={content.facebook}>
              <FaFacebook size={40} />
            </a>
            <a href={content.instagram}>
              <FaInstagram size={40} />
            </a>
            <a href={content.linkedin}>
              <FaLinkedin size={40} />
            </a>
          </section>

          <img src={content.banner} alt="Foto do lucas" />
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const TWO_HOURS_IN_SECONDS = 7200;

  const prismic = getPrismicClient();
  const response = await prismic.query([
    Prismic.Predicates.at("document.type", "about"),
  ]);

  const { title, description, banner, facebook, linkedin, instagram } =
    response.results[0].data;

  const content = {
    title: RichText.asText(title),
    description: RichText.asHtml(description),
    banner: banner.url,
    facebook: facebook.url,
    linkedin: linkedin.url,
    instagram: instagram.url,
  };

  return { props: { content }, revalidate: TWO_HOURS_IN_SECONDS };
};
