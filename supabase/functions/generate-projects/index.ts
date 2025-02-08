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
  id?: string;
  title: string;
  description: string;
  keywords: string[];
  roadmap: ProjectRoadmap;
  research_papers: ResearchPaper[];
  url_slug?: string;
  created_at?: string;
  updated_at?: string;
  last_viewed_at?: string;
  view_count?: number;
  user_id?: string;
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
        
        // Initialize relatedPapers array for each idea
        const relatedPapers: ResearchPaper[] = [];
        
        // Search for related papers using CORE API
        console.log('Searching papers for keywords:', idea.keywords);
        const searchQuery = idea.keywords.join(' OR ');
        
        try {
          const coreResponse = await fetch(
            `https://api.core.ac.uk/v3/search/works?q=${encodeURIComponent(searchQuery)}&limit=3&year_from=${new Date().getFullYear() - 5}`,
            {
              headers: {
                'Authorization': `Bearer ${coreApiKey}`,
              },
            }
          );

          if (!coreResponse.ok) {
            const errorText = await coreResponse.text();
            console.error(`CORE API error for idea "${idea.title}":`, errorText);
            throw new Error(`CORE API error: ${errorText}`);
          }

          const coreData = await coreResponse.json();
          console.log('CORE API raw response:', JSON.stringify(coreData, null, 2));

          // Validate CORE API response
          if (!coreData.results || !Array.isArray(coreData.results)) {
            console.error('Invalid CORE API response format:', coreData);
            throw new Error('Invalid CORE API response format');
          }

          // Process and validate each paper
          for (const paper of coreData.results) {
            if (!paper || typeof paper !== 'object') {
              console.warn('Invalid paper object:', paper);
              continue;
            }

            console.log('Processing paper:', JSON.stringify(paper, null, 2));

            // Extract and validate paper data
            const paperData: ResearchPaper = {
              title: typeof paper.title === 'string' ? paper.title : 'Untitled',
              authors: Array.isArray(paper.authors) 
                ? paper.authors
                    .filter((author: any) => author && typeof author === 'object' && author.name)
                    .map((author: any) => author.name)
                : ['Unknown Author'],
              year: typeof paper.yearPublished === 'number' ? paper.yearPublished : new Date().getFullYear(),
              abstract: typeof paper.abstract === 'string' ? paper.abstract : 'Abstract not available',
              url: paper.downloadUrl || (paper.doi ? `https://doi.org/${paper.doi}` : '')
            };

            console.log('Processed paper:', JSON.stringify(paperData, null, 2));
            relatedPapers.push(paperData);
          }

          console.log('Final processed research papers:', JSON.stringify(relatedPapers, null, 2));

          if (relatedPapers.length === 0) {
            console.warn(`No valid research papers found for idea "${idea.title}"`);
          }

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
          }
          Don't use placeholder links like 'example.com' etc. Strictly follow the output format mentioned above.`;

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

          // Store the papers in the project
          const project = {
            id: crypto.randomUUID(),
            title: idea.title,
            description: idea.description,
            keywords: idea.keywords,
            roadmap: parsedRoadmap.roadmap,
            research_papers: relatedPapers,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_viewed_at: new Date().toISOString(),
            view_count: 0,
            user_id: userProfile.id
          };

          console.log('Final project with research papers:', JSON.stringify(project, null, 2));
          successfulProjects.push(project);

        } catch (error) {
          console.error('Error processing CORE API response:', error);
          // Continue with empty research papers rather than failing
          const project = {
            id: crypto.randomUUID(),
            title: idea.title,
            description: idea.description,
            keywords: idea.keywords,
            roadmap: parsedRoadmap.roadmap,
            research_papers: [], // Empty array if CORE API fails
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            last_viewed_at: new Date().toISOString(),
            view_count: 0,
            user_id: userProfile.id
          };
          successfulProjects.push(project);
        }
        
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

    // Convert to frontend format
    const projectsForState = successfulProjects.map((project: any) => {
      return {
        ...project,
        roadmap: {
          ...project.roadmap,
          overview: project.roadmap?.overview || '',
          problemStatement: project.roadmap?.problemStatement || '',
          solutionApproach: project.roadmap?.solutionApproach || '',
          toolsAndTechnologies: project.roadmap?.toolsAndTechnologies || [],
          expectedChallenges: project.roadmap?.expectedChallenges || [],
          learningResources: project.roadmap?.learningResources || []
        }
      };
    }) as Project[];

    return new Response(
      JSON.stringify({
        projects: projectsForState,
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