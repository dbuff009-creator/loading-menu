import React, { useState, useEffect } from 'react';

// --- НАСТРОЙКИ ---
const DROPBOX_TOKEN = 'sl.u.AGdN_-VCkRfTPhVV0u0E6U565edR0JY0tpqXGy3ldcjLvxEuJjeKS5EljbieaxRhdFQQfeoVsKy89tMLFpQBNoHGWDkKNcNlWkn5xOdtoC1_lCNRW-ELBzjDVY3VnPfqralBn7ilpqlzo_FnI2d_8XlT24sbJKL8XEy9LeQs9eazoRgPLKAfRSkUpjUVMCcZkjxg4chUVA36_iKzN6oUUGRg187Yt9X0U4vnkgdRLDILLpgC8LNMbN0ZgASjsPhzrlM1U35NQin115YAHtpSrQC7AYlXmgmhc2SD2Doijbc4PQLQIEwkmW2NqTrAMfBwZzU5hLufhh4NkhSQL_3SElWcIIcuQ1rjgtLIJfxsu_S-VZzqKybQY6LO-6RGwvcQJspUnhz68R6pcyZn33HuQ0o3xBJwH3tz6B51uiO0k_xK3WP4b73sXV4XAQnNUtVcoQymHAy87DbgGhHSI1_T0CQOviGoBhcbd6outG1m36O7Pw9QEWgJNdRS44LNbhVXcI5EJY1tO3zOsaUhQ97HwApNPf5w1Z1vS2TBNv_QjDa_vukxd-bAdyLhAlCTdyzSGoJvWKeIExj10kh5SApQlIXK6s50vn53PM8BlcjS4eeU7pDU7IVMuG9Q3_K5w3j5Rzqn6HAt92nFX0z3i4Idl40021GQ643F5CjIT6ngZHjUeP6DbmVJ5Y1KM1xjzR5DVYxB0uOjnGWtLM6pOo3U9btLRMgk9BcMzY29WIylURzTHtafiAzmuU1-OrYT_Co9TJRP4yCPiO_fBL6mQX8yMlUKTQeNNUBOe1GZxUV2sDlLUENVx1xQu_QwnIAXPSuZBM8qkQNfcKMM6vTFR1MQNMzS2qfPEJVzMiBU5YvolEWmfJ7NJMv5XoZvsXYfn6g13rBq93jN0KKwpGL28_UmTWHZtjlRcoYmhUwOmxIyKdE3tGgfapf_CpXGbu6CWczFnEQLh8Ge3KHNH4pVqn-6cjo2oTUVvsUVsKmPHzfY86n-HTgY77nzQpfbLUV_FFl0rykO5xkxvzp4V_DPuTy-fKn_FXOV5vlALx6Rv8tzjDz-YKL0XZn-PmzGSY6Mf0Es63oaiH_QsKEWO30-v-KajFuNqKW6Wyc-If3hplrtuA2BjpSu90E2XXIyfT8nWgZ3unmMfSri-B3TtoO07NYVPDb-2ZDsvjLFfCB8VH1VXkeR2dmAHHpd8JdQQvC6bUC0XhVhqjOUKF1o4PHqhNx5sd3KiQJSSmIrP-aR1jQHnaDXCnZ-p4_ReiVNGyaA0KpoIyLcvB1kU4dGtVT6D3hcT1-j45h97wLFRELC2ZpIcXmeBQNcISNZRP2VpU7wvNjBiK6d_0nHibVqsYfO0FxMprIKM8NpxjdSyYxhGx745qTcvWwElqUKH7KVhd_y3OKA_JxTSgs_WaXPwdIxZ2vS2XGw';
const FALLBACKS = [
  'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1600&q=80'
];

const App: React.FC = () => {
  const [images, setImages] = useState<string[]>(FALLBACKS);
  const [server, setServer] = useState({ map: 'LOADING...', players: 0, maxplayers: 128 });
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  // Загрузка Dropbox
  useEffect(() => {
    const loadImg = async () => {
      try {
        const r = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${DROPBOX_TOKEN}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ path: '/Photos' })
        });
        const d = await r.json();
        if (d.entries) {
          const files = d.entries.filter((f: any) => f['.tag'] === 'file').slice(0, 5);
          const urls = [];
          for (const f of files) {
            const lr = await fetch('https://api.dropboxapi.com/2/files/get_temporary_link', {
              method: 'POST',
              headers: { 'Authorization': `Bearer ${DROPBOX_TOKEN}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({ path: f.path_lower })
            });
            const ld = await lr.json();
            if (ld.link) urls.push(ld.link);
          }
          if (urls.length > 0) setImages(urls);
        }
      } catch (e) { console.error(e); }
    };
    loadImg();
  }, []);

  // Загрузка Сервера
  useEffect(() => {
    const loadSrv = async () => {
      try {
        const r = await fetch('https://api.gamemonitoring.ru/servers/11327074');
        const d = await r.json();
        if (d.response) setServer({ 
          map: d.response.map, 
          players: d.response.numplayers, 
          maxplayers: d.response.maxplayers 
        });
      } catch (e) { console.error(e); }
    };
    loadSrv();
    setInterval(loadSrv, 15000);
  }, []);

  // Слайдшоу
  useEffect(() => {
    const i = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex(p => (p + 1) % images.length);
        setFade(true);
      }, 1000);
    }, 7000);
    return () => clearInterval(i);
  }, [images]);

  return (
    <div style={{ backgroundColor: '#000' }} className="fixed inset-0 w-full h-full overflow-hidden text-white uppercase font-sans">
      
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img 
          src={images[index]} 
          style={{ transition: 'opacity 1s ease-in-out', opacity: fade ? 0.4 : 0 }}
          className="w-full h-full object-cover grayscale-[0.2]" 
          alt=""
        />
      </div>

      {/* Shadow */}
      <div className="absolute inset-y-0 left-0 w-[600px] bg-gradient-to-r from-black via-black/50 to-transparent z-10" />

      {/* UI */}
      <div className="absolute bottom-20 left-20 z-20">
        <div className="mb-10">
          <h1 className="text-7xl font-black italic tracking-tighter leading-none mb-4">
            СТРОЙ / УБИВАЙ
          </h1>
          <div className="flex items-center gap-3 opacity-30">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="text-[10px] tracking-[0.5em] font-bold">ESTABLISHING CONNECTION</span>
          </div>
        </div>

        <div className="flex gap-16 border-l-2 border-white/10 pl-10">
          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest text-white/20 font-black mb-1">PLAYERS</span>
            <span className="text-3xl font-light tabular-nums">
              {server.players} <span className="text-white/10">/</span> {server.maxplayers}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] tracking-widest text-white/20 font-black mb-1">LOCATION</span>
            <span className="text-3xl font-light tracking-tight">
              {server.map}
            </span>
          </div>
        </div>
      </div>

      {/* Noise */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] z-30" />
    </div>
  );
};

export default App;
