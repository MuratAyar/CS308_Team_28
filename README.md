# 🛒 CS436 Cloud‑Native E‑Commerce · Google Cloud Reference Deployment

![GKE](https://img.shields.io/badge/GKE-Autopilot-blue?logo=googlekubernetesengine)
![Terraform](https://img.shields.io/badge/Terraform-ready-623CE4?logo=terraform)
![MongoDB](https://img.shields.io/badge/MongoDB-VM-green?logo=mongodb)
![License](https://img.shields.io/badge/License-MIT-green)

> **What you get** – A fully reproducible **MERN‑stack** shop running on
> Google Cloud: two micro‑services on **GKE Autopilot**, a dedicated **Compute‑Engine
> MongoDB VM**, and a lightweight Cloud Run function for passive visit logging.
> Spin the whole stack up in **⩽ 15 minutes** on *any* GCP project.

---

## ✨ Architecture at a Glance

![GKE - Frontend (React+nginx) (1)](https://github.com/user-attachments/assets/b2384a6a-2572-4616-afda-bf90ac2f8bf1)

---

## 🚀 Quick‑Start (one‑liner)

```bash
git clone https://github.com/<YOUR_GH_USER>/<REPO>.git && \
cd <REPO>/gcp-terraform && \
terraform init && \
terraform apply -var="project=$(gcloud config get-value project)" -auto-approve
```

Terraform will:

1. create an **Autopilot** GKE cluster (`cs436-cluster`)
2. spin up a **MongoDB 6.0** VM (`mongodb-vm`, zone `europe-west1-d`)
3. build & push Docker images via Cloud Build
4. deploy Kubernetes manifests (frontend, backend‑main, backend‑dummy, HPA)
5. deploy the **passiveLogger** Cloud Run service
6. output your **frontend LoadBalancer IP** – open it in a browser 🎉

---

## 🛠️ Manual Walk‑Through (for learning/tuning)

### 1 · Build & Push Docker Images

```bash
# Authenticate Docker to Artifact Registry once
gcloud auth configure-docker europe-west4-docker.pkg.dev

# Build images
docker build -t europe-west4-docker.pkg.dev/$PROJ/frontend/frontend:latest ./client
docker build -t europe-west4-docker.pkg.dev/$PROJ/backend/main:latest   ./server

# Push
docker push europe-west4-docker.pkg.dev/$PROJ/frontend/frontend:latest
docker push europe-west4-docker.pkg.dev/$PROJ/backend/main:latest
```

### 2 · Provision GCP Resources via Terraform

```bash
cd gcp-terraform
terraform init
terraform apply -var="project=$PROJ"
```

Terraform outputs the cluster name, MongoDB private IP and the public frontend IP.

### 3 · Configure `kubectl`

```bash
gcloud container clusters get-credentials cs436-cluster \
  --region europe-west4 --project $PROJ
```

```bash
kubectl get nodes   # verify connection
```

### 4 · Deploy / Tweak Kubernetes Manifests

```bash
kubectl apply -f kubernetes/
```

This creates Deployments, Services, HPAs and Secrets.

### 5 · Prepare the MongoDB VM

```bash
# SSH to the VM
gcloud compute ssh mongodb-vm --zone europe-west1-d

# Install MongoDB 6.0
sudo apt-get update && \
sudo apt-get install -y gnupg curl && \
curl -fsSL https://pgp.mongodb.com/server-6.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor && \
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/debian bookworm/mongodb-org/6.0 main" | \
  sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list && \
sudo apt-get update && sudo apt-get install -y mongodb-org

# Enable & start
sudo systemctl enable mongod
sudo systemctl start mongod

# (Optional) create admin user
mongosh <<'EOF'
use admin;
 db.createUser({user: 'gkeApp', pwd: 'StrongPassword!', roles:[{role:'root',db:'admin'}]});
quit();
EOF
exit
```

The connection string `mongodb://gkeApp:StrongPassword!@10.132.0.2:27017/admin` is stored in a Kubernetes Secret (`mongo-uri`).

### 6 · Smoke‑Test the Stack

```bash
# Pod level
kubectl get pods -o wide

# Logs
kubectl logs deployment/backend-main | tail

# Application probes
curl -I http://34.13.193.38/shop/home
curl -I http://34.13.193.38/api/products/all
```

Both commands must return **HTTP 200**.

---

## 📊 Load Testing with Locust

Run a 50‑user baseline scenario and save CSV results:

```bash
locust -f locustfile.py -H http://34.13.193.38 \
       --headless -u 50 -r 5 -t 5m \
       --csv=baseline --csv-full-history
```

Measured baseline results:

\* Average throughput ≈ **12.7 RPS**
\* 95‑th percentile latency ≈ **10 000 ms**
\* No 5xx errors; all failures were client‑side 400 due to malformed test payloads.

Full CSV and plots live in `report/`.

---

## 💸 Cost Snapshot

Monthly estimate (europe‑west4): **\~ \$105** – fully covered by the \$300 free trial.

---

## ✍️ Authors

* **Murat Ayar**
* **Efe Güçlü**

---

## 📝 License

This project is licensed under the MIT License – see `LICENSE.md` for details.
