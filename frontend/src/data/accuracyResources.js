// Первичные источники, использованные при предметной проверке 11.11.2026.
export const accuracyResources = [
  {
    "id": "audit-ssh",
    "title": "OpenSSH · sshd_config",
    "url": "https://github.com/openssh/openssh-portable/blob/master/sshd_config.5",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Проверьте правило first obtained value, Include/Match и PasswordAuthentication/KbdInteractiveAuthentication."
  },
  {
    "id": "audit-sudo",
    "title": "sudo · sudoers manual",
    "url": "https://github.com/sudo-project/sudo/blob/main/docs/sudoers.man.in",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Сверьте точное сопоставление аргументов, риски wildcard и shell escape; не разрешайте root pager."
  },
  {
    "id": "audit-sysctl",
    "title": "Linux kernel · sysctl/kernel",
    "url": "https://github.com/torvalds/linux/blob/master/Documentation/admin-guide/sysctl/kernel.rst",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Изучите runtime-значения randomize_va_space; удаление файла sysctl.d не восстанавливает прежнее runtime-значение."
  },
  {
    "id": "audit-auditctl",
    "title": "Linux Audit · auditctl manual",
    "url": "https://github.com/linux-audit/audit-userspace/blob/master/docs/auditctl.8",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Различайте runtime rules и rules.d, удаление watch через -W и immutable policy."
  },
  {
    "id": "audit-python-kdf",
    "title": "Python · hashlib",
    "url": "https://github.com/python/cpython/blob/main/Doc/library/hashlib.rst",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Проверьте pbkdf2_hmac, соль и итерации; стоимость измеряется на конкретной машине."
  },
  {
    "id": "audit-python-313",
    "title": "Python 3.13 · removed modules",
    "url": "https://github.com/python/cpython/blob/main/Doc/whatsnew/3.13.rst",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Модуль crypt удалён из стандартной библиотеки Python 3.13; пример не должен скрывать эту ошибку через || true."
  },
  {
    "id": "audit-storage-key",
    "title": "Microsoft · authorize Blob data in portal",
    "url": "https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/storage/blobs/authorize-data-operations-portal.md",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Сравните Entra DataActions с management-plane listKeys и доступом через Shared Key."
  },
  {
    "id": "audit-storage-hns",
    "title": "Microsoft · hierarchical namespace",
    "url": "https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/storage/blobs/data-lake-storage-namespace.md",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Различайте плоский namespace и реальные операции с каталогами при ADLS Gen2 HNS."
  },
  {
    "id": "audit-archive",
    "title": "Microsoft · rehydrate archived Blob",
    "url": "https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/storage/blobs/archive-rehydrate-overview.md",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Сверьте online tiers Hot, Cool и Cold и ограничения операции rehydration."
  },
  {
    "id": "audit-nsg-retirement",
    "title": "Microsoft · NSG flow logs retirement",
    "url": "https://github.com/MicrosoftDocs/azure-docs/blob/main/includes/network-watcher-nsg-flow-logs-retirement.md",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Новые NSG flow logs больше не создаются; retirement 30.09.2027. Для нового стенда выбирайте VNet flow logs."
  },
  {
    "id": "audit-lb-retirement",
    "title": "Microsoft · migrate Basic Load Balancer",
    "url": "https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/load-balancer/load-balancer-basic-upgrade-guidance.md",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Basic Load Balancer retired 30.09.2025; изучите ограничения миграции в Standard."
  },
  {
    "id": "audit-app-scaling",
    "title": "Microsoft · per-app scaling",
    "url": "https://github.com/MicrosoftDocs/azure-docs/blob/main/articles/app-service/manage-scale-per-app.md",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Общее число экземпляров плана и число экземпляров приложения — разные настройки на поддерживаемых SKU."
  },
  {
    "id": "audit-sspr-license",
    "title": "Microsoft · SSPR licensing matrix",
    "url": "https://github.com/MicrosoftDocs/entra-docs/blob/main/docs/identity/authentication/concept-sspr-licensing.md",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Сопоставьте cloud password change, cloud password reset и hybrid writeback с Free, Microsoft 365 и P1/P2."
  },
  {
    "id": "audit-sspr-methods",
    "title": "Microsoft · how SSPR works",
    "url": "https://github.com/MicrosoftDocs/entra-docs/blob/main/docs/identity/authentication/concept-sspr-howitworks.md",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Для two-method policy зарегистрируйте два подходящих метода. Authenticator и OATH считаются одним методом; это не классификация факторов MFA."
  },
  {
    "id": "audit-oidc",
    "title": "Microsoft · OpenID Connect",
    "url": "https://github.com/MicrosoftDocs/entra-docs/blob/main/docs/identity-platform/v2-protocols-oidc.md",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "OpenID Connect добавляет authentication поверх OAuth 2.0; не подменяйте ID token токеном доступа API."
  },
  {
    "id": "audit-ps-ssh",
    "title": "Microsoft · PowerShell remoting over SSH",
    "url": "https://github.com/MicrosoftDocs/PowerShell-Docs/blob/main/reference/docs-conceptual/security/remoting/SSH-Remoting-in-PowerShell.md",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "PowerShell 7 поддерживает SSH transport; WinRM нужен WSMan-сценарию, а не каждому remoting-сеансу."
  },
  {
    "id": "audit-docker-bridge",
    "title": "Docker · bridge networking",
    "url": "https://github.com/docker/docs/blob/main/content/manuals/engine/network/drivers/bridge.md",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Loopback port publishing ограничивает входящие подключения, но не блокирует исходящую сеть контейнера."
  },
  {
    "id": "audit-windows-hardware",
    "title": "Microsoft · Windows Server hardware requirements",
    "url": "https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/get-started/hardware-requirements.md",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Ориентируйтесь на таблицу текущей версии и варианта установки; исторические примечания установщика не снижают минимум RAM Windows Server 2025."
  },
  {
    "id": "audit-ad-vm",
    "title": "Microsoft · virtualized DC safeguards",
    "url": "https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/identity/ad-ds/get-started/virtual-dc/Virtualized-Domain-Controller-Architecture.md",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Проверьте условия VM-GenerationID safeguards и отличие поддерживаемого восстановления от произвольного отката/независимого backup."
  },
  {
    "id": "audit-ad-recycle",
    "title": "Microsoft · Active Directory Recycle Bin",
    "url": "https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/identity/ad-ds/get-started/adac/active-directory-recycle-bin.md",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Различайте deleted object lifetime и tombstone lifetime; проверяйте текущие атрибуты леса."
  },
  {
    "id": "audit-ad-name",
    "title": "Microsoft · select forest root domain",
    "url": "https://github.com/MicrosoftDocs/windowsserverdocs/blob/main/WindowsServerDocs/identity/ad-ds/plan/Selecting-the-Forest-Root-Domain.md",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Сверьте выбор имени леса, владение DNS-именем и варианты внутреннего и внешнего namespace."
  },
  {
    "id": "audit-inode",
    "title": "Linux man-pages · inode",
    "url": "https://github.com/mkerrisk/man-pages/blob/master/man7/inode.7",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Проверьте ограничения SUID и sticky bit: права владельца каталога и привилегированного процесса не исчезают."
  },
  {
    "id": "audit-kev-data",
    "title": "CISA · KEV data repository",
    "url": "https://github.com/cisagov/kev-data/blob/main/README.md",
    "type": "Документация",
    "language": "EN",
    "access": "Бесплатно",
    "description": "Официальный репозиторий CISA даёт альтернативный доступ к KEV; это не полный список всех уязвимостей."
  }
];

export const accuracyLessonResources = {
  "lsec-ssh-hardening": [
    {
      "sourceId": "audit-ssh",
      "focus": "Проверьте правило first obtained value, Include/Match и PasswordAuthentication/KbdInteractiveAuthentication."
    }
  ],
  "lsec-users-sudo": [
    {
      "sourceId": "audit-sudo",
      "focus": "Сверьте точное сопоставление аргументов, риски wildcard и shell escape; не разрешайте root pager."
    }
  ],
  "eth-privesc": [
    {
      "sourceId": "audit-sudo",
      "focus": "Сверьте точное сопоставление аргументов, риски wildcard и shell escape; не разрешайте root pager."
    },
    {
      "sourceId": "audit-inode",
      "focus": "Проверьте ограничения SUID и sticky bit: права владельца каталога и привилегированного процесса не исчезают."
    }
  ],
  "lsec-hardening-audit": [
    {
      "sourceId": "audit-sysctl",
      "focus": "Изучите runtime-значения randomize_va_space; удаление файла sysctl.d не восстанавливает прежнее runtime-значение."
    }
  ],
  "ct-os-internals": [
    {
      "sourceId": "audit-sysctl",
      "focus": "Изучите runtime-значения randomize_va_space; удаление файла sysctl.d не восстанавливает прежнее runtime-значение."
    }
  ],
  "lsec-logging-auditd": [
    {
      "sourceId": "audit-auditctl",
      "focus": "Различайте runtime rules и rules.d, удаление watch через -W и immutable policy."
    }
  ],
  "eth-passwords-hashes": [
    {
      "sourceId": "audit-python-kdf",
      "focus": "Проверьте pbkdf2_hmac, соль и итерации; стоимость измеряется на конкретной машине."
    },
    {
      "sourceId": "audit-python-313",
      "focus": "Модуль crypt удалён из стандартной библиотеки Python 3.13; пример не должен скрывать эту ошибку через || true."
    }
  ],
  "az-storage-security": [
    {
      "sourceId": "audit-storage-key",
      "focus": "Сравните Entra DataActions с management-plane listKeys и доступом через Shared Key."
    }
  ],
  "az-blob-storage": [
    {
      "sourceId": "audit-storage-hns",
      "focus": "Различайте плоский namespace и реальные операции с каталогами при ADLS Gen2 HNS."
    },
    {
      "sourceId": "audit-archive",
      "focus": "Сверьте online tiers Hot, Cool и Cold и ограничения операции rehydration."
    }
  ],
  "az-nsg": [
    {
      "sourceId": "audit-nsg-retirement",
      "focus": "Новые NSG flow logs больше не создаются; retirement 30.09.2027. Для нового стенда выбирайте VNet flow logs."
    }
  ],
  "az-network-watcher": [
    {
      "sourceId": "audit-nsg-retirement",
      "focus": "Новые NSG flow logs больше не создаются; retirement 30.09.2027. Для нового стенда выбирайте VNet flow logs."
    }
  ],
  "az-load-balancer": [
    {
      "sourceId": "audit-lb-retirement",
      "focus": "Basic Load Balancer retired 30.09.2025; изучите ограничения миграции в Standard."
    }
  ],
  "az-app-service-plans": [
    {
      "sourceId": "audit-app-scaling",
      "focus": "Общее число экземпляров плана и число экземпляров приложения — разные настройки на поддерживаемых SKU."
    }
  ],
  "az-password-reset": [
    {
      "sourceId": "audit-sspr-license",
      "focus": "Сопоставьте cloud password change, cloud password reset и hybrid writeback с Free, Microsoft 365 и P1/P2."
    },
    {
      "sourceId": "audit-sspr-methods",
      "focus": "Для two-method policy зарегистрируйте два подходящих метода. Authenticator и OATH считаются одним методом; это не классификация факторов MFA."
    }
  ],
  "az-entra-fundamentals": [
    {
      "sourceId": "audit-oidc",
      "focus": "OpenID Connect добавляет authentication поверх OAuth 2.0; не подменяйте ID token токеном доступа API."
    }
  ],
  "entra-id": [
    {
      "sourceId": "audit-oidc",
      "focus": "OpenID Connect добавляет authentication поверх OAuth 2.0; не подменяйте ID token токеном доступа API."
    }
  ],
  "secplus-iam": [
    {
      "sourceId": "audit-oidc",
      "focus": "OpenID Connect добавляет authentication поверх OAuth 2.0; не подменяйте ID token токеном доступа API."
    }
  ],
  "powershell": [
    {
      "sourceId": "audit-ps-ssh",
      "focus": "PowerShell 7 поддерживает SSH transport; WinRM нужен WSMan-сценарию, а не каждому remoting-сеансу."
    }
  ],
  "eth-lab-setup": [
    {
      "sourceId": "audit-docker-bridge",
      "focus": "Loopback port publishing ограничивает входящие подключения, но не блокирует исходящую сеть контейнера."
    }
  ],
  "ct-virtualization-containers": [
    {
      "sourceId": "audit-docker-bridge",
      "focus": "Loopback port publishing ограничивает входящие подключения, но не блокирует исходящую сеть контейнера."
    }
  ],
  "server-deployment": [
    {
      "sourceId": "audit-windows-hardware",
      "focus": "Ориентируйтесь на таблицу текущей версии и варианта установки; исторические примечания установщика не снижают минимум RAM Windows Server 2025."
    },
    {
      "sourceId": "audit-ad-vm",
      "focus": "Проверьте условия VM-GenerationID safeguards и отличие поддерживаемого восстановления от произвольного отката/независимого backup."
    }
  ],
  "ct-computer-architecture": [
    {
      "sourceId": "audit-windows-hardware",
      "focus": "Ориентируйтесь на таблицу текущей версии и варианта установки; исторические примечания установщика не снижают минимум RAM Windows Server 2025."
    }
  ],
  "ad-ds": [
    {
      "sourceId": "audit-ad-vm",
      "focus": "Проверьте условия VM-GenerationID safeguards и отличие поддерживаемого восстановления от произвольного отката/независимого backup."
    },
    {
      "sourceId": "audit-ad-recycle",
      "focus": "Различайте deleted object lifetime и tombstone lifetime; проверяйте текущие атрибуты леса."
    },
    {
      "sourceId": "audit-ad-name",
      "focus": "Сверьте выбор имени леса, владение DNS-именем и варианты внутреннего и внешнего namespace."
    }
  ],
  "bash": [
    {
      "sourceId": "audit-inode",
      "focus": "Проверьте ограничения SUID и sticky bit: права владельца каталога и привилегированного процесса не исчезают."
    }
  ],
  "secplus-vulnerability-management": [
    {
      "sourceId": "audit-kev-data",
      "focus": "Официальный репозиторий CISA даёт альтернативный доступ к KEV; это не полный список всех уязвимостей."
    }
  ],
  "lsec-updates": [
    {
      "sourceId": "audit-kev-data",
      "focus": "Официальный репозиторий CISA даёт альтернативный доступ к KEV; это не полный список всех уязвимостей."
    }
  ]
};
