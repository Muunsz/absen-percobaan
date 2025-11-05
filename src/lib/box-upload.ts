import axios from 'axios';

const BOX_API_UPLOAD_URL = 'https://upload.box.com/api/2.0/files/content';
const BOX_API_GET_FILE_URL = 'https://api.box.com/2.0/files';

export async function uploadFileToBox(file: File, folderId = '348020519152'): Promise<string> {
  const token = process.env.BOX_DEVELOPER_TOKEN;
  if (!token) {
    throw new Error('BOX_DEVELOPER_TOKEN tidak ditemukan di .env.local');
  }

  const formData = new FormData();
  formData.append('attributes', JSON.stringify({ name: file.name, parent: { id: folderId } }));
  formData.append('file', file);

  try {
    const uploadRes = await axios.post(BOX_API_UPLOAD_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    const fileId = uploadRes.data.entries[0].id;

    // Update file supaya bisa diakses publik (shared link)
    const sharedLinkRes = await axios.put(
      `${BOX_API_GET_FILE_URL}/${fileId}`,
      {
        shared_link: {
          access: 'open', // siapa saja bisa lihat
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const publicUrl = sharedLinkRes.data.shared_link.url;
    return publicUrl;
  } catch (error: any) {
    console.error('Box upload error:', error.response?.data || error.message);
    throw new Error(`Gagal upload ke Box: ${error.response?.data?.message || error.message}`);
  }
}