kubernates常用命令

# 查看k8s集群状态

```
kubectl get cs
```

# 查看节点

```
kubectl get node
```

# 查看所有的pod

```
kubectl get pods --all-namespaces 
```

# 查看pod详细信息

```
kubectl describe pods nginx
```

# pod实例分配的Ip地址

```
kubectl get pods --all-namespaces -o wide
```

# 获取podIP

```
kubectl get pod -o yaml run=my-nginx|grep podIP
```

# 查看集群信息

```
kubectl cluster-info
```

显示如：

```
Kubernetes master is running at https://192.168.248.158:6443
Heapster is running at https://192.168.248.158:6443/api/v1/namespaces/kube-system/services/heapster/proxy
KubeDNS is running at https://192.168.248.158:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

```

# k8s Service管理

## 删除服务

```
kubectl delete service nginx-service
```

##  查看Kubetnetes里的service[简写svc]

```
kubectl get service
```

## 查看所有namespace下的service

```
kubectl get service --all-namespaces
```

##  查询指定命名空间下的service

```
kubectl get service -n sre
```

## 批量删除

```
kubectl get pod -n prom | grep Evicted | awk '{print $1}' | xargs kubectl delete pod -n prom
```

# k8s命名空间管理

## 查看namespace

```
kubectl get namespaces
```

展示如下

```
NAME          STATUS    AGE
default       Active    1d
kube-system   Active    1d
```

## 创建namespace

```
kubectl create namespace [your namespace]
```

## 删除namespace

```
kubectl delete namespaces [your namespace]
```


# 删除rc

删除rc，但是pod不会受到影响

```
kubectl delete rc nginx-rc
```

# 删除pod

```
kubectl delete pod nginx-pod
```

# k8s pod日志查看

在部署pod时，可能出现镜像拉取等失败情况，也可能是部署的yaml文件写的有错误导致pod部署失败，这种情况通常需要去查看日志

```
kubectl logs [your pod] -n [your namespace]
kubectl logs -f <pod_name> #类似tail -f的方式查看
```

对于部署在default默认namespace下的pod,可以不指定namespace

```
kubectl logs [your pod]
```

查看指定pod中指定容器的日志

```
kubectl logs <pod_name> -c <container_name>
```

# k8s创建secret

## 创建harbor仓库的secret

**注意**：下面一条命令请书写成一行--docker-xx前需要空一个字符出来

```
kubectl create secret docker-registry [your key] --docker-server=[your harbor registry] --docker-username=[your harbor name] --docker-password=[your password] --docker-email=[your email]

```

创建了harbor的secret后编写deployment时，添加imagePullSecrets来指向你的key,例如：

```
apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: springboot2-rocket-consumer-deployment
  namespace: default
spec:
  selector:
      matchLabels:
        app: springboot2-rocket-consumer
        tier: backend
  replicas: 1
  template:
    metadata:
      labels:
        app: springboot2-rocket-consumer
        tier: backend
    spec:
      containers:
        - name: springboot2-rocket-consumer
          image: your-registry/your-registry-project/com.test.rocketmq.consumer/springboot2-rocket-consumer:1.0
          imagePullPolicy: Always
          ports:
            - containerPort: 8080
      imagePullSecrets:
      - name: [your secrets key]
```

# Ingress管理

```
kubectl get ingress -o wide
```

# 查看pod的yaml

```
kubectl get pod xxx -o yaml
```

# kubernates代理

```
kubectl proxy --address=192.168.56.101 --disable-filter=true
```

- address表示外界可以使用192.168.56.101来访问Dashboard，我们也可以使用0.0.0.0
- disable-filter=true表示禁用请求过滤功能，否则我们的请求会被拒绝，并提示 
- 

# 强制删除pod

```
 kubectl delete pod speaker-openapi-deployment-76fdcfc4c4-djkvb --namespace=default --grace-period=0 --force

```

# label管理

## 添加label

```
kubectl label nodes <node-name> <label-key>=<label-value>
```

## 查看label

```
kubectl get nodes --show-labels
```

## 删除label

```
kubectl label node <nodename> <labelname>-
```

# top命令

```
 kubectl top pods
 kubectl top nodes
```

# 查看k8s支持的api

```
kubectl api-versions 
```


# 修改集群nodePort端口范围

```
sudo vi /etc/kubernetes/manifests/kube-apiserver.yaml
```

添加端口范围

```
- --service-node-port-range=80-32767
```

修改后重启

```
service kubelet restart
```

# kubernetes节点网络排查

节点添加到集群后可以通过，需要检查在宿主机上通过路由命令检查

```
[root@k8s-master1-192-168-85-46 iot]# route -n
Kernel IP routing table
Destination     Gateway         Genmask         Flags Metric Ref    Use Iface
0.0.0.0         192.168.85.1    0.0.0.0         UG    100    0        0 eth0
172.17.0.0      0.0.0.0         255.255.0.0     U     0      0        0 docker0
192.100.3.128   192.168.85.64   255.255.255.192 UG    0      0        0 tunl0
192.100.112.192 192.168.85.63   255.255.255.192 UG    0      0        0 tunl0
192.100.192.128 0.0.0.0         255.255.255.192 U     0      0        0 *
192.100.192.150 0.0.0.0         255.255.255.255 UH    0      0        0 calic5066eb22d8
192.100.192.151 0.0.0.0         255.255.255.255 UH    0      0        0 calidec0e159420
192.100.192.152 0.0.0.0         255.255.255.255 UH    0      0        0 cali9bbdbcfff02
192.100.192.160 0.0.0.0         255.255.255.255 UH    0      0        0 cali97e1ef88b0e
```

对于使用calico网络插件的k8s集群，当使用calico默认的ipip模式时，
calico会在每台node主机创建一个tunl0网口，这个隧道链接所有的node容器网络。

# kubernetes token查看

```
kubeadm token list
```

如果添加节点忘记了join token可以通过上述方式查看，然后在加入

```
kubeadm join --token=[your token] masterip:6443
```

或者重新查看

```
kubeadm token create --print-join-command
```

# ipvs查看

```
ipvsadm -L -n
```

# 查看k8s需要的镜像

```
kubeadm config images list --kubernetes-version=v1.11.1
```

# ETCD查询

## 查看etcd数据

kubeadm默认安装

```
ETCDCTL_API=3 etcdctl --endpoints=https://[127.0.0.1]:2379 \
--cacert=/etc/kubernetes/pki/etcd/ca.crt \
--cert=/etc/kubernetes/pki/etcd/healthcheck-client.crt \
--key=/etc/kubernetes/pki/etcd/healthcheck-client.key \
get /registry/deployments/default --prefix --keys-only
```

因为Kubernetes中的etcd 实例使用了https，需要指定证书等信息，即cacert/cert/key参数。

上面的参数是在使用kubeadm默认安装时，证书位于宿主机的/etc/kubernetes/pki目录下，在安装etcdctl-client后就可以使用上面的命令来访问了。
进去etcd

```
kubectl exec -ti etcd-localhost.localdomain -n kube-system -- sh
```

查看etcd版本号

```
kubectl exec -it etcd-localhost.localdomain -n kube-system -- etcdctl --version
```

## 查看集群列表

```
kubectl exec -it etcd-localhost.localdomain -n kube-system -- etcdctl member list
```

结果展示如下：

```
2e80f96756a54ca9: name=etcd-0 peerURLs=http://etcd-0.etcd:2380 clientURLs=http://etcd-0.etcd:2379 isLeader=true
7fd61f3f79d97779: name=etcd-1 peerURLs=http://etcd-1.etcd:2380 clientURLs=http://etcd-1.etcd:2379 isLeader=false
b429c86e3cd4e077: name=etcd-2 peerURLs=http://etcd-2.etcd:2380 clientURLs=http://etcd-2.etcd:2379 isLeader=false
```

使用api访问

```
curl 127.0.0.1:2379/v2/members
```

## 查看etcd集群状态

```
kubectl exec -it etcd-localhost.localdomain -n kube-system -- etcdctl cluster-health
```

结果类似下面：

```
member 2e80f96756a54ca9 is healthy: got healthy result from http://etcd-0.etcd:2379
member 7fd61f3f79d97779 is healthy: got healthy result from http://etcd-1.etcd:2379
member b429c86e3cd4e077 is healthy: got healthy result from http://etcd-2.etcd:2379
cluster is healthy
```

# 数据存入

通过api

```
curl http://35.204.136.231:2379/v2/keys/message -XPUT -d value="Hello world"
```

结果

```
{"action":"set","node":{"key":"/message","value":"Hello world","modifiedIndex":9,"createdIndex":9}}
```

查看key

```
kubectl exec -it etcd-localhost.localdomain -n kube-system -- etcdctl get message
```

# 获取所有key

```
etcdctl get / --prefix --keys-only
```

# 清理外部 etcd

如果使用外部` etcd`，`kubeadm reset` 将不会删除任何 `etcd` 数据。这意味着如果您再次使用相同的 `etcd` 节点运行 `kubeadm init`，您将看到以前的集群状态。

要删除 `etcd `数据，建议您使用像 `etcdctl` 这样的客户端，例如：

```
etcdctl del “”
–prefix
```

# 利用kubectl转发端口

```
kubectl -n <namespace> port-forward <pod-name> 1100
```

实例

```
kubectl port-forward jmx-demo-142211177-xz2rt 30384:30384
或者
kubectl port-forward pod/jmx-demo-142211177-xz2rt 30384:30384
或者
kubectl port-forward deployment/redis-master 6379:6379 
```

# 查看kubeadm init配置

```
kubeadm config print init-defaults --component-configs KubeProxyConfiguration,KubeletConfiguration
```

