variable "project_id" {
  description = "GCP proje ID"
  type        = string
}

variable "region" {
  description = "GCP bölgesi"
  type        = string
}

variable "zone" {
  description = "GCP zonu"
  type        = string
}

variable "service_account_email" {
  description = "Service account email"
  type        = string // Tip eklendi
}

variable "ssh_public_key_path" {
  description = "Path to the SSH public key file for VM access."
  type        = string
  
  default     = "~/.ssh/id_rsa.pub" 
}