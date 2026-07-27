const fs = require('fs');
const path = require('path');

// Recursively find all mdx files in content/posts
function getAllMdxFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllMdxFiles(fullPath, arrayOfFiles);
    } else if (file.endsWith('.mdx')) {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

const velitePosts = JSON.parse(fs.readFileSync('./.velite/posts.json', 'utf8'));

// Map slug to post details
const postMap = new Map();
velitePosts.forEach(p => {
  postMap.set(p.slug, p);
});

const mdxFiles = getAllMdxFiles(path.resolve('./content/posts'));

const allPosts = [];

mdxFiles.forEach(file => {
  const normalizedFile = file.replace(/\\/g, '/');
  // extract slug from filename or velite match
  const slug = path.basename(file, '.mdx');
  const veliteData = postMap.get(slug);

  if (veliteData) {
    allPosts.push({
      title: veliteData.title,
      slug: veliteData.slug,
      category: veliteData.category || '기타',
      date: veliteData.date || '',
      description: veliteData.description || '',
      filePath: normalizedFile
    });
  } else {
    allPosts.push({
      title: slug,
      slug: slug,
      category: '기타',
      date: '',
      description: '',
      filePath: normalizedFile
    });
  }
});

// Sort by date descending
allPosts.sort((a, b) => b.date.localeCompare(a.date));

// Group by category
const byCategory = {};
allPosts.forEach(p => {
  const cat = p.category;
  if (!byCategory[cat]) byCategory[cat] = [];
  byCategory[cat].push(p);
});

let md = `# 📚 보수주의자의 정원 - 전체 포스트 목록\n\n`;
md += `> 작성된 총 포스트 수: **${allPosts.length}개**\n\n`;

const categories = Object.keys(byCategory).sort();

categories.forEach(cat => {
  const list = byCategory[cat];
  md += `## 📁 ${cat} (${list.length}개)\n\n`;
  list.forEach(p => {
    const dateStr = p.date ? `\`${p.date}\`` : '';
    const fileUrl = `file:///${p.filePath}`;
    md += `- ${dateStr} [${p.title}](${fileUrl}) - \`${p.slug}\`\n`;
    if (p.description) {
      md += `  - *${p.description}*\n`;
    }
  });
  md += '\n';
});

fs.writeFileSync('./POSTS_LIST.md', md, 'utf8');
console.log(`Successfully generated POSTS_LIST.md with ${allPosts.length} posts.`);
