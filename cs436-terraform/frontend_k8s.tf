resource "kubernetes_deployment" "frontend" {
  depends_on = [google_container_node_pool.primary_nodes]

  metadata {
    name   = "frontend"
    labels = {
      app = "frontend"
    }
  }

  spec {
    replicas = 1 // HPA bu değeri yönetecek

    selector {
      match_labels = {
        app = "frontend"
      }
    }

    template {
      metadata {
        labels = {
          app = "frontend"
        }
      }
      spec {
        container {
          name  = "frontend"
          // Artifact Registry'deki güncel frontend imajı (Nginx proxy ve API yolu düzeltmeleri ile)
          image = "europe-west4-docker.pkg.dev/cs436-ecommerce-gcp/frontend/frontend:api-path-final-v1"

          port {
            container_port = 80
          }

          // Nginx reverse proxy kullandığımız için bu ortam değişkenine genellikle gerek yoktur.
          // Frontend JS kodu API isteklerini '/api/...' gibi göreceli yollarla yapmalıdır.
          /*
          env {
            name  = "REACT_APP_BACKEND_URL" 
            value = "http://backend-service:80" 
          }
          */

          resources {
            requests = {
              cpu    = "100m"
              memory = "128Mi"
            }
            limits = {
              cpu    = "500m"
              memory = "256Mi"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "frontend" {
  depends_on = [kubernetes_deployment.frontend]

  metadata {
    name = "frontend"
  }
  spec {
    selector = {
      app = "frontend"
    }
    port {
      port        = 80
      target_port = 80
    }
    // Frontend için dışarıdan erişilebilir bir IP adresi sağlar.
    type = "LoadBalancer"
  }
}

resource "kubernetes_horizontal_pod_autoscaler" "frontend" {
  depends_on = [kubernetes_deployment.frontend]

  metadata {
    name = "frontend-hpa"
  }
  spec {
    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = kubernetes_deployment.frontend.metadata[0].name
    }
    min_replicas = 1
    max_replicas = 3
    target_cpu_utilization_percentage = 70
  }
}
