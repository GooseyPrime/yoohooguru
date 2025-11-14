import React, { useState } from 'react';
import { useRouter } from 'next/router';

interface DisabilityAttestationFormProps {
  onComplete?: () => void;
}

const ATTESTATION_TEXT = `Personal Attestation of Disability for Access to YoohooGuru's Hero Gurus Program

Background: YoohooGuru's Hero Gurus program is supported by the generosity of donors and volunteers who wish to make expert guidance freely available to individuals with disabilities. To ensure that we serve those for whom the program was designed, we ask each applicant to attest that they have a disability as defined by the Americans with Disabilities Act (ADA). A disability is a physical or mental impairment that substantially limits one or more major life activities.

Your attestation: By signing below, you certify that:

1. You have a disability meeting the ADA definition described above, or you are registering on behalf of someone who does.

2. You understand that this program is funded by donors and volunteers and that eligibility is based on honesty and respect for their generosity.

3. You acknowledge that you may be asked at random to provide documentation (such as a Social Security Administration award letter or physician certification) to confirm your disability status. If selected, you agree to provide this documentation for confidential review by an authorized compliance professional. You will not be asked to submit medical records during initial onboarding.

4. You agree to retain supporting documentation in case it is requested. You understand that failure to provide documentation when requested may result in loss of access to the Hero Gurus program.

5. You confirm that the information you provide is true and accurate to the best of your knowledge. Knowingly providing false information may result in suspension of your account.

Providing your personal information and this attestation is voluntary, but it is required to access the Hero Gurus program. Your responses will be kept confidential and used only to determine eligibility and ensure compliance with our donor-funded program. If you have any questions about this statement or need assistance completing it, please contact support@yoohooguru.com.`;

export default function DisabilityAttestationForm({ onComplete }: DisabilityAttestationFormProps) {
  const router = useRouter();
  const [fullLegalName, setFullLegalName] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullLegalName.trim()) {
      setError('Please enter your full legal name');
      return;
    }

    if (!agreed) {
      setError('You must agree to the attestation to continue');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/backend/attestation/disability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullLegalName: fullLegalName.trim(),
          attestationText: ATTESTATION_TEXT,
        }),
      });

      if (response.ok) {
        if (onComplete) {
          onComplete();
        } else {
          router.push('/dashboard?attestation=success');
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error?.message || 'Failed to submit attestation');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass-card p-8 rounded-2xl">
        <h2 className="text-3xl font-display font-bold text-white mb-6">
          Disability Self-Attestation Statement
        </h2>

        <div className="bg-white-5 border border-white-10 rounded-xl p-6 mb-6 max-h-96 overflow-y-auto">
          <div className="text-white-90 whitespace-pre-wrap text-sm leading-relaxed">
            {ATTESTATION_TEXT}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Legal Name */}
          <div>
            <label htmlFor="fullLegalName" className="block text-sm font-medium text-white mb-2">
              Signature (Type Full Legal Name) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              id="fullLegalName"
              value={fullLegalName}
              onChange={(e) => setFullLegalName(e.target.value)}
              className="input-premium w-full"
              placeholder="Enter your full legal name"
              required
              disabled={isSubmitting}
            />
          </div>

          {/* Date (auto-filled) */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Date
            </label>
            <input
              type="text"
              value={new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              className="input-premium w-full bg-white-5"
              disabled
            />
          </div>

          {/* Agreement Checkbox */}
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="agreed"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 mt-1 rounded border-white-20 bg-white-10 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0"
              disabled={isSubmitting}
            />
            <label htmlFor="agreed" className="text-sm text-white-90 cursor-pointer">
              I have read and agree to the disability attestation statement above. I certify that the information I have provided is true and accurate to the best of my knowledge.
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !agreed || !fullLegalName.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-glow-emerald disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Attestation'
              )}
            </button>
            
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 glass-button text-white font-semibold rounded-xl hover:bg-white-20 transition-all duration-300"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>

        {/* Help Text */}
        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <p className="text-sm text-blue-300">
            <strong>Need Help?</strong> If you have questions about this attestation or need assistance completing it, please contact us at{' '}
            <a href="mailto:support@yoohooguru.com" className="text-blue-400 hover:text-blue-300 underline">
              support@yoohooguru.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}