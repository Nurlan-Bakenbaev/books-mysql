const careers = [
  ['Системный администратор', 'Серверы, сети, Linux, Windows Server, резервное копирование и диагностика.', 'roadmap'],
  ['Сетевой инженер', 'Коммутация, маршрутизация, VPN, наблюдаемость и автоматизация сетей.', 'network-engineer'],
  ['Администратор Azure', 'Идентификация, вычисления, хранилища и гибридные сети.', 'azure-admin'],
  ['Специалист по безопасности', 'Контроль доступа, анализ угроз, защитные меры и реагирование.', 'security-plus'],
];
export default function CareersPage() {
  return <section><h1>Профессии</h1><p>Начните с компьютерных технологий, затем выберите специализацию. Прогресс курса показывает изучение материала; готовность к работе подтверждается практикой и портфолио.</p><div className="landing-track-grid">{careers.map(([title, description, id]) => <a className="landing-track-card" key={id} href={`?view=${id}`} data-route-link><h2>{title}</h2><p>{description}</p><strong>Открыть маршрут →</strong></a>)}</div></section>;
}
