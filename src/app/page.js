"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home({ liff, liffError }) {
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (liff) {
      liff.ready.then(() => {
        liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID })
          .then(() => {
            console.log("LIFF init succeeded.");
            const token = liff.getAccessToken();
            console.log("Access Token:", token);
            setAccessToken(token);
          })
          .catch((error) => {
            console.error('LIFF init failed', error);
          });
      }).catch((error) => {
        console.error('LIFF ready failed', error);
      });
    }
  }, [liff]);

  useEffect(() => {
    if (accessToken) {
      axios.get('https://api.example.com/endpoint', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      })
      .then(response => {
        console.log('API response:', response.data);
      })
      .catch(error => {
        console.error('API call failed:', error);
      });
    }
  }, [accessToken]);

  return (
    <div>
      {/* ページのコンテンツ */}
    </div>
  );
}