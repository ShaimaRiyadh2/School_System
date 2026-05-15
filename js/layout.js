// ─── Auth Guard ───────────────────────────────────────────────
function getAuth() {
    const a = sessionStorage.getItem('auth');
    if (!a) { window.location.href = '../login.html'; return null; }
    return JSON.parse(a);
}

// ─── Render Sidebar + Header ──────────────────────────────────
function renderLayout(activePage) {
    const auth = getAuth();
    if (!auth) return;

    const menu = [
        { icon: 'fa-home',           label: 'الرئيسية',      url: 'dashboard.html',   roles: ['Admin','Staff','Student','Parent'] },
        { icon: 'fa-users',          label: 'الطلاب',        url: 'students.html',    roles: ['Admin','Staff'] },
        { icon: 'fa-calendar-check', label: 'الحضور',        url: 'attendance.html',  roles: ['Admin','Staff'] },
        { icon: 'fa-book-open',      label: 'مخطط الدروس',   url: 'planner.html',     roles: ['Admin','Staff','Student'] },
        { icon: 'fa-star',           label: 'سجل الدرجات',   url: 'markbook.html',    roles: ['Admin','Staff','Student','Parent'] },
        { icon: 'fa-envelope',       label: 'الرسائل',       url: 'messenger.html',   roles: ['Admin','Staff','Student','Parent'] },
        { icon: 'fa-user-tie',       label: 'أولياء الأمور', url: 'parents.html',     roles: ['Admin'] },
        { icon: 'fa-door-open',      label: 'الفصول',        url: 'classes.html',     roles: ['Admin'] },
        { icon: 'fa-layer-group',    label: 'المراحل',       url: 'stages.html',      roles: ['Admin'] },
        { icon: 'fa-cog',            label: 'إدارة النظام',  url: 'admin.html',       roles: ['Admin'] },
    ];

    const menuHTML = menu
        .filter(item => item.roles.includes(auth.role_category))
        .map(item => `
            <a href="${item.url}"
               class="sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-gray-600 transition-all text-sm ${activePage === item.url ? 'active' : ''}">
                <i class="fas ${item.icon} w-5 text-center text-base"></i>
                <span class="sidebar-label whitespace-nowrap">${item.label}</span>
            </a>
        `).join('');

    const avatarSrc = `https://ui-avatars.com/api/?name=${encodeURIComponent(auth.full_name)}&background=A88EDB&color=fff&size=64`;

    document.getElementById('app-layout').innerHTML = `
    <!-- Mobile overlay -->
    <div id="sidebar-overlay" onclick="closeSidebar()" class="hidden fixed inset-0 bg-black/40 z-30 md:hidden"></div>

    <aside id="sidebar" class="fixed top-0 right-0 h-full bg-white shadow-lg z-40 transition-all duration-300 flex flex-col w-64
        -translate-x-full md:translate-x-0" style="transform: translateX(0)">
        <div class="flex items-center justify-between px-4 py-4 border-b border-gray-100">
            <span id="sidebar-logo" class="text-lg font-bold text-purple-600">
                <i class="fas fa-graduation-cap ml-2"></i>School System
            </span>
            <button onclick="toggleSidebar()" class="text-gray-400 hover:text-purple-600 transition-colors">
                <i id="sidebar-toggle-icon" class="fas fa-chevron-right text-sm"></i>
            </button>
        </div>
        <nav class="flex-1 overflow-y-auto py-4 px-2">${menuHTML}</nav>
        <div id="sidebar-user" class="border-t border-gray-100 p-4">
            <div class="flex items-center gap-3">
                <img src="${avatarSrc}" class="w-9 h-9 rounded-full object-cover border-2 border-purple-400">
                <div class="overflow-hidden sidebar-label">
                    <p class="text-sm font-semibold text-gray-700 truncate">${auth.full_name}</p>
                    <p class="text-xs text-gray-400">${auth.role_name}</p>
                </div>
            </div>
        </div>
    </aside>

    <div id="main-wrap" class="md:mr-64 transition-all duration-300 min-h-screen flex flex-col">
        <header class="bg-white shadow-sm sticky top-0 z-30 px-4 md:px-6 py-3 flex items-center justify-between">
            <div class="flex items-center gap-3">
                <!-- Mobile hamburger -->
                <button onclick="openSidebar()" class="md:hidden text-gray-500 hover:text-purple-600 p-1">
                    <i class="fas fa-bars text-lg"></i>
                </button>
                <div class="text-sm text-gray-500" id="breadcrumb-slot"></div>
            </div>
            <div class="flex items-center gap-4">
                <div class="relative" id="notif-wrap">
                    <button onclick="toggleNotif()" class="relative text-gray-500 hover:text-purple-600 transition-colors">
                        <i class="fas fa-bell text-lg"></i>
                        <span id="notif-badge" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 items-center justify-center hidden">3</span>
                    </button>
                    <div id="notif-dropdown" class="hidden absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 z-50">
                        <div class="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                            <span class="font-semibold text-sm">الإشعارات</span>
                            <a href="notifications.html" class="text-xs text-purple-600 hover:underline">عرض الكل</a>
                        </div>
                        <div class="divide-y divide-gray-50">
                            <div class="px-4 py-3 flex items-start gap-3 bg-purple-50">
                                <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <i class="fas fa-bell text-white text-xs"></i>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-800">درجة جديدة في الرياضيات</p>
                                    <p class="text-xs text-gray-400 mt-0.5">منذ 5 دقائق</p>
                                </div>
                            </div>
                            <div class="px-4 py-3 flex items-start gap-3 bg-purple-50">
                                <div class="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <i class="fas fa-envelope text-white text-xs"></i>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-800">رسالة جديدة من الإدارة</p>
                                    <p class="text-xs text-gray-400 mt-0.5">منذ ساعة</p>
                                </div>
                            </div>
                            <div class="px-4 py-3 flex items-start gap-3">
                                <div class="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <i class="fas fa-calendar text-gray-400 text-xs"></i>
                                </div>
                                <div>
                                    <p class="text-sm font-medium text-gray-800">تم تسجيل الحضور</p>
                                    <p class="text-xs text-gray-400 mt-0.5">اليوم 8:00 ص</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="relative" id="user-menu-wrap">
                    <button onclick="toggleUserMenu()" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <img src="${avatarSrc}" class="w-8 h-8 rounded-full object-cover border-2 border-purple-400">
                        <span class="text-sm font-medium text-gray-700 hidden sm:block">${auth.full_name}</span>
                        <i class="fas fa-chevron-down text-xs text-gray-400"></i>
                    </button>
                    <div id="user-dropdown" class="hidden absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-1">
                        <a href="dashboard.html" class="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <i class="fas fa-tachometer-alt w-4"></i> لوحة التحكم
                        </a>
                        <hr class="my-1 border-gray-100">
                        <button onclick="logout()" class="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                            <i class="fas fa-sign-out-alt w-4"></i> تسجيل الخروج
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <main class="flex-1 p-6" id="page-content"></main>

        <footer class="text-center text-xs text-gray-400 py-4 border-t border-gray-100">
            School System &copy; 2025
        </footer>
    </div>
    `;
}

// ─── Sidebar Toggle ───────────────────────────────────────────
let sidebarOpen = true;

function openSidebar() {
    document.getElementById('sidebar').style.transform = 'translateX(0)';
    document.getElementById('sidebar-overlay').classList.remove('hidden');
}
function closeSidebar() {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
        document.getElementById('sidebar').style.transform = 'translateX(100%)';
        document.getElementById('sidebar-overlay').classList.add('hidden');
    }
}

function toggleSidebar() {
    const isMobile = window.innerWidth < 768;
    if (isMobile) { closeSidebar(); return; }

    sidebarOpen = !sidebarOpen;
    const sidebar = document.getElementById('sidebar');
    const mainWrap = document.getElementById('main-wrap');
    const labels = document.querySelectorAll('.sidebar-label');
    const logo = document.getElementById('sidebar-logo');
    const userInfo = document.getElementById('sidebar-user');
    const icon = document.getElementById('sidebar-toggle-icon');

    if (sidebarOpen) {
        sidebar.classList.remove('w-16'); sidebar.classList.add('w-64');
        mainWrap.classList.remove('md:mr-16'); mainWrap.classList.add('md:mr-64');
        labels.forEach(l => l.classList.remove('hidden'));
        logo.classList.remove('hidden');
        userInfo.classList.remove('hidden');
        icon.classList.remove('fa-chevron-left'); icon.classList.add('fa-chevron-right');
    } else {
        sidebar.classList.remove('w-64'); sidebar.classList.add('w-16');
        mainWrap.classList.remove('md:mr-64'); mainWrap.classList.add('md:mr-16');
        labels.forEach(l => l.classList.add('hidden'));
        logo.classList.add('hidden');
        userInfo.classList.add('hidden');
        icon.classList.remove('fa-chevron-right'); icon.classList.add('fa-chevron-left');
    }
}

// ─── Dropdowns ────────────────────────────────────────────────
function toggleNotif() {
    document.getElementById('notif-dropdown').classList.toggle('hidden');
    document.getElementById('user-dropdown').classList.add('hidden');
}
function toggleUserMenu() {
    document.getElementById('user-dropdown').classList.toggle('hidden');
    document.getElementById('notif-dropdown').classList.add('hidden');
}
document.addEventListener('click', e => {
    if (!document.getElementById('notif-wrap')?.contains(e.target))
        document.getElementById('notif-dropdown')?.classList.add('hidden');
    if (!document.getElementById('user-menu-wrap')?.contains(e.target))
        document.getElementById('user-dropdown')?.classList.add('hidden');
});

// ─── Logout ───────────────────────────────────────────────────
function logout() {
    sessionStorage.removeItem('auth');
    window.location.href = '../login.html';
}

// ─── Flash Message ────────────────────────────────────────────
function showFlash(msg, type = 'success') {
    const colors = type === 'success'
        ? 'bg-green-50 border-green-200 text-green-700'
        : 'bg-red-50 border-red-200 text-red-700';
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const el = document.createElement('div');
    el.className = `mb-4 p-4 border rounded-lg flex items-center gap-3 ${colors}`;
    el.innerHTML = `<i class="fas ${icon}"></i><span>${msg}</span>`;
    document.getElementById('page-content').prepend(el);
    setTimeout(() => el.remove(), 4000);
}
