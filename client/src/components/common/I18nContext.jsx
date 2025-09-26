import { createContext, useContext, useEffect, useMemo, useState } from "react";

const DEFAULT_LANG = "es";

const resources = {
  es: {
    nav: { home: "Inicio", features: "Características", how: "Cómo funciona", faq: "FAQ" },
    auth: { login: "Iniciar sesión", register: "Registrarse", logout: "Cerrar sesión" },
    header: { myGroups: "Mis Grupos" },
    hero: {
      title: "Organiza tareas en equipo de forma simple y efectiva",
      subtitle:
        "WeDo Taskys te ayuda a coordinar proyectos, distribuir responsabilidades y hacer seguimiento del progreso en tiempo real.",
      start: "Comenzar ahora",
      demo: "Ver demostración",
      goGroups: "Ir a Mis Grupos",
      loginOrRegister: "Iniciar sesión o Registrarse",
      groupTitle: "Grupos de Trabajo",
      groupSubtitle: "Gestiona tus grupos, colabora y comparte tareas con tu equipo.",
      needLogin: "Debes iniciar sesión o registrarte para acceder a tus grupos."
    },
    features: { title: "Características principales" },
    how: {
      title: "Cómo funciona",
      subtitle: "Descubre la experiencia de WeDo en tres simples pasos",
      step1Title: "Crea tu cuenta",
      step1Desc: "Regístrate en segundos con tu correo electrónico o cuenta de Google. Configura tu perfil y personaliza tus preferencias.",
      step2Title: "Crea tu primer proyecto",
      step2Desc: "Configura un nuevo proyecto, invita a los miembros de tu equipo y comienza a crear tareas. Organiza todo según tus necesidades.",
      step3Title: "Colabora y haz seguimiento",
      step3Desc: "Trabaja con tu equipo en tiempo real, asigna tareas, comenta y haz seguimiento del progreso. Recibe notificaciones y mantente al día con todo."
    },
    footer: { tagline: "Organiza tareas en equipo de forma simple y efectiva." },
    faq: {
      title: "Preguntas Frecuentes",
      subtitle: "Encuentra respuestas a las preguntas más comunes sobre WeDo",
      q1: "¿Qué es WeDo y cómo puede ayudar a mi equipo?",
      a1: "WeDo es una plataforma de gestión de tareas para equipos. Crea, asigna y hace seguimiento de tareas en tiempo real, facilitando la colaboración y la productividad.",
      q2: "¿Es gratuito usar WeDo?",
      a2: "Ofrecemos un plan gratuito con funcionalidades básicas y planes premium con características avanzadas como reportes e integraciones.",
      q3: "¿Puedo invitar a miembros de mi equipo?",
      a3: "Sí, puedes invitar a tu equipo por correo, asignar roles y permisos y colaborar en tiempo real.",
      q4: "¿Cómo funciona la colaboración en tiempo real?",
      a4: "Los cambios se sincronizan al instante. Recibe notificaciones, comenta y comparte archivos en cada tarea.",
      q5: "¿Qué tipos de proyectos puedo gestionar?",
      a5: "WeDo se adapta a cualquier proyecto: software, marketing, diseño, eventos, investigación y más. Personaliza tableros, etiquetas y flujos.",
      q6: "¿Mis datos están seguros?",
      a6: "Usamos cifrado, copias de seguridad y cumplimos estándares de protección de datos. Tu información está protegida.",
      q7: "¿Puedo acceder desde dispositivos móviles?",
      a7: "Sí, funciona perfecto en computadoras, tablets y smartphones. Apps nativas en camino.",
      q8: "¿Ofrecen soporte técnico?",
      a8: "Brindamos soporte por chat y correo, además de una base de conocimiento detallada.",
      contactTitle: "¿No encuentras lo que buscas?",
      contactText: "Nuestro equipo de soporte está aquí para ayudarte",
      contactButton: "Contactar Soporte"
    },
    groups: { backHome: "Volver al Inicio", myGroups: "Mis Grupos" },
    register: { tagline: "Organiza tareas en equipo, logra más juntos", registering: "Registrando..." },
    login: { tagline: "Organiza tareas en equipo, logra más juntos", loggingIn: "Iniciando sesión..." },
    lang: { es: "Español", en: "English" }
  },
  en: {
    nav: { home: "Home", features: "Features", how: "How it works", faq: "FAQ" },
    auth: { login: "Sign in", register: "Sign up", logout: "Log out" },
    header: { myGroups: "My Groups" },
    hero: {
      title: "Organize team tasks simply and effectively",
      subtitle:
        "WeDo Taskys helps you coordinate projects, distribute responsibilities, and track progress in real time.",
      start: "Start now",
      demo: "View demo",
      goGroups: "Go to My Groups",
      loginOrRegister: "Sign in or Sign up",
      groupTitle: "Work Groups",
      groupSubtitle: "Manage your groups, collaborate and share tasks with your team.",
      needLogin: "You must sign in or sign up to access your groups."
    },
    features: { title: "Key features" },
    how: {
      title: "How it works",
      subtitle: "Discover the WeDo experience in three simple steps",
      step1Title: "Create your account",
      step1Desc: "Sign up in seconds with your email or Google account. Set up your profile and preferences.",
      step2Title: "Create your first project",
      step2Desc: "Set up a new project, invite team members and start creating tasks. Organize everything to your needs.",
      step3Title: "Collaborate and track progress",
      step3Desc: "Work with your team in real time, assign tasks, comment and track progress. Get notifications and stay up to date."
    },
    footer: { tagline: "Organize team tasks simply and effectively." },
    faq: {
      title: "Frequently Asked Questions",
      subtitle: "Find answers to the most common questions about WeDo",
      q1: "What is WeDo and how can it help my team?",
      a1: "WeDo is a task management platform for teams. Create, assign and track tasks in real time to improve collaboration and productivity.",
      q2: "Is WeDo free to use?",
      a2: "We offer a free plan with basic features and premium plans with advanced capabilities such as reports and integrations.",
      q3: "Can I invite team members?",
      a3: "Yes, invite team members by email, assign roles and permissions, and collaborate in real time.",
      q4: "How does real-time collaboration work?",
      a4: "Changes sync instantly. Receive notifications, comment, and share files on each task.",
      q5: "What types of projects can I manage?",
      a5: "WeDo adapts to any project: software, marketing, design, events, research, and more. Customize boards, labels, and workflows.",
      q6: "Is my data secure?",
      a6: "We use encryption, backups, and comply with data protection standards. Your information is protected.",
      q7: "Can I access from mobile devices?",
      a7: "Yes, it works great on desktops, tablets, and smartphones. Native apps are on the way.",
      q8: "Do you offer technical support?",
      a8: "We provide support via live chat and email, plus a detailed knowledge base.",
      contactTitle: "Can't find what you're looking for?",
      contactText: "Our support team is here to help",
      contactButton: "Contact Support"
    },
    groups: { backHome: "Back to Home", myGroups: "My Groups" },
    register: { tagline: "Organize team tasks, achieve more together", registering: "Signing up..." },
    login: { tagline: "Organize team tasks, achieve more together", loggingIn: "Signing in..." },
    lang: { es: "Español", en: "English" }
  }
};

const I18nContext = createContext({ t: (key) => key, lang: DEFAULT_LANG, setLang: () => {} });

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("preferredLanguage") || DEFAULT_LANG);

  useEffect(() => {
    localStorage.setItem("preferredLanguage", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = useMemo(() => {
    const dict = resources[lang] || resources[DEFAULT_LANG];
    return function translate(path) {
      const segments = path.split(".");
      let node = dict;
      for (const seg of segments) {
        if (node && Object.prototype.hasOwnProperty.call(node, seg)) node = node[seg];
        else return path;
      }
      return typeof node === "string" ? node : path;
    };
  }, [lang]);

  const value = useMemo(() => ({ t, lang, setLang }), [t, lang]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export default I18nContext;


