import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setPreviewConfig } from '../features/previewSlice';

const PreviewListener: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Allow messages from our own domain (local dev)
      if (event.data && event.data.type === 'MANA_VYAPAR_WEBSITE_PREVIEW') {
        console.log('Received preview data:', event.data.config);
        dispatch(setPreviewConfig(event.data.config));
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [dispatch]);

  return null; // This component doesn't render anything
};

export default PreviewListener;
