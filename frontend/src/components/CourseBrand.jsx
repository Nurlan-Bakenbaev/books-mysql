import { SiLinux,SiCisco,SiDocker,SiKubernetes } from 'react-icons/si';
import { FaWindows } from 'react-icons/fa';
import { VscAzure } from 'react-icons/vsc';
const icons={'computer-technologies':FaWindows,roadmap:SiDocker,'network-engineer':SiCisco,'azure-admin':VscAzure,'security-plus':SiKubernetes,'windows-security':FaWindows,'linux-security':SiLinux,'ethical-hacking':SiLinux};
/* eslint-disable react/prop-types */
export default function CourseBrand({id}){const Icon=icons[id]||SiLinux;return <span className="course-brand" aria-hidden="true"><Icon/></span>;}
