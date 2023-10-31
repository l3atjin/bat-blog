import React from 'react'
import styles from './layout.module.css';
import Link from 'next/link';

const projects = [
  {
    name: 'Image Labeler',
    description: 'Computer Vision project that outputs a label given an image. This is a demo that takes advantage of the AWS suite.',
    technologies: 'AWS Lambda, S3, Rekognition',
    id: "image-labeler"
    // Add more project details as needed
  },
  {
    name: 'Chat GPT in Mongolian',
    description: 'Chat GPT based AI assistant that can interpret Mongolian',
    technologies: 'GCP, Cloud Translation API, OpenAI API',
    id: "gpt-mongolian"
  },
  // Add more projects
];

export default function Projects() {
  return (
    <section className={styles.projects}>
      <h2>Projects</h2>
      <ul className={styles.projectList}>
        {projects.map((project, index) => (
          <li key={index} className={styles.projectItem}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
            <p>Technologies: {project.technologies}</p>
            <p>Try: <Link href={`/projects/${project.id}`}>demo</Link></p>
            {/* Add more project details here */}
          </li>
        ))}
      </ul>
    </section>
  )
}
