# V-Tuber Streams Crawling Project

## Mode
```bash
pnpm start:prod --mode=1
pnpm start:prod --mode=2
```
mode 1 : Get new v-tubers from database, and get all streams

mode 2 : Get description and metadata from youtube. stream duration, live date and played game information

## TODO
- Twitch Support
  - Due to end of Twitch service in Korea, I Can not crawl or develop twitch crawling without VPN.
- Accurate metadata
  - YouTube doesn't show exactly the time of the stream. to get the accurate time data we need to use Youtube API