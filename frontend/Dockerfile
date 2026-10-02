FROM node:22-alpine AS builder
WORKDIR /app
RUN npm install -g npm@11
COPY package*.json ./
RUN npm ci
COPY . .
# NEXT_PUBLIC_* değerleri next build'in static prerender adımında derlenip HTML'e
# gömülüyor — compose'un environment: bloğu yalnızca runtime'da geçerli, build
# sırasında görünmez. Bu yüzden build-arg olarak açıkça geçirilmeleri gerekiyor
# (bkz. docker-compose.yml next servisinin build.args'ı).
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_UMAMI_URL
ARG NEXT_PUBLIC_UMAMI_WEBSITE_ID
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_UMAMI_URL=$NEXT_PUBLIC_UMAMI_URL
ENV NEXT_PUBLIC_UMAMI_WEBSITE_ID=$NEXT_PUBLIC_UMAMI_WEBSITE_ID
RUN npm run build

FROM node:22-alpine AS production
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
COPY --from=builder /app/public ./public
COPY --from=builder --chown=app:app /app/.next/standalone ./
COPY --from=builder --chown=app:app /app/.next/static ./.next/static
# docker-compose'da buraya kalıcı bir volume mount edilir (image-optimizer/ISR
# cache'i deploy'lar arası hayatta kalsın diye); dizin önceden app:app sahipliğiyle
# var olmazsa, volume ilk oluşturulduğunda root sahipliğinde kalır ve non-root
# "app" kullanıcısı yazamaz
RUN mkdir -p ./.next/cache && chown -R app:app ./.next/cache
USER app
EXPOSE 3000
CMD ["node", "server.js"]
