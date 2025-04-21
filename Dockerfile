# 使用官方 Nginx 镜像
FROM nginx:alpine

# 删除默认配置文件
RUN rm -rf /usr/share/nginx/html/*

# 拷贝 dist 下的静态文件到 nginx 的默认路径
COPY dist /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
