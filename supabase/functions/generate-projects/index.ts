import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const mistralApiKey = Deno.env.get('MISTRAL_API_KEY')!;
const coreApiKey = Deno.env.get('CORE_API_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProjectIdea {
  title: string;
  description: string;
  keywords: string[];
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

interface ProjectIdeasResponse {
  ideas: ProjectIdea[];
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
  roadmap: ProjectRoadmap;
  researchPapers: ResearchPaper[];
}

interface RoadmapResponse {
  roadmap: ProjectRoadmap;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data: userProfile } = await req.json();
    console.log('Received user profile:', userProfile);

    const initialPrompt = `Analyze this student profile and generate 3 project ideas:
    Name: ${userProfile.name}
    Major: ${userProfile.major}
    Semester: ${userProfile.semester}
    Technical Skills: ${userProfile.technicalSkills}
    Interests: ${userProfile.interests}
    Problem Solving Style: ${userProfile.problemSolvingStyle}
    Work Style: ${userProfile.preferredWorkStyle}
    Project Scope: ${userProfile.projectScope}

    Generate a response in this exact JSON format:
    {
      "ideas": [
        {
          "title": "Project Title",
          "description": "Brief project description",
          "keywords": ["keyword1", "keyword2", "keyword3"]
        }
      ]
    }`;

    const mistralResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${mistralApiKey}`,
      },
      body: JSON.stringify({
        model: 'mistral-medium',
        messages: [
          {
            role: 'user',
            content: initialPrompt,
          },
        ],
        temperature: 0.7,
      }),
    });

    if (!mistralResponse.ok) {
      const errorText = await mistralResponse.text();
      console.error('Mistral API error:', errorText);
      throw new Error(`Mistral API error: ${errorText}`);
    }

    const mistralData = await mistralResponse.json();
    console.log('Mistral API response:', mistralData);

    if (!mistralData.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from Mistral API');
    }

    const parsedIdeas: ProjectIdeasResponse = JSON.parse(mistralData.choices[0].message.content);
    console.log('Parsed ideas:', parsedIdeas);

    if (!parsedIdeas.ideas || !Array.isArray(parsedIdeas.ideas)) {
      throw new Error('Invalid ideas format from Mistral API');
    }

    // Process each idea independently and collect successful results
    const successfulProjects: Project[] = [];
    
    for (const idea of parsedIdeas.ideas) {
      try {
        console.log('Processing idea:', idea.title);
        
        // Search for related papers using CORE API
        console.log('Searching papers for keywords:', idea.keywords);
        const searchQuery = idea.keywords.join(' OR ');
        const coreResponse = await fetch(
          `https://api.core.ac.uk/v3/search/works?q=${encodeURIComponent(searchQuery)}&limit=3&year_from=${new Date().getFullYear() - 5}`,
          {
            headers: {
              'Authorization': `Bearer ${coreApiKey}`,
            },
          }
        );

        if (!coreResponse.ok) {
          console.error(`CORE API error for idea "${idea.title}":`, await coreResponse.text());
          continue; // Skip this idea but continue with others
        }

        const coreData = await coreResponse.json();
        console.log('CORE API response:', coreData);

        const relatedPapers: ResearchPaper[] = coreData.results.map((paper: any) => ({
          title: paper.title,
          authors: paper.authors?.map((author: any) => author.name) || [],
          year: paper.yearPublished || new Date().getFullYear(),
          abstract: paper.abstract || 'Abstract not available',
          url: paper.downloadUrl || (paper.doi ? `https://doi.org/${paper.doi}` : ''),
        }));

        // Generate detailed roadmap with Mistral AI
        const roadmapPrompt = `Create a detailed project roadmap for:
        Title: ${idea.title}
        Description: ${idea.description}
        Keywords: ${idea.keywords.join(', ')}
        Related Research:
        ${relatedPapers.map(paper => `- ${paper.title} (${paper.year})`).join('\n')}

        Provide a response in this exact JSON format:
        {
          "roadmap": {
            "overview": "Project overview text",
            "problemStatement": "Problem statement text",
            "solutionApproach": "Solution approach text",
            "toolsAndTechnologies": ["tool1", "tool2"],
            "expectedChallenges": ["challenge1", "challenge2"],
            "learningResources": [
              {
                "title": "Resource title",
                "type": "documentation|tutorial|course",
                "url": "https://example.com"
              }
            ]
          }
        }`;

        const roadmapResponse = await fetch('https://api.mistral.ai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${mistralApiKey}`,
          },
          body: JSON.stringify({
            model: 'mistral-medium',
            messages: [
              {
                role: 'user',
                content: roadmapPrompt,
              },
            ],
            temperature: 0.7,
          }),
        });

        if (!roadmapResponse.ok) {
          console.error(`Roadmap generation error for idea "${idea.title}":`, await roadmapResponse.text());
          continue; // Skip this idea but continue with others
        }

        const roadmapData = await roadmapResponse.json();
        console.log('Roadmap API response:', roadmapData);

        if (!roadmapData.choices?.[0]?.message?.content) {
          console.error(`Invalid roadmap response for idea "${idea.title}"`);
          continue; // Skip this idea but continue with others
        }

        const parsedRoadmap: RoadmapResponse = JSON.parse(roadmapData.choices[0].message.content);
        console.log('Parsed roadmap:', parsedRoadmap);

        if (!parsedRoadmap.roadmap) {
          console.error(`Missing roadmap data for idea "${idea.title}"`);
          continue; // Skip this idea but continue with others
        }

        // Add successful project to the collection
        successfulProjects.push({
          id: crypto.randomUUID(),
          title: idea.title,
          description: idea.description,
          keywords: idea.keywords,
          roadmap: parsedRoadmap.roadmap,
          researchPapers: relatedPapers,
        });
        
        console.log(`Successfully processed idea: ${idea.title}`);
      } catch (error) {
        // Log the error but continue processing other ideas
        console.error(`Error processing idea "${idea.title}":`, error);
        continue;
      }
    }

    // Return successful projects, even if only some ideas were processed
    if (successfulProjects.length === 0) {
      throw new Error('No projects could be generated successfully');
    }

    return new Response(
      JSON.stringify({
        projects: successfulProjects,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});