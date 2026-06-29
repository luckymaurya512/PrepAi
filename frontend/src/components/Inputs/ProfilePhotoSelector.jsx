import { useRef, useState } from 'react';
import { HiCamera, HiUser } from 'react-icons/hi';
import { getInitials } from '../../utils/helper';
import { fileToBase64, validateImageFile } from '../../utils/uploadImage';
import toast from 'react-hot-toast';

const ProfilePhotoSelector = ({ name = '', imageUrl, onImageChange }) => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(imageUrl || null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validation = validateImageFile(file, 2);
    if (!validation.valid) {
      toast.error(validation.error);
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      setPreview(base64);
      onImageChange(base64);
    } catch {
      toast.error('Failed to process image. Please try again.');
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setPreview(null);
    onImageChange(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          position: 'relative',
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          cursor: 'pointer',
          border: '2px solid var(--color-border)',
          overflow: 'hidden',
          background: preview ? 'transparent' : 'rgba(99,102,241,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color var(--transition-fast)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-primary)';
          e.currentTarget.querySelector('.overlay').style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-border)';
          e.currentTarget.querySelector('.overlay').style.opacity = '0';
        }}
      >
        {preview ? (
          <img src={preview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            {name ? (
              <span style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--color-primary-light)' }}>
                {getInitials(name)}
              </span>
            ) : (
              <HiUser size={36} color="var(--color-text-muted)" />
            )}
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="overlay"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            opacity: 0,
            transition: 'opacity var(--transition-fast)',
          }}
        >
          <HiCamera size={20} color="white" />
          <span style={{ fontSize: '0.65rem', color: 'white', fontWeight: 500 }}>Change</span>
        </div>
      </div>

      {preview && (
        <button
          type="button"
          onClick={handleRemove}
          style={{
            fontSize: '0.75rem',
            color: 'var(--color-danger)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          Remove photo
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        id="profile-photo-input"
      />

      <p style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', textAlign: 'center' }}>
        Click to upload a photo (max 2MB)
      </p>
    </div>
  );
};

export default ProfilePhotoSelector;
