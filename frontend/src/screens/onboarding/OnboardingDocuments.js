import React, { useState } from 'react';
import styled from 'styled-components';
import { api } from '../../lib/api';
import Button from '../../components/Button';

const Container = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem;
  background: ${props => props.theme.colors.bg};
  min-height: calc(100vh - 140px);
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1rem;
`;

const Description = styled.p`
  color: ${props => props.theme.colors.muted};
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const Form = styled.form`
  display: grid;
  gap: 1rem;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: ${props => props.theme.colors.text};
  font-weight: 500;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md}px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.pri};
  }

  &::placeholder {
    color: ${props => props.theme.colors.muted};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md}px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;
  cursor: pointer;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.pri};
  }

  option {
    background: ${props => props.theme.colors.surface};
    color: ${props => props.theme.colors.text};
  }
`;

const ContinueLink = styled.div`
  margin-top: 1.5rem;
  
  a {
    color: ${props => props.theme.colors.pri};
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    
    &:hover {
      color: ${props => props.theme.colors.succ};
    }
  }
`;

export default function OnboardingDocuments() {
  const [form, setForm] = useState({ 
    type:'license', 
    category:'', 
    provider:'', 
    number:'', 
    issued_on:'', 
    expires_on:'', 
    file_url:'' 
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api('/onboarding/documents', { method:'POST', body: JSON.stringify(form) });
      alert('Uploaded for review. You can add more or continue.');
      setForm({ type:'license', category:'', provider:'', number:'', issued_on:'', expires_on:'', file_url:'' });
    } catch (error) {
      alert('Error uploading document: ' + error.message);
    }
  };

  const handleChange = (field) => (e) => {
    setForm({...form, [field]: e.target.value});
  };

  return (
    <Container>
      <Title>Upload Documents</Title>
      <Description>For now, paste a document link (Google Drive/Dropbox). Storage integration is Coming Soon.</Description>
      <Form onSubmit={submit}>
        <Label>
          Type
          <Select value={form.type} onChange={handleChange('type')}>
            <option value="license">License</option>
            <option value="insurance">Insurance (GL)</option>
            <option value="auto">Auto Insurance</option>
            <option value="cert">Certification</option>
            <option value="id">Government ID</option>
          </Select>
        </Label>
        <Label>
          Category (if specific)
          <Input 
            value={form.category} 
            onChange={handleChange('category')} 
            placeholder="e.g., electrical" 
          />
        </Label>
        <Label>
          Provider
          <Input 
            value={form.provider} 
            onChange={handleChange('provider')} 
            placeholder="Issuer / Insurer" 
          />
        </Label>
        <Label>
          Number
          <Input 
            value={form.number} 
            onChange={handleChange('number')} 
            placeholder="Policy or license #" 
          />
        </Label>
        <Label>
          Issued on
          <Input 
            type="date" 
            value={form.issued_on} 
            onChange={handleChange('issued_on')}
          />
        </Label>
        <Label>
          Expires on
          <Input 
            type="date" 
            value={form.expires_on} 
            onChange={handleChange('expires_on')}
          />
        </Label>
        <Label>
          File URL
          <Input 
            value={form.file_url} 
            onChange={handleChange('file_url')} 
            placeholder="https://link.to/document.pdf" 
          />
        </Label>
        <Button type="submit" variant="primary">Add document</Button>
      </Form>

      <ContinueLink>
        <a href="/onboarding/payout">
          Continue to Payout →
        </a>
      </ContinueLink>
    </Container>
  );
}