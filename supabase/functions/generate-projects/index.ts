import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
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
    
    Return the response in JSON format with title, keywords, brief_description, technical_requirements, and learning_outcomes for each idea.`

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
    const ideas = JSON.parse(mistralData.choices[0].message.content).ideas

    // Process each idea with CORE API and generate roadmaps
    const projects: Project[] = await Promise.all(
      ideas.map(async (idea: any, index: number) => {
        // Generate roadmap
        const roadmapPrompt = `Create a detailed project roadmap for:
        Title: ${idea.title}
        Description: ${idea.brief_description}
        Technical Requirements: ${idea.technical_requirements.join(', ')}
        
        Return a JSON object with overview, problemStatement, solutionApproach, toolsAndTechnologies, expectedChallenges, and learningResources.`

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
        const roadmap = JSON.parse(roadmapData.choices[0].message.content)

        // Fetch related research papers
        const coreApiKey = Deno.env.get('CORE_API_KEY')
        const coreResponse = await fetch(`https://api.core.ac.uk/v3/search/works?q=${encodeURIComponent(idea.keywords.join(' OR '))}&limit=3`, {
          headers: {
            'Authorization': `Bearer ${coreApiKey}`,
          },
        })

        const coreData = await coreResponse.json()
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
          roadmap,
          researchPapers,
        }
      })
    )

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
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})