import puppeteer from 'puppeteer-core';
import path from 'path';

async function runBrowserVerification() {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 1000 });
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

    console.log('1. Page loaded successfully. Page title:', await page.title());

    // 1. Generate a Recursive Backtracker Maze
    console.log('2. Clicking Generate Maze...');
    const generateBtn = await page.waitForSelector('button::-p-text(Generate)');
    await generateBtn.click();
    await new Promise((r) => setTimeout(r, 300));

    // 2. Select Instant speed for quick comparison runs
    console.log('3. Selecting Instant speed...');
    const instantBtn = await page.waitForSelector('.btn-pill::-p-text(Instant)');
    await instantBtn.click();
    await new Promise((r) => setTimeout(r, 200));

    // 3. Run A* on the maze
    console.log('4. Running A* on the maze...');
    const runBtn = await page.waitForSelector('.btn-run');
    await runBtn.click();
    await new Promise((r) => setTimeout(r, 500));

    // Capture A* solved screenshot
    const artifactDir = 'C:\\Users\\Dhairya\\.gemini\\antigravity\\brain\\e02865c4-f265-41f1-89f9-391408d64925';
    await page.screenshot({ path: path.join(artifactDir, 'astar_maze_solved.png') });
    console.log('Saved astar_maze_solved.png');

    // 4. Select BFS and run on the exact same maze
    console.log('5. Running BFS on the exact same maze...');
    await page.select('#algo-select', 'bfs');
    await new Promise((r) => setTimeout(r, 200));
    const runBtnBfs = await page.waitForSelector('.btn-run');
    await runBtnBfs.click();
    await new Promise((r) => setTimeout(r, 500));

    // 5. Select Dijkstra and run on the exact same maze
    console.log('6. Running Dijkstra on the exact same maze...');
    await page.select('#algo-select', 'dijkstra');
    await new Promise((r) => setTimeout(r, 200));
    const runBtnDijkstra = await page.waitForSelector('.btn-run');
    await runBtnDijkstra.click();
    await new Promise((r) => setTimeout(r, 500));

    // 6. Select DFS and run on the exact same maze
    console.log('7. Running DFS on the exact same maze...');
    await page.select('#algo-select', 'dfs');
    await new Promise((r) => setTimeout(r, 200));
    const runBtnDfs = await page.waitForSelector('.btn-run');
    await runBtnDfs.click();
    await new Promise((r) => setTimeout(r, 500));

    // Capture comparison table screenshot
    await page.screenshot({ path: path.join(artifactDir, 'comparison_table_verified.png') });
    console.log('Saved comparison_table_verified.png');

    // 7. Mobile viewport check at 390px
    console.log('8. Testing mobile viewport at 390x844...');
    await page.setViewport({ width: 390, height: 844 });
    await page.screenshot({ path: path.join(artifactDir, 'mobile_verified.png') });
    console.log('Saved mobile_verified.png');

    console.log('Browser verification completed successfully!');
  } finally {
    await browser.close();
  }
}

runBrowserVerification().catch((err) => {
  console.error('Browser verification failed:', err);
  process.exit(1);
});
