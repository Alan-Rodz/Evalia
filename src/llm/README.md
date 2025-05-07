# 🐍 Python Backend – Google Cloud Functions

Collection of Python-based Google Cloud Functions.

---

## 🛠️ Requirements

- **Python 3.12**
- **gcloud CLI**: [Install Instructions](https://cloud.google.com/sdk/docs/install)
- **Google Cloud Project** with billing enabled
- **A service account** with appropriate permissions (e.g., Cloud Functions Admin, Cloud Build Editor, etc.)

---

## 🔧 Setup

1. **Authenticate with Google Cloud:**

   ```bash
   gcloud auth login
   ```

---

## 🧪 Local Development

Use the [Functions Framework](https://github.com/GoogleCloudPlatform/functions-framework-python) to run your function locally.

Open a terminal located on the folder of the function you want to test and:

1. **Install dependencies:**

   ```bash
   pip install -r requirements.txt

2. **Execute the functions framework:**

   ```bash
   functions-framework --target FUNCTION_NAME

> Default port: `8080`
> Replace `FUNCTION_NAME` with the name of your function handler.

---

## 🚀 Deployment

To deploy a function to Google Cloud (2nd gen):

Ensure the project is correctly configured
```bash
gcloud config set project PROJECT_ID
```

Ensure your service account has the Cloud Invoker role
```bash
gcloud run services add-iam-policy-binding YOUR_CLOUD_RUN_SERVICE_NAME \
  --region=YOUR_REGION \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT_EMAIL" \
  --role="roles/run.invoker"
```

```bash
gcloud functions deploy CLOUD_FUNCTION_NAME \
  --gen2 \
  --runtime=python312 \
  --region=us-west2 \
  --source=. \
  --entry-point=HANDLER_NAME \
  --trigger-http \
  --service-account=SERVICE_ACCOUNT \
  --set-env-vars=OPENAI_API_KEY=
```

You may be prompted to enable certain APIs for the project, like 
[cloudfunctions.googleapis.com], [run.googleapis.com] or [cloudbuild.googleapis.com]

### Replace:

* `CLOUD_FUNCTION_NAME` — Name to give the deployed function
* `HANDLER_NAME` — Name of the Python function defined with `@functions_framework.http`
* `SERVICE_ACCOUNT` — Full email of the service account to run the function
* `OPENAI_API_KEY` - OpenAI API Key to use 

---
