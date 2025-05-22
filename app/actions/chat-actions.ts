"use server"

// Define the types for our chat messages
export type Message = {
  role: "user" | "assistant"
  content: string
}

// Predefined responses for common questions (fallback when API is unavailable)
const fallbackResponses = {
  greeting: [
    "Namaste! Welcome to the Bhagavad Gita chatbot. How may I assist you on your spiritual journey today?",
    "Om Namah Bhagavate Vasudevaya! I'm here to help you explore the divine wisdom of the Bhagavad Gita.",
    "Jai Shri Krishna! How can I help you understand the teachings of the Bhagavad Gita today?",
  ],
  krishna: [
    "Lord Krishna is the Supreme Personality of Godhead who appeared on Earth around 5,000 years ago. In the Bhagavad Gita, He serves as Arjuna's charioteer and reveals divine knowledge.",
    "Krishna is described as having a beautiful bluish complexion, wearing a peacock feather in His crown, and playing a flute. He is the embodiment of love, wisdom, and divine consciousness.",
    "In the Bhagavad Gita, Krishna reveals Himself as the source of all creation, the sustainer of the universe, and the ultimate goal of spiritual practice.",
  ],
  karma: [
    "Karma Yoga is the path of selfless action. Krishna teaches that one should perform their duties without attachment to the results, dedicating all actions to the Divine.",
    "In Chapter 3, Krishna explains: 'Work done as a sacrifice for Vishnu has to be performed, otherwise work causes bondage in this material world. Therefore, perform your prescribed duties for His satisfaction, and in this way, you will always remain free from bondage.'",
  ],
  dharma: [
    "Dharma refers to one's sacred duty or righteous path. In the Bhagavad Gita, Krishna emphasizes the importance of following one's dharma, even when it seems difficult.",
    "Krishna tells Arjuna: 'It is better to perform one's own duties imperfectly than to master the duties of another. By fulfilling the obligations born of one's nature, a person never incurs sin.'",
  ],
  default:
    "The Bhagavad Gita teaches us that spiritual knowledge is the key to understanding our true nature. Could you please rephrase your question or ask about a specific chapter or concept from the Gita?",
}

// Simple fallback response generator
function generateFallbackResponse(query: string): string {
  // Convert query to lowercase for easier matching
  const lowerQuery = query.toLowerCase()

  // Check for greetings
  if (lowerQuery.match(/\b(hello|hi|namaste|greet|namaskar|jai|shree|ram|krishna)\b/)) {
    return fallbackResponses.greeting[Math.floor(Math.random() * fallbackResponses.greeting.length)]
  }

  // Check for Krishna related questions
  if (lowerQuery.match(/\b(krishna|lord|god|bhagavan|vasudev|govinda|madhav|keshav)\b/)) {
    return fallbackResponses.krishna[Math.floor(Math.random() * fallbackResponses.krishna.length)]
  }

  // Check for concept related questions
  if (lowerQuery.match(/\b(karma|action|duty|work|deed)\b/)) {
    return fallbackResponses.karma[Math.floor(Math.random() * fallbackResponses.karma.length)]
  }

  if (lowerQuery.match(/\b(dharma|duty|righteousness|moral|ethics)\b/)) {
    return fallbackResponses.dharma[Math.floor(Math.random() * fallbackResponses.dharma.length)]
  }

  // Default response if no match is found
  return fallbackResponses.default
}

// Function to generate a response using OpenRouter API with DeepSeek model
export async function generateChatResponse(
  messages: Message[],
  language = "english",
): Promise<{ content: string; isApiResponse: boolean }> {
  try {
    // Get the API key from environment variables
    const apiKey = process.env.OPENROUTER_API_KEY

    if (!apiKey) {
      console.log("No API key found, using fallback response")
      const lastUserMessage = messages.filter((m) => m.role === "user").pop()?.content || ""
      return {
        content: generateFallbackResponse(lastUserMessage),
        isApiResponse: false,
      }
    }

    // Format messages for the API
    const formattedMessages = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    // Add a system message to guide the model's responses
    const systemMessage = {
      role: "system",
      content: `You are a knowledgeable assistant specializing in the Bhagavad Gita, a 700-verse Hindu scripture that is part of the epic Mahabharata.
      
      Your responses should:
      1. Be accurate to the teachings and philosophy of the Bhagavad Gita
      2. Include Sanskrit verses when relevant, along with translations
      3. Explain complex concepts in simple terms
      4. Be respectful and reverent when discussing spiritual topics
      5. Provide practical applications of the Gita's wisdom when appropriate
      
      IMPORTANT: You must respond in ${language} language. If the user asks to change the language, adapt accordingly.
      
      If asked about topics outside the scope of the Bhagavad Gita, gently redirect the conversation back to the teachings of the Gita or related Hindu philosophy.`,
    }

    // Prepare the request to the OpenRouter API
    // Using a different model that doesn't require prompt training
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
        "HTTP-Referer": "shrimadchatbot.vercel.app",
        "X-Title": "Shrimad Bhagavad Gita Chatbot",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // Using a model that doesn't require prompt training
        messages: [systemMessage, ...formattedMessages],
        temperature: 0.7,
        max_tokens: 1000,
        transforms: ["middle-out"], // This helps with data policy issues
        route: "fallback", // Use fallback routing if primary model is unavailable
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error("API error:", JSON.stringify(errorData))

      // Check for data policy error
      if (errorData?.error?.message?.includes("data policy")) {
        console.log("OpenRouter data policy error, trying alternative approach...")

        // Try with a different model and explicit data policy settings
        try {
          const alternativeResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
              "HTTP-Referer": "shrimadchatbot.vercel.app",
              "X-Title": "Shrimad Bhagavad Gita Chatbot",
            },
            body: JSON.stringify({
              model: "anthropic/claude-instant-v1", // Try a different model
              messages: [systemMessage, ...formattedMessages],
              temperature: 0.7,
              max_tokens: 1000,
              transforms: ["middle-out"],
              route: "fallback",
              allow_data_collection: false, // Explicitly disable data collection
            }),
          })

          if (alternativeResponse.ok) {
            const data = await alternativeResponse.json()
            return {
              content: data.choices[0].message.content,
              isApiResponse: true,
            }
          }
        } catch (alternativeError) {
          console.error("Alternative API approach failed:", alternativeError)
        }
      }

      // Use fallback response if all API approaches fail
      const lastUserMessage = messages.filter((m) => m.role === "user").pop()?.content || ""
      return {
        content: generateFallbackResponse(lastUserMessage),
        isApiResponse: false,
      }
    }

    const data = await response.json()
    return {
      content: data.choices[0].message.content,
      isApiResponse: true,
    }
  } catch (error) {
    console.error("Error generating chat response:", error)

    // Use fallback response
    const lastUserMessage = messages.filter((m) => m.role === "user").pop()?.content || ""
    return {
      content: generateFallbackResponse(lastUserMessage),
      isApiResponse: false,
    }
  }
}
