import os

import boto3
from dotenv import load_dotenv

load_dotenv()

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

AWS_BEARER_TOKEN_BEDROCK = os.getenv("AWS_BEARER_TOKEN_BEDROCK")
AWS_REGION = os.getenv("AWS_REGION", "ap-southeast-2")
MODEL_ID = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")

TRAVEL_PLANNER_PROMPT = (
    "You are an experienced travel planner.\n"
    "Plan a {days}-day itinerary for {destination}.\n"
    "Budget: USD {budget}\n"
    "Travel Style: {travel_style}.\n\n"
    "For each day, structure the itinerary with these three sections:\n"
    "- Morning Activities\n"
    "- Afternoon Activities\n"
    "- Evening Activities\n\n"
    "Give the answer with markdown format."
)


def get_bedrock_client():
    if not AWS_BEARER_TOKEN_BEDROCK:
        raise ValueError(
            "AWS_BEARER_TOKEN_BEDROCK is not set. "
            "Check your .env file."
        )

    client = boto3.client(
        service_name="bedrock-runtime",
        region_name=AWS_REGION,
    )

    return client


def get_ai_recommendation(
    destination: str,
    days: int,
    budget: float,
    travel_style: str,
) -> str:
    """
    Call Amazon Bedrock with the travel-planner prompt and return the
    AI-generated itinerary as a plain string.

    Args:
        destination:  City / country the traveller is visiting.
        days:         Length of the trip in days.
        budget:       Total budget in USD.
        travel_style: Free-text style description (e.g. "backpacker",
                      "luxury", "family").

    Returns:
        The model's text response.

    Raises:
        ValueError: If required environment variables are missing.
        Exception:  Propagated from boto3 / Bedrock on API errors.
    """
    prompt = TRAVEL_PLANNER_PROMPT.format(
        days=days,
        destination=destination,
        budget=budget,
        travel_style=travel_style,
    )

    client = get_bedrock_client()

    # Use the Converse API — works across all Nova / Titan / Claude models
    response = client.converse(
        modelId=MODEL_ID,
        messages=[
            {
                "role": "user",
                "content": [{"text": prompt}],
            }
        ],
    )

    # Extract the assistant's reply text
    output_message = response["output"]["message"]
    text_parts = [
        block["text"]
        for block in output_message["content"]
        if "text" in block
    ]
    return "\n".join(text_parts)