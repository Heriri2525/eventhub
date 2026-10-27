'use client';

// TOPIC: Forms and controlled components - Event creation form
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/Button';
import styles from '@/styles/Form.module.css';

export default function NewEventPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Music',
    date: '',
    time: '',
    locationName: '',
    locationLat: '',
    locationLng: '',
    image: '',
    price: '',
    capacity: '',
    featured: false,
  });
  const [errors, setErrors] = useState({});

  const createMutation = useMutation({
    mutationFn: async (eventData) => {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error);
      }
      return res.json();
    },
    onSuccess: () => {
      router.push('/organiser/dashboard');
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.locationName.trim()) newErrors.locationName = 'Location name is required';
    if (!formData.locationLat) newErrors.locationLat = 'Latitude is required';
    if (!formData.locationLng) newErrors.locationLng = 'Longitude is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const eventData = {
      ...formData,
      price: parseFloat(formData.price),
      capacity: parseInt(formData.capacity),
      location: {
        name: formData.locationName,
        lat: parseFloat(formData.locationLat),
        lng: parseFloat(formData.locationLng),
      },
    };

    createMutation.mutate(eventData);
  };

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--spacing-xl)' }}>Create New Event</h1>

      <div style={{
        backgroundColor: 'var(--color-surface)',
        padding: 'var(--spacing-xl)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--color-border)',
      }}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label htmlFor="title" className={styles.label}>
                Event Title <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`${styles.input} ${errors.title ? styles.error : ''}`}
                disabled={createMutation.isPending}
              />
              {errors.title && <span className={styles.errorMessage}>{errors.title}</span>}
            </div>

            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label htmlFor="description" className={styles.label}>
                Description <span className={styles.required}>*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className={`${styles.textarea} ${errors.description ? styles.error : ''}`}
                disabled={createMutation.isPending}
              />
              {errors.description && <span className={styles.errorMessage}>{errors.description}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category" className={styles.label}>
                Category <span className={styles.required}>*</span>
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={styles.select}
                disabled={createMutation.isPending}
              >
                <option value="Music">Music</option>
                <option value="Technology">Technology</option>
                <option value="Arts">Arts</option>
                <option value="Business">Business</option>
                <option value="Sports">Sports</option>
                <option value="Food">Food</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="date" className={styles.label}>
                Date <span className={styles.required}>*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`${styles.input} ${errors.date ? styles.error : ''}`}
                disabled={createMutation.isPending}
              />
              {errors.date && <span className={styles.errorMessage}>{errors.date}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="time" className={styles.label}>
                Time <span className={styles.required}>*</span>
              </label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className={`${styles.input} ${errors.time ? styles.error : ''}`}
                disabled={createMutation.isPending}
              />
              {errors.time && <span className={styles.errorMessage}>{errors.time}</span>}
            </div>

            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label htmlFor="locationName" className={styles.label}>
                Location Name <span className={styles.required}>*</span>
              </label>
              <input
                type="text"
                id="locationName"
                name="locationName"
                value={formData.locationName}
                onChange={handleChange}
                placeholder="e.g., Millennium Hall, Addis Ababa"
                className={`${styles.input} ${errors.locationName ? styles.error : ''}`}
                disabled={createMutation.isPending}
              />
              {errors.locationName && <span className={styles.errorMessage}>{errors.locationName}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="locationLat" className={styles.label}>
                Latitude <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                step="any"
                id="locationLat"
                name="locationLat"
                value={formData.locationLat}
                onChange={handleChange}
                placeholder="e.g., 9.0320"
                className={`${styles.input} ${errors.locationLat ? styles.error : ''}`}
                disabled={createMutation.isPending}
              />
              {errors.locationLat && <span className={styles.errorMessage}>{errors.locationLat}</span>}
              <span className={styles.helpText}>Addis Ababa coordinates: 9.0320, 38.7469</span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="locationLng" className={styles.label}>
                Longitude <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                step="any"
                id="locationLng"
                name="locationLng"
                value={formData.locationLng}
                onChange={handleChange}
                placeholder="e.g., 38.7469"
                className={`${styles.input} ${errors.locationLng ? styles.error : ''}`}
                disabled={createMutation.isPending}
              />
              {errors.locationLng && <span className={styles.errorMessage}>{errors.locationLng}</span>}
            </div>

            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label htmlFor="image" className={styles.label}>
                Image URL
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className={styles.input}
                disabled={createMutation.isPending}
              />
              <span className={styles.helpText}>Optional - defaults to a placeholder if not provided</span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="price" className={styles.label}>
                Price (ETB) <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                step="0.01"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0 for free events"
                className={`${styles.input} ${errors.price ? styles.error : ''}`}
                disabled={createMutation.isPending}
              />
              {errors.price && <span className={styles.errorMessage}>{errors.price}</span>}
              <span className={styles.helpText}>Ethiopian Birr (ETB) - Use 0 for free events</span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="capacity" className={styles.label}>
                Capacity <span className={styles.required}>*</span>
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="e.g., 100"
                className={`${styles.input} ${errors.capacity ? styles.error : ''}`}
                disabled={createMutation.isPending}
              />
              {errors.capacity && <span className={styles.errorMessage}>{errors.capacity}</span>}
            </div>

            <div className={`${styles.formGroup} ${styles.formGridFull}`}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  disabled={createMutation.isPending}
                />
                <span className={styles.checkboxLabel}>Feature this event</span>
              </label>
            </div>
          </div>

          {errors.submit && (
            <div style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-error)',
            }}>
              {errors.submit}
            </div>
          )}

          {createMutation.error && (
            <div style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid var(--color-error)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-error)',
            }}>
              {createMutation.error.message}
            </div>
          )}

          <div className={styles.formActions}>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={createMutation.isPending}
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
