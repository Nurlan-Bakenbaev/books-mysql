import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './site-motion.css';

const desktopRoutes = [
  'M0 156H70L102 188V386L134 418V1000',
  'M1440 110H1348L1316 142V312L1384 380V728L1344 768V1000',
  'M0 724H172L204 756H384',
  'M1440 892H1178L1146 860H1010',
  'M420 0V48L452 80H980L1012 48V0',
];
const mobileRoutes = [
  'M0 118H10L18 126V360L10 368V844',
  'M390 176H380L372 184V568L382 578V844',
  'M70 0V18L84 32H292L308 16V0',
];
const signalProfiles = [
  { '--signal-duration': '8.6s', '--signal-delay': '-2.3s', '--signal-pattern': '1.4 26' },
  { '--signal-duration': '15.4s', '--signal-delay': '-11.7s', '--signal-pattern': '1.8 39' },
  { '--signal-duration': '10.2s', '--signal-delay': '-.8s', '--signal-pattern': '1.2 19' },
  { '--signal-duration': '19.1s', '--signal-delay': '-15.2s', '--signal-pattern': '2 31' },
  { '--signal-duration': '12.7s', '--signal-delay': '-5.6s', '--signal-pattern': '1.6 47' },
  { '--signal-duration': '7.9s', '--signal-delay': '-18.4s', '--signal-pattern': '1.3 23' },
  { '--signal-duration': '16.6s', '--signal-delay': '-8.9s', '--signal-pattern': '2.1 35' },
  { '--signal-duration': '11.3s', '--signal-delay': '-3.7s', '--signal-pattern': '1.5 29' },
];

function Circuit({ mobile = false }) {
  const routes = mobile ? mobileRoutes : desktopRoutes;
  return <svg className={`site-circuit site-circuit-${mobile ? 'mobile' : 'desktop'}`}
    viewBox={mobile ? '0 0 390 844' : '0 0 1440 1000'} preserveAspectRatio="none" focusable="false">
    {routes.map((route, index) => <g className={`site-circuit-lane lane-${index % 3}${index % 3 === 1 ? ' is-reversed' : ''}`} key={route} style={signalProfiles[(index + (mobile ? 2 : 0)) % signalProfiles.length]}>
      <path className="site-circuit-track" d={route} />
      <path className="site-circuit-packet" pathLength="100" d={route} />
    </g>)}
    {(mobile ? [[18, 126], [372, 568], [84, 32]] : [[102, 188], [1316, 312], [204, 756], [1146, 860], [452, 80]]).map(([x, y]) =>
      <circle className="site-circuit-node" cx={x} cy={y} r={mobile ? 2.5 : 3.5} key={`${x}-${y}`} />)}
  </svg>;
}
Circuit.propTypes = { mobile: PropTypes.bool };

export default function SiteSignalBackdrop() {
  const backdropRef = useRef(null);

  useEffect(() => {
    const element = backdropRef.current;
    const shell = element.closest('.app-shell');
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => { shell.dataset.siteMotion = !document.hidden && !preference.matches ? 'running' : 'paused'; };
    sync();
    document.addEventListener('visibilitychange', sync);
    preference.addEventListener('change', sync);
    return () => {
      document.removeEventListener('visibilitychange', sync);
      preference.removeEventListener('change', sync);
      delete shell.dataset.siteMotion;
    };
  }, []);

  return <div className="site-signal-backdrop" ref={backdropRef} aria-hidden="true">
    <Circuit /><Circuit mobile />
  </div>;
}
