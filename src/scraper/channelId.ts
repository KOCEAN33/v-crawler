// 프로필 페이지에서만 작동함
export async function getYoutubeChannelId(page): Promise<string> {
  return await page.$eval('meta:nth-child(81)', (el) =>
    el.getAttribute('content'),
  );
}
