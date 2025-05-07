import functions_framework
import json
import asyncio
from llm_scorer import score_candidates


@functions_framework.http
def handle_score_candidates_http(request):
    data = request.get_json(silent=True)
    if not data:
        return ("Invalid JSON", 400)

    try:
        candidates = data["candidates"]
        job_description = data["job_description"]
        scored = asyncio.run(score_candidates(job_description, candidates))
        return (json.dumps(scored), 200, {'Content-Type': 'application/json'})
    except Exception as e:
        return (json.dumps({"error": str(e)}), 500, {'Content-Type': 'application/json'})
