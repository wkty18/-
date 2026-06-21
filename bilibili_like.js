const { chromium } = require('playwright');

(async () => {
  // 使用系统已安装的 Edge 浏览器
  const browser = await chromium.launch({
    channel: 'msedge',
    headless: false,  // 可见模式，方便你看到操作过程
  });

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 }
  });
  const page = await context.newPage();

  console.log('1. 打开 Bilibili...');
  await page.goto('https://www.bilibili.com/', { waitUntil: 'networkidle' });
  console.log('   Bilibili 已打开');

  // 在搜索框输入 "我的世界"
  console.log('2. 搜索 "我的世界"...');
  const searchInput = page.locator('input[placeholder*="搜索"]').first();
  await searchInput.waitFor({ state: 'visible', timeout: 10000 });
  await searchInput.click();
  await searchInput.fill('我的世界');
  await page.keyboard.press('Enter');
  console.log('   已搜索');

  // 等待搜索结果加载
  await page.waitForTimeout(2000);

  // 点击 "最多播放" 排序，获取最热门的视频
  console.log('3. 按最多播放排序...');
  // 寻找排序选项
  const sortButtons = page.locator('text=最多播放');
  try {
    await sortButtons.first().click({ timeout: 5000 });
    console.log('   已切换到最多播放');
  } catch (e) {
    console.log('   排序按钮未找到，尝试直接选择第一个视频');
  }

  await page.waitForTimeout(2000);

  // 点击第一个视频
  console.log('4. 打开最热门的视频...');
  const firstVideo = page.locator('.video-list-item, .bili-video-card, a[href*="video/BV"]').first();
  try {
    await firstVideo.click({ timeout: 10000 });
    console.log('   视频已打开');
  } catch (e) {
    // 尝试其他选择器
    const videoLink = page.locator('a[href*="/video/BV"]').first();
    await videoLink.click({ timeout: 10000 });
    console.log('   视频已打开 (备选方案)');
  }

  // 等待视频页面加载
  await page.waitForTimeout(3000);
  await page.waitForLoadState('networkidle');

  // 点赞
  console.log('5. 点赞视频...');
  // B站点赞按钮的常见选择器
  const likeButton = page.locator('.video-like, .video-toolbar .ops span, [class*="like"]').first();
  try {
    // 先检查是否已点赞
    const likeActive = await page.locator('[class*="like"][class*="active"], .video-like.on').count();
    if (likeActive > 0) {
      console.log('   已经点过赞了！');
    } else {
      await likeButton.click({ timeout: 5000 });
      console.log('   点赞成功！');
    }
  } catch (e) {
    console.log('   点赞按钮可能需要登录，尝试其他方式...');
    // 尝试用坐标点击（B站点赞按钮通常在视频下方左侧）
    try {
      await page.locator('.ops span').first().click({ timeout: 5000 });
      console.log('   点赞成功！');
    } catch (e2) {
      console.log('   可能需要在浏览器中手动登录后点赞');
      console.log('   浏览器将保持打开，请在浏览器中完成点赞操作');
    }
  }

  console.log('\n完成！浏览器窗口保持打开，可以查看结果。');
  // 保持浏览器打开，不自动关闭
  // await browser.close();
})();
