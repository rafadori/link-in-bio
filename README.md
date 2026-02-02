# 🖥️ Retro Desktop Link-in-Bio

Este projeto é uma página de "Link in Bio" reimaginada como uma interface de desktop retro interativa. Desenvolvido com foco em performance, estética pixel-art e interatividade, ele serve como um portfólio criativo para desenvolvedores.

## 🛠️ Tecnologias Utilizadas

- **Core:** [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS](https://tailwindcss.com/) (com `clsx` e `tailwind-merge` para utilitários dinâmicos)
- **Animações e Interatividade:** [Framer Motion](https://www.framer.com/motion/) (gerenciamento de janelas arrastáveis, transições e efeitos)
- **Gráficos e Simulação:** HTML5 Canvas API (para visualizadores de áudio e simulações de física)
- **Ícones:** [Lucide React](https://lucide.dev/)

## 🧩 Arquitetura e Componentes

A aplicação é estruturada em torno de um "Desktop" virtual que gerencia múltiplas janelas flutuantes. O layout é responsivo, adaptando-se de uma grid livre no desktop para uma lista vertical rolável em dispositivos móveis.

### Principais Componentes (`src/components/retro/`)

#### 1. `Desktop.tsx`
O orquestrador principal.
- Gerencia o estado das janelas (qual está ativa/focada, ordem de sobreposição Z-index).
- Detecta o dispositivo (Mobile/Desktop) para ajustar o comportamento de layout e scroll.
- Utiliza `framer-motion` para permitir que as janelas sejam arrastadas pelo usuário.

#### 2. `ProfileWindow.tsx` ("C:\USER\PROFILE.EXE")
O hub central de informações.
- Exibe avatar, biografia e estatísticas do desenvolvedor.
- Lista links sociais e de contato com efeitos de hover interativos.
- Estilizado como uma aplicação de terminal/perfil de sistema.

#### 3. `AudioWindow.tsx` ("AUDIO")
Um player de música ambiente totalmente funcional.
- **Visualizer:** Implementa um analisador de espectro de áudio em tempo real usando Canvas API.
- **Animação:** Simula um disco de vinil girando e um braço de tocadiscos que reage ao estado de reprodução.
- **Terminal:** Exibe logs de "sistema" digitados dinamicamente para imersão.

#### 4. `TimeWindow.tsx` ("TIME?")
Uma simulação de ampulheta em pixel-art.
- **Física de Areia:** Implementa uma simulação de autômato celular (semelhante ao *Falling Sand*) renderizada em Canvas.
- A areia cai realisticamente e "recicla" quando a parte superior esvazia, criando um loop visual infinito e relaxante.

#### 5. `ClockWindow.tsx` ("CALENDAR")
Display de tempo e data.
- Mostra hora, minuto e segundo em um layout digital industrial.
- Inclui um mini-calendário gerado dinamicamente para o mês atual.

#### 6. `LogWindow.tsx`
Janela de logs do sistema (decorativa).
- Adiciona à estética "hacker/developer", mostrando atividades fictícias do sistema em tempo real.

## 🚀 Como Rodar

1.  **Instalar dependências:**
    ```bash
    npm install
    # ou
    yarn
    ```

2.  **Iniciar servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

3.  **Build para produção:**
    ```bash
    npm run build
    ```
