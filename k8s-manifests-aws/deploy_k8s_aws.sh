#!/bin/bash
# Script de Despliegue Express en Kubernetes AWS
echo "========================================================="
echo " 🚀 DESPLIEGUE EXPRESS AGROPACAYALES KUBERNETES & AWS"
echo "========================================================="

echo "[1/5] Aplicando Namespace..."
kubectl apply -f 01-namespace.yml

echo "[2/5] Aplicando ConfigMap..."
kubectl apply -f 02-configmap.yml

echo "[3/5] Aplicando Secrets (Bases de datos)..."
kubectl apply -f 03-secret.yml

echo "[4/5] Desplegando Backend Spring WebFlux..."
kubectl apply -f 04-backend.yml

echo "[5/5] Desplegando Frontend React Native Web..."
kubectl apply -f 05-frontend.yml

echo ""
echo "========================================================="
echo " 📊 COMPROBACIÓN DEL ESTADO DEL CLUSTER"
echo "========================================================="
kubectl get nodes
echo ""
kubectl get pods -n agropacayales-k8s
echo ""
kubectl get deployments -n agropacayales-k8s
echo ""
kubectl get services -n agropacayales-k8s
echo "========================================================="
echo " ¡DESPLIEGUE FINALIZADO CON ÉXITO!"
echo "========================================================="
