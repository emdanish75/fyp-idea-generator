
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

async function generateInitialIdeas(userProfile: any): Promise<ProjectIdea[]> {
  const initialPrompt = `Analyze this student profile and generate 3 personalized project/thesis ideas based on their preferences and field of study:
    Name: ${userProfile.name}
    Major: ${userProfile.major}
    Semester: ${userProfile.semester}
    Technical Skills: ${userProfile.technicalSkills}
    Interests: ${userProfile.interests}
    Problem Solving Style: ${userProfile.problemSolvingStyle}
    Work Style: ${userProfile.preferredWorkStyle}
    Project Scope: ${userProfile.projectScope}

    Ensure the ideas are:
    - Unique, with potential to solve a real-world problem or fill an existing market gap.
    - Of medium difficulty to implement.
    - Have the potential to make money or create value in a practical way.
    - Not outdated or oversaturated with competition.
    - Relevant to the student's specific major and interests.
    - Not too broad or narrow; ensure they are feasible and aligned with the student's capabilities.
    - If the student is in a field more focused on research (e.g., Humanities, Social Sciences), suggest thesis ideas rather than projects. Ensure the ideas are research-driven and innovative.
    
    Generate a response in this exact JSON format:
    {
      "ideas": [
        {
          "title": "Project/Thesis Title",
          "description": "Brief description of the project or thesis idea, highlighting its uniqueness, potential impact, and how it addresses a real-world problem or market gap.",
          "keywords": ["keyword1", "keyword2", "keyword3"],
        }
      ]
    }`;

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${mistralApiKey}`,
    },
    body: JSON.stringify({
      model: 'mistral-medium',
      messages: [{ role: 'user', content: initialPrompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Mistral API error:', errorText);
    throw new Error(`Mistral API error: ${errorText}`);
  }

  const data = await response.json();
  console.log('Mistral API response:', data);

  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid response from Mistral API');
  }

  const parsedIdeas: ProjectIdeasResponse = JSON.parse(data.choices[0].message.content);
  console.log('Parsed ideas:', parsedIdeas);

  if (!parsedIdeas.ideas || !Array.isArray(parsedIdeas.ideas)) {
    throw new Error('Invalid ideas format from Mistral API');
  }

  return parsedIdeas.ideas;
}

async function searchRelatedPapers(keywords: string[]): Promise<ResearchPaper[]> {
  console.log('Searching papers for keywords:', keywords);
  const searchQuery = keywords.join(' OR ');
  const response = await fetch(
    `https://api.core.ac.uk/v3/search/works?q=${encodeURIComponent(searchQuery)}&limit=3&year_from=${new Date().getFullYear() - 5}`,
    {
      headers: {
        'Authorization': `Bearer ${coreApiKey}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('CORE API error:', errorText);
    throw new Error(`CORE API error: ${errorText}`);
  }

  const data = await response.json();
  console.log('CORE API response:', data);

  return data.results.map((paper: any) => ({
    title: paper.title,
    authors: paper.authors?.map((author: any) => author.name) || [],
    year: paper.yearPublished || new Date().getFullYear(),
    abstract: paper.abstract || 'Abstract not available',
    url: paper.downloadUrl || (paper.doi ? `https://doi.org/${paper.doi}` : ''),
  }));
}

async function generateProjectRoadmap(idea: ProjectIdea, relatedPapers: ResearchPaper[]): Promise<ProjectRoadmap> {
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
    }
    Don't use placeholder links like 'example.com' etc. Strictly follow the output format mentioned above.`;

  const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${mistralApiKey}`,
    },
    body: JSON.stringify({
      model: 'mistral-medium',
      messages: [{ role: 'user', content: roadmapPrompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Roadmap generation error:', errorText);
    throw new Error(`Roadmap generation error: ${errorText}`);
  }

  const data = await response.json();
  console.log('Roadmap API response:', data);

  if (!data.choices?.[0]?.message?.content) {
    throw new Error('Invalid roadmap response');
  }

  const parsedRoadmap: RoadmapResponse = JSON.parse(data.choices[0].message.content);
  console.log('Parsed roadmap:', parsedRoadmap);

  if (!parsedRoadmap.roadmap) {
    throw new Error('Missing roadmap data');
  }

  return parsedRoadmap.roadmap;
}

async function processProjectIdea(idea: ProjectIdea): Promise<Project> {
  try {
    console.log('Processing idea:', idea.title);
    
    const relatedPapers = await searchRelatedPapers(idea.keywords);
    const roadmap = await generateProjectRoadmap(idea, relatedPapers);

    return {
      id: crypto.randomUUID(),
      title: idea.title,
      description: idea.description,
      keywords: idea.keywords,
      roadmap,
      researchPapers: relatedPapers,
    };
  } catch (error) {
    console.error(`Error processing idea "${idea.title}":`, error);
    throw error;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { data: userProfile } = await req.json();
    console.log('Received user profile:', userProfile);

    const ideas = await generateInitialIdeas(userProfile);
    const successfulProjects: Project[] = [];

    for (const idea of ideas) {
      try {
        const project = await processProjectIdea(idea);
        successfulProjects.push(project);
        console.log(`Successfully processed idea: ${idea.title}`);
      } catch (error) {
        console.error(`Error processing idea "${idea.title}":`, error);
        continue;
      }
    }

    if (successfulProjects.length === 0) {
      throw new Error('No projects could be generated successfully');
    }

    return new Response(
      JSON.stringify({ projects: successfulProjects }),
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
      JSON.stringify({ error: error.message }),
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
