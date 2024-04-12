const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
const PORT = 3001;
// enable CORS(cross origin resource sharig) for all routes
app.use(cors()); 

// endpoint name, callback function
app.get("/recipeStream", (req, res) => {
  const ingredients = req.query.ingredients;
  const mealType = req.query.mealType;
  const cuisine = req.query.cuisine;
  const cookingTime = req.query.cookingTime;
  const complexity = req.query.complexity;

  res.setHeader("Content-Type", "text/event/stream");
  res.setHeader("Cache-control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendEvent = (chunk) => {
    let chunkResponse;
    if (chunk.choices[0].finish_reason === "stop") {
      res.write(`data: ${JSON.stringify({ action: "close" })}\n\n`);
    } else {
      if (
        chunk.choices[0].delta.role &&
        chunk.choices[0].delta.role === "assistant"
      ) {
        chunkResponse = {
          action: "start",
        };
      } else {
        chunkResponse = {
          action: "chunk",
          chunk: chunk.choices[0].delta.content,
        }
      }
      res.write(`data: ${JSON.stringify(chunkResponse)}\n\n`);
    }
  };

  const prompt = [];
  prompt.push("Generate a recipe that incorporates the following details:");
  prompt.push(`[Ingredients: ${ingredients}]`);
  prompt.push(`[Meal Type: ${mealType}]`);
  prompt.push(`[Cuisine Preference: ${cuisine}]`);
  prompt.push(`[Cooking Time: ${cookingTime}]`);
  prompt.push(`[ComplexityL ${complexity}]`);
  prompt.push("Please provide a detailed recipe, including steps for preparation and cooking. Pnly use the ingredients listed above.");
  prompt.push("The recipe shuold highlight the fresh and vibrant flavors of the ingredients.");
  prompt.push("Also give the recipe a suitable name in its local language based on the provided cuisine preference.");

  const messages = [
    {
      role: "system",
      content: prompt.join(" "),
    }
  ]

  fetchOpenAICompletionsStream(messages, sendEvent);

  req.on("close", () => {
    res.end();
  });

})

async function fetchOpenAICompletionsStream(messages, callback) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const aiModel = "gpt-3.5-turbo";

  try {
    openai.chat.completions.create({
      model: aiModel,
      messages: messages,
      stream: true,
    })
    for await (const chunk of completion) {
      callback(chunk);
    }
  } catch (error) {

  }

}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
})

