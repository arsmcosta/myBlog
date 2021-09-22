import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';
import Prismic from '@prismicio/client';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';
import { RichText } from 'prismic-dom';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ results }: PostPagination) {
  return (
    <>
      <header>spacetravelling</header>
      <main className={styles.contentContainer}>
        <div className={styles.posts}>
          <ul>
            {results.map(post => (
              <main key={post.uid} className={styles.contentContainer}>
                <div className={styles.posts}>
                {console.log(post.data)}
                  <a>
                    <strong>{post.data.title}</strong>
                    <span>{post.data.author}</span>
                    <time>{post.first_publication_date}</time>
                  </a>
                </div>
              </main>
            ))}
          </ul>
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();
  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],
    {
      fetch: ['posts.title', 'posts.content'],
      pageSize: 100,
    }
  );

  const results = postsResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: new Date(
        post.first_publication_date
      ).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
      data: {
        title: post.data.title,
      },
    };
  });
  return {
    props: {
      results,
    },
  };
};
