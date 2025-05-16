# 🛒 CS436 Cloud-Native E-Commerce &nbsp;·&nbsp; GCP Reference Deployment  
![GKE](https://img.shields.io/badge/GKE-autopilot-cluster-blue) 
![Terraform](https://img.shields.io/badge/Terraform-Ready-623CE4) 
![License](https://img.shields.io/badge/License-MIT-green)

A fully reproducible **MERN-stack** e-commerce platform migrated to  
**Google Cloud Platform** with Kubernetes, a Compute-Engine MongoDB VM and  
serverless Cloud Run logging.  
Follow this README to spin up the entire stack in **<15 minutes** on any GCP project.

---

## ✨ Architecture at a Glance

🛠️ Manual Walk-through (For Learning / Tuning)
1. Build & push Docker images

docker build -t europe-west4-docker.pkg.dev/$PROJ/frontend/frontend:latest ./client
docker build -t europe-west4-docker.pkg.dev/$PROJ/backend/main:latest   ./server
docker push  europe-west4-docker.pkg.dev/$PROJ/frontend/frontend:latest
docker push  europe-west4-docker.pkg.dev/$PROJ/backend/main:latest

2. Provision cloud infrastructure with Terraform

cd gcp-terraform
terraform apply -var="project=$PROJ"

3. Point kubectl at the new cluster

gcloud container clusters get-credentials cs436-cluster \
   --region europe-west4 --project $PROJ

4. Deploy (or tweak) Kubernetes manifests

kubectl apply -f kubernetes/

6. Validate health

# Pod-level
kubectl get pods
kubectl logs deployment/backend-main | tail

# Application probes
curl -I http://34.13.193.38/shop/home
curl -I http://34.13.193.38/api/products/all

📊 Load Testing with Locust
Run a 50-user scenario (headless) and save CSV results:

locust -f locustfile.py -H http://34.13.193.38 \
       --headless -u 50 -r 5 -t 5m \
       --csv=baseline --csv-full-history

✍️ Authors
Murat Ayar
Efe Güçlü
