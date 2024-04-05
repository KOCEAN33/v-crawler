export const extractVideoId = (youtubeLink: string) => {
  const url = new URL(youtubeLink);
  return url.searchParams.get('v');
};
