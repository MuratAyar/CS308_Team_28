resource "kubernetes_deployment" "dummy_backend" {
  depends_on = [google_container_node_pool.primary_nodes]

  metadata {
    name   = "dummy-backend"
    labels = {
      app = "dummy-backend"
    }
  }

  spec {
    replicas = 1 

    selector {
      match_labels = {
        app = "dummy-backend"
      }
    }

    template {
      metadata {
        labels = {
          app = "dummy-backend"
        }
      }
      spec {
        container {
          name  = "dummy-backend"
          image = "europe-west4-docker.pkg.dev/cs436-ecommerce-gcp/dummy-backend/dummy-backend:latest"

          port {
            container_port = 3000
          }

          resources {
            requests = {
              cpu    = "50m"
              memory = "64Mi"
            }
            limits = {
              cpu    = "200m"
              memory = "128Mi"
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "dummy_backend" {
  depends_on = [kubernetes_deployment.dummy_backend]

  metadata {
    name = "dummy-backend-service"
  }
  spec {
    selector = {
      app = kubernetes_deployment.dummy_backend.spec[0].template[0].metadata[0].labels.app
    }
    port {
      protocol    = "TCP"
      port        = 80
      target_port = 3000
    }
    // Sadece cluster içinden erişim için "ClusterIP".
    type = "ClusterIP"
  }
}

resource "kubernetes_horizontal_pod_autoscaler" "dummy_backend" {
  depends_on = [kubernetes_deployment.dummy_backend]

  metadata {
    name = "dummy-backend-hpa"
  }
  spec {
    scale_target_ref {
      api_version = "apps/v1"
      kind        = "Deployment"
      name        = kubernetes_deployment.dummy_backend.metadata[0].name
    }
    min_replicas = 1
    max_replicas = 2
    target_cpu_utilization_percentage = 70
  }
}
