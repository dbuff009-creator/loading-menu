import { useState, useEffect } from 'react';

interface ServerData {
  name: string;
  map: string;
  players: number;
  maxPlayers: number;
  status: 'online' | 'offline';
}

export const useServerData = () => {
  const [data, setData] = useState<ServerData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const response = await fetch('https://api.gamemonitoring.ru/servers/11327074');
      const json = await response.json();
      
      const s = json.response;
      if (s) {
        setData({
          name: s.name,
          map: s.map,
          players: s.numplayers,
          maxPlayers: s.maxplayers,
          status: s.status ? 'online' : 'offline'
        });
      }
    } catch (error) {
      console.error('Error fetching server data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return { data, loading };
};
