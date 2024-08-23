"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';
import liff from '@line/liff';

export default function Home() {
  const [idToken, setIdToken] = useState(null);
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // liff の初期化
    liff.init({ liffId: process.env.NEXT_PUBLIC_LIFF_ID })
      .then(() => {
        console.log("LIFF init succeeded.");
        if (liff.isLoggedIn()) {
          const token = liff.getIDToken();
          console.log("ID Token:", token);
          setIdToken(token);  // idTokenが更新される
        } else {
          liff.login();
        }
      })
      .catch((error) => {
        console.error('LIFF init failed', error);
      });
  }, []);

  // idTokenが取得されたらAPIリクエストを実行
  useEffect(() => {
    if (idToken) {  // idTokenがnullではないことを確認
      axios.get(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/dictionary?idToken=${idToken}`)
        .then(response => {
          console.log('API response:', response.data.words);
          setData(response.data.words);  // APIから取得したデータを状態に保存
        })
        .catch(error => {
          console.error('API call failed:', error);
        });
    }
  }, [idToken]);

  const filteredData = data.filter(item => 
    item.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.mean.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main>
      <h1>辞書</h1>
      <input 
        type="text" 
        placeholder="検索..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className='wordInput'
      />
      <div>
        {filteredData.map((item) => 
          <div className='wordBlock' id={item["word"]}>
            <h2 className='wordText'>{item["word"]}</h2>
            <p className='wordRead'>{item["read"]}</p>
            <p className='wordMean'>{item["mean"]}</p>
          </div>
        )}
      </div>
    </main>
  );
}