resource "kubernetes_deployment" "backend" {
  depends_on = [
    google_container_node_pool.primary_nodes,
    google_compute_instance.mongodb_vm,
    google_compute_firewall.allow_mongodb_from_gke_nodes 
  ]

  metadata {
    name   = "backend"
    labels = {
      app = "backend"
    }
  }

  spec {
    replicas = 1 // HPA bu değeri yönetecek

    selector {
      match_labels = {
        app = "backend"
      }
    }

    template {
      metadata {
        labels = {
          app = "backend"
        }
      }
      spec {
        container {
          name  = "backend"
          image = "europe-west4-docker.pkg.dev/cs436-ecommerce-gcp/backend/backend:latest"

          port {
            container_port = 8080
          }

          // Backend'in MongoDB'ye bağlanması için gerekli ortam değişkenleri
          env {
            name  = "MONGO_HOST"
            // vm.tf dosyasındaki google_compute_instance.mongodb_vm kaynağının internal IP adresini kullanır.
            value = google_compute_instance.mongodb_vm.network_interface[0].network_ip
          }
          env {
            name  = "MONGO_PORT"
            value = "27017"
          }
          env {
            name  = "MONGO_DB_NAME" 
            value = "cs436_db"      
          }
          

          resources {
            requests = {
              cpu    = "150m"
              memory = "256Mi"
            }
            limits = {
              cpu    = "1" 
              memory = "512Mi"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "backend" {
  depends_on = [kubernetes_deployment.backend]

  metadata {
    name = "backend-service" // Frontend uygulamasının backend'e erişmek için kullanacağı servis adı
  }

  spec {
    selector = {
      app = kubernetes_deployment.backend.spec[0].template[0].metadata[0].labels.app
    }
    port {
      port        = 80
      target_port = 8080
    }
    // Sadece cluster içinden erişim için "ClusterIP".
    type = "ClusterIP"
  }
}

resource "kubernetes_horizontal_pod_autoscaler" "backend" {
  depends_on = [kubernetes_deployment.backend]

  metadata {
    name = "backend-hpa"
  }
  spec {
    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = kubernetes_deployment.backend.metadata[0].name
    }
    min_replicas = 1
    max_replicas = 3
    target_cpu_utilization_percentage = 70
  }
}
