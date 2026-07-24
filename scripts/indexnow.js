import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const key = "7f7f0c5a3b2b4e859b8a07c3905c10a4";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://argosnotes.com";
const host = siteUrl.replace(/^https?:\/\//, '');

async function submitUrls() {
  try {
    const postsFilePath = path.join(__dirname, '../.velite/posts.json');
    if (!fs.existsSync(postsFilePath)) {
      console.log('[IndexNow] posts.json not found. Make sure velite is built.');
      return;
    }

    const postsData = JSON.parse(fs.readFileSync(postsFilePath, 'utf8'));
    const urls = [
      `${siteUrl}/`,
      `${siteUrl}/about`
    ];

    postsData.forEach(post => {
      if (post.slug) {
        urls.push(`${siteUrl}/posts/${post.slug}`);
      }
    });

    console.log(`[IndexNow] Submitting ${urls.length} URLs to IndexNow for host: ${host}...`);

    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        host: host,
        key: key,
        keyLocation: `${siteUrl}/${key}.txt`,
        urlList: urls
      })
    });

    if (response.ok) {
      console.log('[IndexNow] Submission successful!');
    } else {
      const errorText = await response.text();
      console.error(`[IndexNow] Submission failed: ${response.status} ${response.statusText}`, errorText);
    }
  } catch (error) {
    console.error('[IndexNow] Error during IndexNow submission:', error);
  }
}

submitUrls();
