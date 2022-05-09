### 1、背景
前后端分离的情况下，前端可以单独作为一个微服务启动起来，而这个微服务是怎么实现的呢，这就是这篇文档的核心价值了。

大致流程：前端依托于nginx启动服务，打成docker镜像，放到harbor镜像仓库中，然后在yaml文件中配置相关的service， deployment, ingress 和 configmap等，做到前端容器化，可配置化。

### 2、前端配置（Vue为例）
- vue.config.js: 配置publicPath,提出配置文件（不压缩，k8s中configMap映射后，实现动态修改容器中的配置文件）
```js
module.exports = {
  // 署应用包时的基本 URL。 vue-router hash 模式使用
  publicPath: '/smartimd/',
   configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(__dirname, './public/config'),
            to: 'config'
            // ingore: ['.*']
          }
        ]
      })
    ]
  },
  }
```
- router: 配置history路由
```js
const createRouter = () =>
  new Router({
    mode: 'history', // 如果你是 history模式 需要配置vue.config.js publicPath
    base: process.env.BASE_URL,
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
  })
```


### 3、docker镜像的生成
- 1） **docker.sh：docker镜像生成的命令及推到harbor仓库的命令**
```
#!/bin/bash

source /etc/profile
# include yaml_parse function

CUR_PATH=$(cd `dirname $0`;pwd)

# docker 镜像仓库地址，本例使用harbor对images进行管理的
DOCKER_REGISTRY=xxxx
# habor的项目名称, 本例为library
HARBOR_PROJECT=library
# habor的密码及账号
HARBOR_PASSWORD=xxx
HARBOR_USER=xxx
# 镜像的版本 当前时间
TIME_VERSION=$(date +%Y%m%d%H%M%S)
# 镜像名称，本例为smartim-dialogue-front
PROJECT_NAME="smartim-dialogue-front"

# ====================define IMAGE=======================================
# auto set images name
#========================================================================
MYIMAGE=$PROJECT_NAME:$TIME_VERSION
TAG_IMAGE=$PROJECT_NAME:v${TIME_VERSION}
echo "INFO: The image name is $MYIMAGE"

# =========================stop container================================

CONTAINER_ID=$(docker ps|grep ${PROJECT_NAME}| awk '{print $1}')
if [ $CONTAINER_ID ]
then
    docker kill $CONTAINER_ID
    echo "INFO：The container about of  ${PROJECT_NAME} Stopped."
else
    echo "ERROR: The container about of ${PROJECT_NAME} Could't be Stopped."
fi

# =========================remove container===============================
docker rmi -f $(docker images | grep "none" | awk '{print $3}')
if [ $CONTAINER_ID ]
then
    docker rm $CONTAINER_ID
    echo "INFO: Remove container about for ${PROJECT_NAME} success"
else
    echo "ERROR: Can't find container for ${PROJECT_NAME}"
fi

# =========================remove old images==============================
IMAGEID=$(docker images | grep ${PROJECT_NAME} | awk '{print $3}')
if [ "$IMAGEID" ]
then
    docker images | grep ${PROJECT_NAME} | awk '{print $3}' | xargs docker rmi -f
else
    echo "ERROR: Can't find image for ${PROJECT_NAME}"
fi
# =========================npm build======================================
npm install -g cnpm --registry=https://registry.npm.taobao.org
cnpm install
cnpm run build
# =========================build docker image=============================
echo "INFO: build docker image"
# . 代表Dockerfile的路径，本例的Dockerfile与docker.sh在同一路径
docker build -t ${MYIMAGE} .

# ==========================push image to registry========================
# uncomment if you need push
docker login ${DOCKER_REGISTRY} -u $HARBOR_USER -p $HARBOR_PASSWORD
echo "INFO：Starting push image of ${TAG_IMAGE} to docker registry ${DOCKER_REGISTRY}"
docker tag ${MYIMAGE}  ${DOCKER_REGISTRY}/$HARBOR_PROJECT/${TAG_IMAGE}
docker push ${DOCKER_REGISTRY}/$HARBOR_PROJECT/${TAG_IMAGE}

```

- 2） **Dockerfile：doker基础镜像的生成，配置nginx.conf, 对应前端添加前缀的操作**
```
FROM registry.cn-shanghai.aliyuncs.com/shalousun/node-alpine:10.15.3-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm config set unsafe-perm true
RUN npm install -g cnpm --registry=https://registry.npm.taobao.org
RUN cnpm install
COPY . .
RUN cnpm run build

FROM registry.cn-shanghai.aliyuncs.com/shalousun/nginx-alpine:1.13.12-alpine as production-stage
RUN rm -v /etc/nginx/nginx.conf
COPY --from=build-stage /app/nginx.conf /etc/nginx/
RUN mkdir -p /usr/share/nginx/html/smartimd
COPY --from=build-stage /app/dist /usr/share/nginx/html/smartimd

EXPOSE 80

```

- **nginx.conf: 主要对nginx启动的服务做配置, 主要配置如下**
```
location /smartimd {
    root   /usr/share/nginx/html; # 静态文件的根路径
    index  index.html index.htm; # index 指向的文件
    try_files $uri $uri/ /smartimd/index.html; # 默认跳转到某个文件，作为index
}
```

### 4、k8s配置: yaml文件
- config: 映射配置文件， 做到动态修改容器中的文件
- service：svc代理，集群环境中代理到所对应的容器中
- deloymnet: 将镜像封装成k8s可管理的容器
- ingress: 代理，类似于nginx的代理，避免直接使用nodePort去访问容器，减少资源消耗
```
# ------------------- config -------------------- #
apiVersion: v1
kind: ConfigMap
metadata:
  name: smartim-dialogue-front-config
  namespace: default
data:
  index.js: |-
    var sdConfig = {
    baseApi: '/'
    }
---
# ------------------- Service ---------------------- #
apiVersion: v1
kind: Service
metadata:
  name: smartim-dialogue-front-svc
  namespace: default
spec:
  type: NodePort
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30013
  selector:
    app: smartim-dialogue-front
    tier: backend
---
# --------------------------- Deployment ------------------- #
apiVersion: apps/v1
kind: Deployment
metadata:
  name: smartim-dialogue-front-deployment
  namespace: default
spec:
  selector:
    matchLabels:
      app: smartim-dialogue-front
      tier: backend
  replicas: 1
  template:
    metadata:
      labels:
        app: smartim-dialogue-front
        tier: backend
    spec:
      containers:
        - name: smartim-dialogue-front
          image: 仓库地址/library/smartim-dialogue-front:v20210108162530
          imagePullPolicy: Always
          ports:
            - containerPort: 80
          volumeMounts:
          - name: smartim-dialogue-front-config-volume
            mountPath: /usr/share/nginx/html/smartimd/config/index.js # 对应映射容器内配置文件的地址
            readOnly: true
            subPath: index.js
      volumes:
      - name: smartim-dialogue-front-config-volume
        configMap:
          name: smartim-dialogue-front-config
      terminationGracePeriodSeconds: 30
      imagePullSecrets:
        - name: harbor-key
---
# --------------------------- ingress,k8s 1.13---------------------- #
apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  labels:
    app: smartim-dialogue-front
    version: 1.0.0
  name: smartim-dialogue-front-ingress
  namespace: default
spec:
  rules:
  - http:
      paths:
      - path: /smartimd # 路由前缀代理
        backend:
          serviceName: smartim-dialogue-front-svc
          servicePort: 80
---

```



### 5、创建k8s
```
kubectl create -f smartim-dialogue-web.yml
```