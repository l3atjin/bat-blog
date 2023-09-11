import Head from 'next/head';
import styles from './layout.module.css';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';

const name = 'Bat Lamjav';
export const siteTitle = 'Batjin Lamjav';

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <main>{children}</main>
    </div>
  );
}