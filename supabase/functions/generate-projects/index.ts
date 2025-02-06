import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const mistralApiKey = Deno.env.get('MISTRAL_API_KEY');
const coreApiKey = Deno.env.get('CORE_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface UserProfile {
  name: string;
  age: string;
  university: string;
  semester: string;
  major: string;
  interests: string;
  technicalSkills: string;
  problemSolvingStyle: string;
  preferredWorkStyle: string;
  projectScope: string;
}

interface ProjectIdea {
  title: string;
  keywords: string[];
  description: string;
  technicalRequirements: string[];
}

interface ResearchPaper {
  title: string;
  authors: string[];
  year: number;
  abstract: string;
  url: string;
}

interface ProjectRoadmap {
  overview: string;
  problemStatement: string;
  solutionApproach: string;
  toolsAndTechnologies: string[];
  expectedChallenges: string[];
  learningResources: {
    title: string;
    type: string;
    url: string;
  }[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data: userProfile } = await req.json();
    console.log('Received user profile:', userProfile);

    // Step 1: Initial Mistral API call for psychometric analysis and project ideas
    const initialPrompt = `Analyze this student profile and generate 3 project ideas:
    Name: ${userProfile.name}
    Major: ${userProfile.major}
    Technical Skills: ${userProfile.technicalSkills}
    Interests: ${userProfile.interests}
    Problem-Solving Style: ${userProfile.problemSolvingStyle}
    Work Style: ${userProfile.preferredWorkStyle}
    Project Scope: ${userProfile.projectScope}

    Based on this profile, generate 3 project ideas. Return ONLY a JSON object with this exact structure:
    {
      "ideas": [
        {
          "title": "Project Title",
          "keywords": ["keyword1", "keyword2"],
          "description": "Project description",
          "technicalRequirements": ["requirement1", "requirement2"]
        }
      ]
    }`;

    console.log('Sending initial prompt to Mistral API');
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
    });

    const mistralData = await mistralResponse.json();
    console.log('Mistral API response:', mistralData);

    if (!mistralData.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Mistral API');
    }

    const parsedIdeas = JSON.parse(mistralData.choices[0].message.content);
    console.log('Parsed ideas:', parsedIdeas);

    if (!parsedIdeas.ideas || !Array.isArray(parsedIdeas.ideas)) {
      throw new Error('Invalid ideas format in Mistral response');
    }

    // Step 2: Process each idea with CORE API and generate final project details
    const projects = await Promise.all(parsedIdeas.ideas.map(async (idea: ProjectIdea) => {
      // Search for related papers using CORE API
      console.log('Searching papers for keywords:', idea.keywords);
      const coreResponse = await fetch(
        `https://api.core.ac.uk/v3/search/works?q=${encodeURIComponent(idea.keywords.join(' OR '))}&limit=3`,
        {
          headers: {
            'Authorization': `Bearer ${coreApiKey}`,
          },
        }
      );

      const coreData = await coreResponse.json();
      console.log('CORE API response:', coreData);

      const papers: ResearchPaper[] = coreData.results.map((paper: any) => ({
        title: paper.title || 'Untitled',
        authors: paper.authors?.map((a: any) => a.name) || [],
        year: paper.yearPublished || new Date().getFullYear(),
        abstract: paper.abstract || 'No abstract available',
        url: paper.downloadUrl || (paper.doi ? `https://doi.org/${paper.doi}` : ''),
      }));

      // Step 3: Generate detailed roadmap with Mistral API using project idea and research papers
      const roadmapPrompt = `Create a detailed project roadmap for:
      Title: ${idea.title}
      Description: ${idea.description}
      Technical Requirements: ${idea.technicalRequirements.join(', ')}
      Related Papers: ${papers.map(p => p.title).join(', ')}

      Return ONLY a JSON object with this exact structure:
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
      }`;

      console.log('Sending roadmap prompt to Mistral API');
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
      });

      const roadmapData = await roadmapResponse.json();
      console.log('Roadmap API response:', roadmapData);

      if (!roadmapData.choices?.[0]?.message?.content) {
        throw new Error('Invalid roadmap response from Mistral API');
      }

      const parsedRoadmap = JSON.parse(roadmapData.choices[0].message.content);
      console.log('Parsed roadmap:', parsedRoadmap);

      if (!parsedRoadmap.roadmap) {
        throw new Error('Invalid roadmap format in Mistral response');
      }

      // Return complete project data
      return {
        id: crypto.randomUUID(),
        title: idea.title,
        description: idea.description,
        keywords: idea.keywords,
        roadmap: parsedRoadmap.roadmap,
        researchPapers: papers,
      };
    }));

    console.log('Final projects data:', projects);

    return new Response(
      JSON.stringify({ projects }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    );
  }
});