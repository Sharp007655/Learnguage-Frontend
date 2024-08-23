"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Home({ liff, liffError }) {
  const [idToken, setIdToken] = useState(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (liff) {
      liff.ready.then(() => {
        liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID })
          .then(() => {
            console.log("LIFF init succeeded.");
            const token = liff.getIDToken();
            console.log("ID Token:", token);
            setIdToken(token);
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
    axios.get(`https://api.learnguage.somando.jp/user/dictionary`, {
      method: "GET",
    })
    .then(response => {
      console.log('API response:', response.data);
      setData(response.data["words"]); // APIから取得したデータを状態に保存
    })
    .catch(error => {
      console.error('API call failed:', error);
    });
  }, [idToken]);

  return (
    <div>
      <h1>APIから取得したデータ</h1>
      {data}
      <ul>
        {data.map((item) => (
          <li>{item}</li> // ここでデータをHTMLに並べる
        ))}
      </ul>
    </div>
  );
}