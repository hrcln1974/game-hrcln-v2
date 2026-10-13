# As Aventuras de Nena e Pepê — HRCLN Games

Jogo de plataforma e aventura em cinco fases, com Nena, Pepê e o cãozinho Bidu. Feito com React, TypeScript, Vite e Canvas, com arte estilizada, parallax, partículas e acabamento visual 2.5D.

## Requisitos
- Node.js 20 ou superior (recomendado Node.js 22)
- npm

## Desenvolvimento local
```bash
npm ci
npm run dev
```
Abra `http://localhost:3000`.

## Build e servidor de produção (Hostinger Node.js)
```bash
npm ci
npm run build
npm start
```
O Vite gera os arquivos em `dist/`; o `server.js` serve esses arquivos via Express. A hospedagem deve usar:
- **Build command:** `npm run build`
- **Start command:** `npm start`
- **Entry file:** `server.js`
- **Porta:** definida automaticamente por `PORT` no ambiente (fallback local: 3000)
- **Health check:** `/health` ou `/api/health`

Não defina `dist` como entry file: `dist` é a saída estática do build, enquanto `server.js` inicia o servidor Express.

## Controles
- Andar: ← → ou A / D
- Pular: Espaço / ↑ / W (segure para pulo alto, solte cedo para pulo curto)
- Latido do Bidu (atrai moedas e assusta inimigos): Z / J / Enter
- Pausar: P / Esc
- Celular: botões na tela

## Recursos
- Cinco fases com temas e progressão.
- Moedas, estrelas, poderes, inimigos, checkpoints e pontuação.
- Áudio com opção de silenciar.
- Progresso e ranking local guardados no navegador.
- Controles por teclado e toque.
- Acabamento visual de plataforma com sombras, faces laterais e bordas iluminadas para profundidade 2.5D.
- Endpoint de saúde para verificação da hospedagem.

## Limites atuais e evolução
A jogabilidade é um jogo de plataforma 2D com arte e profundidade 2.5D — **não é um motor 3D real**. A estética é inspirada no gênero clássico de plataforma, sem reproduzir personagens, marcas ou assets proprietários de Super Mario. Para uma versão 3D real com câmera orbital, modelos 3D e física tridimensional, será necessário um projeto de renderização WebGL/Three.js ou Babylon.js e uma revisão específica de performance/dispositivos.

O ranking atual é local ao navegador. Para ranking online compartilhado entre jogadores, autenticação ou sincronização entre dispositivos, será necessário criar API e banco de dados; isso não é necessário para publicar a versão atual.

## Testes antes da publicação
```bash
npm ci
npm run build
npm run lint
npm start
```
Depois verifique `http://localhost:3000/health` e abra o jogo no navegador. Teste controles, pausa, áudio, cinco fases, checkpoints, vitória/derrota e salvamento do progresso.
