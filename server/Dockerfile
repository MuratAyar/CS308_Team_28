# 1. Base image
FROM node:18

# 2. Çalışma dizini
WORKDIR /app

# 3. package.json ve package-lock.json kopyala
COPY package*.json ./

# 4. Bağımlılıkları yükle
RUN npm install

# 5. Tüm proje dosyalarını kopyala
COPY . .

# 6. Uygulamanın dinlediği port
EXPOSE 8080

# 7. Uygulama başlatma komutu
CMD ["node", "server.js"]
