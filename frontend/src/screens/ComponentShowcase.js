import React, { useState } from 'react';
import styled from 'styled-components';
import TextField from '../components/ui/TextField';
import Select from '../components/ui/Select';
import Switch from '../components/ui/Switch';
import Dropdown from '../components/ui/Dropdown';
import Modal from '../components/ui/Modal';
import Tabs from '../components/ui/Tabs';
import Tooltip from '../components/ui/Tooltip';
import { useToast } from '../components/ui/Toast';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import { FadeIn } from '../components/motion/FadeIn';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Section = styled.section`
  margin: 2rem 0;
  padding: 1.5rem;
  border: 1px solid var(--border);
  border-radius: var(--r-lg);
  background: var(--surface);
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
`;

const FlexRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin: 1rem 0;
  flex-wrap: wrap;
`;

export default function ComponentShowcase() {
  const [formData, setFormData] = useState({
    email: '',
    category: '',
    notifications: false,
    activeTab: 'first'
  });
  const [modalOpen, setModalOpen] = useState(false);
  const { notify, ToastHost } = useToast();

  const categories = [
    { value: 'tech', label: 'Technology' },
    { value: 'creative', label: 'Creative Arts' },
    { value: 'fitness', label: 'Fitness & Health' },
    { value: 'education', label: 'Education' }
  ];

  const dropdownItems = [
    { label: 'Profile Settings', onSelect: () => notify('Profile clicked') },
    { label: 'Account Settings', onSelect: () => notify('Account clicked') },
    { label: 'Sign Out', onSelect: () => notify('Sign out clicked') }
  ];

  const tabItems = [
    { value: 'first', label: 'Overview', children: <div style={{padding:'1rem'}}>Overview content here</div> },
    { value: 'second', label: 'Details', children: <div style={{padding:'1rem'}}>Details content here</div> },
    { value: 'third', label: 'Settings', children: <div style={{padding:'1rem'}}>Settings content here</div> }
  ];

  return (
    <Container>
      <ToastHost />
      
      <FadeIn>
        <h1>Component Showcase</h1>
        <p>Demonstrating the Linear-grade Motion + Foundational Component Kit</p>
      </FadeIn>

      <FadeIn delay={0.1}>
        <Section>
          <h2>Form Components</h2>
          <Grid>
            <div>
              <TextField
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
                hint="We'll never share your email"
              />
              
              <Select
                value={formData.category}
                onChange={(value) => setFormData(prev => ({...prev, category: value}))}
                options={categories}
                placeholder="Choose a category..."
              />
            </div>
            
            <div>
              <FlexRow>
                <label>Notifications</label>
                <Switch
                  checked={formData.notifications}
                  onChange={(checked) => setFormData(prev => ({...prev, notifications: checked}))}
                />
              </FlexRow>
              
              <Dropdown 
                button={<span>User Menu ▾</span>}
                items={dropdownItems}
              />
            </div>
          </Grid>
        </Section>
      </FadeIn>

      <FadeIn delay={0.2}>
        <Section>
          <h2>Layout Components</h2>
          
          <Tabs 
            value={formData.activeTab}
            onChange={(value) => setFormData(prev => ({...prev, activeTab: value}))}
            items={tabItems}
          />
        </Section>
      </FadeIn>

      <FadeIn delay={0.3}>
        <Section>
          <h2>Feedback Components</h2>
          <FlexRow>
            <button onClick={() => setModalOpen(true)}>Open Modal</button>
            <button onClick={() => notify('Hello from toast!')}>Show Toast</button>
            
            <Tooltip content="This is a helpful tooltip">
              <Badge>Hover me</Badge>
            </Tooltip>
          </FlexRow>
          
          <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
            <h3>Example Modal</h3>
            <p>This modal demonstrates the basic modal component with backdrop and ESC key support.</p>
            <button onClick={() => setModalOpen(false)}>Close</button>
          </Modal>
        </Section>
      </FadeIn>

      <FadeIn delay={0.4}>
        <Section>
          <h2>Cards & Layout</h2>
          <Grid>
            {[1, 2, 3].map((num, index) => (
              <FadeIn key={num} delay={0.5 + index * 0.1}>
                <Card style={{ padding: '1.5rem' }}>
                  <h3>Card {num}</h3>
                  <p>This is an example card component with consistent styling.</p>
                  <FlexRow>
                    <Badge>Feature</Badge>
                    <Badge>New</Badge>
                  </FlexRow>
                </Card>
              </FadeIn>
            ))}
          </Grid>
        </Section>
      </FadeIn>
    </Container>
  );
}