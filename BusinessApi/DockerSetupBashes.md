# RABBITMQ
```bash
docker run --hostname java14-rabbit --name java14-rabbit -d -e RABBITMQ_DEFAULT_USER=java14user -e RABBITMQ_DEFAULT_PASS=root -p 15672:15672 -p 5672:5672 --memory=512m rabbitmq:3-management
``` 