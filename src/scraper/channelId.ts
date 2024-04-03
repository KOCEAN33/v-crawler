export async function getYoutubeChannelId(page): Promise<string> {
  return await page.$eval('meta:nth-child(81)', (el) =>
    el.getAttribute('content'),
  );
}
