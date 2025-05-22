# Bhagavad Gita Chapter Data

This directory contains JSON files for each chapter of the Bhagavad Gita. Each file follows a specific structure to ensure proper display in the application.

## File Structure

Each chapter should be saved as a separate JSON file named `chapter-X.json` where X is the chapter number (1-18).

### JSON Structure

\`\`\`json
{
  "number": 1,
  "title": "Chapter Title",
  "subtitle": "Chapter Subtitle",
  "summary": "A summary of the chapter's content and significance.",
  "verses": [
    {
      "number": "1.1",
      "sanskrit": "Sanskrit text of the verse",
      "transliteration": "Transliteration of the Sanskrit text",
      "translation": "English translation of the verse",
      "explanation": "Explanation of the verse's meaning and significance"
    },
    {
      "number": "1.2",
      "sanskrit": "Sanskrit text of the verse",
      "transliteration": "Transliteration of the Sanskrit text",
      "translation": "English translation of the verse",
      "explanation": "Explanation of the verse's meaning and significance"
    }
  ]
}
\`\`\`

## How to Add a New Chapter

1. Copy the `chapter-template.json` file
2. Rename it to `chapter-X.json` where X is the chapter number
3. Fill in the chapter details:
   - Update the `number`, `title`, and `subtitle` fields
   - Write a comprehensive `summary` of the chapter
   - Add verses to the `verses` array, with each verse containing:
     - `number`: The verse number (e.g., "1.1", "1.2-3" for combined verses)
     - `sanskrit`: The original Sanskrit text
     - `transliteration`: The romanized Sanskrit text
     - `translation`: The English translation
     - `explanation`: An explanation of the verse's meaning

## Chapter Metadata

The `chapter-metadata.json` file contains basic information about all 18 chapters. This file is used to generate the table of contents and should be kept in sync with the individual chapter files.

## Example

See `chapter-1.json` and `chapter-2.json` for complete examples of properly formatted chapter data.
