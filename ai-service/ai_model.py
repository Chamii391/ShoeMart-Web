import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate

load_dotenv()

llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.1-8b-instant",
    temperature=0.7
)

# -------- ALT NAMES --------
altname_prompt = PromptTemplate(
    input_variables=["name", "main_category", "color", "country"],
    template="""
You are generating SEO keywords for an online shoe store.
Create 6-7 short alternate names / search keywords for this shoe.
Rules:
- Output ONLY one comma-separated line
- No numbering, no quotes, no extra text
- Mix: style keywords + use case + category words
- Include category: {main_category} (men/women/child) naturally

Product Name: {name}
Color: {color}
Country: {country}

Alt Names:
"""
)


def generate_altnames(name, main_category, color="", country=""):
    chain = altname_prompt | llm
    return chain.invoke({
        "name": name,
        "main_category": main_category,
        "color": color,
        "country": country
    }).content.strip()


# -------- DESCRIPTION --------
description_prompt = PromptTemplate(
    input_variables=["name", "main_category", "price", "color", "country"],
    template="""
You are a copywriter for a modern online shoe store.
Write a premium product description in 2–3 sentences.

Rules:
- Simple English, smooth and confident tone
- Mention comfort + style
- Mention the color naturally
- DO NOT mention "AI", "prompt", or "database"
- DO NOT add emojis
- Keep it short and attractive

Product Name: {name}
Main Category: {main_category} (men/women/child)
Color: {color}
Country: {country}
Price: Rs. {price}

Description:
"""
)


def generate_description(name, main_category, price, color="", country=""):
    chain = description_prompt | llm
    return chain.invoke({
        "name": name,
        "main_category": main_category,
        "price": price,
        "color": color,
        "country": country
    }).content.strip()