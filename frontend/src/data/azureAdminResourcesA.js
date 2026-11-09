// Источники для части A самостоятельного курса «по материалам Microsoft Learn (AZ-104)».
// Курс неофициальный: это конспекты для самообучения, а не подготовка к экзамену и не материалы Microsoft.
// Все ссылки проверены на доступность (HTTP 200); упражнения внутри модулей требуют подписки Azure.

export const azureResourcesA = [
  {
    id: 'azA-entra',
    title: 'Microsoft Learn: Understand Microsoft Entra ID (исходный модуль на GitHub)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Модуль AZ-104 о том, чем облачный каталог Microsoft Entra ID отличается от локального Active Directory Domain Services, какие бывают выпуски (Free, P1, P2) и когда нужен Microsoft Entra Domain Services. Ссылка ведёт на исходный index.yml модуля в репозитории MicrosoftDocs/learn. Практические упражнения внутри модуля требуют подписки Azure.',
    url: 'https://github.com/MicrosoftDocs/learn/blob/main/learn-pr/wwl-azure/understand-azure-active-directory/index.yml',
  },
  {
    id: 'azA-identities',
    title: 'Microsoft Learn: Create, configure, and manage identities (исходный модуль на GitHub)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Модуль о создании пользователей и групп, назначении лицензий, регистрации устройств, пользовательских атрибутах безопасности и автоматическом предоставлении учётных записей. Описывает управление идентичностями в Microsoft Entra ID на уровне администратора. Упражнения внутри модуля требуют подписки Azure или тенанта Entra.',
    url: 'https://github.com/MicrosoftDocs/learn/blob/main/learn-pr/wwl-sci/create-configure-manage-identities/index.yml',
  },
  {
    id: 'azA-architecture',
    title: 'Microsoft Learn: Describe the core architectural components of Azure (исходный модуль на GitHub)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Модуль о физической и логической структуре Azure: регионы и пары регионов, суверенные регионы, зоны доступности и центры обработки данных, ресурсы и группы ресурсов, подписки и группы управления. Хорошая карта для понимания иерархии областей действия. Упражнения внутри модуля требуют подписки Azure.',
    url: 'https://github.com/MicrosoftDocs/learn/blob/main/learn-pr/wwl-azure/describe-core-architectural-components-of-azure/index.yml',
  },
  {
    id: 'azA-policy',
    title: 'Microsoft Learn: Azure Policy initiatives (исходный модуль на GitHub)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Модуль из дорожки Microsoft Sovereign Cloud об управлении соответствием с помощью инициатив Azure Policy: принципы проектирования, ресурсы политик, определения, назначения и оценка соответствия. Шире, чем одна тема AZ-104, но понятия определений, инициатив и областей действия совпадают. Упражнения внутри модуля требуют подписки Azure.',
    url: 'https://github.com/MicrosoftDocs/learn/blob/main/learn-pr/wwl-data-ai/sovereignty-policy-initiatives/index.yml',
  },
  {
    id: 'azA-rbac',
    title: 'Microsoft Learn: Secure your Azure resources with Azure RBAC (исходный модуль на GitHub)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Модуль о ролевой модели доступа Azure RBAC: как посмотреть, кто и какими правами обладает, как выдать доступ на нужной области действия и как проверить действия в журнале активности. Упражнения внутри модуля требуют подписки Azure и права выдавать роли (Owner или User Access Administrator).',
    url: 'https://github.com/MicrosoftDocs/learn/blob/main/learn-pr/azure/secure-azure-resources-with-rbac/index.yml',
  },
  {
    id: 'azA-sspr',
    title: 'Microsoft Learn: Allow users to reset their password with Microsoft Entra self-service password reset (исходный модуль на GitHub)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Модуль о самостоятельном сбросе пароля: включение SSPR для выбранной группы, методы проверки личности, регистрация пользователей и настройка брендинга каталога. Для упражнений нужен тенант с лицензией Microsoft Entra ID P1 или P2 и роль, позволяющая менять политику методов проверки подлинности.',
    url: 'https://github.com/MicrosoftDocs/learn/blob/main/learn-pr/azure/allow-users-reset-their-password/index.yml',
  },
  {
    id: 'azA-storage-accounts',
    title: 'Microsoft Learn: Configure storage accounts (исходный модуль на GitHub)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Модуль об учётных записях хранения Azure: типы и виды аккаунтов, варианты репликации и избыточности, уровни доступа, конечные точки и защищённый доступ к ним. Подходит как справочная карта к практике создания аккаунта. Упражнения внутри модуля требуют подписки Azure.',
    url: 'https://github.com/MicrosoftDocs/learn/blob/main/learn-pr/wwl-azure/configure-storage-accounts/index.yml',
  },
  {
    id: 'azA-blob',
    title: 'Microsoft Learn: Configure Azure Blob Storage (исходный модуль на GitHub)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Модуль о контейнерах и больших двоичных объектах: уровни доступа, правила жизненного цикла, репликация объектов, загрузка данных и вопросы стоимости хранения. Упражнения внутри модуля требуют подписки Azure; хранение и операции тарифицируются.',
    url: 'https://github.com/MicrosoftDocs/learn/blob/main/learn-pr/wwl-azure/configure-blob-storage/index.yml',
  },
  {
    id: 'azA-storage-security',
    title: 'Microsoft Learn: Configure Azure Storage security (исходный модуль на GitHub)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Модуль о защите хранилища: подписи общего доступа (SAS), параметры URI и SAS-токена, шифрование на стороне службы, ключи, управляемые клиентом, и рекомендации по безопасной работе. Упражнения внутри модуля требуют подписки Azure.',
    url: 'https://github.com/MicrosoftDocs/learn/blob/main/learn-pr/wwl-azure/configure-storage-security/index.yml',
  },
  {
    id: 'azA-files',
    title: 'Microsoft Learn: Configure Azure Files (исходный модуль на GitHub)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Модуль о сетевых папках в облаке: отличие Azure Files от Blob Storage, создание общих ресурсов, снимки и мягкое удаление, работа через Storage Explorer и настройка Azure File Sync для гибридного файлового сервера. Упражнения внутри модуля требуют подписки Azure.',
    url: 'https://github.com/MicrosoftDocs/learn/blob/main/learn-pr/wwl-azure/configure-azure-files-file-sync/index.yml',
  },
  {
    id: 'azA-vm-intro',
    title: 'Microsoft Learn: Introduction to Azure virtual machines (исходный модуль на GitHub)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Вводный модуль о виртуальных машинах Azure: список вопросов перед созданием, создание VM, доступные параметры, высокая доступность и резервное копирование. Хорошо дополняет практику с az vm create. Упражнения внутри модуля требуют подписки Azure; работающая VM тарифицируется.',
    url: 'https://github.com/MicrosoftDocs/learn/blob/main/learn-pr/azure/intro-to-azure-virtual-machines/index.yml',
  },
  {
    id: 'azA-vm-availability',
    title: 'Microsoft Learn: Configure virtual machine availability (исходный модуль на GitHub)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Модуль о доступности и масштабировании: наборы доступности, домены обновления и отказа, зоны доступности, вертикальное и горизонтальное масштабирование, наборы масштабирования VMSS и автомасштабирование. Упражнения внутри модуля требуют подписки Azure.',
    url: 'https://github.com/MicrosoftDocs/learn/blob/main/learn-pr/wwl-azure/configure-virtual-machine-availability/index.yml',
  },
  {
    id: 'azA-app-service-plans',
    title: 'Microsoft Learn: Configure Azure App Service plans (исходный модуль на GitHub)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Модуль о планах App Service: уровни тарификации, какие вычислительные ресурсы выделяются плану, вертикальное (scale up) и горизонтальное (scale out) масштабирование. Упражнения внутри модуля требуют подписки Azure; планы выше уровня Free тарифицируются.',
    url: 'https://github.com/MicrosoftDocs/learn/blob/main/learn-pr/wwl-azure/configure-app-service-plans/index.yml',
  },
  {
    id: 'azA-app-services',
    title: 'Microsoft Learn: Configure Azure App Service (исходный модуль на GitHub)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Модуль о веб-приложениях App Service: создание приложения, непрерывное развёртывание, слоты развёртывания и обмен, безопасность, собственные домены, резервное копирование и Application Insights. Упражнения внутри модуля требуют подписки Azure.',
    url: 'https://github.com/MicrosoftDocs/learn/blob/main/learn-pr/wwl-azure/configure-azure-app-services/index.yml',
  },
  {
    id: 'azA-aci',
    title: 'Microsoft Learn: Configure Azure Container Instances (исходный модуль на GitHub)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Модуль о запуске контейнеров без управления серверами и кластером: сравнение контейнеров и виртуальных машин, возможности Azure Container Instances, группы контейнеров и основы платформы Docker. Упражнения внутри модуля требуют подписки Azure.',
    url: 'https://github.com/MicrosoftDocs/learn/blob/main/learn-pr/wwl-azure/configure-azure-container-instances/index.yml',
  },
  {
    id: 'azA-labs',
    title: 'MicrosoftLearning/AZ-104-MicrosoftAzureAdministrator — лабораторные работы (GitHub)',
    type: 'Курс',
    language: 'EN',
    access: 'Материалы бесплатно; для лабораторных нужна подписка Azure, возможны расходы',
    description: 'Открытый репозиторий пошаговых лабораторных к курсу AZ-104: управление идентичностями Entra ID, подписки и RBAC, Azure Policy, учётные записи хранения, виртуальные машины, веб-приложения App Service и Azure Container Instances. Это материалы Microsoft Learning; наш курс неофициальный и ссылается на них только как на источник практики. Лабораторные создают ресурсы, за которые может списываться плата.',
    url: 'https://github.com/MicrosoftLearning/AZ-104-MicrosoftAzureAdministrator',
  },
  {
    id: 'azA-cli',
    title: 'Get started with Azure CLI (документация azure-docs-cli)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Базовое руководство по Azure CLI: запуск в Azure Cloud Shell или локальная установка, az version, вход в аккаунт, выбор подписки через az account set, поиск команд (az find) и справка по ключу --help. Нужна для всех лабораторных этой части курса.',
    url: 'https://github.com/MicrosoftDocs/azure-docs-cli/blob/main/docs-ref-conceptual/Latest-version/get-started-with-azure-cli.md',
  },
  {
    id: 'azA-free-account',
    title: 'Avoid charges with an Azure free account (документация Cost Management)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Объясняет, как устроен бесплатный аккаунт Azure: у новых пользователей может быть ограниченный кредит на первый месяц и набор бесплатных служб на ограниченный срок; условия определяет Microsoft и они меняются. Когда кредит или лимиты заканчиваются, ресурсы отключаются или начинают тарифицироваться. Прочитайте перед лабораторными, чтобы не получить неожиданных списаний.',
    url: 'https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/cost-management-billing/manage/avoid-charges-free-account.md',
  },
  {
    id: 'azA-resource-org',
    title: 'Cloud Adoption Framework: организация ресурсов Azure (resource-org)',
    type: 'Документация',
    language: 'EN',
    access: 'Бесплатно',
    description: 'Статья по проектированию зон посадки: соглашения об именовании, теги, проектирование подписок и иерархии групп управления, четыре уровня областей действия и применение Azure Policy для единообразия тегов. Полезна для понимания, зачем иерархия нужна в реальной организации.',
    url: 'https://github.com/MicrosoftDocs/cloud-adoption-framework/blob/main/docs/ready/landing-zone/design-area/resource-org.md',
  },
];

export const azureLessonResourcesA = {
  'az-entra-fundamentals': [
    {
      sourceId: 'azA-entra',
      focus: 'Сравнение Microsoft Entra ID и AD DS, выпуски Free, P1 и P2, роль Microsoft Entra Domain Services.',
      takeaway: 'Entra ID — не «Active Directory в облаке», а отдельная служба идентичности на современных протоколах (OAuth 2.0, OpenID Connect, SAML). Kerberos, NTLM, LDAP и групповые политики даёт только Entra Domain Services.',
    },
    {
      sourceId: 'azA-identities',
      focus: 'Какие объекты живут в каталоге: пользователи, группы, устройства, лицензии и регистрация устройств.',
    },
    {
      sourceId: 'azA-labs',
      focus: 'Лабораторная LAB_01 «Manage Microsoft Entra ID identities»: создание пользователей, приглашение внешнего гостя и группы.',
      takeaway: 'Сначала посмотрите, в каком тенанте вы работаете, и только потом создавайте объекты: ошибка с каталогом самая частая у новичков.',
    },
  ],
  'az-identities': [
    {
      sourceId: 'azA-identities',
      focus: 'Создание пользователей и групп, лицензии, пользовательские атрибуты безопасности и автоматическое предоставление.',
      takeaway: 'Права и лицензии надёжнее выдавать группам, а не людям: так аудит и отзыв доступа сводятся к одному месту.',
    },
    {
      sourceId: 'azA-labs',
      focus: 'LAB_01, задачи 1 и 2: создание внутреннего пользователя, приглашение внешнего гостя, создание групп безопасности.',
    },
    {
      sourceId: 'azA-entra',
      focus: 'Контекст: какой выпуск Entra ID нужен для динамических групп и других возможностей.',
    },
  ],
  'az-architecture': [
    {
      sourceId: 'azA-architecture',
      focus: 'Регионы, пары регионов, зоны доступности, группы ресурсов, подписки и группы управления.',
      takeaway: 'Иерархия «группа управления → подписка → группа ресурсов → ресурс» определяет, куда распространяются политики и роли: наследование идёт сверху вниз.',
    },
    {
      sourceId: 'azA-resource-org',
      focus: 'Как проектируют иерархию подписок и групп управления, соглашения об именовании и теги в реальной организации.',
    },
    {
      sourceId: 'azA-labs',
      focus: 'LAB_02a, задача 1, и LAB_02b, задача 1: создание группы управления и работа с тегами.',
    },
  ],
  'az-policy': [
    {
      sourceId: 'azA-policy',
      focus: 'Инициативы Azure Policy: определения, назначения, оценка соответствия и принципы проектирования.',
      takeaway: 'Policy отвечает на вопрос «какими должны быть ресурсы», а не «кто может действовать»: проверяются свойства ресурса при создании и по расписанию.',
    },
    {
      sourceId: 'azA-labs',
      focus: 'LAB_02b: тег-политика, принудительное назначение, применение к существующим ресурсам и блокировки ресурсов.',
      takeaway: 'Назначайте новую политику сначала в режиме DoNotEnforce и смотрите отчёт соответствия, а уже потом включайте блокирующий эффект.',
    },
    {
      sourceId: 'azA-resource-org',
      focus: 'Использование Azure Policy для единообразия тегов и стандартов именования на уровне подписок.',
    },
  ],
  'az-rbac': [
    {
      sourceId: 'azA-rbac',
      focus: 'Просмотр существующего доступа, выдача ролей на нужной области действия и проверка журнала активности.',
      takeaway: 'Назначение роли — это три составляющие: кто (участник), что (роль) и где (область действия). Выдавайте минимальную роль на минимальной области.',
    },
    {
      sourceId: 'azA-labs',
      focus: 'LAB_02a, задачи 2–4: встроенная роль, настраиваемая роль и просмотр журнала действий.',
    },
    {
      sourceId: 'azA-entra',
      focus: 'Разница между ролями Microsoft Entra (управление каталогом) и ролями Azure RBAC (управление ресурсами).',
    },
  ],
  'az-password-reset': [
    {
      sourceId: 'azA-sspr',
      focus: 'Включение SSPR для группы пользователей, выбор методов проверки, регистрация методов и брендинг страницы входа.',
      takeaway: 'SSPR работает только для тех, кто заранее зарегистрировал методы проверки, поэтому включение функции без кампании регистрации ничего не даёт.',
    },
    {
      sourceId: 'azA-entra',
      focus: 'Лицензионный контекст: что входит в бесплатный выпуск, а что требует Entra ID P1 или P2.',
    },
    {
      sourceId: 'azA-labs',
      focus: 'LAB_01: как создать тестового пользователя и группу, на которых безопасно проверять политику SSPR.',
    },
  ],
  'az-storage-accounts': [
    {
      sourceId: 'azA-storage-accounts',
      focus: 'Типы учётных записей хранения, варианты репликации LRS, ZRS, GRS и GZRS, уровни доступа и конечные точки.',
      takeaway: 'Имя аккаунта глобально уникально и совпадает с DNS-именем конечных точек, а вариант избыточности выбирайте по требованию к отказоустойчивости, а не «на всякий случай».',
    },
    {
      sourceId: 'azA-labs',
      focus: 'LAB_07, задача 1: создание учётной записи хранения и выбор параметров.',
    },
    {
      sourceId: 'azA-free-account',
      focus: 'Какие бесплатные лимиты и условия действуют для новых аккаунтов Azure и как избежать лишних списаний.',
    },
  ],
  'az-blob-storage': [
    {
      sourceId: 'azA-blob',
      focus: 'Контейнеры, уровни доступа, правила жизненного цикла, репликация объектов и загрузка данных.',
      takeaway: 'Перемещение в холодные уровни экономит хранение, но добавляет плату за доступ и минимальный срок хранения: считайте стоимость на всём жизненном цикле, а не по одной цене за гигабайт.',
    },
    {
      sourceId: 'azA-labs',
      focus: 'LAB_07, задача 2: защита больших объектов, временное удержание неизменяемости и SAS.',
    },
    {
      sourceId: 'azA-storage-accounts',
      focus: 'Какие параметры аккаунта (тип, избыточность, уровень по умолчанию) определяют поведение контейнеров.',
    },
  ],
  'az-storage-security': [
    {
      sourceId: 'azA-storage-security',
      focus: 'SAS-токены, их параметры, шифрование на стороне службы, ключи, управляемые клиентом, рекомендации.',
      takeaway: 'SAS на ключе аккаунта нельзя отозвать по отдельности, кроме как сменой ключа или политикой доступа; для новых решений предпочтительнее SAS делегирования пользователя на базе Entra ID.',
    },
    {
      sourceId: 'azA-labs',
      focus: 'LAB_07, задачи 2 и 3: создание SAS и ограничение сетевого доступа к аккаунту.',
    },
    {
      sourceId: 'azA-storage-accounts',
      focus: 'Конечные точки аккаунта и защищённый доступ к ним: HTTPS, брандмауэр и частные конечные точки.',
    },
  ],
  'az-files-sync': [
    {
      sourceId: 'azA-files',
      focus: 'Azure Files против Blob Storage, создание общих ресурсов, снимки, мягкое удаление и настройка Azure File Sync.',
      takeaway: 'Azure File Sync превращает локальный сервер в быстрый кэш облачной папки: горячие файлы лежат локально, остальные заменяются заглушками.',
    },
    {
      sourceId: 'azA-labs',
      focus: 'LAB_07, задача 3: общий ресурс Azure Files, Storage Browser и ограничение доступа по сети.',
    },
    {
      sourceId: 'azA-blob',
      focus: 'Сравнение с Blob Storage: когда нужен протокол SMB, а когда достаточно объектного хранилища.',
    },
  ],
  'az-vm-intro': [
    {
      sourceId: 'azA-vm-intro',
      focus: 'Что решить до создания VM: регион, размер, образ, диски и сеть; создание VM, высокая доступность, резервное копирование.',
      takeaway: 'Останавливайте VM командой deallocate, а не выключением изнутри ОС: остановленная, но выделенная VM продолжает тарифицироваться за вычисления.',
    },
    {
      sourceId: 'azA-labs',
      focus: 'LAB_08: создание VM через портал, PowerShell и Azure CLI, а также изменение размера и дисков.',
    },
    {
      sourceId: 'azA-cli',
      focus: 'Основы работы с Azure CLI: вход, выбор подписки, формат вывода и справка.',
    },
  ],
  'az-vm-availability': [
    {
      sourceId: 'azA-vm-availability',
      focus: 'Наборы доступности, домены обновления и отказа, зоны доступности, VMSS и автомасштабирование.',
      takeaway: 'Набор доступности защищает от сбоя стойки и от планового обновления, а зоны доступности — ещё и от потери целого центра обработки данных региона.',
    },
    {
      sourceId: 'azA-labs',
      focus: 'LAB_08, задачи 1, 3 и 4: устойчивые к сбою зоны VM, создание и масштабирование VMSS.',
    },
    {
      sourceId: 'azA-architecture',
      focus: 'Контекст: регионы, пары регионов и зоны доступности как основа отказоустойчивости.',
    },
  ],
  'az-app-service-plans': [
    {
      sourceId: 'azA-app-service-plans',
      focus: 'Уровни тарификации, ресурсы плана, вертикальное и горизонтальное масштабирование.',
      takeaway: 'Тарифицируется план, а не отдельное приложение: все приложения плана делят одни и те же виртуальные машины.',
    },
    {
      sourceId: 'azA-labs',
      focus: 'LAB_09a, задача 5: автомасштабирование приложения.',
    },
    {
      sourceId: 'azA-app-services',
      focus: 'Какие возможности приложения (слоты, домены, автомасштабирование) зависят от выбранного уровня плана.',
    },
  ],
  'az-app-services': [
    {
      sourceId: 'azA-app-services',
      focus: 'Создание приложения, непрерывное развёртывание, слоты и обмен, безопасность, домены и резервное копирование.',
      takeaway: 'Слот развёртывания — это отдельное приложение со своим адресом: выкладывайте в него, прогревайте и только затем меняйте местами с рабочим слотом.',
    },
    {
      sourceId: 'azA-labs',
      focus: 'LAB_09a, задачи 1–4: веб-приложение, слот, параметры развёртывания и обмен слотов.',
    },
    {
      sourceId: 'azA-app-service-plans',
      focus: 'Ограничения плана: слоты и автомасштабирование доступны только с уровня Standard и выше.',
    },
  ],
  'az-container-instances': [
    {
      sourceId: 'azA-aci',
      focus: 'Контейнеры и виртуальные машины, возможности ACI, группы контейнеров и основы Docker.',
      takeaway: 'ACI подходит для коротких и одиночных задач; если нужны автомасштабирование, балансировка и обновления без простоя, смотрите на App Service, Container Apps или AKS.',
    },
    {
      sourceId: 'azA-labs',
      focus: 'LAB_09b: запуск контейнера из образа Docker и проверка его работы; в репозитории есть и лабораторная по Container Apps.',
    },
    {
      sourceId: 'azA-app-services',
      focus: 'Сравнение: когда одиночный контейнер лучше разместить как Web App for Containers в App Service.',
    },
  ],
};
