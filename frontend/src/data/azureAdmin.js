// AZ-104 (Microsoft Azure Administrator) structure, mirrored 1:1 from the official
// Microsoft Learn path modules: https://learn.microsoft.com/training/courses/az-104t00
// Grouped the same way guide.js groups the sysadmin roadmap into phases, so Roadmap.jsx
// can render this course as an accordion too (see App.jsx / azureAdminCourse below).
import { trackLessons } from './trackContent.js';

// Во внешний курс попадают только темы, для которых уже написан полный урок (см. trackContent.js);
// остальные показываются отдельным списком «в разработке».
const allAzurePhases = [
  {
    id: 'az-identity', number: '01', title: 'Идентификация и управление', subtitle: 'Identity & Governance',
    description: 'Основы Microsoft Entra ID, структура Azure и контроль доступа к подписке.',
    topics: [
      { id: 'az-entra-fundamentals', title: 'Основы Microsoft Entra ID', description: 'Каталог идентификации Azure: тенанты, пользователи, группы и место Entra ID в экосистеме Microsoft.' },
      { id: 'az-identities', title: 'Создание и управление пользователями и группами', description: 'Создание, импорт и администрирование учётных записей и групп Entra ID, включая динамические группы.' },
      { id: 'az-architecture', title: 'Архитектура Azure: клиенты, группы управления, подписки, ресурсы', description: 'Иерархия Azure от клиента до ресурса, группы ресурсов и области применения политик.' },
      { id: 'az-policy', title: 'Azure Policy и инициативы управления', description: 'Определения политик, инициативы, область действия и соответствие требованиям (compliance).' },
      { id: 'az-rbac', title: 'Защита ресурсов с помощью Azure RBAC', description: 'Встроенные и настраиваемые роли, область назначения и принцип минимальных привилегий.' },
      { id: 'az-password-reset', title: 'Самостоятельный сброс пароля (SSPR)', description: 'Настройка методов проверки и политики самостоятельного сброса пароля пользователями.' },
      { id: 'az-arm-bicep', title: 'ARM, шаблоны и Bicep', description: 'Декларативное развёртывание, параметры, what-if, история deployment и безопасный откат.' },
    ],
  },
  {
    id: 'az-storage', number: '02', title: 'Хранилище Azure', subtitle: 'Storage',
    description: 'Учётные записи хранения, Blob Storage, безопасность данных и синхронизация файлов.',
    topics: [
      { id: 'az-storage-accounts', title: 'Учётные записи хранения Azure', description: 'Типы и избыточность хранилища, уровни производительности и выбор конфигурации учётной записи.' },
      { id: 'az-blob-storage', title: 'Управление Blob Storage', description: 'Контейнеры, уровни доступа к данным (hot/cool/archive) и управление жизненным циклом объектов.' },
      { id: 'az-storage-security', title: 'Безопасность хранилища Azure', description: 'Общие ключи доступа, подписанные URL-адреса (SAS) и сетевые ограничения доступа к хранилищу.' },
      { id: 'az-files-sync', title: 'Azure Files и Azure File Sync', description: 'Общие файловые ресурсы SMB/NFS в облаке и кэширование файлов на локальных серверах.' },
    ],
  },
  {
    id: 'az-compute', number: '03', title: 'Вычислительные ресурсы', subtitle: 'Compute',
    description: 'Виртуальные машины, доступность, планы App Service и контейнеры.',
    topics: [
      { id: 'az-vm-intro', title: 'Виртуальные машины Azure', description: 'Выбор размера, образа и диска виртуальной машины; группы доступности и зоны.' },
      { id: 'az-vm-availability', title: 'Доступность и масштабирование виртуальных машин', description: 'Наборы масштабирования виртуальных машин, зоны доступности и автоматическое масштабирование.' },
      { id: 'az-app-service-plans', title: 'Планы App Service', description: 'Уровни планов, общие вычислительные ресурсы и выбор плана для веб-нагрузки.' },
      { id: 'az-app-services', title: 'Веб-приложения Azure App Service', description: 'Развёртывание и настройка веб-приложений, слотов развёртывания и доменных имён.' },
      { id: 'az-container-instances', title: 'Контейнеры: Azure Container Instances', description: 'Быстрый запуск контейнеров без управления оркестрацией; группы контейнеров.' },
      { id: 'az-container-apps', title: 'Azure Container Apps', description: 'Управляемые контейнерные приложения, revisions, ingress, масштабирование и canary-релизы.' },
    ],
  },
  {
    id: 'az-network', number: '04', title: 'Сети Azure', subtitle: 'Virtual Networking',
    description: 'Виртуальные сети, группы безопасности, DNS, маршрутизация и балансировка нагрузки.',
    topics: [
      { id: 'az-vnet', title: 'Виртуальные сети Azure (VNet)', description: 'Адресные пространства, подсети и базовая сегментация облачной сети.' },
      { id: 'az-nsg', title: 'Группы безопасности сети (NSG)', description: 'Правила входящего и исходящего трафика, приоритеты и ассоциация с подсетями/интерфейсами.' },
      { id: 'az-dns', title: 'DNS в Azure', description: 'Публичные и частные зоны Azure DNS и разрешение имён внутри виртуальной сети.' },
      { id: 'az-peering', title: 'Пиринг виртуальных сетей (VNet Peering)', description: 'Соединение виртуальных сетей напрямую без шлюза и особенности маршрутизации пиринга.' },
      { id: 'az-routes', title: 'Таблицы маршрутов и пользовательские маршруты (UDR)', description: 'Системные маршруты по умолчанию и переопределение их пользовательскими таблицами.' },
      { id: 'az-load-balancer', title: 'Azure Load Balancer', description: 'Балансировка на 4 уровне, пробы состояния (health probes) и правила балансировки.' },
      { id: 'az-app-gateway', title: 'Application Gateway и Web Application Firewall', description: 'Балансировка на 7 уровне, маршрутизация по пути URL и защита от атак уровня приложений.' },
      { id: 'az-network-watcher', title: 'Диагностика сети: Network Watcher', description: 'Проверка потока IP, диагностика подключения и журналы потоков NSG.' },
    ],
  },
  {
    id: 'az-monitor', number: '05', title: 'Резервное копирование и мониторинг', subtitle: 'Backup & Monitor',
    description: 'Защита данных виртуальных машин и наблюдение за их состоянием.',
    topics: [
      { id: 'az-backup-intro', title: 'Основы Azure Backup', description: 'Хранилище Recovery Services, политики резервного копирования и модель затрат.' },
      { id: 'az-vm-backup', title: 'Резервное копирование виртуальных машин', description: 'Настройка защиты ВМ, расписания и восстановление из точки восстановления.' },
      { id: 'az-site-recovery', title: 'Azure Site Recovery и аварийное восстановление', description: 'Репликация, recovery plans, test failover, RPO/RTO и безопасная проверка восстановления.' },
      { id: 'az-vm-diagnostics', title: 'Мониторинг и диагностика виртуальных машин', description: 'Диагностические данные, метрики, оповещения и базовые запросы Azure Monitor.' },
      { id: 'az-monitor-alerts', title: 'Azure Monitor: запросы, оповещения и Action Groups', description: 'Metric и log alerts, KQL, каналы уведомлений, подавление шума и проверка реакции.' },
    ],
  },
];

const isReady = (topic) => Boolean(trackLessons[topic.id]);

export const azureAdminPhases = allAzurePhases
  .map((phase) => ({ ...phase, topics: phase.topics.filter(isReady) }))
  .filter((phase) => phase.topics.length > 0);

export const azureAdminPlanned = allAzurePhases
  .map((phase) => ({ id: phase.id, number: phase.number, title: phase.title, topics: phase.topics.filter((topic) => !isReady(topic)) }))
  .filter((phase) => phase.topics.length > 0);

const totalTopics = allAzurePhases.reduce((sum, phase) => sum + phase.topics.length, 0);
const readyTopics = azureAdminPhases.reduce((sum, phase) => sum + phase.topics.length, 0);

export const azureAdminCourse = {
  id: 'azure-admin',
  title: 'AZ-104: Microsoft Azure Administrator',
  description: `Подготовка к экзамену AZ-104 по структуре официальной программы Microsoft Learn: идентификация, хранилище, вычисления, сети, резервное копирование и мониторинг. Опубликовано ${readyTopics} из ${totalTopics} тем с полными лекциями, лабораторными и тестами; остальные темы добавляются поэтапно и перечислены ниже.`,
  topics: azureAdminPhases.flatMap((phase) => phase.topics),
};
