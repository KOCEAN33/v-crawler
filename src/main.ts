import './env';
import { log, PuppeteerCrawler } from 'crawlee';
import { db } from './database';

import { newVtuberRouter } from './routes/new-vtuber.router';
import { getDescRouter } from './routes/get-desc.router';
import { getStreamsToUpdate } from './repository/streams.repository';
import { getNewVtubers } from './repository/vtubers.repository';

// 신규 vTuber 크롤링 런처
const newVtuberCrawler = new PuppeteerCrawler({
  requestHandler: newVtuberRouter,
  launchContext: { launchOptions: { args: ['--lang=ja'] } },
  headless: false,
  autoscaledPoolOptions: {
    isFinishedFunction: () => finishCrawling(),
  },
  browserPoolOptions: {
    fingerprintOptions: {
      fingerprintGeneratorOptions: {
        locales: ['ja-JP'],
      },
    },
  },
});

async function finishCrawling() {
  const newChannels = await getNewVtubers();
  const newChannelUrls = newChannels.map((data) => data.url);
  log.info(`Got ${newChannelUrls.length} V-Tubers`);
  if (newChannelUrls.length == 0) {
    await db.destroy();
    return true;
  }
  await newVtuberCrawler.addRequests(newChannelUrls);
  return false;
}

// 라이브 방송 상세 정보 크롤링 런처
const getDescCrawler = new PuppeteerCrawler({
  requestHandler: getDescRouter,
  headless: true,
  autoscaledPoolOptions: {
    isFinishedFunction: () => finishGetDesc(),
  },
  launchContext: { launchOptions: { args: ['--lang=ja'] } },
  browserPoolOptions: {
    fingerprintOptions: {
      fingerprintGeneratorOptions: {
        locales: ['ja-JP'],
      },
    },
  },
});

const getStreams = async (): Promise<string[]> => {
  const streams = await getStreamsToUpdate();
  log.info(`Got ${streams.length} streams with no data`);
  return streams.map(
    (stream) => `https://youtube.com/watch?v=${stream.stream_id}`,
  );
};

async function finishGetDesc() {
  const streams = await getStreams();
  if (streams.length === 0) {
    await db.destroy();
    return true;
  }
  await getDescCrawler.addRequests(streams);
  return false;
}

// 인수 ( mode ) 수신
const [, , ...args] = process.argv;

// 인수 파싱 로직
interface Options {
  mode?: string;
}
const options: Options = {};
for (const arg of args) {
  const [key, value] = arg.split('=');
  options[key.replace(/^--/, '')] = value;
}

if (options.mode === '1') {
  await newVtuberCrawler.run();
} else if (options.mode === '2') {
  await getDescCrawler.run();
}
