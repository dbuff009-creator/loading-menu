import { useState, useEffect } from 'react';

const ACCESS_TOKEN = 'sl.u.AGdN_-VCkRfTPhVV0u0E6U565edR0JY0tpqXGy3ldcjLvxEuJjeKS5EljbieaxRhdFQQfeoVsKy89tMLFpQBNoHGWDkKNcNlWkn5xOdtoC1_lCNRW-ELBzjDVY3VnPfqralBn7ilpqlzo_FnI2d_8XlT24sbJKL8XEy9LeQs9eazoRgPLKAfRSkUpjUVMCcZkjxg4chUVA36_iKzN6oUUGRg187Yt9X0U4vnkgdRLDILLpgC8LNMbN0ZgASjsPhzrlM1U35NQin115YAHtpSrQC7AYlXmgmhc2SD2Doijbc4PQLQIEwkmW2NqTrAMfBwZzU5hLufhh4NkhSQL_3SElWcIIcuQ1rjgtLIJfxsu_S-VZzqKybQY6LO-6RGwvcQJspUnhz68R6pcyZn33HuQ0o3xBJwH3tz6B51uiO0k_xK3WP4b73sXV4XAQnNUtVcoQymHAy87DbgGhHSI1_T0CQOviGoBhcbd6outG1m36O7Pw9QEWgJNdRS44LNbhVXcI5EJY1tO3zOsaUhQ97HwApNPf5w1Z1vS2TBNv_QjDa_vukxd-bAdyLhAlCTdyzSGoJvWKeIExj10kh5SApQlIXK6s50vn53PM8BlcjS4eeU7pDU7IVMuG9Q3_K5w3j5Rzqn6HAt92nFX0z3i4Idl40021GQ643F5CjIT6ngZHjUeP6DbmVJ5Y1KM1xjzR5DVYxB0uOjnGWtLM6pOo3U9btLRMgk9BcMzY29WIylURzTHtafiAzmuU1-OrYT_Co9TJRP4yCPiO_fBL6mQX8yMlUKTQeNNUBOe1GZxUV2sDlLUENVx1xQu_QwnIAXPSuZBM8qkQNfcKMM6vTFR1MQNMzS2qfPEJVzMiBU5YvolEWmfJ7NJMv5XoZvsXYfn6g13rBq93jN0KKwpGL28_UmTWHZtjlRcoYmhUwOmxIyKdE3tGgfapf_CpXGbu6CWczFnEQLh8Ge3KHNH4pVqn-6cjo2oTUVvsUVsKmPHzfY86n-HTgY77nzQpfbLUV_FFl0rykO5xkxvzp4V_DPuTy-fKn_FXOV5vlALx6Rv8tzjDz-YKL0XZn-PmzGSY6Mf0Es63oaiH_QsKEWO30-v-KajFuNqKW6Wyc-If3hplrtuA2BjpSu90E2XXIyfT8nWgZ3unmMfSri-B3TtoO07NYVPDb-2ZDsvjLFfCB8VH1VXkeR2dmAHHpd8JdQQvC6bUC0XhVhqjOUKF1o4PHqhNx5sd3KiQJSSmIrP-aR1jQHnaDXCnZ-p4_ReiVNGyaA0KpoIyLcvB1kU4dGtVT6D3hcT1-j45h97wLFRELC2ZpIcXmeBQNcISNZRP2VpU7wvNjBiK6d_0nHibVqsYfO0FxMprIKM8NpxjdSyYxhGx745qTcvWwElqUKH7KVhd_y3OKA_JxTSgs_WaXPwdIxZ2vS2XGw';
const FOLDER_PATH = '/Photos';

export const useDropboxImages = () => {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('https://api.dropboxapi.com/2/files/list_folder', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ path: FOLDER_PATH })
        });

        const data = await response.json();
        
        if (data.error) {
          console.error('Dropbox API Error:', data.error);
          setLoading(false);
          return;
        }

        const entries = data.entries.filter((file: any) => file['.tag'] === 'file');
        const links: string[] = [];

        for (let file of entries) {
          const linkResponse = await fetch('https://api.dropboxapi.com/2/files/get_temporary_link', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${ACCESS_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ path: file.path_lower })
          });
          const linkData = await linkResponse.json();
          if (linkData.link) {
            links.push(linkData.link);
          }
        }

        setImages(links);
      } catch (error) {
        console.error('Error fetching Dropbox images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  return { images, loading };
};
