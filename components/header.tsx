import React from 'react'
import Image from 'next/image'
import Head from 'next/head'
import styles from './header.module.css'
import utilStyles from '../styles/utils.module.css';

const name = 'Batjin Lamjav'
export default function Header() {
  return (
    <div>
      <header className={styles.header}>
        <Image
          priority
          src="/images/profile1.jpeg"
          className={utilStyles.borderCircle}
          height={144}
          width={144}
          alt={name}
        />
        <h1 className={utilStyles.heading2Xl}>{name}</h1>
      </header>
    </div>
  )
}
