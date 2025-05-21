
resource "google_compute_firewall" "allow_mongodb_from_gke_nodes" {
  name    = "allow-mongodb-from-gke-nodes-tf"
  
  network = "projects/${var.project_id}/global/networks/default" 
  project = var.project_id

  allow {
    protocol = "tcp"
    ports    = ["27017"]
  }

  source_tags = ["gke-node-cs436"]
  target_tags = ["mongodb"]

  description = "Allow TCP traffic on port 27017 to instances tagged 'mongodb' from instances tagged 'gke-node-cs436'"
}
