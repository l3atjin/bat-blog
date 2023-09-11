import Head from 'next/head';
import utilStyles from '../styles/utils.module.css';
import Image from 'next/image'
import styles from '../components/layout.module.css';
import Layout from '../components/layout';
import Header from '../components/header';
import About from '../components/about';
import Projects from '../components/projects';
import Contact from '../components/contact';

const name = 'Bat Lamjav';
const siteTitle = 'Batjin Lamjav';

export default function Home() {
  return (
    <Layout>
      <Header/>
      <About/>
      <Projects/>
      <Contact/>
    </Layout>
  );
}