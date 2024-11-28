## RabbitMQ kurulumu:
* default port: amqp: 5672 (arka planda microservislerin iletişimi için)
* management port : http: 15672 (Yönetim işlemleri için yayın yaptığı port)
```bash
docker run --hostname java14-rabbit --name java14-rabbit -d -e RABBITMQ_DEFAULT_USER=java14user -e RABBITMQ_DEFAULT_PASS=root -p 15672:15672 -p 5672:5672 --memory=512m RabbitMQ:3-management
```