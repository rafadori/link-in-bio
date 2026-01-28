import { Github, Linkedin, Globe, Mail } from 'lucide-react';

export const profile = {
  name: "Rafael Nascimento",
  role: "Desenvolvedor Fullstack @ Algar Tech",
  bio: "Node.js • AWS • Vue • APIs • RPA",
  avatar: "/profilepic.jpg", // We need to move the image back to public or src/assets
};

export const socialLinks = [
  {
    platform: "github",
    url: "https://github.com/rafadori",
    label: "GitHub",
    icon: Github,
    subtext: "30+ repositórios",
    stack: "JavaScript | Node | AWS"
  },
  {
    platform: "linkedin",
    url: "https://linkedin.com/in/rafael-nascimento",
    label: "LinkedIn",
    icon: Linkedin,
    subtext: "Conexões profissionais",
    stack: "Carreira | Artigos"
  },
  {
    platform: "website",
    url: "https://seu-website.com",
    label: "Meu Website",
    icon: Globe,
    subtext: "Portfolio Completo",
    stack: "Projetos | Blog"
  },
  {
    platform: "email",
    url: "mailto:rafaelnra@outlook.com",
    label: "Email",
    icon: Mail,
    subtext: "Entre em contato",
    stack: "Business | Hello"
  }
];

export const devStats = [
  {
    title: "⚙️ Stack principal",
    content: "Node.js • AWS • Vue • MongoDB"
  },
  {
    title: "🚀 Foco atual",
    content: "APIs • Automação • RPA • Escalabilidade"
  }
];
