FROM oven/bun:1

WORKDIR /usr/src/app

COPY package.json bun.lock* ./

RUN bun install --frozen-lockfile

COPY . .

RUN bun run generate

RUN bun run build

CMD ["bun", "run", "start:migrate"]
