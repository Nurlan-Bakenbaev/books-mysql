const directories = {
  '/': ['home/'],
  '/home': ['student/'],
  '/home/student': ['logs/', 'notes.txt'],
  '/home/student/logs': ['practice.log'],
};

const files = {
  '/home/student/notes.txt': 'Учебная VM: проверяйте команды перед запуском.',
  '/home/student/logs/practice.log': 'INFO: учебная служба запущена\nERROR: учебный тайм-аут',
};

function resolvePath(cwd, target) {
  const parts = target.startsWith('/') ? [] : cwd.split('/').filter(Boolean);
  for (const part of target.split('/')) {
    if (!part || part === '.') continue;
    if (part === '..') parts.pop();
    else parts.push(part);
  }
  return `/${parts.join('/')}`;
}

export function executeVirtualCommand(input, cwd) {
  const [command, ...args] = input.trim().split(/\s+/);
  if (command === 'help' && args.length === 0) return { cwd, output: 'Команды: help, pwd, ls, cd [путь], cat <файл>, whoami, clear' };
  if (command === 'pwd' && args.length === 0) return { cwd, output: cwd };
  if (command === 'whoami' && args.length === 0) return { cwd, output: 'student' };
  if (command === 'clear' && args.length === 0) return { cwd, output: '', clear: true };
  if (command === 'ls' && args.length <= 1) {
    const path = resolvePath(cwd, args[0] || '.');
    return { cwd, output: Object.hasOwn(directories, path) ? directories[path].join('  ') : `ls: каталог не найден: ${path}` };
  }
  if (command === 'cd' && args.length <= 1) {
    const path = resolvePath(cwd, args[0] || '/home/student');
    return Object.hasOwn(directories, path) ? { cwd: path, output: '' } : { cwd, output: `cd: каталог не найден: ${path}` };
  }
  if (command === 'cat' && args.length === 1) {
    const path = resolvePath(cwd, args[0]);
    return { cwd, output: Object.hasOwn(files, path) ? files[path] : `cat: файл не найден: ${path}` };
  }
  return { cwd, output: 'Команда или аргументы не поддерживаются симулятором. Введите help.' };
}
