export const courseOrder = ['computer-technologies', 'roadmap', 'network-engineer', 'azure-admin', 'security-plus', 'windows-security', 'linux-security', 'ethical-hacking'];
export const orderCourses = (courses) => [...courses].sort((a, b) => courseOrder.indexOf(a.id) - courseOrder.indexOf(b.id));
