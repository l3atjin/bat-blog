import React from 'react'
import styles from './layout.module.css';

const projects = [
  {
    name: 'Project 1',
    description: 'Description of Project 1.',
    technologies: 'React, Node.js, MongoDB',
    // Add more project details as needed
  },
  {
    name: 'Project 2',
    description: 'Description of Project 2.',
    technologies: 'Angular, Express, MySQL',
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
            {/* Add more project details here */}
          </li>
        ))}
      </ul>
    </section>
}
