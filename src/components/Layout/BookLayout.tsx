import React from 'react';
import { ReactNode } from 'react';
import styles from './BookLayout.module.css';

/**
 * BookLayout
 *
 * Provides a book-like layout with a sidebar, main content area, and breadcrumbs.
 *
 * Props:
 *   sidebar?: ReactNode - Content for the sidebar (e.g., chapters/branches).
 *   breadcrumbs?: ReactNode - Breadcrumb navigation above the main content.
 *   children: ReactNode - Main content area.
 *
 * Usage:
 *   <BookLayout sidebar={<Sidebar />} breadcrumbs={<Breadcrumbs />}>
 *     ...main content...
 *   </BookLayout>
 */
interface BookLayoutProps {
  sidebar?: ReactNode;
  breadcrumbs?: ReactNode;
  children: ReactNode;
}

const BookLayout: React.FC<BookLayoutProps> = ({ sidebar, breadcrumbs, children }) => (
  <div className={styles.layout}>
    {sidebar && <aside className={styles.sidebar}>{sidebar}</aside>}
    <main className={styles.main}>
      {breadcrumbs && <nav className={styles.breadcrumbs}>{breadcrumbs}</nav>}
      <div className={styles.content}>{children}</div>
    </main>
  </div>
);

export default BookLayout; 