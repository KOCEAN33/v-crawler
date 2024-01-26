/*
* 이 과정은 새로 추가된 VTuber의 유튜브 프로필 데이터를 가져옵니다.
* ChannelId, 설명, 이름, 프로필 사진등
* */

export async function newVtuberScrapeProcess(page, log) {

    // await puppeteerUtils.infiniteScroll(page, {scrollDownAndUp: true})
    await page.waitForSelector('#channel-header')
    const channelId = await page.$eval('meta:nth-child(81)', el => el.getAttribute('content'))
    const data = await getProfile(page)


    log.info(JSON.stringify(channelId))
    log.info(JSON.stringify(data))
}

interface ChannelHeader {
    image: string
    name: string,
    handle: string,
    description: string,
}

async function getProfile(page) {
    return await page.$$eval('#channel-header', ($posts) => {
        const scrapedData: ChannelHeader[] = [];

        $posts.forEach((post) => {
            return scrapedData.push({
                image: post.querySelector('#avatar #img').src,
                name: post.querySelector('.ytd-channel-name #text').textContent.trim(),
                handle: post.querySelector('#channel-handle').textContent.trim(),
                description: post.querySelector('.ytd-channel-tagline-renderer').textContent.trim()
            })
        })

        return scrapedData
    })

}

