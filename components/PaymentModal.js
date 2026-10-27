'use client';

// Custom Chapa payment modal UI
import { useState } from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import styles from '@/styles/Form.module.css';

export function PaymentModal({ isOpen, onClose, event, user, onSuccess }) {
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^(09|07|\+2519|\+2517)\d{8}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Invalid Ethiopian phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setProcessing(true);
    setErrors({});

    try {
      // Initialize payment
      const res = await fetch('/api/payments/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }

      const { checkoutUrl, tx_ref } = await res.json();

      // Store transaction reference
      localStorage.setItem('pending_payment', JSON.stringify({
        tx_ref,
        eventId: event.id,
        timestamp: Date.now(),
      }));

      // Redirect to Chapa
      window.location.href = checkoutUrl;
    } catch (error) {
      setErrors({ submit: error.message });
      setProcessing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Payment"
      size="medium"
    >
      <div style={{ marginBottom: 'var(--spacing-xl)' }}>
        {/* Event Summary */}
        <div style={{
          padding: 'var(--spacing-lg)',
          backgroundColor: 'var(--color-background-secondary)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-lg)',
        }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: 'var(--spacing-md)' }}>
            {event.title}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Ticket Price:</span>
            <strong style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-primary)' }}>
              {event.price.toFixed(2)} ETB
            </strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--spacing-sm)' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Date:</span>
            <span>{new Date(event.date).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Location:</span>
            <span>{event.location.name}</span>
          </div>
        </div>

        {/* Payment Information */}
        <div style={{
          padding: 'var(--spacing-md)',
          backgroundColor: 'rgba(37, 99, 235, 0.1)',
          border: '1px solid var(--color-primary)',
          borderRadius: 'var(--radius-md)',
          marginBottom: 'var(--spacing-lg)',
        }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
            🔒 Secure Payment powered by <strong>Chapa</strong>
          </p>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            You will be redirected to Chapa's secure payment page to complete your purchase.
          </p>
        </div>

        {/* Payment Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="firstName" className={styles.label}>
                First Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`${styles.input} ${errors.firstName ? styles.error : ''}`}
                disabled={processing}
              />
              {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="lastName" className={styles.label}>
                Last Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`${styles.input} ${errors.lastName ? styles.error : ''}`}
                disabled={processing}
              />
              {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
            </div>

            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label htmlFor="email" className={styles.label}>
                Email <span className={styles.required}>*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.input} ${errors.email ? styles.error : ''}`}
                disabled={processing}
              />
              {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
            </div>

            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label htmlFor="phoneNumber" className={styles.label}>
                Phone Number <span className={styles.required}>*</span>
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="09xxxxxxxx or 07xxxxxxxx"
                className={`${styles.input} ${errors.phoneNumber ? styles.error : ''}`}
                disabled={processing}
              />
              {errors.phoneNumber && <span className={styles.errorMessage}>{errors.phoneNumber}</span>}
              <span className={styles.helpText}>Ethiopian phone number (e.g., 0912345678)</span>
            </div>
          </div>

          {errors.submit && (
            <div style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-error)',
              marginTop: 'var(--spacing-md)',
            }}>
              {errors.submit}
            </div>
          )}

          {/* Payment Methods Info */}
          <div style={{
            marginTop: 'var(--spacing-lg)',
            padding: 'var(--spacing-md)',
            backgroundColor: 'var(--color-background-secondary)',
            borderRadius: 'var(--radius-md)',
          }}>
            <p style={{ fontSize: 'var(--font-size-sm)', fontWeight: '600', marginBottom: 'var(--spacing-sm)' }}>
              Accepted Payment Methods:
            </p>
            <div style={{ display: 'flex', gap: 'var(--spacing-md)', flexWrap: 'wrap' }}>
              <span style={{ 
                padding: 'var(--spacing-xs) var(--spacing-md)', 
                backgroundColor: 'var(--color-surface)', 
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
              }}>
                💳 Credit/Debit Cards
              </span>
              <span style={{ 
                padding: 'var(--spacing-xs) var(--spacing-md)', 
                backgroundColor: 'var(--color-surface)', 
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
              }}>
                📱 Mobile Money
              </span>
              <span style={{ 
                padding: 'var(--spacing-xs) var(--spacing-md)', 
                backgroundColor: 'var(--color-surface)', 
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--font-size-sm)',
              }}>
                🏦 Bank Transfer
              </span>
            </div>
          </div>

          <div style={{ 
            display: 'flex', 
            gap: 'var(--spacing-md)', 
            marginTop: 'var(--spacing-xl)',
            justifyContent: 'flex-end',
          }}>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={processing}
              disabled={processing}
            >
              {processing ? 'Processing...' : `Pay ${event.price.toFixed(2)} ETB`}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
