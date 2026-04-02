import { FormAnswers } from "@/components/steps/step-config";

export function buildPrompt ( answers: FormAnswers) : string {
    const {
        domain,
        difficulty,
        technologies, 
        timeAvailable,
        projectType,
        goal,
        targetAudience,
        industryDomain,
        collaborationLevel,
        features,
        additionalConstraints,
    } = answers;

    // required fields
    const requiredContext = `
        DEVELOPER PROFILE:
        - Domain : ${domain}
        - Experience Level : ${difficulty}
        - Technologies : ${technologies}
        - Time Avalaible : ${timeAvailable}
        - Collaboration : ${collaborationLevel}
    `.trim();

    // optional field
    const optionalLines : string[] = [];

    if (projectType) {
        optionalLines.push(`- Project Type : ${projectType}`);
    }

    if (goal) {
        optionalLines.push(`- Primary Goal : ${goal}`);
    }

    if (targetAudience) {
        optionalLines.push(`- Target Audience : ${targetAudience}`);
    }

    if (industryDomain) {
        optionalLines.push(`- Industry/Context : ${industryDomain}`);
    }

    if (features && features.length > 0) {
        optionalLines.push(`- Desired Features : ${features.join(", ")}`);
    }

    if (additionalConstraints && additionalConstraints.trim() !== "") {
        optionalLines.push(`- Additional Constraints : ${additionalConstraints}`);
    }

    const optionalContext = optionalLines.length > 0 ? `\nADDITIONAL PREFERENCES :\n ${optionalLines.join("\n")}` : "";

    // final prompt 
    return `
        You are an expert software project advisor. Your job is to suggest personnalized project ideas based on a developer's profile and preferences.

        ${requiredContext} ${optionalContext}

        Based on the  above, suggest exactly 3 different project ideas. Each project MUST be :
        - Realistic to complete within the given time (${timeAvailable})
        - Appropriate for a ${difficulty} level developer
        - Buildable using the specified technologies : ${technologies.join(", ")}
        - Pratical and specific, not generic

        For each project, respond in the EXACT form:
        
        ---
        POJECT [number] : [Project Title]

        Description : 
        [2-3 sentences explaining what the project does and why it's valuable ]

        TECHNOLOGIES USED :
        [list from the developer's selected technologies and explain how each is used ]

        KEY FEATURES :
        - [Feature 1]
        - [Feature 2]
        - [Feature 3]
        - [Feature 4]

        WHY IT FITS YOU :
        [1-2 sentence explaining why this matches their level, time and goals] 
        ---
        Be specific, creative, and avoid suggesting projects that are too basic or too complex for the given profile.
    `.trim();

}