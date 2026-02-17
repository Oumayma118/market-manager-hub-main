export type TranslationKey = 
  | 'dashboard' | 'centers' | 'locals' | 'owners' | 'activities' | 'settings'
  | 'dashboard_subtitle' | 'commercial_centers' | 'available_locals' | 'active_owners'
  | 'monthly_revenue' | 'total_locals' | 'out_of' | 'ongoing_rentals' | 'occupancy_rate'
  | 'vs_last_month' | 'revenue_evolution' | 'occupancy_chart' | 'rented' | 'available'
  | 'locals_per_center' | 'activities_distribution' | 'recent_locals' | 'view_all'
  | 'manage' | 'center' | 'occupation' | 'search' | 'add' | 'edit' | 'delete'
  | 'cancel' | 'save' | 'confirm_delete' | 'confirm_delete_msg' | 'name' | 'address'
  | 'description' | 'type' | 'size' | 'status' | 'monthly_rent' | 'first_name'
  | 'last_name' | 'email' | 'phone' | 'login' | 'register' | 'logout' | 'password'
  | 'confirm_password' | 'full_name' | 'connect' | 'create_account' | 'no_account'
  | 'have_account' | 'welcome' | 'login_subtitle' | 'register_subtitle'
  | 'settings_subtitle' | 'language' | 'language_desc' | 'currency' | 'currency_desc'
  | 'notifications' | 'notifications_desc' | 'appearance' | 'appearance_desc'
  | 'security' | 'security_desc' | 'theme' | 'light' | 'dark' | 'system'
  | 'animations' | 'animations_desc' | 'new_tenants' | 'new_tenants_desc'
  | 'late_payments' | 'late_payments_desc' | 'monthly_reports' | 'monthly_reports_desc'
  | 'two_factor' | 'two_factor_desc' | 'change_password' | 'change_password_desc'
  | 'enable' | 'modify' | 'boutique' | 'restaurant' | 'service' | 'artisanat' | 'other'
  | 'no_data' | 'loading' | 'error' | 'actions' | 'created_at'
  | 'login_success' | 'register_success' | 'language_changed' | 'currency_changed'
  | 'theme_changed' | 'animations_enabled' | 'animations_disabled'
  | 'hero_subtitle' | 'hero_register';

type Translations = Record<TranslationKey, string>;

const fr: Translations = {
  dashboard: 'Tableau de bord', centers: 'Centres', locals: 'Locaux', owners: 'Propriétaires',
  activities: 'Activités', settings: 'Paramètres', dashboard_subtitle: "Vue d'ensemble de votre portefeuille immobilier",
  commercial_centers: 'Centres commerciaux', available_locals: 'Locaux disponibles',
  active_owners: 'Propriétaires actifs', monthly_revenue: 'Revenus mensuels',
  total_locals: 'locaux au total', out_of: 'sur', ongoing_rentals: 'locations en cours',
  occupancy_rate: "Taux d'occupation", vs_last_month: 'vs mois dernier',
  revenue_evolution: 'Évolution des revenus', occupancy_chart: "Taux d'occupation",
  rented: 'Loués', available: 'Disponibles', locals_per_center: 'Locaux par centre',
  activities_distribution: 'Répartition des activités', recent_locals: 'Locaux récents',
  view_all: 'Voir tout', manage: 'Gérer', center: 'Centre', occupation: 'Occupation',
  search: 'Rechercher...', add: 'Ajouter', edit: 'Modifier', delete: 'Supprimer',
  cancel: 'Annuler', save: 'Enregistrer', confirm_delete: 'Confirmer la suppression',
  confirm_delete_msg: 'Êtes-vous sûr de vouloir supprimer cet élément ?',
  name: 'Nom', address: 'Adresse', description: 'Description', type: 'Type',
  size: 'Taille (m²)', status: 'Statut', monthly_rent: 'Loyer mensuel',
  first_name: 'Prénom', last_name: 'Nom de famille', email: 'Email', phone: 'Téléphone',
  login: 'Connexion', register: 'Inscription', logout: 'Déconnexion',
  password: 'Mot de passe', confirm_password: 'Confirmer le mot de passe',
  full_name: 'Nom complet', connect: 'Se connecter', create_account: "S'inscrire",
  no_account: 'Pas encore de compte ?', have_account: 'Déjà un compte ?',
  welcome: 'Bienvenue sur INDH Market Manager',
  login_subtitle: 'Connectez-vous à votre compte', register_subtitle: 'Créez votre compte',
  settings_subtitle: 'Configurez votre application INDH Market Manager',
  language: 'Langue', language_desc: "Choisissez la langue de l'interface",
  currency: 'Devise', currency_desc: "Devise utilisée dans l'application",
  notifications: 'Notifications', notifications_desc: 'Gérez vos alertes',
  appearance: 'Apparence', appearance_desc: "Personnalisez l'interface",
  security: 'Sécurité', security_desc: 'Protégez votre compte',
  theme: 'Thème', light: 'Clair', dark: 'Sombre', system: 'Système',
  animations: 'Animations', animations_desc: 'Transitions et effets visuels',
  new_tenants: 'Nouveaux locataires', new_tenants_desc: 'Notification par email',
  late_payments: 'Paiements en retard', late_payments_desc: 'Alertes automatiques',
  monthly_reports: 'Rapports mensuels', monthly_reports_desc: 'Résumé par email',
  two_factor: 'Authentification à deux facteurs', two_factor_desc: 'Non activée',
  change_password: 'Changer le mot de passe', change_password_desc: 'Dernière modification: il y a 30 jours',
  enable: 'Activer', modify: 'Modifier',
  boutique: 'Boutique', restaurant: 'Restaurant', service: 'Service', artisanat: 'Artisanat', other: 'Autre',
  no_data: 'Aucune donnée', loading: 'Chargement...', error: 'Erreur', actions: 'Actions', created_at: 'Créé le',
  login_success: 'Connexion réussie', register_success: 'Inscription réussie',
  language_changed: 'Langue modifiée', currency_changed: 'Devise modifiée',
  theme_changed: 'Thème modifié', animations_enabled: 'Animations activées',
  animations_disabled: 'Animations désactivées',
  hero_subtitle: 'Gérez vos centres commerciaux, locaux, propriétaires et activités en toute simplicité.',
  hero_register: 'Rejoignez la plateforme de gestion des marchés INDH.',
};

const en: Translations = {
  dashboard: 'Dashboard', centers: 'Centers', locals: 'Locals', owners: 'Owners',
  activities: 'Activities', settings: 'Settings', dashboard_subtitle: 'Overview of your real estate portfolio',
  commercial_centers: 'Shopping Centers', available_locals: 'Available Locals',
  active_owners: 'Active Owners', monthly_revenue: 'Monthly Revenue',
  total_locals: 'total locals', out_of: 'out of', ongoing_rentals: 'ongoing rentals',
  occupancy_rate: 'Occupancy rate', vs_last_month: 'vs last month',
  revenue_evolution: 'Revenue Evolution', occupancy_chart: 'Occupancy Rate',
  rented: 'Rented', available: 'Available', locals_per_center: 'Locals per Center',
  activities_distribution: 'Activities Distribution', recent_locals: 'Recent Locals',
  view_all: 'View all', manage: 'Manage', center: 'Center', occupation: 'Occupation',
  search: 'Search...', add: 'Add', edit: 'Edit', delete: 'Delete',
  cancel: 'Cancel', save: 'Save', confirm_delete: 'Confirm Deletion',
  confirm_delete_msg: 'Are you sure you want to delete this item?',
  name: 'Name', address: 'Address', description: 'Description', type: 'Type',
  size: 'Size (m²)', status: 'Status', monthly_rent: 'Monthly Rent',
  first_name: 'First Name', last_name: 'Last Name', email: 'Email', phone: 'Phone',
  login: 'Login', register: 'Register', logout: 'Logout',
  password: 'Password', confirm_password: 'Confirm Password',
  full_name: 'Full Name', connect: 'Sign In', create_account: 'Sign Up',
  no_account: "Don't have an account?", have_account: 'Already have an account?',
  welcome: 'Welcome to INDH Market Manager',
  login_subtitle: 'Sign in to your account', register_subtitle: 'Create your account',
  settings_subtitle: 'Configure your INDH Market Manager application',
  language: 'Language', language_desc: 'Choose the interface language',
  currency: 'Currency', currency_desc: 'Currency used in the application',
  notifications: 'Notifications', notifications_desc: 'Manage your alerts',
  appearance: 'Appearance', appearance_desc: 'Customize the interface',
  security: 'Security', security_desc: 'Protect your account',
  theme: 'Theme', light: 'Light', dark: 'Dark', system: 'System',
  animations: 'Animations', animations_desc: 'Transitions and visual effects',
  new_tenants: 'New Tenants', new_tenants_desc: 'Email notification',
  late_payments: 'Late Payments', late_payments_desc: 'Automatic alerts',
  monthly_reports: 'Monthly Reports', monthly_reports_desc: 'Email summary',
  two_factor: 'Two-Factor Authentication', two_factor_desc: 'Not enabled',
  change_password: 'Change Password', change_password_desc: 'Last changed: 30 days ago',
  enable: 'Enable', modify: 'Modify',
  boutique: 'Shop', restaurant: 'Restaurant', service: 'Service', artisanat: 'Craft', other: 'Other',
  no_data: 'No data', loading: 'Loading...', error: 'Error', actions: 'Actions', created_at: 'Created at',
  login_success: 'Login successful', register_success: 'Registration successful',
  language_changed: 'Language changed', currency_changed: 'Currency changed',
  theme_changed: 'Theme changed', animations_enabled: 'Animations enabled',
  animations_disabled: 'Animations disabled',
  hero_subtitle: 'Manage your shopping centers, locals, owners and activities with ease.',
  hero_register: 'Join the INDH market management platform.',
};

const ar: Translations = {
  dashboard: 'لوحة القيادة', centers: 'المراكز', locals: 'المحلات', owners: 'المالكون',
  activities: 'الأنشطة', settings: 'الإعدادات', dashboard_subtitle: 'نظرة عامة على محفظتك العقارية',
  commercial_centers: 'المراكز التجارية', available_locals: 'المحلات المتاحة',
  active_owners: 'المالكون النشطون', monthly_revenue: 'الإيرادات الشهرية',
  total_locals: 'إجمالي المحلات', out_of: 'من', ongoing_rentals: 'إيجارات جارية',
  occupancy_rate: 'معدل الإشغال', vs_last_month: 'مقارنة بالشهر الماضي',
  revenue_evolution: 'تطور الإيرادات', occupancy_chart: 'معدل الإشغال',
  rented: 'مؤجرة', available: 'متاحة', locals_per_center: 'المحلات لكل مركز',
  activities_distribution: 'توزيع الأنشطة', recent_locals: 'المحلات الأخيرة',
  view_all: 'عرض الكل', manage: 'إدارة', center: 'مركز', occupation: 'إشغال',
  search: 'بحث...', add: 'إضافة', edit: 'تعديل', delete: 'حذف',
  cancel: 'إلغاء', save: 'حفظ', confirm_delete: 'تأكيد الحذف',
  confirm_delete_msg: 'هل أنت متأكد من حذف هذا العنصر؟',
  name: 'الاسم', address: 'العنوان', description: 'الوصف', type: 'النوع',
  size: 'المساحة (م²)', status: 'الحالة', monthly_rent: 'الإيجار الشهري',
  first_name: 'الاسم الأول', last_name: 'اسم العائلة', email: 'البريد الإلكتروني', phone: 'الهاتف',
  login: 'تسجيل الدخول', register: 'التسجيل', logout: 'تسجيل الخروج',
  password: 'كلمة المرور', confirm_password: 'تأكيد كلمة المرور',
  full_name: 'الاسم الكامل', connect: 'دخول', create_account: 'إنشاء حساب',
  no_account: 'ليس لديك حساب؟', have_account: 'لديك حساب بالفعل؟',
  welcome: 'مرحباً بك في INDH Market Manager',
  login_subtitle: 'سجل الدخول إلى حسابك', register_subtitle: 'أنشئ حسابك',
  settings_subtitle: 'قم بتكوين تطبيق INDH Market Manager',
  language: 'اللغة', language_desc: 'اختر لغة الواجهة',
  currency: 'العملة', currency_desc: 'العملة المستخدمة في التطبيق',
  notifications: 'الإشعارات', notifications_desc: 'إدارة التنبيهات',
  appearance: 'المظهر', appearance_desc: 'تخصيص الواجهة',
  security: 'الأمان', security_desc: 'حماية حسابك',
  theme: 'السمة', light: 'فاتح', dark: 'داكن', system: 'النظام',
  animations: 'الرسوم المتحركة', animations_desc: 'التحولات والتأثيرات البصرية',
  new_tenants: 'مستأجرون جدد', new_tenants_desc: 'إشعار بالبريد الإلكتروني',
  late_payments: 'مدفوعات متأخرة', late_payments_desc: 'تنبيهات تلقائية',
  monthly_reports: 'تقارير شهرية', monthly_reports_desc: 'ملخص بالبريد الإلكتروني',
  two_factor: 'المصادقة الثنائية', two_factor_desc: 'غير مفعلة',
  change_password: 'تغيير كلمة المرور', change_password_desc: 'آخر تغيير: قبل 30 يوماً',
  enable: 'تفعيل', modify: 'تعديل',
  boutique: 'متجر', restaurant: 'مطعم', service: 'خدمة', artisanat: 'حرف يدوية', other: 'أخرى',
  no_data: 'لا توجد بيانات', loading: 'جاري التحميل...', error: 'خطأ', actions: 'إجراءات', created_at: 'تاريخ الإنشاء',
  login_success: 'تم تسجيل الدخول بنجاح', register_success: 'تم التسجيل بنجاح',
  language_changed: 'تم تغيير اللغة', currency_changed: 'تم تغيير العملة',
  theme_changed: 'تم تغيير السمة', animations_enabled: 'تم تفعيل الرسوم المتحركة',
  animations_disabled: 'تم تعطيل الرسوم المتحركة',
  hero_subtitle: 'قم بإدارة مراكزك التجارية ومحلاتك ومالكيك وأنشطتك بكل سهولة.',
  hero_register: 'انضم إلى منصة إدارة أسواق INDH.',
};

const es: Translations = {
  dashboard: 'Panel de control', centers: 'Centros', locals: 'Locales', owners: 'Propietarios',
  activities: 'Actividades', settings: 'Configuración', dashboard_subtitle: 'Resumen de su cartera inmobiliaria',
  commercial_centers: 'Centros comerciales', available_locals: 'Locales disponibles',
  active_owners: 'Propietarios activos', monthly_revenue: 'Ingresos mensuales',
  total_locals: 'locales en total', out_of: 'de', ongoing_rentals: 'alquileres en curso',
  occupancy_rate: 'Tasa de ocupación', vs_last_month: 'vs mes anterior',
  revenue_evolution: 'Evolución de ingresos', occupancy_chart: 'Tasa de ocupación',
  rented: 'Alquilados', available: 'Disponibles', locals_per_center: 'Locales por centro',
  activities_distribution: 'Distribución de actividades', recent_locals: 'Locales recientes',
  view_all: 'Ver todo', manage: 'Gestionar', center: 'Centro', occupation: 'Ocupación',
  search: 'Buscar...', add: 'Agregar', edit: 'Editar', delete: 'Eliminar',
  cancel: 'Cancelar', save: 'Guardar', confirm_delete: 'Confirmar eliminación',
  confirm_delete_msg: '¿Está seguro de que desea eliminar este elemento?',
  name: 'Nombre', address: 'Dirección', description: 'Descripción', type: 'Tipo',
  size: 'Tamaño (m²)', status: 'Estado', monthly_rent: 'Alquiler mensual',
  first_name: 'Nombre', last_name: 'Apellido', email: 'Correo', phone: 'Teléfono',
  login: 'Iniciar sesión', register: 'Registrarse', logout: 'Cerrar sesión',
  password: 'Contraseña', confirm_password: 'Confirmar contraseña',
  full_name: 'Nombre completo', connect: 'Entrar', create_account: 'Registrarse',
  no_account: '¿No tiene cuenta?', have_account: '¿Ya tiene una cuenta?',
  welcome: 'Bienvenido a INDH Market Manager',
  login_subtitle: 'Inicie sesión en su cuenta', register_subtitle: 'Cree su cuenta',
  settings_subtitle: 'Configure su aplicación INDH Market Manager',
  language: 'Idioma', language_desc: 'Elija el idioma de la interfaz',
  currency: 'Moneda', currency_desc: 'Moneda utilizada en la aplicación',
  notifications: 'Notificaciones', notifications_desc: 'Gestione sus alertas',
  appearance: 'Apariencia', appearance_desc: 'Personalice la interfaz',
  security: 'Seguridad', security_desc: 'Proteja su cuenta',
  theme: 'Tema', light: 'Claro', dark: 'Oscuro', system: 'Sistema',
  animations: 'Animaciones', animations_desc: 'Transiciones y efectos visuales',
  new_tenants: 'Nuevos inquilinos', new_tenants_desc: 'Notificación por correo',
  late_payments: 'Pagos atrasados', late_payments_desc: 'Alertas automáticas',
  monthly_reports: 'Informes mensuales', monthly_reports_desc: 'Resumen por correo',
  two_factor: 'Autenticación de dos factores', two_factor_desc: 'No activada',
  change_password: 'Cambiar contraseña', change_password_desc: 'Última modificación: hace 30 días',
  enable: 'Activar', modify: 'Modificar',
  boutique: 'Tienda', restaurant: 'Restaurante', service: 'Servicio', artisanat: 'Artesanía', other: 'Otro',
  no_data: 'Sin datos', loading: 'Cargando...', error: 'Error', actions: 'Acciones', created_at: 'Creado el',
  login_success: 'Inicio de sesión exitoso', register_success: 'Registro exitoso',
  language_changed: 'Idioma cambiado', currency_changed: 'Moneda cambiada',
  theme_changed: 'Tema cambiado', animations_enabled: 'Animaciones activadas',
  animations_disabled: 'Animaciones desactivadas',
  hero_subtitle: 'Gestione sus centros comerciales, locales, propietarios y actividades con facilidad.',
  hero_register: 'Únase a la plataforma de gestión de mercados INDH.',
};

const translations: Record<string, Translations> = { fr, en, ar, es };

export function getTranslations(lang: string): Translations {
  return translations[lang] || fr;
}

export function useTranslation() {
  // This is a simple hook - import and use in components
  // Usage: const t = useT(); then t('dashboard')
}
