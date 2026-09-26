import Svg, { Circle, Path, Rect } from 'react-native-svg';

const ICONS = {
  calendar: (
    <>
      <Rect x="3.5" y="5" width="17" height="15.5" rx="3" />
      <Path d="M3.5 9.5h17M8 3v4M16 3v4" />
    </>
  ),
  list: (
    <>
      <Circle cx="5" cy="7" r="1.6" />
      <Circle cx="5" cy="12" r="1.6" />
      <Circle cx="5" cy="17" r="1.6" />
      <Path d="M9.5 7H20M9.5 12H20M9.5 17H20" />
    </>
  ),
};

export default function TabBarIcon({ name, color, size }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.8}>
      {ICONS[name]}
    </Svg>
  );
}
