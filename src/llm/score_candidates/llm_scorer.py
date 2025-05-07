import asyncio
from typing import List, Dict
import json
import openai
import os
import logging

# == Logging ======================================================================
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# == Env ==========================================================================
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    logger.error("Missing OPENAI_API_KEY environment variable.")
    raise RuntimeError("Missing OPENAI_API_KEY environment variable.")

# == Constant =====================================================================
FEW_SHOT_EXAMPLES = [
    {
        "id": "123",
        "name": "Alice Smith",
        "score": 85,
        "highlights": ["Relevant experience in SaaS sales", "Fluent in Spanish"],
    },
    {
        "id": "456",
        "name": "Bob Johnson",
        "score": 62,
        "highlights": ["Some CRM exposure", "Limited B2B experience"],
    },
]

SYSTEM_INSTRUCTION = (
    "You are a recruiter assistant. Given a job description and a list of candidates, "
    "score each candidate from 0 to 100 based on how well they fit the job. Return a JSON array with objects "
    "containing 'id', 'name', 'score' (float), and 'highlights' (a list of short bullet points justifying the score)."
    "These are some examples:"
    "You must return a JSON array with the same structure as the examples, since your answer will be JSON parsed"
    "Do not include any other text or explanation."
    "Example answer with raw text:"
    f"{json.dumps(FEW_SHOT_EXAMPLES, indent=2)}"
    "Do not include the examples in your answer."
)


# == Main =========================================================================
async def score_candidates(job_description: str, candidates: List[Dict]) -> List[Dict]:
    if not job_description or not candidates:
        raise ValueError("Both job_description and candidates are required.")

    logger.info("Scoring candidates...")
    all_results = []
    batch_size = 10

    tasks = []
    for i in range(0, len(candidates), batch_size):
        batch = candidates[i : i + batch_size]
        logger.info(
            f"Processing batch {i // batch_size + 1} of {len(candidates) // batch_size + 1}"
        )
        messages = build_prompt(job_description, batch)
        tasks.append(call_llm_with_retries(messages))

    responses = await asyncio.gather(*tasks)
    for response_text in responses:
        parsed = await parse_llm_response(response_text)
        all_results.extend(parsed)

    logger.info(f"Finished scoring {len(all_results)} candidates.")
    return all_results


# == Util =========================================================================
def build_prompt(job_description: str, candidates: List[Dict]) -> List[Dict]:
    logger.info("Building prompt for LLM...")
    return [
        {"role": "system", "content": SYSTEM_INSTRUCTION},
        {
            "role": "user",
            "content": f"Job Description:\n{job_description}\n\n Candidates:\n{json.dumps(candidates, indent=2)}",
        },
    ]


async def call_llm_with_retries(messages: List[Dict], max_retries=3) -> str:
    delay = 3
    for attempt in range(1, max_retries + 1):
        try:
            logger.info(f"Calling OpenAI (attempt {attempt})...")
            response = await asyncio.to_thread(
                openai.chat.completions.create,
                model="gpt-3.5-turbo",
                messages=messages,
                temperature=0.2,
            )
            logger.info(f"LLM call succeeded on attempt {attempt}.")
            return response.choices[0].message.content

        except openai.RateLimitError:
            logger.warning(f"Rate limit hit, retrying in {delay} seconds...")
            await asyncio.sleep(delay)
            delay *= 4
        except Exception as e:
            logger.error(f"LLM call failed: {e}")
            raise RuntimeError(f"LLM call failed: {e}")
    raise RuntimeError("LLM call failed after max retries")


def validate_candidate(candidate: Dict) -> bool:
    required_keys = {"id", "name", "score", "highlights"}
    return (
        required_keys.issubset(candidate.keys())
        and isinstance(candidate["id"], str)
        and isinstance(candidate["name"], str)
        and isinstance(candidate["score"], (int, float))
        and isinstance(candidate["highlights"], list)
        and all(isinstance(h, str) for h in candidate["highlights"])
    )


async def parse_llm_response(response_text: str) -> List[Dict]:
    logger.info(f"Parsing LLM response...")
    if response_text.startswith("```json") and response_text.endswith("```"):
        logger.info("Response starts with '```json' and ends with '```'. Removing markers.")
        response_text = response_text[7:-3].strip()
    try:
        data = json.loads(response_text)
    except json.JSONDecodeError:
        logger.warning("Initial JSON parse failed. Attempting to truncate response and re-parse. This is the malformed response_text:")
        logger.warning(response_text)

    try:
        data = json.loads(response_text)
    except json.JSONDecodeError:
        logger.warning("Initial JSON parse failed. Attempting to handle malformed response.")
        fix_prompt = (
            "The following response is likely malformed JSON. Please review the response and correct the JSON. "
            "Then return the corrected response in valid JSON format without any additional explanation.\n\n"
            f"Malformed response:\n{response_text}\n\n"
            "Corrected response (in JSON format):"
        )
        messages = [
            {"role": "system","content": "You are a helpful assistant. Correct the following malformed JSON.",},
            {"role": "user", "content": fix_prompt},
        ]
        corrected_response = await call_llm_with_retries(messages)
        try:
            logger.info("Parsing the corrected response...")
            data = json.loads(corrected_response)
        except json.JSONDecodeError:
            logger.error("Failed to parse the corrected response from the AI.")
            raise ValueError("Failed to parse the corrected response from the AI.")

    if not isinstance(data, list):
        raise ValueError("LLM response is not a list of candidates.")

    for idx, candidate in enumerate(data):
        if not validate_candidate(candidate):
            logger.error(f"Invalid candidate format at index {idx}: {candidate}")
            raise ValueError(f"Invalid candidate format at index {idx}: {candidate}")

    logger.info("LLM response parsed and validated successfully.")
    return data
