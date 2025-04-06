import React, { useState, useEffect } from 'react';
import Layout from '@theme/Layout';
import styles from './workflows.module.css'; // We'll create this CSS file next

// Define TypeScript interfaces
interface Workflow {
  id: string;
  title: string;
  description: string;
  platform: string;
  tags: string[];
  price: string;
  docPath: string;
  jsonUrl: string;
  imageUrl: string; // Add image URL field
}

interface WorkflowCardProps {
  workflow: Workflow;
  layout: 'grid' | 'list';
}


// --- Sample Data (Mimic Front Matter) ---
// In a real scenario, this data would be fetched or generated at build time
const allWorkflows: Workflow[] = [
  {
    id: 'n8n-social',
    title: 'Social Media Content Calendar',
    description: 'Schedule and post content across multiple social media platforms from a single spreadsheet.',
    platform: 'n8n',
    tags: ['Social Media', 'Productivity', 'Google Sheets'],
    price: 'Free',
    docPath: '/docs/workflows/n8n/social-media-calendar', // Link to the doc page
    jsonUrl: '/workflows/n8n/social-media-calendar.json', // Link to the JSON
    imageUrl: 'https://t4.ftcdn.net/jpg/05/18/56/43/240_F_518564320_mq70LbrtjXCvmxjjN5FCXWKzlMDOtp79.jpg' // Placeholder image
  },
  {
    id: 'zapier-invoice',
    title: 'Invoice Generator',
    description: 'Create professional invoices automatically when new clients are added to your CRM.',
    platform: 'Zapier',
    tags: ['Finance', 'CRM', 'Automation'],
    price: 'Free',
    docPath: '/docs/workflows/zapier/invoice-generator', // Assume this doc exists
    jsonUrl: '/workflows/zapier/invoice-generator.json', // Assume this JSON exists
    imageUrl: 'https://source.unsplash.com/featured/600x300?invoice' // Placeholder image
  },
  {
    id: 'n8n-backup',
    title: 'Automated Data Backup',
    description: 'Securely backup important files from multiple sources to cloud storage daily.',
    platform: 'n8n',
    tags: ['Backup', 'Cloud Storage', 'Data Management'],
    price: 'Free',
    docPath: '/docs/workflows/n8n/automated-data-backup', // Assume this doc exists
    jsonUrl: '/workflows/n8n/automated-data-backup.json', // Assume this JSON exists
    imageUrl: 'https://source.unsplash.com/featured/600x300?data+backup' // Placeholder image
  },
   // Add more sample workflows based on your .md files
];
// --- End Sample Data ---
// WorkflowCard component with TypeScript props
const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow, layout }) => {
  const isFree = workflow.price === 'Free';
  
  if (layout === 'list') {
    return (
      <div className={styles.workflowCard}>
        <div className={styles.workflowContent}>
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div className={styles.listImageContainer}>
              <img src={workflow.imageUrl} alt={workflow.title} className={styles.listImage} />
            </div>
            <div>
              <h3>{workflow.title}</h3>
              <span className={styles.platformTag} data-platform={workflow.platform}>
                {workflow.platform}
              </span>
              <p>{workflow.description}</p>
            </div>
          </div>
        </div>
        
        {workflow.price && (
          <div className={styles.price}>
            {isFree ? 'Free' : `$${workflow.price}`}
          </div>
        )}
        
        <div className={styles.actions}>
          <button className={`${styles.button} ${styles.secondary}`}>
            Add
          </button>
          <a 
            href={workflow.jsonUrl} 
            className={`${styles.button} ${styles.primary}`}
            download
          >
            {isFree ? 'Download' : 'Buy'}
          </a>
          <a 
            href={workflow.docPath}
            className={`${styles.button} ${styles.view}`}
          >
            View
          </a>
        </div>
      </div>
    );
  }

  // Grid layout (existing card design)
  return (
    <div className={styles.workflowCard}>
      <div className={styles.imageContainer}>
        <img src={workflow.imageUrl} alt={workflow.title} className={styles.heroImage} />
        <span className={styles.platformTag} data-platform={workflow.platform}>
          {workflow.platform}
        </span>
      </div>
      <div className={styles.cardContent}>
        <h3>{workflow.title}</h3>
        <p>{workflow.description}</p>
        <div className={styles.tags}>
          {workflow.tags.map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
        <div className={styles.cardFooter}>
          <span className={styles.price}>
            {isFree ? 'Free' : `$${workflow.price}`}
          </span>
          <div className={styles.buttons}>
            <a href={workflow.docPath} className={styles.button}>View Details</a>
            <a href={workflow.jsonUrl} className={styles.button} download>
              {isFree ? 'Download' : 'Buy'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

type SortOption = {
  value: string;
  label: string;
  compareFn: (a: Workflow, b: Workflow) => number;
};

const sortOptions: SortOption[] = [
  {
    value: 'titleAsc',
    label: 'Title (A-Z)',
    compareFn: (a, b) => a.title.localeCompare(b.title)
  },
  {
    value: 'titleDesc',
    label: 'Title (Z-A)',
    compareFn: (a, b) => b.title.localeCompare(a.title)
  },
  {
    value: 'priceAsc',
    label: 'Price (Low to High)',
    compareFn: (a, b) => {
      const aPrice = a.price === 'Free' ? 0 : parseFloat(a.price);
      const bPrice = b.price === 'Free' ? 0 : parseFloat(b.price);
      return aPrice - bPrice;
    }
  },
  {
    value: 'priceDesc',
    label: 'Price (High to Low)',
    compareFn: (a, b) => {
      const aPrice = a.price === 'Free' ? 0 : parseFloat(a.price);
      const bPrice = b.price === 'Free' ? 0 : parseFloat(b.price);
      return bPrice - aPrice;
    }
  },
  {
    value: 'platform',
    label: 'Platform',
    compareFn: (a, b) => a.platform.localeCompare(b.platform)
  }
];

// Main page component
const WorkflowsPage: React.FC = () => {
  const [filteredWorkflows, setFilteredWorkflows] = useState<Workflow[]>(allWorkflows);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<string>(sortOptions[0].value);

  // Get unique platforms and tags
  const platforms = Array.from(new Set(allWorkflows.map(w => w.platform)));
  const allTags = Array.from(new Set(allWorkflows.flatMap(w => w.tags)));

  useEffect(() => {
    let filtered = allWorkflows;

    // Filter by platform
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(w => w.platform === selectedPlatform);
    }

    // Filter by tags
    if (selectedTags.length > 0) {
      filtered = filtered.filter(w => 
        selectedTags.every(tag => w.tags.includes(tag))
      );
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(w => 
        w.title.toLowerCase().includes(query) ||
        w.description.toLowerCase().includes(query) ||
        w.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort workflows
    const selectedSort = sortOptions.find(option => option.value === sortBy);
    if (selectedSort) {
      filtered = [...filtered].sort(selectedSort.compareFn);
    }

    setFilteredWorkflows(filtered);
  }, [selectedPlatform, selectedTags, searchQuery, sortBy]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <Layout
      title="Workflow Browser"
      description="Browse and discover automation workflows for n8n, Zapier, Make, and more."
    >
      <main className={styles.workflowBrowserContainer}>
        <h1>Workflow Browser</h1>
        <p>Find automations for your favorite tools.</p>
        
        {/* Filter Controls */}
        <div className={styles.filterControls}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search workflows..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.platformFilter}>
            <label>Platform:</label>
            <select 
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className={styles.select}
            >
              <option value="all">All Platforms</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>

          <div className={styles.tagFilter}>
            <label>Tags:</label>
            <div className={styles.tagButtons}>
              {allTags.map(tag => (
                <button
                  key={tag}
                  className={`${styles.tagButton} ${selectedTags.includes(tag) ? styles.selected : ''}`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Top Controls Bar */}
        <div className={styles.topControls}>
          {/* Left Side - Sort Control */}
          <div className={styles.leftControls}>
            <div className={styles.sortControl}>
              <label htmlFor="sort">Sort by:</label>
              <select
                id="sort"
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.resultCount}>
              {filteredWorkflows.length} workflow{filteredWorkflows.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* Right Side - View Toggle */}
          <div className={styles.rightControls}>
            <div className={styles.layoutToggle}>
              <button
                className={`${styles.toggleButton} ${layout === 'grid' ? styles.active : ''}`}
                onClick={() => setLayout('grid')}
                title="Grid View"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M1 1h6v6H1V1zm8 0h6v6H9V1zM1 9h6v6H1V9zm8 0h6v6H9V9z"/>
                </svg>
              </button>
              <button
                className={`${styles.toggleButton} ${layout === 'list' ? styles.active : ''}`}
                onClick={() => setLayout('list')}
                title="List View"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M1 1h14v2H1V1zm0 4h14v2H1V5zm0 4h14v2H1V9zm0 4h14v2H1v-2z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Workflow Grid/List */}
        <div className={layout === 'grid' ? styles.workflowGrid : styles.workflowList}>
          {filteredWorkflows.length > 0 ? (
            filteredWorkflows.map((workflow) => (
              <WorkflowCard 
                key={workflow.id} 
                workflow={workflow} 
                layout={layout}
              />
            ))
          ) : (
            <p>No workflows match your filters. Try adjusting your search criteria.</p>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default WorkflowsPage;