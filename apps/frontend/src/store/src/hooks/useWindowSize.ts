import { useRecoilValue } from 'recoil';
import { windowSizeLessThan960 } from '../atoms/window';

export const useWindowSize = () => {
  const value = useRecoilValue(windowSizeLessThan960);
  return value;
};
