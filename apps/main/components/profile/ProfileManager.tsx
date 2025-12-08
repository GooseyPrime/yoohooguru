import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const ProfileHeader = styled.h2`
  color: #ffffff;
  font-size: 2rem;
  margin-bottom: 2rem;
  text-align: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #b0b0b0;
  font-weight: 600;
`;

const Input = styled.input`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-size: 1rem;
  min-height: 150px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const Button = styled.button`
  padding: 1rem;
  border-radius: 0.5rem;
  border: none;
  background: #667eea;
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  align-self: flex-start;
  
  &:hover {
    background: #5a6fd8;
  }
  
  &:disabled {
    background: #555;
    cursor: not-allowed;
  }
`;

const SkillTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SkillTag = styled.span`
  background: #667eea;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const RemoveTag = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  font-size: 1rem;
  line-height: 1;
`;

const AddSkillForm = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const SkillInput = styled(Input)`
  flex: 1;
`;

const AddButton = styled(Button)`
  padding: 0.75rem;
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border-radius: 0.5rem;
  border: 1px solid #ff6b6b;
`;

const SuccessMessage = styled.div`
  color: #51cf66;
  padding: 1rem;
  background: rgba(81, 207, 102, 0.1);
  border-radius: 0.5rem;
  border: 1px solid #51cf66;
`;

const AudienceTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #b0b0b0;
  font-size: 0.85rem;
  width: fit-content;
`;

const HelperText = styled.p`
  color: #b0b0b0;
  line-height: 1.5;
`;

interface ProfileData {
  name: string;
  email: string;
  bio: string;
  role: string;
  skills: string[];
  specializations?: string[]; // For Hero Gurus
  photoUrl?: string;
  location?: string;
  pricing?: {
    hourlyRate: number;
    currency: string;
  };
  availability?: {
    days: string[];
    hours: {
      start: string;
      end: string;
    };
  };
}

export default function ProfileManager() {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    bio: '',
    role: 'gunu',
    skills: [],
    photoUrl: '',
    location: '',
    pricing: {
      hourlyRate: 0,
      currency: 'USD'
    },
    availability: {
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      hours: {
        start: '09:00',
        end: '17:00'
      }
    }
  });
  const [newSkill, setNewSkill] = useState('');
  const [message, setMessage] = useState<{type: 'error' | 'success', text: string} | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setProfileData(prev => ({
        ...prev,
        name: session.user?.name || '',
        email: session.user?.email || '',
        role: session.user.role || 'guru'
      }));
    }
  }, [session]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      pricing: {
        hourlyRate: prev.pricing?.hourlyRate || 0,
        currency: prev.pricing?.currency || 'USD',
        ...prev.pricing,
        [name]: name === 'hourlyRate' ? parseFloat(value) || 0 : value
      }
    }));
  };

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      availability: {
        days: prev.availability?.days || [],
        hours: {
          start: prev.availability?.hours?.start || '',
          end: prev.availability?.hours?.end || '',
          ...prev.availability?.hours,
          [name]: value
        }
      }
    }));
  };

  const handleDayToggle = (day: string) => {
    setProfileData(prev => {
      const currentDays = prev.availability?.days || [];
      const newDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day];
      
      return {
        ...prev,
        availability: {
          days: newDays,
          hours: prev.availability?.hours || { start: '', end: '' }
        }
      };
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !profileData.skills.includes(newSkill.trim())) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill: string) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      // In a real implementation, this would be an API call to update the user profile
      // For now, we&apos;ll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setMessage({
        type: 'success',
        text: 'Profile updated successfully!'
      });
    } catch {
      setMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isTeacherRole = profileData.role === 'guru' || profileData.role === 'hero-guru' || profileData.role === 'angel';

  return (
    <ProfileContainer>
      <ProfileHeader>System Profile (Private)</ProfileHeader>

      <AudienceTag>
        <span aria-hidden>🔒</span>
        Visible only to you and YooHoo.Guru for account support
      </AudienceTag>

      <HelperText style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        Keep this information up to date to power notifications, account recovery, and onboarding. Your public Guru or Angel
        pages pull friendly defaults from here, but nothing is published until you curate it in the Public Profiles area.
      </HelperText>

      {message && (
        message.type === 'error'
          ? <ErrorMessage>{message.text}</ErrorMessage>
          : <SuccessMessage>{message.text}</SuccessMessage>
      )}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            type="text"
            value={profileData.name}
            onChange={handleChange}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={profileData.email}
            onChange={handleChange}
            required
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="location">City / Region (general location)</Label>
          <Input
            id="location"
            name="location"
            type="text"
            value={profileData.location}
            onChange={handleChange}
            placeholder="Example: Austin, TX"
          />
          <HelperText>This stays private but helps us prefill your public profile without storing your exact address.</HelperText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="photoUrl">Profile photo (optional)</Label>
          <Input
            id="photoUrl"
            name="photoUrl"
            type="url"
            value={profileData.photoUrl}
            onChange={handleChange}
            placeholder="https://..."
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="bio">Bio</Label>
          <TextArea
            id="bio"
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
            placeholder="Tell us about yourself..."
          />
        </FormGroup>
        
        {isTeacherRole && (
          <>
            <FormGroup>
              <Label>Skills</Label>
              <SkillTags>
                {profileData.skills.map((skill, index) => (
                  <SkillTag key={index}>
                    {skill}
                    <RemoveTag onClick={() => removeSkill(skill)}>×</RemoveTag>
                  </SkillTag>
                ))}
              </SkillTags>
              <AddSkillForm>
                <SkillInput
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a skill..."
                />
                <AddButton type="button" onClick={addSkill}>Add</AddButton>
              </AddSkillForm>
            </FormGroup>
            
            {profileData.role !== 'hero-guru' && (
              <FormGroup>
                <Label>Pricing</Label>
                <Input
                  type="number"
                  name="hourlyRate"
                  value={profileData.pricing?.hourlyRate || 0}
                  onChange={handlePricingChange}
                  placeholder="Hourly rate"
                  min="0"
                  step="1"
                />
                <Select
                  name="currency"
                  value={profileData.pricing?.currency || 'USD'}
                  onChange={handlePricingChange}
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </Select>
              </FormGroup>
            )}
            
            <FormGroup>
              <Label>Availability</Label>
              <div>
                <Label>Days</Label>
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <label key={day} style={{display: 'block', margin: '0.5rem 0', color: '#b0b0b0'}}>
                    <input
                      type="checkbox"
                      checked={profileData.availability?.days.includes(day) || false}
                      onChange={() => handleDayToggle(day)}
                      style={{marginRight: '0.5rem'}}
                    />
                    {day}
                  </label>
                ))}
              </div>
              
              <div>
                <Label>Hours</Label>
                <div style={{display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '0.5rem'}}>
                  <Input
                    type="time"
                    name="start"
                    value={profileData.availability?.hours.start || '09:00'}
                    onChange={handleHoursChange}
                    style={{width: 'auto'}}
                  />
                  <span>to</span>
                  <Input
                    type="time"
                    name="end"
                    value={profileData.availability?.hours.end || '17:00'}
                    onChange={handleHoursChange}
                    style={{width: 'auto'}}
                  />
                </div>
              </div>
            </FormGroup>
          </>
        )}
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Profile'}
        </Button>
      </Form>
    </ProfileContainer>
  );
}