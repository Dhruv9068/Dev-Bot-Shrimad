"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Database, FileText, Code, Upload, CheckCircle2 } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function TrainingInfo() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <Card className="w-full bg-gradient-to-br from-amber-950 to-amber-900/80 border-amber-800/50 shadow-xl">
      <CardHeader className="bg-gradient-to-r from-amber-900 to-amber-800 rounded-t-lg border-b border-amber-700/50">
        <CardTitle className="text-amber-300">Training the Bhagavad Gita Chatbot</CardTitle>
        <CardDescription className="text-amber-400/80">
          Learn how to enhance the chatbot with all 7000 verses of the Gita
        </CardDescription>
      </CardHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 bg-amber-900/50 border-b border-amber-800/50">
          <TabsTrigger value="overview" className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-300">
            Overview
          </TabsTrigger>
          <TabsTrigger value="steps" className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-300">
            Step-by-Step Guide
          </TabsTrigger>
          <TabsTrigger value="advanced" className="data-[state=active]:bg-amber-800 data-[state=active]:text-amber-300">
            Advanced Options
          </TabsTrigger>
        </TabsList>

        <CardContent className="p-6">
          <TabsContent value="overview" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-300">Training Overview</h3>

              <p className="text-amber-100">
                Training the Bhagavad Gita chatbot with all 7000 verses allows it to provide more accurate and
                comprehensive responses. The process involves preparing your data, formatting it correctly, and
                integrating it with the chatbot's knowledge base.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <Card className="bg-amber-900/30 border-amber-800/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-amber-300 flex items-center gap-2 text-base">
                      <Database className="h-4 w-4" /> Data Preparation
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-amber-100">
                      Format your Gita verses in a structured way with chapter, verse numbers, Sanskrit text,
                      transliteration, translation, and explanation.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-amber-900/30 border-amber-800/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-amber-300 flex items-center gap-2 text-base">
                      <Code className="h-4 w-4" /> Integration
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-amber-100">
                      Integrate your formatted data with the chatbot's knowledge base using the provided API or
                      configuration files.
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-amber-900/30 border-amber-800/30">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-amber-300 flex items-center gap-2 text-base">
                      <CheckCircle2 className="h-4 w-4" /> Testing & Refinement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-amber-100">
                      Test the chatbot with various queries to ensure it correctly retrieves and presents information
                      from your verses.
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-6 bg-amber-900/20 p-4 rounded-lg border border-amber-800/30">
                <h4 className="font-medium text-amber-300 mb-2">Benefits of Training:</h4>
                <ul className="list-disc pl-5 space-y-1 text-amber-100">
                  <li>More accurate responses to specific verse inquiries</li>
                  <li>Deeper understanding of complex Gita concepts</li>
                  <li>Ability to provide Sanskrit text and transliterations</li>
                  <li>Enhanced explanations with contextual understanding</li>
                  <li>Better cross-referencing between related verses</li>
                </ul>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="steps" className="mt-0">
            <div className="space-y-5">
              <h3 className="text-lg font-semibold text-amber-300">Step-by-Step Training Guide</h3>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="step1" className="border-amber-800/30">
                  <AccordionTrigger className="text-amber-300 hover:text-amber-200">
                    Step 1: Prepare Your Data
                  </AccordionTrigger>
                  <AccordionContent className="text-amber-100">
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Organize your 7000 verses in a structured format (JSON or CSV)</li>
                      <li>
                        Include the following fields for each verse:
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Chapter number</li>
                          <li>Verse number</li>
                          <li>Sanskrit text</li>
                          <li>Transliteration</li>
                          <li>English translation</li>
                          <li>Explanation/commentary</li>
                        </ul>
                      </li>
                      <li>Ensure consistent formatting across all verses</li>
                    </ol>

                    <div className="mt-3 bg-amber-900/30 p-3 rounded border border-amber-800/30">
                      <p className="text-sm font-medium text-amber-300 mb-1">Example JSON Format:</p>
                      <pre className="text-xs text-amber-200 overflow-x-auto p-2 bg-amber-950/50 rounded">
                        {`{
  "verses": [
    {
      "chapter": 1,
      "verse": 1,
      "sanskrit": "धृतराष्ट्र उवाच...",
      "transliteration": "dhṛtarāṣṭra uvāca...",
      "translation": "Dhritarashtra said: O Sanjaya...",
      "explanation": "The Bhagavad Gita begins with..."
    },
    // More verses...
  ]
}`}
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step2" className="border-amber-800/30">
                  <AccordionTrigger className="text-amber-300 hover:text-amber-200">
                    Step 2: Format Data for Training
                  </AccordionTrigger>
                  <AccordionContent className="text-amber-100">
                    <p className="mb-3">
                      Convert your structured data into training examples that the chatbot can learn from:
                    </p>

                    <ol className="list-decimal pl-5 space-y-2">
                      <li>Create question-answer pairs for each verse</li>
                      <li>Generate multiple question variations for each verse</li>
                      <li>Include metadata like chapter and verse numbers in the training data</li>
                    </ol>

                    <div className="mt-3 bg-amber-900/30 p-3 rounded border border-amber-800/30">
                      <p className="text-sm font-medium text-amber-300 mb-1">Example Training Pairs:</p>
                      <pre className="text-xs text-amber-200 overflow-x-auto p-2 bg-amber-950/50 rounded">
                        {`[
  {
    "question": "What does Bhagavad Gita 2.47 say?",
    "answer": "Verse 2.47 states: 'कर्मण्येवाधिकारस्ते...' - 'You have a right to perform your prescribed duties...'"
  },
  {
    "question": "Explain Bhagavad Gita Chapter 2 Verse 47",
    "answer": "This verse introduces the concept of Karma Yoga..."
  }
]`}
                      </pre>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step3" className="border-amber-800/30">
                  <AccordionTrigger className="text-amber-300 hover:text-amber-200">
                    Step 3: Integrate with the Chatbot
                  </AccordionTrigger>
                  <AccordionContent className="text-amber-100">
                    <p className="mb-3">There are several ways to integrate your data with the chatbot:</p>

                    <ol className="list-decimal pl-5 space-y-3">
                      <li>
                        <strong className="text-amber-300">Direct Integration:</strong>
                        <p className="mt-1">
                          Modify the <code className="bg-amber-950/50 px-1 rounded">predefinedQA</code> array in the{" "}
                          <code className="bg-amber-950/50 px-1 rounded">chat-interface.tsx</code> file to include all
                          your verse data.
                        </p>
                      </li>

                      <li>
                        <strong className="text-amber-300">Database Integration:</strong>
                        <p className="mt-1">
                          Store your verses in a database and modify the chatbot to query the database for responses.
                        </p>
                        <pre className="text-xs text-amber-200 overflow-x-auto p-2 bg-amber-950/50 rounded mt-2">
                          {`// Example database query in chat-interface.tsx
async function getVerseFromDB(chapter, verse) {
  // Query your database for the specific verse
  const response = await db.query(
    'SELECT * FROM verses WHERE chapter = ? AND verse = ?',
    [chapter, verse]
  );
  return response[0];
}`}
                        </pre>
                      </li>

                      <li>
                        <strong className="text-amber-300">API Integration:</strong>
                        <p className="mt-1">
                          Create an API endpoint that serves verse data and have the chatbot call this API.
                        </p>
                      </li>
                    </ol>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step4" className="border-amber-800/30">
                  <AccordionTrigger className="text-amber-300 hover:text-amber-200">
                    Step 4: Enhance Response Generation
                  </AccordionTrigger>
                  <AccordionContent className="text-amber-100">
                    <p className="mb-3">
                      Improve the <code className="bg-amber-950/50 px-1 rounded">generateResponse</code> function to
                      handle specific verse requests:
                    </p>

                    <pre className="text-xs text-amber-200 overflow-x-auto p-2 bg-amber-950/50 rounded">
                      {`// Add to generateResponse function
const versePattern = /chapter\\s*(\\d+)\\s*verse\\s*(\\d+)|bhagavad\\s*gita\\s*(\\d+)\\s*:\\s*(\\d+)|gita\\s*(\\d+)\\s*\\.\\s*(\\d+)/i;
const match = lowerQuery.match(versePattern);

if (match) {
  // Extract chapter and verse numbers from the match
  const chapter = match[1] || match[3] || match[5];
  const verse = match[2] || match[4] || match[6];
  
  // Get the verse from your data source
  const verseData = getVerse(chapter, verse);
  
  if (verseData) {
    return \`Bhagavad Gita Chapter \${chapter} Verse \${verse}:\\n
    Sanskrit: \${verseData.sanskrit}\\n
    Translation: \${verseData.translation}\\n
    Explanation: \${verseData.explanation}\`;
  }
}`}
                    </pre>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="step5" className="border-amber-800/30">
                  <AccordionTrigger className="text-amber-300 hover:text-amber-200">
                    Step 5: Test and Refine
                  </AccordionTrigger>
                  <AccordionContent className="text-amber-100">
                    <ol className="list-decimal pl-5 space-y-2">
                      <li>
                        Test the chatbot with various types of queries:
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Direct verse references: "What does Bhagavad Gita 2.47 say?"</li>
                          <li>Concept questions: "What does the Gita teach about karma?"</li>
                          <li>Thematic inquiries: "Verses about devotion in the Gita"</li>
                        </ul>
                      </li>
                      <li>Analyze where the chatbot struggles and refine your data or response generation</li>
                      <li>Add more question variations to improve matching accuracy</li>
                      <li>Consider implementing fuzzy matching for verse references</li>
                    </ol>

                    <div className="mt-4 p-3 bg-amber-800/20 rounded-lg border border-amber-700/30">
                      <p className="text-sm text-amber-300 font-medium">Pro Tip:</p>
                      <p className="text-sm text-amber-100 mt-1">
                        Create a feedback mechanism where users can report incorrect or missing information, allowing
                        you to continuously improve the chatbot's knowledge base.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="mt-0">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-amber-300">Advanced Training Options</h3>

              <p className="text-amber-100">
                For more sophisticated training and integration, consider these advanced approaches:
              </p>

              <div className="space-y-4 mt-4">
                <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-800/30">
                  <h4 className="font-medium text-amber-300 mb-2">Vector Database Integration</h4>
                  <p className="text-amber-100 mb-3">
                    Use a vector database to store embeddings of your verses for semantic search capabilities:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-amber-100">
                    <li>Generate embeddings for each verse using a language model</li>
                    <li>Store these embeddings in a vector database like Pinecone or Supabase</li>
                    <li>Implement semantic search to find the most relevant verses for a query</li>
                  </ol>
                </div>

                <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-800/30">
                  <h4 className="font-medium text-amber-300 mb-2">Fine-tuning a Language Model</h4>
                  <p className="text-amber-100 mb-3">
                    For the most advanced implementation, fine-tune a language model on your Gita data:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2 text-amber-100">
                    <li>Prepare a dataset of question-answer pairs from your verses</li>
                    <li>Fine-tune a model like GPT-3.5 or a smaller open-source model</li>
                    <li>Deploy the fine-tuned model as your chatbot backend</li>
                  </ol>
                  <p className="text-amber-100 mt-2">
                    This approach requires more technical expertise but provides the best results.
                  </p>
                </div>

                <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-800/30">
                  <h4 className="font-medium text-amber-300 mb-2">Multi-language Support</h4>
                  <p className="text-amber-100 mb-3">Extend your chatbot to support multiple languages:</p>
                  <ol className="list-decimal pl-5 space-y-2 text-amber-100">
                    <li>Include translations in different languages in your verse data</li>
                    <li>Implement language detection to identify the user's preferred language</li>
                    <li>Return responses in the detected language</li>
                  </ol>
                </div>

                <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-800/30">
                  <h4 className="font-medium text-amber-300 mb-2">Context-Aware Responses</h4>
                  <p className="text-amber-100 mb-3">Make your chatbot understand the context of conversations:</p>
                  <ol className="list-decimal pl-5 space-y-2 text-amber-100">
                    <li>Implement conversation history tracking</li>
                    <li>Use the history to provide more relevant follow-up responses</li>
                    <li>Add cross-referencing between related verses</li>
                  </ol>
                </div>
              </div>
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>

      <CardFooter className="bg-gradient-to-b from-amber-900/20 to-amber-950/30 border-t border-amber-800/30 p-4">
        <div className="flex flex-col sm:flex-row gap-3 w-full justify-between items-center">
          <p className="text-sm text-amber-400/80">Ready to enhance your Bhagavad Gita chatbot with all 7000 verses?</p>
          <div className="flex gap-2">
            <Button variant="outline" className="border-amber-700 text-amber-300">
              <FileText className="mr-2 h-4 w-4" /> Download Guide
            </Button>
            <Button className="bg-amber-600 hover:bg-amber-500 text-white">
              <Upload className="mr-2 h-4 w-4" /> Start Training
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
