FROM node:18

WORKDIR /usr/src/app

COPY package*.json .

# cài node module trên server
# RUN yarn install --legacy-peer-deps : lệnh này dùng để cho máy nào chạy ko dc, nó sẽ tìm đúng các thư viện thích hợp để cài cho máy của bạn
RUN yarn install --legacy-peer-deps

COPY prisma ./prisma/

RUN yarn prisma generate

# Cấu hình cho FE sẹt đường dẫn
# COPY nginx.conf /etc/nginx/nginx.conf

COPY . .

# quy định cứng cho port này bởi docker
EXPOSE 8080        

# Thay đổi người dùng mặc định của container thành root
USER root

CMD ["yarn","start"]
# CMD ["node","start"]


# docker exec -it cons-be bash && git pull && docker restart cons-be
# docker exec -it "tên_Container" bash => CICD => git pull
#run: curl http://ductandev.io.vn/update-code