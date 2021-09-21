import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';

import { RichText } from 'prismic-dom';
import { getPrismicClient } from '../../services/prismic';
import Prismic from '@prismicio/client';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post() {
  <Head>
    <title>myBlogg</title>
  </Head>;
}

export const getStaticPaths = async () => {
  // const prismic = getPrismicClient();
  // const posts = await prismic.query(
  //   [Prismic.predicates.at('document.type', 'post')],
  //   {
  //     fetch: ['post.title', 'post.content'],
  //     pageSize: 100,
  //   }
  // );
  // return {
  //   paths: [],
  //   fallback: "blocking",
  // };
};

export const getStaticProps = async ({ params }) => {
  const uid = params.uid;
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(uid), {});

  const post = {
    uid,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }
    ),
  };

  return {
    props: {
      post,
    },
  };
};
