export const extractVideoId = (youtubeLink: string): string => {
  const url = new URL(youtubeLink);
  return url.searchParams.get('v') as string;
};

/*
2가지 형태의 날짜 형식이 존재
  1. 9 時間前にライブ配信 (24시간 이내)
  2. 2024/04/08 にライブ配信 (24시간 이후)
  3. '' (방송중, 예약 인 경우)
*/
export function convertToCurrentTime(dateString: string | null): Date | null {
  if (dateString === '') {
    return null;
  }

  if (dateString === null) {
    return null;
  }

  const currentDate = new Date();

  if (dateString.includes('時間前')) {
    const hours = parseInt(dateString.match(/\d+/)?.[0] ?? '0', 10);
    return new Date(currentDate.getTime() - hours * 60 * 60 * 1000);
  } else if (dateString.includes('/')) {
    const [date] = dateString.split(' ');
    const [year, month, day] = date.split('/');
    return new Date(Number(year), Number(month) - 1, Number(day));
  }

  return null;
}

export function convertTimeToSeconds(timeString: string): number | null {
  // 시간 문자열을 ':' 기호로 분할하여 배열로 만듦
  if (timeString === '') {
    return null;
  }

  const timeParts = timeString.split(':');

  let seconds = 0;

  // 배열의 길이에 따라 시, 분, 초를 계산하여 총 초 단위로 변환
  if (timeParts.length === 3) {
    // 시, 분, 초가 모두 있는 경우
    const hours = parseInt(timeParts[0], 10);
    const minutes = parseInt(timeParts[1], 10);
    const secs = parseInt(timeParts[2], 10);
    seconds = hours * 3600 + minutes * 60 + secs;
  } else if (timeParts.length === 2) {
    // 분, 초만 있는 경우
    const minutes = parseInt(timeParts[0], 10);
    const secs = parseInt(timeParts[1], 10);
    seconds = minutes * 60 + secs;
  } else if (timeParts.length === 1) {
    // 초만 있는 경우
    seconds = parseInt(timeParts[0], 10);
  }

  return seconds;
}
