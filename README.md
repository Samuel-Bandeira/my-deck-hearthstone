# HearthStone Card Manager

Gerenciador de cartas do HearthStone com suporte a criação, edição, exclusão e filtragem. Construído com React Router v7, TypeScript e TailwindCSS v4.

## Pré-requisitos

- Node.js >= 22
- npm >= 10
- Docker (opcional, para rodar via container)

## Rodando localmente

### 1. Instalar dependências

```bash
nvm use 22  # se estiver usando nvm
npm install
```

### 2. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`.

### 3. Build de produção

```bash
npm run build
npm run start
```

A aplicação estará disponível em `http://localhost:3000`.

---

## Rodando via Docker

### Build da imagem

```bash
docker build -t my-deck-hearthstone .
```

### Iniciar o container

```bash
docker run -p 3000:3000 my-deck-hearthstone
```

A aplicação estará disponível em `http://localhost:3000`.

---

## Scripts disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento com HMR |
| `npm run build` | Gera o build de produção |
| `npm run start` | Inicia o servidor de produção |
| `npm run typecheck` | Valida os tipos TypeScript |
