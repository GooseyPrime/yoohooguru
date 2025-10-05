import React, { useState } from 'react';
import styled from 'styled-components';
import { X, Calendar, Clock, Video, MapPin } from 'lucide-react';
import Button from './Button';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled.div`
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.radius.lg}px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: ${props => props.theme.shadow.xl};
`;

const Header = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-size: var(--text-xl);
  color: ${props => props.theme.colors.text};
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.muted};
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.theme.radius.sm}px;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.border};
    color: ${props => props.theme.colors.text};
  }
`;

const Content = styled.div`
  padding: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: var(--text-sm);
  font-weight: 500;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md}px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: var(--text-base);
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.pri};
    box-shadow: 0 0 0 2px rgba(124, 140, 255, 0.1);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md}px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: var(--text-base);
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.pri};
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.radius.md}px;
  background: ${props => props.theme.colors.surface};
  color: ${props => props.theme.colors.text};
  font-size: var(--text-base);
  min-height: 100px;
  resize: vertical;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.pri};
    box-shadow: 0 0 0 2px rgba(124, 140, 255, 0.1);
  }
`;

const ProviderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.radius.md}px;
  margin-bottom: 1.5rem;
`;

const ProviderAvatar = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${props => props.theme.colors.pri};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
`;

const ProviderDetails = styled.div`
  flex: 1;

  h3 {
    margin: 0 0 0.25rem 0;
    font-size: var(--text-base);
    color: ${props => props.theme.colors.text};
  }

  p {
    margin: 0;
    font-size: var(--text-sm);
    color: ${props => props.theme.colors.muted};
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${props => props.theme.colors.bg};
  border-radius: ${props => props.theme.radius.sm}px;
  margin-bottom: 0.75rem;
  
  svg {
    color: ${props => props.theme.colors.pri};
    flex-shrink: 0;
  }

  span {
    color: ${props => props.theme.colors.text};
    font-size: var(--text-sm);
  }
`;

const Footer = styled.div`
  padding: 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
`;

function BookingModal({ isOpen, onClose, provider, skillName, serviceType = 'skill' }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    mode: 'video',
    duration: '60',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Calculate start and end times
      const dateTime = new Date(`${formData.date}T${formData.time}`);
      const startTime = dateTime.getTime();
      const endTime = startTime + (parseInt(formData.duration) * 60 * 1000);

      // Create session booking
      const response = await api('/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coachId: provider?.id || 'placeholder-id',
          learnerId: '__SELF__',
          skillId: skillName || 'general',
          mode: formData.mode,
          startTime,
          endTime,
          notes: formData.notes
        })
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Session booked successfully! You will receive a confirmation email.');
        onClose();
        // Reset form
        setFormData({
          date: '',
          time: '',
          mode: 'video',
          duration: '60',
          notes: ''
        });
      } else {
        throw new Error(data.error?.message || 'Failed to book session');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.message || 'Failed to book session. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Generate time slots (9 AM to 9 PM)
  const timeSlots = [];
  for (let hour = 9; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeSlots.push(time);
    }
  }

  return (
    <Overlay onClick={handleOverlayClick}>
      <Modal>
        <Header>
          <Title>Book {serviceType === 'service' ? 'Service' : 'Session'}</Title>
          <CloseButton onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </CloseButton>
        </Header>

        <Content>
          {provider && (
            <ProviderInfo>
              <ProviderAvatar>
                {provider.name ? provider.name.charAt(0).toUpperCase() : '?'}
              </ProviderAvatar>
              <ProviderDetails>
                <h3>{provider.name || 'Provider'}</h3>
                <p>{skillName || 'General Session'}</p>
              </ProviderDetails>
            </ProviderInfo>
          )}

          <form onSubmit={handleSubmit}>
            <Section>
              <Label htmlFor="date">
                <Calendar size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                Date
              </Label>
              <Input
                type="date"
                id="date"
                value={formData.date}
                onChange={handleChange('date')}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </Section>

            <Section>
              <Label htmlFor="time">
                <Clock size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                Time
              </Label>
              <Select
                id="time"
                value={formData.time}
                onChange={handleChange('time')}
                required
              >
                <option value="">Select a time</option>
                {timeSlots.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </Select>
            </Section>

            <Section>
              <Label htmlFor="duration">Duration</Label>
              <Select
                id="duration"
                value={formData.duration}
                onChange={handleChange('duration')}
                required
              >
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </Select>
            </Section>

            <Section>
              <Label htmlFor="mode">
                <Video size={16} style={{ display: 'inline', marginRight: '0.25rem' }} />
                Session Mode
              </Label>
              <Select
                id="mode"
                value={formData.mode}
                onChange={handleChange('mode')}
                required
              >
                <option value="video">Video Call</option>
                <option value="in-person">In Person</option>
                <option value="phone">Phone Call</option>
              </Select>
            </Section>

            {formData.mode === 'in-person' && (
              <InfoItem>
                <MapPin size={16} />
                <span>Location will be confirmed after booking</span>
              </InfoItem>
            )}

            <Section>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <TextArea
                id="notes"
                value={formData.notes}
                onChange={handleChange('notes')}
                placeholder="Any specific topics or questions you'd like to cover?"
              />
            </Section>

            <Footer>
              <Button
                type="button"
                variant="ghost"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? 'Booking...' : 'Book Session'}
              </Button>
            </Footer>
          </form>
        </Content>
      </Modal>
    </Overlay>
  );
}

export default BookingModal;
