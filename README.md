# 🌾 AgroPacayales — Sistema de Gestión Agrícola Políglota
> **Despliegue en AWS con Kubernetes, MongoDB, RDS SQL Server y Frontend React Native Web**

---

### 📋 Información del Proyecto
- **Asignatura**: Orquestadores y Automatización de Software (EO)
- **Proyecto ABP**: Sistema de Gestión Agrícola AgroPacayales
- **Responsable Principal del Despliegue**: Ana Félix (`ana.felix@agropacayales.com`)
- **Integrantes**: Ana Félix, Hugo Fernández, Axel Huapaya
- **Imágenes Públicas en Docker Hub**:
  - 🎨 **Frontend**: [`anafelixmendoza21/agropacayales-frontend:1.0`](https://hub.docker.com/r/anafelixmendoza21/agropacayales-frontend)
  - ⚙️ **Backend**: [`anafelixmendoza21/agropacayales-backend:1.0`](https://hub.docker.com/r/anafelixmendoza21/agropacayales-backend)

---

## 📐 1. Arquitectura del Sistema

El proyecto implementa una arquitectura **Políglota de Base de Datos** integrada a través de una API Reactiva en la nube de AWS:

```
[ Frontend React Native / Expo Web ] (Puerto 80 / NodePort 30080)
                │
                ▼
[ Backend Spring Boot WebFlux ] (Puerto 8081 / NodePort 30081)
        ├──► [ MongoDB 7.0 ] (Puerto 27017) -> Catálogos y Documentos
        └──► [ Amazon RDS SQL Server ] (Puerto 1433) -> Transacciones R2DBC
```

### 📂 Estructura del Repositorio
```
.
├── ASE251S3_T05-fe/          # Aplicación Frontend React Native (Expo Web + Nginx Dockerfile)
├── Transacionales-a-subir-/  # Aplicación Backend Spring Boot WebFlux (Mongo + R2DBC SQL)
└── k8s-manifests-aws/        # Manifiestos de Kubernetes (Namespace, ConfigMap, Secrets, Deployments, Services)
```

---

## ❓ 2. ¿Cómo funciona el despliegue automático en AWS EC2?

No es necesario instalar Git ni clonar el código en cada servidor EC2 porque los contenedores están pre-compilados e subidos a **Docker Hub** en la cuenta de **Ana Félix**:

```bash
# Docker descarga automáticamente la imagen compilada en menos de 10 segundos:
docker run -d -p 80:80 anafelixmendoza21/agropacayales-frontend:1.0
docker run -d -p 8081:8081 anafelixmendoza21/agropacayales-backend:1.0
```

---

## 🚀 3. Manual de Despliegue Paso a Paso en AWS

### Paso 1: Configurar el Security Group (`sg-agropacayales`)
En la consola de AWS -> **EC2** -> **Security Groups** -> **Create security group**:
- **Nombre**: `sg-agropacayales`
- **Reglas de Entrada (Inbound Rules)**:
  - `SSH (22)` -> `0.0.0.0/0`
  - `HTTP (80)` -> `0.0.0.0/0`
  - `Custom TCP (8081)` -> `0.0.0.0/0`
  - `Custom TCP (27017)` -> `0.0.0.0/0`
  - `Custom TCP (1433)` -> `0.0.0.0/0`
  - `Custom TCP (30080)` -> `0.0.0.0/0`
  - `Custom TCP (30081)` -> `0.0.0.0/0`

---

### Paso 2: Crear las 4 Instancias EC2 con "User Data"

Al lanzar cada instancia en **AWS EC2 -> Launch Instance**:
- **AMI**: Ubuntu 22.04 LTS
- **Security Group**: `sg-agropacayales`
- **Advanced Details** -> **User Data (Datos de usuario)** -> Copia y pega el código correspondiente:

---

#### 1️⃣ Instancia 1: Cluster de Kubernetes (`EC2-K8s-Cluster`)
- **Tipo**: `t3.medium` | **Nombre**: `EC2-K8s-Cluster`
- **User Data**:
```bash
#!/bin/bash
sudo apt update -y
sudo apt install -y docker.io curl git
sudo systemctl enable --now docker

curl -sfL https://get.k3s.io | sh -
sudo chmod 644 /etc/rancher/k3s/k3s.yaml

mkdir -p /root/.kube
sudo cp /etc/rancher/k3s/k3s.yaml /root/.kube/config

mkdir -p /app/k8s
cat << 'EOF' > /app/k8s/deployment.yml
apiVersion: v1
kind: Namespace
metadata:
  name: agropacayales-k8s
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agropacayales-backend
  namespace: agropacayales-k8s
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: anafelixmendoza21/agropacayales-backend:1.0
        ports:
        - containerPort: 8081
---
apiVersion: v1
kind: Service
metadata:
  name: agropacayales-backend-service
  namespace: agropacayales-k8s
spec:
  type: NodePort
  selector:
    app: backend
  ports:
  - port: 8081
    targetPort: 8081
    nodePort: 30081
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: agropacayales-frontend
  namespace: agropacayales-k8s
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: anafelixmendoza21/agropacayales-frontend:1.0
        ports:
        - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: agropacayales-frontend-service
  namespace: agropacayales-k8s
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
    nodePort: 30080
EOF

sudo /usr/local/bin/kubectl apply -f /app/k8s/deployment.yml
```

---

#### 2️⃣ Instancia 2: Frontend (`EC2-Frontend`)
- **Tipo**: `t3.small` | **Nombre**: `EC2-Frontend`
- **User Data**:
```bash
#!/bin/bash
sudo apt update -y
sudo apt install -y docker.io
sudo systemctl enable --now docker

sudo docker run -d \
  --name agropacayales-frontend \
  --restart always \
  -p 80:80 \
  anafelixmendoza21/agropacayales-frontend:1.0
```

---

#### 3️⃣ Instancia 3: Backend (`EC2-Backend`)
- **Tipo**: `t3.small` | **Nombre**: `EC2-Backend`
- **User Data**:
```bash
#!/bin/bash
sudo apt update -y
sudo apt install -y docker.io
sudo systemctl enable --now docker

sudo docker run -d \
  --name agropacayales-backend \
  --restart always \
  -p 8081:8081 \
  -e SERVER_PORT=8081 \
  -e SPRING_PROFILES_ACTIVE=local \
  anafelixmendoza21/agropacayales-backend:1.0
```

---

#### 4️⃣ Instancia 4: MongoDB (`EC2-MongoDB`)
- **Tipo**: `t2.medium` | **Nombre**: `EC2-MongoDB`
- **User Data**:
```bash
#!/bin/bash
sudo apt update -y
sudo apt install -y docker.io
sudo systemctl enable --now docker

sudo docker run -d \
  --name agropacayales-mongodb \
  --restart always \
  -p 27017:27017 \
  mongo:7.0
```

---

### Paso 3: Configurar Amazon RDS SQL Server

1. En la consola **RDS** -> **Create database**.
2. **Engine**: Microsoft SQL Server Express Edition.
3. **DB Identifier**: `agropacayales-rds`
4. **Master Username**: `sa`
5. **Master Password**: `ClaveSegura2026!`
6. **Publicly Accessible**: Yes.
7. **VPC Security Group**: `sg-agropacayales`.

---

## 📊 4. Verificación y Comandos de Demostración (`kubectl`)

En la instancia `EC2-K8s-Cluster`, verifica que los Pods y Servicios estén activos:

```bash
# 1. Estado de los Nodos del Cluster
kubectl get nodes

# 2. Estado de las réplicas de Pods (Frontend y Backend)
kubectl get pods -n agropacayales-k8s

# 3. Estado de los Deployments
kubectl get deployments -n agropacayales-k8s

# 4. Servicios expuestos en NodePort (30080 y 30081)
kubectl get services -n agropacayales-k8s
```

---

## 🔐 5. Credenciales de Prueba (Ana Félix)

- **Usuario**: `ana.felix@agropacayales.com`
- **Contraseña**: `ClaveAna123`
- **Rol**: `SUPERVISOR`
