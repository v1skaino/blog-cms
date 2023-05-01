import { getPrismicClient } from "@/services/prismic";
import Prismic from "@prismicio/client";
import { GetStaticProps } from "next";
import Head from "next/head";
import Image from "next/image";
import { RichText } from "prismic-dom";
import techs from "../../public/images/techs.svg";
import styles from "../styles/home.module.scss";

interface ContentType {
  title: string;
  subtitle: string;
  mainimage: string;
  firstsectiontitle: string;
  firstsectiondescription: string;
  firstsectionbanner: string;
  secondsectiontitle: string;
  secondsectiondescription: string;
  secondsectionbanner: string;
}

interface HomeProps {
  content: ContentType;
}

export default function Home({ content }: HomeProps) {
  return (
    <>
      <Head>
        <title>Blog de TI - Lucas Viscaino</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.containerHeader}>
          <section className={styles.ctaTxt}>
            <h1>{content.title}</h1>
            <span>{content.subtitle}</span>
            <a>
              <button>COMEÇAR AGORA</button>
            </a>
          </section>
          <img src={content.mainimage} alt="Conteúdos do aplicativo" />
        </div>
        <hr className={styles.divisor} />
        <div className={styles.sectionContent}>
          <section>
            <h2>{content.firstsectiontitle}</h2>
            <span>{content.firstsectiondescription}</span>
          </section>
          <img
            src={content.firstsectionbanner}
            alt="Imagem que ilustra o conteudo"
          />
        </div>
        <hr className={styles.divisor} />
        <div className={styles.sectionContent}>
          <img
            src={content.secondsectionbanner}
            alt="Imagem que ilustra o conteudo"
          />
          <section>
            <h2>{content.secondsectiontitle}</h2>
            <span>{content.secondsectiondescription} </span>
          </section>
        </div>

        <div className={styles.nextLevelContent}>
          <Image src={techs} alt="Tecnologias" />
          <h2>
            Venha fazer parte dessa <span>comunidade</span>, e nos ajude a
            compartilhar a informação!
          </h2>
          <span>
            E você vai perder a chance de interagir com DEVS do mundo todo?
          </span>
          <a href="/posts">
            <button>VISUALIZAR POSTS</button>
          </a>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const TWO_HOURS_IN_SECONDS = 7200;

  const response = await prismic.query([
    Prismic.Predicates.at("document.type", "home"),
  ]);

  const {
    title,
    subtitle,
    mainimage,
    firstsectiontitle,
    firstsectiondescription,
    firstsectionbanner,
    secondsectiontitle,
    secondsectiondescription,
    secondsectionbanner,
  } = response.results[0].data;

  const content = {
    title: RichText.asText(title),
    subtitle: RichText.asText(subtitle),
    mainimage: mainimage.url,
    firstsectiontitle: RichText.asText(firstsectiontitle),
    firstsectiondescription: RichText.asText(firstsectiondescription),
    firstsectionbanner: firstsectionbanner.url,
    secondsectiontitle: RichText.asText(secondsectiontitle),
    secondsectiondescription: RichText.asText(secondsectiondescription),
    secondsectionbanner: secondsectionbanner.url,
  };

  return { props: { content }, revalidate: TWO_HOURS_IN_SECONDS };
};
