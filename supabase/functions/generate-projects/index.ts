import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { corsHeaders } from '../_shared/cors.ts'

interface LearningResource {
  title: string;
  type: string;
  url: string;
}

interface Roadmap {
  overview: string;
  problemStatement: string;
  solutionApproach: string;
  toolsAndTechnologies: string[];
  expectedChallenges: string[];
  learningResources: LearningResource[];
}

interface ResearchPaper {
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  url: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  roadmap: Roadmap;
  researchPapers: ResearchPaper[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { data } = await req.json()
    console.log('Received data:', data)

    // Initialize Mistral client
    const mistralApiKey = Deno.env.get('MISTRAL_API_KEY')
    if (!mistralApiKey) {
      throw new Error('Missing Mistral API key')
    }

    // Generate initial project ideas
    const initialPrompt = `Based on the following student profile, generate 3 unique final year project ideas:
    - Name: ${data.name}
    - Major: ${data.major}
    - Technical Skills: ${data.technicalSkills}
    - Interests: ${data.interests}
    - Problem-Solving Style: ${data.problemSolvingStyle}
    - Work Style: ${data.preferredWorkStyle}
    - Desired Impact: ${data.projectScope}
    
    Return the response in JSON format with the following structure:
    {
      "ideas": [
        {
          "title": "Project Title",
          "keywords": ["keyword1", "keyword2"],
          "brief_description": "Project description",
          "technical_requirements": ["requirement1", "requirement2"],
          "learning_outcomes": ["outcome1", "outcome2"]
        }
      ]
    }`

    console.log('Sending request to Mistral API...')
    const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mistralApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages: [{ role: 'user', content: initialPrompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      }),
    })

    const mistralData = await mistralResponse.json()
    console.log('Mistral API response:', mistralData)

    if (!mistralData.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Mistral API')
    }

    const parsedIdeas = JSON.parse(mistralData.choices[0].message.content)
    console.log('Parsed ideas:', parsedIdeas)

    if (!parsedIdeas.ideas || !Array.isArray(parsedIdeas.ideas)) {
      throw new Error('Invalid ideas format in Mistral response')
    }

    // Process each idea with CORE API and generate roadmaps
    const projects: Project[] = await Promise.all(
      parsedIdeas.ideas.map(async (idea: any, index: number) => {
        // Generate roadmap
        const roadmapPrompt = `Create a detailed project roadmap for:
        Title: ${idea.title}
        Description: ${idea.brief_description}
        Technical Requirements: ${idea.technical_requirements.join(', ')}
        
        Return a JSON object with the following structure:
        {
          "roadmap": {
            "overview": "Project overview",
            "problemStatement": "Problem statement",
            "solutionApproach": "Solution approach",
            "toolsAndTechnologies": ["tool1", "tool2"],
            "expectedChallenges": ["challenge1", "challenge2"],
            "learningResources": [
              {
                "title": "Resource title",
                "type": "video|article|tutorial",
                "url": "https://example.com"
              }
            ]
          }
        }`

        const roadmapResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${mistralApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'mistral-large-latest',
            messages: [{ role: 'user', content: roadmapPrompt }],
            response_format: { type: 'json_object' },
            temperature: 0.7,
          }),
        })

        const roadmapData = await roadmapResponse.json()
        console.log('Roadmap response:', roadmapData)

        if (!roadmapData.choices?.[0]?.message?.content) {
          throw new Error('Invalid roadmap response from Mistral API')
        }

        const parsedRoadmap = JSON.parse(roadmapData.choices[0].message.content)
        console.log('Parsed roadmap:', parsedRoadmap)

        if (!parsedRoadmap.roadmap) {
          throw new Error('Invalid roadmap format in Mistral response')
        }

        // Fetch related research papers
        const coreApiKey = Deno.env.get('CORE_API_KEY')
        if (!coreApiKey) {
          throw new Error('Missing CORE API key')
        }

        console.log('Fetching research papers for keywords:', idea.keywords)
        const coreResponse = await fetch(
          `https://api.core.ac.uk/v3/search/works?q=${encodeURIComponent(idea.keywords.join(' OR '))}&limit=3`,
          {
            headers: {
              'Authorization': `Bearer ${coreApiKey}`,
            },
          }
        )

        const coreData = await coreResponse.json()
        console.log('CORE API response:', coreData)

        const researchPapers: ResearchPaper[] = coreData.results.map((paper: any) => ({
          title: paper.title || 'Untitled',
          authors: paper.authors?.map((a: any) => a.name) || [],
          year: paper.yearPublished || new Date().getFullYear(),
          abstract: paper.abstract || 'No abstract available',
          url: paper.downloadUrl || (paper.doi ? `https://doi.org/${paper.doi}` : ''),
        }))

        return {
          id: (index + 1).toString(),
          title: idea.title,
          description: idea.brief_description,
          keywords: idea.keywords,
          roadmap: parsedRoadmap.roadmap,
          researchPapers,
        }
      })
    )

    console.log('Final projects:', projects)

    return new Response(
      JSON.stringify({ projects }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})