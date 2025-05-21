// cloudfunctions.tf


resource "google_storage_bucket" "functions_staging_bucket" {

  name                        = "${var.project_id}-cf-staging-bucket" 
  location                    = var.region                         
  uniform_bucket_level_access = true
  project                     = var.project_id

  lifecycle {
    prevent_destroy = false 
  }
}

data "archive_file" "passive_logger_zip" {
  type        = "zip"
  source_dir  = "functions/passive-logger/" 
  output_path = "${path.cwd}/passive-logger-source.zip" 
  
}

resource "google_storage_bucket_object" "passive_logger_archive" {
  name   = "source-archives/passive-logger-${data.archive_file.passive_logger_zip.output_sha}.zip" 
  bucket = google_storage_bucket.functions_staging_bucket.name
  source = data.archive_file.passive_logger_zip.output_path 
}

resource "google_cloudfunctions2_function" "passive_logger_function" {
  project  = var.project_id
  name     = "passive-logger-tf" 
  location = var.region          

  build_config {
    runtime     = "nodejs22"     
    entry_point = "passiveLogger"  
    environment_variables = {      
      // "MY_VARIABLE" = "my_value"
    }
    source {
      storage_source {
        bucket = google_storage_bucket.functions_staging_bucket.name
        object = google_storage_bucket_object.passive_logger_archive.name
      }
    }
  }

  service_config {
    max_instance_count = 3      
    min_instance_count = 0      
    available_memory   = "256Mi" 
    timeout_seconds    = 60      
    // ingress_settings = "ALLOW_ALL" 
    all_traffic_on_latest_revision = true

  }


}


resource "google_cloud_run_service_iam_member" "passive_logger_invoker" {
  project  = google_cloudfunctions2_function.passive_logger_function.project
  location = google_cloudfunctions2_function.passive_logger_function.location
  service  = google_cloudfunctions2_function.passive_logger_function.name 
  role     = "roles/run.invoker"
  member   = "allUsers" 
}

output "passive_logger_function_url" {
  description = "URL of the passive logger HTTP function"
  value       = google_cloudfunctions2_function.passive_logger_function.service_config[0].uri
}