import Parser from 'rss-parser';
import fs from 'fs/promises';

const parser = new Parser();

// ---------------------------
// CONFIG
// ---------------------------
const SOURCES = [
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', weight: 1.4 },
  { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', weight: 1.3 },
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', weight: 1.3 },
  { name: 'Wired', url: 'https://www.wired.com/feed/rss', weight: 1.2 },
  { name: 'Engadget', url: 'https://www.engadget.com/rss.xml', weight: 1.2 },
  { name: 'CNET News', url: 'https://www.cnet.com/rss/news/', weight: 1.1 },

  { name: 'ZDNet News', url: 'https://www.zdnet.com/news/rss.xml', weight: 1.1 },
  { name: 'The Next Web', url: 'https://thenextweb.com/feed/', weight: 1.0 },
];

const BRANDS = [
   // Big Tech / Platform
  'Apple', 'Microsoft', 'Google', 'Alphabet', 'Amazon', 'Meta', 'Facebook',
  'Samsung', 'Sony', 'LG', 'Huawei', 'Xiaomi', 'Tencent', 'Alibaba',
  'Baidu', 'ByteDance', 'TikTok',

  // Chip makers
  'Nvidia', 'AMD', 'Intel', 'Qualcomm', 'ARM', 'MediaTek', 'Broadcom',
  'TSMC', 'Samsung Foundry', 'GlobalFoundries', 'ASML', 'Micron',
  'SK Hynix', 'Western Digital', 'Seagate',

  // PC & device makers
  'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Razer', 'Alienware',
  'Framework', 'System76', 'Gigabyte', 'ASRock', 'Supermicro',

  // Phones & wearables
  'OnePlus', 'Oppo', 'Vivo', 'Realme', 'Honor', 'Motorola', 'Nokia',
  'Nothing', 'Fairphone', 'Garmin', 'Fitbit', 'Whoop', 'Oura',

  // Gaming
  'Sony PlayStation', 'Xbox', 'Nintendo', 'Valve', 'Steam', 'Epic Games',
  'Unity', 'Unreal Engine', 'Roblox', 'Riot Games', 'Activision',
  'Blizzard', 'EA', 'Ubisoft', 'Take-Two', 'Rockstar',

  // AI & ML
  'OpenAI', 'Anthropic', 'Google DeepMind', 'DeepMind', 'Mistral',
  'Cohere', 'Hugging Face', 'Stability AI', 'Midjourney', 'xAI',
  'Perplexity', 'Character.AI', 'Inflection', 'Adept', 'Scale AI',
  
  // Cloud & enterprise
  'AWS', 'Azure', 'Google Cloud', 'Oracle', 'IBM', 'Salesforce', 'SAP',
  'VMware', 'Broadcom', 'Cisco', 'Juniper', 'Cloudflare', 'Akamai',
  'Databricks', 'Snowflake', 'MongoDB', 'Elastic', 'Red Hat', 'Canonical',

  // Software & tools
  'Adobe', 'Autodesk', 'Figma', 'Canva', 'Notion', 'Slack', 'Zoom',
  'Atlassian', 'GitHub', 'GitLab', 'JetBrains', 'Docker', 'Kubernetes',
  'Linux Foundation', 'Mozilla',

  // EV & transportation
  'Tesla', 'Rivian', 'Lucid', 'Ford', 'GM', 'Toyota', 'Volkswagen',
  'BMW', 'Mercedes-Benz', 'Hyundai', 'Kia', 'BYD', 'NIO', 'Waymo',
  'Cruise', 'Rimac',

  // Social & media
  'X', 'Twitter', 'Reddit', 'Snap', 'Pinterest', 'LinkedIn', 'Discord',
  'Spotify', 'Netflix', 'Disney', 'YouTube', 'Twitch',

  // Networking & telecom
  'Qualcomm', 'Ericsson', 'Nokia Networks', 'Verizon', 'AT&T', 'T-Mobile',
  'Vodafone', 'Deutsche Telekom', 'Starlink', 'SpaceX',

  // Security
  'CrowdStrike', 'Palo Alto Networks', 'Fortinet', 'SentinelOne',
  'Mandiant', 'Okta', '1Password', 'LastPass',

  // Emerging / robotics / quantum
  'Boston Dynamics', 'Figure', 'Agility Robotics', 'IBM Quantum',
  'IonQ', 'Rigetti', 'D-Wave', 'PsiQuantum'

];

const HARDWARE = [
  // Computing devices
  'smartphone', 'laptop', 'tablet', 'desktop', 'PC', 'Mac', 'Chromebook',
  'workstation', 'server', 'mini PC', 'all-in-one',

  // Chips & components
  'CPU', 'GPU', 'processor', 'chip', 'SoC', 'silicon', 'NPU', 'TPU',
  'RAM', 'memory', 'SSD', 'HDD', 'storage', 'motherboard', 'PSU',
  'cooler', 'thermal paste', 'overclock', 'benchmark',

  // Displays & audio
  'display', 'monitor', 'screen', 'OLED', 'LCD', 'Mini-LED', 'MicroLED',
  'refresh rate', 'resolution', '8K', '4K', 'HDR', 'touchscreen',
  'speaker', 'headphones', 'earbuds', 'soundbar', 'microphone',

  // Mobile & wearables
  'wearable', 'smartwatch', 'fitness tracker', 'AR glasses', 'VR headset',
  'mixed reality', 'controller', 'stylus', 'charger', 'power bank',
  
  // Cameras & imaging
  'camera', 'lens', 'sensor', 'drone', 'gimbal', 'webcam', 'action cam',

  // Gaming
  'console', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Steam Deck',
  'handheld', 'gamepad', 'gaming PC', 'ray tracing', 'DLSS', 'FSR',

  // Connectivity
  'router', 'Wi-Fi', 'Wi-Fi 7', '5G', '6G', 'Bluetooth', 'USB-C',
  'Thunderbolt', 'HDMI', 'Ethernet', 'modem', 'antenna', 'NFC',

  // Power & battery
  'battery', 'fast charging', 'wireless charging', 'power adapter',
  'solar', 'energy', 'efficiency',

  // Smart home & IoT
  'smart home', 'smart speaker', 'smart display', 'smart bulb',
  'thermostat', 'doorbell', 'security camera', 'robot vacuum',
  'IoT', 'Matter', 'Thread', 'Zigbee', 'Z-Wave',
  
  // AI & software
  'AI', 'machine learning', 'deep learning', 'LLM', 'chatbot',
  'generative AI', 'AI model', 'neural network', 'training', 'inference',
  'GPU cluster', 'data center', 'cloud', 'edge computing',

  // Operating systems & platforms
  'operating system', 'OS', 'iOS', 'Android', 'Windows', 'macOS', 'Linux',
  'ChromeOS', 'firmware', 'update', 'patch', 'beta',

  // Software & tools
  'software', 'app', 'application', 'platform', 'API', 'SDK',
  'browser', 'Chrome', 'Safari', 'Firefox', 'Edge',
  'Photoshop', 'Premiere', 'DaVinci Resolve', 'Final Cut',

  // Emerging tech
  'quantum', 'quantum computing', 'robotics', 'autonomous', 'self-driving',
  'EV', 'electric vehicle', 'charging network', 'solid-state battery'
  
];

// ---------------------------
// HELPERS
// ---------------------------
function countTerms(text, terms) {
  const lower = text.toLowerCase();
  const counts = {};
  for (const term of terms) {
    const t = term.toLowerCase();
    let idx = lower.indexOf(t);
    let count = 0;
    while (idx !== -1) {
      count++;
      idx = lower.indexOf(t, idx + t.length);
    }
    if (count) counts[term] = count;
  }
  return counts;
}

function analyzeArticle(article) {
  const text = `${article.title} ${article.description || ''}`;
  const brandCounts = countTerms(text, BRANDS);
  const hardwareCounts = countTerms(text, HARDWARE);

  const brandMatches = Object.values(brandCounts).reduce((a, b) => a + b, 0);
  const hardwareMatches = Object.values(hardwareCounts).reduce((a, b) => a + b, 0);

  const pubDate = article.date ? new Date(article.date) : new Date();
  const daysOld = Math.max(0, (Date.now() - pubDate.getTime()) / 86400000);
  const recencyScore = Math.max(0, 30 - daysOld) / 30;

  const score =
    brandMatches * 5 +
    hardwareMatches * 3 +
    recencyScore * 10 +
    (article.sourceWeight || 1);

  return { ...article, brandCounts, hardwareCounts, brandMatches, hardwareMatches, score };
}

// ---------------------------
// MAIN
// ---------------------------
async function main() {
  console.log('Fetching feeds...');
  const failed = [];
  const articles = [];

  for (const source of SOURCES) {
    try {
      const feed = await parser.parseURL(source.url);
      for (const item of feed.items.slice(0, 15)) {
        articles.push({
          title: item.title || 'Untitled',
          link: item.link || '',
          date: item.pubDate || item.isoDate || new Date().toISOString(),
          description: (item.contentSnippet || item.content || '')
            .replace(/<[^>]+>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 500),
          source: source.name,
          sourceWeight: source.weight
        });
      }
      console.log(`✓ ${source.name} (${feed.items.length} items)`);
    } catch (err) {
      console.warn(`✗ ${source.name}: ${err.message}`);
      failed.push(source.name);
    }
  }

  // Deduplicate
  const seen = new Set();
  const unique = articles.filter(a => {
    const key = a.link || a.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const analyzed = unique.map(analyzeArticle);

  // Build summary
  const brandTotals = {};
  const hardwareTotals = {};
  analyzed.forEach(a => {
    Object.entries(a.brandCounts).forEach(([k, v]) => {
      brandTotals[k] = (brandTotals[k] || 0) + v;
    });
    Object.entries(a.hardwareCounts).forEach(([k, v]) => {
      hardwareTotals[k] = (hardwareTotals[k] || 0) + v;
    });
  });

  const topBrands = Object.entries(brandTotals).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const topHardware = Object.entries(hardwareTotals).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const top5 = [...analyzed].sort((a, b) => b.score - a.score).slice(0, 5);

  const output = {
    lastUpdated: new Date().toISOString(),
    summary: {
      topBrands,
      topHardware,
      totalArticles: analyzed.length,
      failedSources: failed
    },
    top5,
    articles: analyzed
  };

  await fs.writeFile('data.json', JSON.stringify(output, null, 2));
  console.log(`\n✅ Wrote data.json (${analyzed.length} articles, ${failed.length} failures)`);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(0);
});
