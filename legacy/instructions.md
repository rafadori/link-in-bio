# 📘 Instructions — Evolução do Link in Bio (Dev Dashboard)

Este documento descreve as **alterações de design e experiência** propostas para evoluir o Link in Bio atual, mantendo a base simples e profissional, porém adicionando **identidade técnica**, **microinterações** e um **background vivo com Three.js**.

---

## 🎯 Objetivo

Transformar o Link in Bio em um **Dev Dashboard pessoal**, transmitindo:

* Profissionalismo
* Identidade técnica (perfil dev)
* Experiência moderna e fluida

⚠️ Importante: o conteúdo principal **continua sendo HTML**, com foco em **legibilidade, performance e mobile-first**.

---

## 🧱 Base Atual (Manter)

Os itens abaixo **não devem ser removidos**, apenas evoluídos visualmente:

* Card central único
* Foto de perfil circular
* Nome + bio
* Lista vertical de links
* Botões grandes (touch-friendly)
* Paleta escura e sóbria

---

## ✨ Evoluções Propostas

### 1️⃣ Header mais expressivo

**Alterações:**

* Foto de perfil com **anel animado sutil** (loop lento)
* Nome com **gradiente animado leve**
* Bio com efeito de **fade ou troca suave de stack**

**Exemplo de conteúdo:**

```
Desenvolvedor Fullstack @ Algar Tech
Node.js • AWS • Vue • APIs • RPA
```

---

### 2️⃣ Background vivo com Three.js

**Uso do Three.js:**

* Apenas como **background decorativo**
* Nunca substituir conteúdo HTML

**Sugestões de cena:**

* Grid 3D em perspectiva
* Partículas conectadas (nodes)
* Wireframe abstrato lento

**Regras:**

* Opacidade baixa
* Movimento lento
* Interação sutil com mouse
* Animação automática no mobile
* Lazy load do canvas

---

### 3️⃣ Cards de links enriquecidos

Transformar os botões em **cards informativos**:

**Exemplo:**

**GitHub**

```
↳ 30+ repositórios
↳ JavaScript | Node | AWS
```

**Comportamento:**

* Hover revela subtexto
* Ícone de link externo com micro rotação
* Leve glow ao focar

---

### 4️⃣ Bloco opcional: Dev Stats

Adicionar um bloco compacto abaixo da bio:

```
⚙️ Stack principal
Node.js • AWS • Vue • MongoDB

🚀 Foco atual
APIs • Automação • RPA • Escalabilidade
```

⚠️ Deve ser discreto e não competir com os links.

---

### 5️⃣ Microinterações

Aplicar microinterações suaves em toda a UI:

* Botões:

  * Scale leve no hover
  * Glow sutil
* Foto:

  * Parallax leve
* Card principal:

  * Sombra dinâmica
* Transições:

  * `ease-out`
  * 200–300ms

---

## 🛠️ Stack Técnica Sugerida

* Framework: **React ou Vue**
* Estilização: **TailwindCSS**
* Animações: **Framer Motion** ou **GSAP**
* 3D: **Three.js** ou **React Three Fiber**

**Boas práticas:**

* Canvas carregado após o conteúdo
* Fallback para dispositivos fracos
* SEO e acessibilidade preservados

---

## 🚫 O que NÃO fazer

* Scroll travado
* Conteúdo principal dentro do canvas
* Animações agressivas
* Experiência confusa ou pesada
* Estilo "NFT / Crypto landing page"

---

## ✅ Resultado Esperado

Um Link in Bio que:

* Continua simples
* É visualmente memorável
* Demonstra senioridade técnica
* Funciona perfeitamente no mobile
* Se destaca entre outros perfis

---

**Autor:** Rafael Nascimento
**Conceito:** Dev Dashboard pessoal
