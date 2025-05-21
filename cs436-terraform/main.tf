provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_container_cluster" "primary" {
  name     = "cs436-gke-cluster-tf" // İsim çakışmasını önlemek için "-tf" eklediğinizi varsayıyorum
  location = var.zone

  deletion_protection      = false
  remove_default_node_pool = true
  initial_node_count       = 1

  networking_mode = "VPC_NATIVE"
  ip_allocation_policy {}
}

resource "google_container_node_pool" "primary_nodes" {
  name     = "primary-node-pool"
  location = var.zone
  cluster  = google_container_cluster.primary.name // Veya .id kullanmak daha sağlam olabilir

  autoscaling {
    min_node_count = 1
    max_node_count = 3
  }

  node_config {
    machine_type = "e2-medium"
    oauth_scopes = [
      "https://www.googleapis.com/auth/cloud-platform"
    ]
    tags = ["gke-node-cs436"]
  }

  management {
    auto_repair  = true
    auto_upgrade = true
  }
}

data "google_client_config" "default" {}

provider "kubernetes" {
  // GKE cluster'ının doğrudan API endpoint'ini kullanın
  host = "https://${google_container_cluster.primary.endpoint}" // DEĞİŞTİRİLDİ

  // Kimlik doğrulama için erişim token'ı
  token = data.google_client_config.default.access_token

  // Cluster'ın CA sertifikası
  cluster_ca_certificate = base64decode(google_container_cluster.primary.master_auth[0].cluster_ca_certificate)
}
