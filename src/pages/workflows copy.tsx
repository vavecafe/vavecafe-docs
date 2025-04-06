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
}

interface WorkflowCardProps {
  workflow: Workflow;
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
    jsonUrl: '/workflows/n8n/social-media-calendar.json' // Link to the JSON
  },
  {
    id: 'zapier-invoice',
    title: 'Invoice Generator',
    description: 'Create professional invoices automatically when new clients are added to your CRM.',
    platform: 'Zapier',
    tags: ['Finance', 'CRM', 'Automation'],
    price: 'Free',
    docPath: '/docs/workflows/zapier/invoice-generator', // Assume this doc exists
    jsonUrl: '/workflows/zapier/invoice-generator.json' // Assume this JSON exists
  },
  {
    id: 'n8n-backup',
    title: 'Automated Data Backup',
    description: 'Securely backup important files from multiple sources to cloud storage daily.',
    platform: 'n8n',
    tags: ['Backup', 'Cloud Storage', 'Data Management'],
    price: 'Free',
    docPath: '/docs/workflows/n8n/automated-data-backup', // Assume this doc exists
    jsonUrl: '/workflows/n8n/automated-data-backup.json' // Assume this JSON exists
  },
   // Add more sample workflows based on your .md files
];
// --- End Sample Data ---
// WorkflowCard component with TypeScript props
const WorkflowCard: React.FC<WorkflowCardProps> = ({ workflow }) => {
    // Typed card structure
    return (
        <div className={styles.workflowCard}>
             <h3>{workflow.title}</h3>
             <span className={styles.platformTag}>{workflow.platform}</span>
             <p>{workflow.description}</p>
             <div className={styles.tags}>
                 {workflow.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}
             </div>
             <div className={styles.cardFooter}>
                 <span className={styles.price}>{workflow.price}</span>
                 <div className={styles.buttons}>
                    <a href={workflow.docPath} className={styles.button}>View Details</a>
                    <a href={workflow.jsonUrl} className={styles.button} download>Download</a>
                 </div>
             </div>
        </div>
    );
}

// Main page component
const WorkflowsPage: React.FC = () => {
  const [filteredWorkflows, setFilteredWorkflows] = useState<Workflow[]>(allWorkflows);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

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

    setFilteredWorkflows(filtered);
  }, [selectedPlatform, selectedTags, searchQuery]);

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

        {/* Workflow Grid */}
        <div className={styles.workflowGrid}>
          {filteredWorkflows.length > 0 ? (
            filteredWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
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