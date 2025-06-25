# === 1. 构建阶段 ===
FROM node:20-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装依赖
RUN npm install --frozen-lockfile

# 复制项目文件
COPY . .

# 构建 Next.js 项目
RUN npm run build

# === 2. 运行阶段 ===
FROM node:20-alpine AS runner

# 设置非 root 用户运行
RUN addgroup --system --gid 1001 nextjs \
    && adduser --system --uid 1001 nextjs

# 设置工作目录
WORKDIR /app

# 复制构建产物
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public

# 复制 .env 文件（可选，如果有环境变量）
# COPY .env ./.env

# 设置端口
EXPOSE 3000

# 设置默认用户
USER nextjs

# 启动应用
CMD ["node", "server.js"]
