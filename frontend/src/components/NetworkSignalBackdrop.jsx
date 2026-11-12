import { useEffect, useRef } from 'react';
import { TbDeviceDesktop, TbRouter, TbServer, TbShieldLock, TbSwitch3, TbWorld } from 'react-icons/tb';

const components = [
  { name: 'Компьютер', Icon: TbDeviceDesktop },
  { name: 'Коммутатор', Icon: TbSwitch3 },
  { name: 'Маршрутизатор', Icon: TbRouter },
  { name: 'Интернет / WAN', Icon: TbWorld },
  { name: 'Маршрутизатор', Icon: TbRouter },
  { name: 'Межсетевой экран', Icon: TbShieldLock },
  { name: 'Коммутатор', Icon: TbSwitch3 },
  { name: 'Сервер', Icon: TbServer },
];
const desktopPoints = [[65, 98], [200, 98], [335, 98], [510, 98], [690, 98], [835, 98], [980, 98], [1135, 98]];
const mobilePoints = [[44, 65], [140, 65], [236, 65], [316, 155], [316, 247], [228, 247], [140, 247], [44, 247]];

export default function NetworkSignalBackdrop() {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let visible = false;
    const sync = () => {
      const running = visible && !document.hidden && !preference.matches;
      element.dataset.motion = running ? 'running' : 'paused';
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
    observer.observe(element);
    preference.addEventListener('change', sync);
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      observer.disconnect();
      preference.removeEventListener('change', sync);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  const diagram = (mobile) => {
    const points = mobile ? mobilePoints : desktopPoints;
    return <svg className={`network-topology ${mobile ? 'network-topology-mobile' : 'network-topology-desktop'}`}
      viewBox={mobile ? '0 0 360 310' : '0 0 1200 180'} aria-hidden="true" focusable="false">
      <rect className="network-zone" x={mobile ? 12 : 14} y={mobile ? 16 : 22} width={mobile ? 336 : 380} height={mobile ? 94 : 136} rx="18" />
      <rect className="network-zone network-zone-destination" x={mobile ? 12 : 625} y={mobile ? 204 : 22} width={mobile ? 336 : 560} height={mobile ? 94 : 136} rx="18" />
      <text className="network-zone-label" x={mobile ? 26 : 32} y={mobile ? 35 : 43}>СЕТЬ A · ОФИС</text>
      <text className="network-zone-label" x={mobile ? 26 : 643} y={mobile ? 223 : 43}>СЕТЬ B · ДАТА-ЦЕНТР</text>
      <path className="network-route" d={mobile ? 'M44 65H316V247H44' : 'M65 98H1135'} />
      {components.map(({ name, Icon }, index) => {
        const [x, y] = points[index];
        const label = mobile && index === 5 ? 'Firewall' : mobile && (index === 2 || index === 4) ? 'Роутер' : name;
        return <g key={`${name}-${index}`} className={`network-component network-component-${index}`}>
          <rect className="network-component-base" x={x - 23} y={y - 23} width="46" height="46" rx="12" />
          <Icon x={x - 14} y={y - 14} size={28} className="network-component-icon" />
          <text x={mobile && index === 3 ? x - 27 : x} y={mobile && index === 3 ? y + 5 : y + 41}
            textAnchor={mobile && index === 3 ? 'end' : 'middle'} className="network-component-label">{label}</text>
        </g>;
      })}
    </svg>;
  };

  return <div ref={ref} className="network-signal-backdrop" data-motion="paused" role="img"
    aria-label="Путь сетевого сигнала: компьютер и коммутатор в сети A, маршрутизатор, интернет, маршрутизатор и межсетевой экран сети B, коммутатор и сервер.">
    {diagram(false)}{diagram(true)}
    <span className="network-packet" aria-hidden="true" />
    <span className="network-packet network-packet-trailing" aria-hidden="true" />
  </div>;
}
