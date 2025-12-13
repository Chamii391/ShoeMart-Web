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
Generate 6 short, search-friendly alternate names (comma-separated only).
Do not add explanations.

Product Name: {name}
Main Category: {main_category}
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
Write a short product description (2–3 sentences) for an online shoe store.
Friendly, simple English. No emojis.

Product Name: {name}
Main Category: {main_category}
Color: {color}
Country: {country}
Price: {price}

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