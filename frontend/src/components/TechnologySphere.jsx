import { useEffect, useRef, useState } from 'react';
import { SiLinux, SiUbuntu, SiDebian, SiRedhat, SiDocker, SiKubernetes, SiAnsible, SiGit, SiPython, SiPrometheus, SiGrafana, SiCisco, SiIbm, SiVmware, SiTerraform, SiNginx, SiApache, SiPostgresql, SiMysql, SiOpenstack, SiWireshark } from 'react-icons/si';
import { FaWindows } from 'react-icons/fa';
import { VscTerminalPowershell, VscAzure } from 'react-icons/vsc';
const brands = [['Windows',FaWindows],['IBM',SiIbm],['Cisco',SiCisco],['Linux',SiLinux],['Ubuntu',SiUbuntu],['Debian',SiDebian],['Red Hat',SiRedhat],['Docker',SiDocker],['Kubernetes',SiKubernetes],['Ansible',SiAnsible],['Git',SiGit],['Python',SiPython],['PowerShell',VscTerminalPowershell],['Prometheus',SiPrometheus],['Grafana',SiGrafana],['VMware',SiVmware],['Terraform',SiTerraform],['Nginx',SiNginx],['Apache',SiApache],['PostgreSQL',SiPostgresql],['MySQL',SiMysql],['OpenStack',SiOpenstack],['Wireshark',SiWireshark],['Azure',VscAzure]];
export default function TechnologySphere() {
  const ref = useRef(null);
  const [paused,setPaused] = useState(false);
  const [visible,setVisible] = useState(true);
  const [hidden,setHidden] = useState(document.hidden);
  useEffect(() => { const observer=new IntersectionObserver(([entry])=>setVisible(entry.isIntersecting)); observer.observe(ref.current); const sync=()=>setHidden(document.hidden); document.addEventListener('visibilitychange',sync); return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync);}; },[]);
  return <div className="technology-sphere" ref={ref}><div className="sphere-rotation" style={{animationPlayState:paused || !visible || hidden ? 'paused':'running'}} aria-label="Технологии курса">{brands.map(([name,Icon],i)=>{const y=1-2*(i+.5)/brands.length;const angle=i*Math.PI*(3-Math.sqrt(5));const radius=Math.sqrt(1-y*y);return <span key={name} title={name} style={{transform:`translate3d(${radius*Math.cos(angle)*125}px,${y*125}px,${radius*Math.sin(angle)*125}px)`}}><Icon aria-hidden="true"/><span className="sr-only">{name}</span></span>;})}</div><button className="button" aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?'Продолжить сферу':'Остановить сферу'}</button></div>;
}
